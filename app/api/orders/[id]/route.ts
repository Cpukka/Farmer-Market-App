// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                images: true,
                category: true,
              },
            },
          },
        },
        farmer: {
          select: {
            id: true,
            farmName: true,
            description: true,
            image: true,
            rating: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if the user is authorized to view this order
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const { status, deliveryDate } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if the user is authorized to update this order
    const isFarmer = session.user.role === 'FARMER'
    const isAdmin = session.user.role === 'ADMIN'
    const isCustomer = order.userId === session.user.id
    
    if (!isFarmer && !isAdmin && !isCustomer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Customers can only cancel orders
    if (isCustomer && status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Customers can only cancel orders' },
        { status: 403 }
      )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
      },
    })

    // Create order status update history
    if (status) {
      await prisma.orderStatusUpdate.create({
        data: {
          orderId: id,
          status,
          updatedBy: session.user.id,
        },
      })
    }

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}