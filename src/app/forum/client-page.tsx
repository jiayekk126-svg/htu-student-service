'use client'

import { useState, useRef } from 'react'
import { Search, Plus, BookOpen, Heart, ShoppingBag, Target, Pin, MessageSquare, Eye, ThumbsUp, ChevronRight, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { forumBoards } from '@/data/forum-posts'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api-client'
import type { ForumPost } from '@/types'
import { getLevelInfo } from '@/lib/level'

const boardIcons: Record<string, typeof BookOpen> = {
  study: BookOpen,
  life: Heart,
  trade: ShoppingBag,
  career: Target,
}

const boardLabels: Record<string, string> = {
  study: '学习交流',
  life: '生活分享',
  trade: '二手交易',
  career: '求职考研',
}

const boardColors: Record<string, string> = {
  study: 'border-l-blue-500',
  life: 'border-l-emerald-500',
  trade: 'border-l-amber-500',
  career: 'border-l-violet-500',
}

function detectDeviceInfo() {
  if (typeof navigator === 'undefined') return { name: '河南师范大学' }
  const ua = navigator.userAgent
  if (ua.includes('iPhone') || ua.includes('iPad')) return { name: 'iPhone' }
  if (ua.includes('Android')) return { name: 'Android' }
  if (ua.includes('Windows')) return { name: 'Windows' }
  return { name: '河南师范大学' }
}

async function getLocationInfo(): Promise<{ city: string }> {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return { city: data.city || '河南' }
  } catch {
    return { city: '河南' }
  }
}

export function ClientForumPage({ posts }: { posts: ForumPost[] }) {
  const { user, openLogin } = useAppStore()
  const [activeBoard, setActiveBoard] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [postBoard, setPostBoard] = useState('study')
  const [postImages, setPostImages] = useState<File[]>([])
  const [postPreviews, setPostPreviews] = useState<string[]>([])
  const [posting, setPosting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = posts.filter((p) => {
    const matchBoard = activeBoard === '全部' || p.board === activeBoard
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchBoard && matchSearch
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...postImages, ...files].slice(0, 9)
    setPostImages(newFiles)
    Promise.all(newFiles.map((f) => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(f)
    }))).then(setPostPreviews)
  }

  const removeImage = (i: number) => {
    const newFiles = postImages.filter((_, j) => j !== i)
    setPostImages(newFiles)
    const newPrevs = postPreviews.filter((_, j) => j !== i)
    setPostPreviews(newPrevs)
  }

  const handlePost = async () => {
    if (!user) { openLogin(); return }
    if (!postContent.trim()) return
    setPosting(true)
    try {
      const loc = await getLocationInfo()
      const device = detectDeviceInfo()
      const fd = new FormData()
      fd.set('content', postContent)
      fd.set('isForum', 'true')
      fd.set('forumCategory', postBoard)
      fd.set('device', device.name)
      fd.set('location', loc.city)
      postImages.forEach((f) => fd.append('images', f))
      await api.createPostWithFiles(fd)
      setPostContent(''); setPostImages([]); setPostPreviews([]); setShowPostModal(false)
      window.location.reload()
    } catch {} finally { setPosting(false) }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">校园论坛</h1>
          <p className="mt-1 text-sm text-muted-foreground">畅所欲言，交流分享</p>
        </div>
        <Button onClick={() => { if (!user) { openLogin(); return }; setShowPostModal(true) }} className="bg-[#C41A1A] hover:bg-[#a01515] text-white">
          <Plus className="h-4 w-4 mr-1" /> 发帖
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[{ id: '全部', name: '全部', icon: BookOpen }, ...forumBoards].map((board) => {
          const Icon = 'icon' in board ? boardIcons[board.id] || BookOpen : BookOpen
          return (
            <button key={board.id} onClick={() => setActiveBoard(board.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeBoard === board.id ? 'bg-[#003366] text-white shadow-sm' : 'bg-[#F5F5F5] text-muted-foreground hover:bg-[#eee]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {board.name}
            </button>
          )
        })}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索帖子..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="space-y-2">
        {filtered.map((post) => (
          <Link key={post.id} href={`/forum/${post.id}`}>
            <Card className={`border-l-4 ${boardColors[post.board]} border-[#003366]/10 transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar size="sm" className="mt-0.5 shrink-0">
                    <AvatarImage src={post.author?.avatar || ''} />
                    <AvatarFallback className="bg-[#003366] text-white text-xs">{post.author?.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.isPinned && <Pin className="h-3.5 w-3.5 text-[#C41A1A]" />}
                      <Badge variant="outline" className="text-xs bg-[#F5F5F5]">{boardLabels[post.board]}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-[#003366] leading-snug">{post.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.content}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">{post.author?.name || '匿名'} {post.author?.createdAt ? <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(post.author.createdAt).level}</span> : null}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentCount}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {post.likes}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-2 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-muted-foreground">暂无帖子</div>}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !posting && setShowPostModal(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#003366]">发布帖子</h3>
              <button onClick={() => !posting && setShowPostModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">选择版块</label>
              <div className="flex gap-2">
                {forumBoards.map((b) => {
                  const Icon = boardIcons[b.id]
                  return (
                    <button key={b.id} onClick={() => setPostBoard(b.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${postBoard === b.id ? 'bg-[#003366] text-white' : 'bg-[#F5F5F5] text-gray-600 hover:bg-[#eee]'}`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {b.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} placeholder="写下你想说的话..."
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20" />
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {postPreviews.map((url, i) => (
                <div key={i} className="relative">
                  <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden"><img src={url} alt="" className="h-full w-full object-cover" /></div>
                  <button onClick={() => removeImage(i)} className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="h-2.5 w-2.5" /></button>
                </div>
              ))}
              {postImages.length < 9 && (
                <button onClick={() => fileInputRef.current?.click()} className="h-14 w-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#003366] hover:text-[#003366]">
                  <ImageIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setShowPostModal(false); setPostContent(''); setPostImages([]); setPostPreviews([]) }} disabled={posting} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={handlePost} disabled={!postContent.trim() || posting} className="rounded-lg bg-[#C41A1A] px-4 py-1.5 text-sm text-white hover:bg-[#a01515] disabled:opacity-50">
                {posting ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null}
                {posting ? '发布中...' : '发布'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
