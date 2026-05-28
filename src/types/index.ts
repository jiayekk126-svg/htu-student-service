export interface User {
  id: string
  name: string
  avatar: string
  studentId: string
  major: string
  email: string
  bio?: string
  skills?: string[]
  achievements?: string[]
  contact?: string
  level?: string
  source?: string
}

export interface Competition {
  id: string
  name: string
  url: string
  category: string
  class: 'A' | 'B' | 'C'
  stars: number
  description: string
  organizer?: string
  note?: string
  emoji: string
  registrationDeadline?: string
  status?: '报名中' | '进行中' | '已结束'
  tags?: string[]
}

export interface CompetitionLink {
  name: string
  url: string
  description?: string
  note?: string
}

export interface BlogPost {
  id: string
  title?: string
  content: string
  images: string[]
  author: User
  createdAt: string
  likes: number
  comments: number
  shares: number
  favorites: number
  tags?: string[]
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: User
  board: string
  tags: string[]
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  dislikes: number
  commentCount: number
  isPinned: boolean
  isResolved?: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  postId: string
  parentId?: string
  createdAt: string
  likes: number
  dislikes: number
  replies?: Comment[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  seller: User
  status: '在售' | '已售出' | '已下架'
  createdAt: string
  views: number
  tags: string[]
}

export interface Resource {
  id: string
  name: string
  description: string
  category: string
  uploader: User
  fileType: string
  fileSize: string
  downloadCount: number
  rating: number
  coverImage?: string
  downloadUrl: string
  createdAt: string
  tags: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}
