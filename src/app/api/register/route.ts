import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()
    if (!username || !email || !password) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
    if (existing) {
      return NextResponse.json({ error: '用户名或邮箱已存在' }, { status: 409 })
    }
    const user = await prisma.user.create({
      data: { username, email, password: await hashPassword(password) },
      select: { id: true, username: true, email: true, createdAt: true },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}
