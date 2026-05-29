import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { content, receiverId } = await request.json()
  if (!content?.trim() || !receiverId) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }
  const msg = await prisma.message.create({
    data: { content, senderId: auth.userId, receiverId },
    include: {
      sender: { select: { id: true, username: true, avatar: true } },
      receiver: { select: { id: true, username: true, avatar: true } },
    },
  })
  return NextResponse.json(msg, { status: 201 })
}

export async function GET(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: '缺少userId' }, { status: 400 })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: auth.userId, receiverId: userId },
        { senderId: userId, receiverId: auth.userId },
      ],
    },
    include: {
      sender: { select: { id: true, username: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ messages })
}
