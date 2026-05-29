import { create } from 'zustand'
import type { User, AIConfig, ChatMessage, Conversation, GitHubInfo, PrivateMessage } from '@/types'
import { currentUser, mockUsers } from '@/data/users'
import { api, setToken, getStoredUser, setStoredUser } from './api-client'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  isMobileMenuOpen: boolean
  aiConfig: AIConfig
  chatMessages: ChatMessage[]
  isLoginOpen: boolean
  searchOpen: boolean
  searchHistory: string[]
  setUser: (user: User | null) => void
  toggleTheme: () => void
  setMobileMenuOpen: (open: boolean) => void
  setAIConfig: (config: Partial<AIConfig>) => void
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void
  openLogin: () => void
  closeLogin: () => void
  setSearchOpen: (open: boolean) => void
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useAppStore = create<AppState>((set) => {
  return {
    user: null,
    theme: 'light',
    isMobileMenuOpen: false,
    aiConfig: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: '你是一位河南师范大学的AI助手，乐于帮助同学们解决学习和生活中的问题。',
    },
    chatMessages: [],
    isLoginOpen: false,
    searchOpen: false,
    searchHistory: [],
    setUser: (user) => {
      setStoredUser(user)
      set({ user })
    },
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
        }
        return { theme: newTheme }
      }),
    setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    setAIConfig: (config) =>
      set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
    addChatMessage: (message) =>
      set((state) => ({ chatMessages: [...state.chatMessages, message] })),
    clearChatMessages: () => set({ chatMessages: [] }),
    openLogin: () => set({ isLoginOpen: true }),
    closeLogin: () => set({ isLoginOpen: false }),
    setSearchOpen: (open) => set({ searchOpen: open }),
    addSearchHistory: (query) =>
      set((state) => {
        const filtered = state.searchHistory.filter((q) => q !== query)
        return { searchHistory: [query, ...filtered].slice(0, 10) }
      }),
    clearSearchHistory: () => set({ searchHistory: [] }),
  }
})

export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  try {
    const res = await api.login(email, password)
    setToken(res.token)
    const raw = res.user as Record<string, unknown>
    const u: User = {
      id: raw.id as string,
      name: (raw.name || raw.username || '') as string,
      avatar: (raw.avatar || '') as string,
      studentId: (raw.studentId || raw.schoolId || '') as string,
      major: (raw.major || '') as string,
      email: (raw.email || '') as string,
      bio: raw.bio as string | undefined,
      createdAt: raw.createdAt as string | undefined,
    }
    setStoredUser(u)
    return u
  } catch {
    return null
  }
}

export const mockRegister = async (data: { name: string; email: string; studentId: string; password: string; major: string }): Promise<User> => {
  const res = await api.register({ username: data.name, email: data.email, password: data.password })
  const raw = res.user as Record<string, unknown>
  const u: User = {
    id: raw.id as string,
    name: (raw.name || raw.username || data.name) as string,
    avatar: (raw.avatar || '') as string,
    studentId: data.studentId,
    major: data.major,
    email: data.email,
    bio: raw.bio as string | undefined,
    createdAt: raw.createdAt as string | undefined,
  }
  return u
}

/* ---- Follow Store ---- */
interface FollowState {
  followedUsers: Set<string>
  toggleFollow: (userId: string) => void
  isFollowed: (userId: string) => boolean
}

export const useFollowStore = create<FollowState>((set, get) => ({
  followedUsers: new Set(),
  toggleFollow: (userId) => set((state) => {
    const next = new Set(state.followedUsers)
    if (next.has(userId)) next.delete(userId)
    else next.add(userId)
    return { followedUsers: next }
  }),
  isFollowed: (userId) => get().followedUsers.has(userId),
}))

/* ---- Message Store ---- */
interface MessageState {
  conversations: Conversation[]
  sendMessage: (fromUserId: string, toUserId: string, content: string) => void
  getConversation: (userId: string) => Conversation | undefined
  mockHistory: (userId: string) => void
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  sendMessage: (fromUserId, toUserId, content) => set((state) => {
    const existing = state.conversations.find(c => c.userId === toUserId)
    const msg = { id: `msg_${Date.now()}`, fromUserId, toUserId, content, createdAt: new Date().toISOString() }
    if (existing) {
      return { conversations: state.conversations.map(c => c.userId === toUserId ? { ...c, messages: [...c.messages, msg] } : c) }
    }
    return { conversations: [...state.conversations, { userId: toUserId, messages: [msg] }] }
  }),
  getConversation: (userId) => get().conversations.find(c => c.userId === userId),
  mockHistory: (userId) => set((state) => {
    if (state.conversations.find(c => c.userId === userId)) return state
    const now = Date.now()
    const history: PrivateMessage[] = [
      { id: 'm1', fromUserId: userId, toUserId: '2024001', content: '你好！看了你的项目很感兴趣', createdAt: new Date(now - 86400000 * 2).toISOString() },
      { id: 'm2', fromUserId: '2024001', toUserId: userId, content: '谢谢！有什么可以帮你的吗？', createdAt: new Date(now - 86400000 * 2 + 60000).toISOString() },
      { id: 'm3', fromUserId: userId, toUserId: '2024001', content: '想请教一下你的Spring框架项目', createdAt: new Date(now - 86400000).toISOString() },
    ]
    return { conversations: [...state.conversations, { userId, messages: history }] }
  }),
}))

/* ---- Bookmark Store ---- */
interface BookmarkState {
  bookmarkedPosts: Set<string>
  toggleBookmark: (postId: string) => void
  isBookmarked: (postId: string) => boolean
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedPosts: new Set(),
  toggleBookmark: (postId) => set((state) => {
    const next = new Set(state.bookmarkedPosts)
    if (next.has(postId)) next.delete(postId)
    else next.add(postId)
    return { bookmarkedPosts: next }
  }),
  isBookmarked: (postId) => get().bookmarkedPosts.has(postId),
}))

/* ---- GitHub Store ---- */
interface GitHubState {
  githubInfo: GitHubInfo | null
  associate: (username: string) => void
  remove: () => void
}

export const useGitHubStore = create<GitHubState>((set) => ({
  githubInfo: null,
  associate: (username) => set({
    githubInfo: {
      username,
      avatar: `https://avatars.githubusercontent.com/${username}`,
      repos: Math.floor(Math.random() * 20) + 5,
      followers: Math.floor(Math.random() * 100) + 10,
    }
  }),
  remove: () => set({ githubInfo: null }),
}))
