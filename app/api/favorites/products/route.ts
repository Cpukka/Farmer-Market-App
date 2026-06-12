// app/api/favorites/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ favorites: [] })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favoriteProducts: {
          include: {
            farmer: {
              select: {
                farmName: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ favorites: user?.favoriteProducts || [] })
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
    return NextResponse.json({ favorites: [] })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId } = await req.json()

    // Toggle favorite
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { favoriteProducts: true },
    })

    const isFavorite = user?.favoriteProducts.some(p => p.id === productId)

    if (isFavorite) {
      // Remove from favorites
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          favoriteProducts: {
            disconnect: { id: productId },
          },
        },
      })
      return NextResponse.json({ favorited: false })
    } else {
      // Add to favorites
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          favoriteProducts: {
            connect: { id: productId },
          },
        },
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    )
  }
}