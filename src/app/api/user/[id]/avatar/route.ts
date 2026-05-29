import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(request)
  const { id } = await params
  if (!auth || auth.userId !== id) {
    return NextResponse.json({ error: '无权限' }, { status: 403 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null
    if (!file) return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = uuidv4() + '.' + ext
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(uploadDir, filename), buffer)
    const avatarUrl = '/uploads/' + filename
    await prisma.user.update({ where: { id }, data: { avatar: avatarUrl } })
    return NextResponse.json({ avatar: avatarUrl })
  } catch (e) {
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
