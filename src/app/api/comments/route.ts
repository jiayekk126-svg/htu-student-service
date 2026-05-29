import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: '缺少postId' }, { status: 400 })
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, username: true, avatar: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ comments })
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { content, postId } = await request.json()
  if (!content?.trim() || !postId) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }
  const comment = await prisma.comment.create({
    data: { content, postId, userId: auth.userId },
    include: { user: { select: { id: true, username: true, avatar: true } } },
  })
  return NextResponse.json(comment, { status: 201 })
}
