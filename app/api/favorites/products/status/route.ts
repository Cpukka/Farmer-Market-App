// app/api/favorites/products/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../../lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ isFavorite: false })
  }

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ isFavorite: false })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favoriteProducts: {
          where: { id: productId },
        },
      },
    })

    const isFavorite = user?.favoriteProducts?.length > 0
    return NextResponse.json({ isFavorite })
  } catch (error) {
    console.error('Failed to check favorite status:', error)
    return NextResponse.json({ isFavorite: false })
  }
}