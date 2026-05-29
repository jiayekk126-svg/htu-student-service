import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const { postId, content } = await request.json()
  if (!postId) return NextResponse.json({ error: '缺少postId' }, { status: 400 })

  const original = await prisma.post.findUnique({ where: { id: postId } })
  if (!original) return NextResponse.json({ error: '动态不存在' }, { status: 404 })

  const forwardText = content ? `${content}\n\n// @${original.userId}: ${original.content}` : original.content

  const post = await prisma.post.create({
    data: {
      content: forwardText,
      images: original.images,
      device: original.device,
      isForum: false,
      originPostId: postId,
      userId: auth.userId,
    },
  })

  await prisma.post.update({ where: { id: postId }, data: { forwardCount: { increment: 1 } } })

  return NextResponse.json(post, { status: 201 })
}
