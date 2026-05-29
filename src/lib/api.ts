import type { Competition, ForumPost, Comment, Product, Resource, ChatMessage } from '@/types'
import { allCompetitions } from '@/data/competitions'
import { mockProducts } from '@/data/products'
import { mockResources } from '@/data/resources'
import { prisma } from '@/lib/prisma'

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

const compatCompetitions: Competition[] = allCompetitions.map((c) => ({
  id: c.id,
  name: c.name,
  url: c.url,
  category: c.class + '类',
  class: c.class,
  stars: c.stars,
  description: c.description,
  emoji: c.emoji,
  organizer: c.class + '类赛事',
  status: '报名中',
  registrationDeadline: '2026-12-31',
  tags: [c.class + '类', c.emoji],
}))

export async function getCompetitions(): Promise<Competition[]> {
  return delay(compatCompetitions)
}

export async function getFeaturedCompetitions(): Promise<Competition[]> {
  return delay(compatCompetitions.filter((c) => c.status === '报名中').slice(0, 6))
}

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const item = compatCompetitions.find((c) => c.id === id)
  return delay(item ?? null)
}

export async function getCompetitionsByCategory(category: string): Promise<Competition[]> {
  if (category === '全部') return delay(compatCompetitions)
  return delay(compatCompetitions.filter((c) => c.category === category))
}

export async function getBlogPosts() {
  const posts = await prisma.post.findMany({
    where: { isForum: false },
    include: { user: { select: { id: true, username: true, avatar: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return posts.map((p) => ({
    id: p.id,
    content: p.content,
    images: p.images ? JSON.parse(p.images) : [],
    author: { ...p.user, name: p.user.username, createdAt: p.user.createdAt?.toISOString() || '', source: p.device || '河南师范大学', level: 'Lv.1' },
    createdAt: p.createdAt.toISOString(),
    likes: 0,
    comments: 0,
    shares: p.forwardCount,
    favorites: 0,
    tags: [],
  }))
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { id: slug },
    include: { user: { select: { id: true, username: true, avatar: true, createdAt: true } } },
  })
  if (!post) return null
  return {
    id: post.id,
    content: post.content,
    images: post.images ? JSON.parse(post.images) : [],
    author: { ...post.user, name: post.user.username, createdAt: post.user.createdAt?.toISOString() || '', source: post.device || '河南师范大学', level: 'Lv.1' },
    createdAt: post.createdAt.toISOString(),
    likes: 0, comments: 0, shares: post.forwardCount, favorites: 0,
    tags: [],
  }
}

export async function getBlogPostsByCategory(_category: string) {
  return getBlogPosts()
}

export async function getForumPosts(board?: string): Promise<ForumPost[]> {
  const where: Record<string, unknown> = { isForum: true }
  if (board && board !== '全部') where.forumCategory = board

  const posts = await prisma.post.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, avatar: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return posts.map((p) => ({
    id: p.id,
    title: p.content.slice(0, 60),
    content: p.content,
    author: { id: p.userId, name: p.user.username, avatar: p.user.avatar || '', studentId: '', major: '', email: '' },
    board: p.forumCategory || 'study',
    tags: [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.createdAt.toISOString(),
    views: p.viewCount,
    likes: p._count.likes,
    dislikes: 0,
    commentCount: p._count.comments,
    isPinned: false,
  }))
}

export async function getForumPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, avatar: true, createdAt: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })
  if (!post) return null
  return {
    id: post.id,
    title: post.content.slice(0, 60),
    content: post.content,
    author: { id: post.userId, name: post.user.username, avatar: post.user.avatar || '', createdAt: post.user.createdAt?.toISOString() || '', studentId: '', major: '', email: '' },
    board: post.forumCategory || 'study',
    tags: [],
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.createdAt.toISOString(),
    views: post.viewCount,
    likes: post._count.likes,
    dislikes: 0,
    commentCount: post._count.comments,
    isPinned: false,
  }
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, username: true, avatar: true, createdAt: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    author: { id: c.userId, name: c.user.username, avatar: c.user.avatar || '', createdAt: c.user.createdAt?.toISOString() || '', studentId: '', major: '', email: '' },
    postId: c.postId,
    createdAt: c.createdAt.toISOString(),
    likes: 0, dislikes: 0,
  }))
}

export async function getProducts(category?: string): Promise<Product[]> {
  if (!category || category === '全部') return delay(mockProducts)
  return delay(mockProducts.filter((p) => p.category === category))
}

export async function getProductById(id: string): Promise<Product | null> {
  const item = mockProducts.find((p) => p.id === id)
  return delay(item ?? null)
}

export async function getResources(category?: string): Promise<Resource[]> {
  if (!category || category === '全部') return delay(mockResources)
  return delay(mockResources.filter((r) => r.category === category))
}

export async function searchForumPosts(query: string): Promise<ForumPost[]> {
  const posts = await getForumPosts()
  const q = query.toLowerCase()
  return posts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase()
  return delay(mockProducts.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
}

export async function getHotBlogPosts() {
  const posts = await getBlogPosts()
  return posts.sort((a, b) => b.likes - a.likes).slice(0, 5)
}

export async function getLatestForumPosts(): Promise<ForumPost[]> {
  const posts = await getForumPosts()
  return posts.slice(0, 5)
}

export async function getLatestResources(): Promise<Resource[]> {
  return delay([...mockResources].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4))
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  const lastMsg = messages[messages.length - 1]
  await delay(null, 1000)
  return {
    id: `resp-${Date.now()}`,
    role: 'assistant',
    content: `收到消息："${lastMsg?.content}"。这是一个AI聊天占位响应。当接入实际的AI模型后，这里将返回智能回复。`,
    timestamp: new Date().toISOString(),
  }
}
