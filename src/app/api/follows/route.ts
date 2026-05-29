import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: '缺少userId' }, { status: 400 })
  if (userId === auth.userId) return NextResponse.json({ error: '不能关注自己' }, { status: 400 })

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: auth.userId, followingId: userId } },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ followed: false })
  } else {
    await prisma.follow.create({ data: { followerId: auth.userId, followingId: userId } })
    return NextResponse.json({ followed: true })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type')
  if (!userId) return NextResponse.json({ error: '缺少userId' }, { status: 400 })

  if (type === 'following') {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, username: true, avatar: true } } },
    })
    return NextResponse.json({ users: follows.map(f => f.following) })
  } else {
    const follows = await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: { id: true, username: true, avatar: true } } },
    })
    return NextResponse.json({ users: follows.map(f => f.follower) })
  }
}
