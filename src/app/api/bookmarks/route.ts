import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { postId } = await request.json()
  if (!postId) return NextResponse.json({ error: '缺少postId' }, { status: 400 })

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId: auth.userId, postId } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    return NextResponse.json({ bookmarked: false })
  } else {
    await prisma.bookmark.create({ data: { userId: auth.userId, postId } })
    return NextResponse.json({ bookmarked: true })
  }
}
