import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, username: true, email: true, avatar: true, bio: true, phone: true,
      schoolId: true, className: true, department: true, skills: true, githubUsername: true,
      createdAt: true,
      _count: { select: { followedBy: true, follows: true, posts: true, likes: true } },
    },
  })
  if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(request)
  const { id } = await params
  if (!auth || auth.userId !== id) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }
  const data = await request.json()
  const allowed = ['username', 'bio', 'phone', 'schoolId', 'className', 'department', 'skills', 'githubUsername']
  const updateData: Record<string, string> = {}
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = String(data[key])
  }
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '没有要更新的字段' }, { status: 400 })
  }
  const user = await prisma.user.update({ where: { id }, data: updateData })
  return NextResponse.json({ user })
}
