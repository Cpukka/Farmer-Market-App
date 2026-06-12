// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const role = session.user.role

    let stats

    if (role === 'FARMER') {
      // Farmer stats
      const farmer = await prisma.farmer.findUnique({
        where: { userId },
        include: {
          products: true,
          orders: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      })

      if (!farmer) {
        return NextResponse.json({
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          activeProducts: 0,
        })
      }

      const totalOrders = farmer.orders.length
      const totalRevenue = farmer.orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const pendingOrders = farmer.orders.filter(order => 
        ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)
      ).length
      const activeProducts = farmer.products.filter(product => product.stock > 0).length

      stats = {
        totalOrders,
        totalRevenue,
        pendingOrders,
        activeProducts,
      }
    } else {
      // Customer stats
      const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
        prisma.order.count({
          where: { userId },
        }),
        prisma.order.aggregate({
          where: { userId },
          _sum: { totalAmount: true },
        }),
        prisma.order.count({
          where: {
            userId,
            status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] },
          },
        }),
      ])

      stats = {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        activeProducts: 0, // Not applicable for customers
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}