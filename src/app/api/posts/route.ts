import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const userId = searchParams.get('userId')
  const isForum = searchParams.get('isForum')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (userId) where.userId = userId
  if (isForum === 'true') where.isForum = true
  else if (isForum === 'false') where.isForum = false

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { comments: true, likes: true, bookmarks: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({
    posts: posts.map(p => ({
      ...p,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      bookmarksCount: p._count.bookmarks,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request)
  if (!auth) return NextResponse.json({ error: '未登录' }, { status: 401 })

  try {
    const contentType = request.headers.get('content-type') || ''
    let content = ''
    let images: string[] = []
    let device = ''
    let location = ''
    let isForum = false
    let forumCategory = ''
    let originPostId = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      content = (formData.get('content') as string) || ''
      device = (formData.get('device') as string) || ''
      location = (formData.get('location') as string) || ''
      isForum = formData.get('isForum') === 'true'
      forumCategory = (formData.get('forumCategory') as string) || ''
      originPostId = (formData.get('originPostId') as string) || ''

      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const imageFiles = formData.getAll('images') as File[]
      for (const file of imageFiles) {
        if (file instanceof File) {
          const ext = file.name.split('.').pop() || 'jpg'
          const filename = `${uuidv4()}.${ext}`
          const buffer = Buffer.from(await file.arrayBuffer())
          await writeFile(join(uploadDir, filename), buffer)
          images.push(`/uploads/${filename}`)
        }
      }
    } else {
      const data = await request.json()
      content = data.content || ''
      images = data.images || []
      device = data.device || ''
      location = data.location || ''
      isForum = data.isForum || false
      forumCategory = data.forumCategory || ''
      originPostId = data.originPostId || ''
    }

    if (!content.trim()) return NextResponse.json({ error: '内容不能为空' }, { status: 400 })

    const post = await prisma.post.create({
      data: {
        content,
        images: JSON.stringify(images),
        device,
        location,
        isForum,
        forumCategory,
        originPostId,
        userId: auth.userId,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { comments: true, likes: true, bookmarks: true } },
      },
    })

    return NextResponse.json({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
    }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '发布失败' }, { status: 500 })
  }
}
