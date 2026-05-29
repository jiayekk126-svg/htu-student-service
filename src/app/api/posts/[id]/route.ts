import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      _count: { select: { comments: true, likes: true, bookmarks: true } },
    },
  })
  if (!post) return NextResponse.json({ error: '动态不存在' }, { status: 404 })
  return NextResponse.json({ post: { ...post, likesCount: post._count.likes, commentsCount: post._count.comments, bookmarksCount: post._count.bookmarks } })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(request)
  const { id } = await params
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: '动态不存在' }, { status: 404 })
  if (post.userId !== auth.userId) return NextResponse.json({ error: '无权限' }, { status: 403 })
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
