import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../lib/prisma'
import { authOptions } from "../../lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const farmerId = searchParams.get('farmerId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (productId) where.productId = productId
    if (farmerId) where.farmerId = farmerId
    if (userId) where.userId = userId

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          farmer: {
            select: {
              id: true,
              farmName: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// Update your existing app/api/reviews/route.ts POST function:

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, title, comment, productId, farmerId, orderId, images = [] } = body

    // Validate required fields
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product/farmer
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        OR: [
          { productId: productId || undefined },
          { farmerId: farmerId || undefined }
        ].filter(Boolean)
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this item' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        comment,
        images, // Now expects array of URLs from uploaded images
        productId: productId || undefined,
        farmerId: farmerId || undefined,
        orderId: orderId || undefined,
        userId: session.user.id,
        verified: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        farmer: {
          select: {
            id: true,
            farmName: true,
            image: true,
          }
        }
      }
    })

    // Update product/farmer rating averages
    if (productId) {
      await updateProductRating(productId)
    }
    if (farmerId) {
      await updateFarmerRating(farmerId)
    }

    // Mark order as reviewed
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { reviewed: true }
      })
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

async function updateProductRating(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true }
  })

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  await prisma.product.update({
    where: { id: productId },
    data: {
      avgRating,
      totalReviews: reviews.length
    }
  })
}

async function updateFarmerRating(farmerId: string) {
  const reviews = await prisma.review.findMany({
    where: { farmerId },
    select: { rating: true }
  })

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  await prisma.farmer.update({
    where: { id: farmerId },
    data: {
      rating: avgRating,
      totalReviews: reviews.length
    }
  })
}