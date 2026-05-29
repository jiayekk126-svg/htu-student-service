const API_BASE = ''

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('auth_user')
  return raw ? JSON.parse(raw) : null
}

export function setStoredUser(user: unknown) {
  if (typeof window === 'undefined') return
  if (user) localStorage.setItem('auth_user', JSON.stringify(user))
  else localStorage.removeItem('auth_user')
}

export function getStoredGithubInfo() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('github_info')
  return raw ? JSON.parse(raw) : null
}

export function setStoredGithubInfo(info: unknown) {
  if (typeof window === 'undefined') return
  if (info) localStorage.setItem('github_info', JSON.stringify(info))
  else localStorage.removeItem('github_info')
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: Record<string, unknown> }>('/api/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),

  register: (data: { username: string; email: string; password: string }) =>
    request<{ user: Record<string, unknown> }>('/api/register', {
      method: 'POST', body: JSON.stringify(data),
    }),

  getUser: (id: string) =>
    request<{ user: Record<string, unknown> }>(`/api/user/${id}`),

  updateUser: (id: string, data: Record<string, unknown>) =>
    request<{ user: Record<string, unknown> }>(`/api/user/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }),

  uploadAvatar: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('avatar', file)
    return request<{ avatar: string }>(`/api/user/${id}/avatar`, {
      method: 'POST', body: fd,
    })
  },

  getPosts: (params?: { page?: number; limit?: number; userId?: string; isForum?: boolean }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.userId) q.set('userId', params.userId)
    if (params?.isForum !== undefined) q.set('isForum', String(params.isForum))
    return request<{ posts: Record<string, unknown>[]; total: number; page: number; totalPages: number }>(`/api/posts?${q}`)
  },

  createPost: (data: { content: string; images?: string[]; device?: string; location?: string; isForum?: boolean; forumCategory?: string }) =>
    request<Record<string, unknown>>('/api/posts', {
      method: 'POST', body: JSON.stringify(data),
    }),

  createPostWithFiles: (fd: FormData) =>
    request<Record<string, unknown>>('/api/posts', { method: 'POST', body: fd }),

  deletePost: (id: string) =>
    request<{ success: boolean }>(`/api/posts/${id}`, { method: 'DELETE' }),

  getPost: (id: string) =>
    request<{ post: Record<string, unknown> }>(`/api/posts/${id}`),

  getComments: (postId: string) =>
    request<{ comments: Record<string, unknown>[] }>(`/api/comments?postId=${postId}`),

  addComment: (postId: string, content: string) =>
    request<Record<string, unknown>>('/api/comments', {
      method: 'POST', body: JSON.stringify({ postId, content }),
    }),

  toggleLike: (postId: string) =>
    request<{ liked: boolean }>('/api/likes', {
      method: 'POST', body: JSON.stringify({ postId }),
    }),

  getLikes: (postId: string) =>
    request<{ likes: Record<string, unknown>[] }>(`/api/posts/${postId}/likes`),

  toggleBookmark: (postId: string) =>
    request<{ bookmarked: boolean }>('/api/bookmarks', {
      method: 'POST', body: JSON.stringify({ postId }),
    }),

  getBookmarks: (postId: string) =>
    request<{ bookmarks: Record<string, unknown>[] }>(`/api/posts/${postId}/bookmarks`),

  forwardPost: (postId: string, content?: string) =>
    request<Record<string, unknown>>('/api/forwards', {
      method: 'POST', body: JSON.stringify({ postId, content }),
    }),

  getForwards: (postId: string) =>
    request<{ forwards: Record<string, unknown>[] }>(`/api/posts/${postId}/forwards`),

  toggleFollow: (userId: string) =>
    request<{ followed: boolean }>('/api/follows', {
      method: 'POST', body: JSON.stringify({ userId }),
    }),

  getFollows: (userId: string, type: 'following' | 'followers') =>
    request<{ users: Record<string, unknown>[] }>(`/api/follows?userId=${userId}&type=${type}`),

  sendMessage: (receiverId: string, content: string) =>
    request<Record<string, unknown>>('/api/messages', {
      method: 'POST', body: JSON.stringify({ receiverId, content }),
    }),

  getMessages: (userId: string) =>
    request<{ messages: Record<string, unknown>[] }>(`/api/messages?userId=${userId}`),

  getGitHub: (username: string) =>
    request<{ username: string; avatar: string; repos: number; followers: number; htmlUrl: string }>(`/api/github/${username}`),
}
