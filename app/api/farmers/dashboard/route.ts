// app/api/farmer/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a farmer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'FARMER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get farmer's products
    const products = await prisma.product.findMany({
      where: { farmerId: session.user.id },
      select: { id: true }
    })

    const productIds = products.map(p => p.id)

    // Get orders for farmer's products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: { in: productIds }
          }
        }
      },
      include: {
        items: {
          where: {
            productId: { in: productIds }
          },
          include: {
            product: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get reviews for farmer's products
    const reviews = await prisma.review.findMany({
      where: {
        OR: [
          { productId: { in: productIds } },
          { farmerId: session.user.id }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => {
      const farmerItems = order.items.filter(item => productIds.includes(item.productId))
      return sum + farmerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    }, 0)

    const pendingOrders = orders.filter(order => 
      order.status === 'PENDING' || order.status === 'CONFIRMED'
    ).length

    // Calculate monthly changes (mock for now - implement actual comparison)
    const revenueChange = 12.5 // Percentage change from last month
    const ordersChange = 8.3 // Percentage change from last month

    // Get this month's revenue
    const thisMonth = new Date()
    const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
    const thisMonthRevenue = orders
      .filter(order => new Date(order.createdAt) >= thisMonthStart)
      .reduce((sum, order) => {
        const farmerItems = order.items.filter(item => productIds.includes(item.productId))
        return sum + farmerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
      }, 0)

    // Get average rating
    const farmerReviews = await prisma.review.findMany({
      where: { farmerId: session.user.id },
      select: { rating: true }
    })
    const averageRating = farmerReviews.length > 0
      ? farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length
      : 0

    // Format recent orders
    const recentOrders = orders.slice(0, 5).map(order => ({
      id: order.id,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      customerName: order.user?.name || 'Customer',
      totalAmount: order.items
        .filter(item => productIds.includes(item.productId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: order.status as any,
      createdAt: order.createdAt.toISOString(),
      itemsCount: order.items.filter(item => productIds.includes(item.productId)).length
    }))

    // Format recent reviews
    const recentReviews = reviews.map(review => ({
      id: review.id,
      customerName: review.user?.name || 'Customer',
      rating: review.rating,
      comment: review.comment,
      productName: review.product?.name || 'Product',
      createdAt: review.createdAt.toISOString(),
      hasResponse: false // You'll need to add response tracking
    }))

    const stats = {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      totalProducts: products.length,
      averageRating,
      reviewsCount: farmerReviews.length,
      thisMonthRevenue,
      revenueChange,
      ordersChange
    }

    return NextResponse.json({
      stats,
      recentOrders,
      recentReviews
    })
  } catch (error) {
    console.error('Error fetching farmer dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch farmer dashboard data' },
      { status: 500 }
    )
  }
}