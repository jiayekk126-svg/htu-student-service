import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } })
  return NextResponse.json({ success: true })
}
