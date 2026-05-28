import type {
  Competition,
  BlogPost,
  ForumPost,
  Comment,
  Product,
  Resource,
  ChatMessage,
} from '@/types'
import { allCompetitions } from '@/data/competitions'
import { mockBlogPosts } from '@/data/blog-posts'
import { mockForumPosts, mockComments } from '@/data/forum-posts'
import { mockProducts } from '@/data/products'
import { mockResources } from '@/data/resources'
import { mockUsers } from '@/data/users'

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

export async function getBlogPosts(): Promise<BlogPost[]> {
  return delay(mockBlogPosts)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const item = mockBlogPosts.find((p) => p.id === slug)
  return delay(item ?? null)
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  if (category === '全部') return delay(mockBlogPosts)
  return delay(mockBlogPosts.filter((p) => p.tags?.includes(category)))
}

export async function getForumPosts(board?: string): Promise<ForumPost[]> {
  if (!board || board === '全部') return delay(mockForumPosts)
  return delay(mockForumPosts.filter((p) => p.board === board))
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  const item = mockForumPosts.find((p) => p.id === id)
  return delay(item ?? null)
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  return delay(mockComments[postId] ?? [])
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
  const q = query.toLowerCase()
  return delay(mockForumPosts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)))
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase()
  return delay(mockProducts.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
}

export async function getHotBlogPosts(): Promise<BlogPost[]> {
  return delay([...mockBlogPosts].sort((a, b) => b.likes - a.likes).slice(0, 5))
}

export async function getLatestForumPosts(): Promise<ForumPost[]> {
  return delay([...mockForumPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5))
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
