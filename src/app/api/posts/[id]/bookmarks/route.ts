import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bookmarks = await prisma.bookmark.findMany({
    where: { postId: id },
    include: { user: { select: { id: true, username: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ bookmarks: bookmarks.map(b => b.user) })
}
