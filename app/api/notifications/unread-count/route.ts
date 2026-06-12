// app/api/notifications/unread-count/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to fetch notification count:', error)
    return NextResponse.json({ count: 0 })
  }
}