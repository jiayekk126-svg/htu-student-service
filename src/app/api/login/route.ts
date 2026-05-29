import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const user = await prisma.user.findFirst({ where: { OR: [{ email }, { schoolId: email }] } })
    if (!user) {
      return NextResponse.json({ error: '账号不存在' }, { status: 401 })
    }
    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }
    const token = signToken({ userId: user.id, username: user.username })
    return NextResponse.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, schoolId: user.schoolId, createdAt: user.createdAt } })
  } catch (e) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
