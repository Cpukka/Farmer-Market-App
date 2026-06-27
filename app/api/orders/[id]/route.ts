// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Get the session with authOptions
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params for Next.js 15+
    const { id } = await params

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
    const isAuthorized = 
      order.userId === session.user.id || 
      session.user.role === 'ADMIN' ||
      session.user.role === 'FARMER'

    if (!isAuthorized) {
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, deliveryDate } = body

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check authorization
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

    // Create order status update history (if status changed)
    if (status && status !== order.status) {
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

// Optional: DELETE method
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Only ADMIN or FARMER can delete orders
    if (session.user.role !== 'ADMIN' && session.user.role !== 'FARMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Delete order (cascade will handle related records if schema has onDelete: Cascade)
    await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Failed to delete order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}