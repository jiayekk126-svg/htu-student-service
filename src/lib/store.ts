import { create } from 'zustand'
import type { User, AIConfig, ChatMessage } from '@/types'
import { currentUser } from '@/data/users'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  isMobileMenuOpen: boolean
  aiConfig: AIConfig
  chatMessages: ChatMessage[]
  setUser: (user: User | null) => void
  toggleTheme: () => void
  setMobileMenuOpen: (open: boolean) => void
  setAIConfig: (config: Partial<AIConfig>) => void
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: currentUser,
  theme: 'light',
  isMobileMenuOpen: false,
  aiConfig: {
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '你是一位河南师范大学的AI助手，乐于帮助同学们解决学习和生活中的问题。',
  },
  chatMessages: [],
  setUser: (user) => set({ user }),
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
}))
