// app/api/reviews/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/app/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!session && !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = userId || session?.user?.id

    // Get user reviews stats
    const userReviews = await prisma.review.findMany({
      where: { userId: targetUserId },
      select: {
        rating: true,
        helpful: true,
        images: true
      }
    })

    // Get pending reviews (delivered orders not reviewed)
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId: targetUserId,
        status: 'DELIVERED',
        reviewed: false
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                farmer: true
              }
            }
          }
        }
      }
    })

    const stats = {
      totalReviews: userReviews.length,
      averageRating: userReviews.length > 0
        ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
        : 0,
      helpfulVotes: userReviews.reduce((sum, r) => sum + r.helpful, 0),
      reviewsWithPhotos: userReviews.filter(r => r.images.length > 0).length,
      pendingReviews: pendingOrders.length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review stats' },
      { status: 500 }
    )
  }
}