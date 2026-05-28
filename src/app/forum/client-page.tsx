'use client'

import { useState } from 'react'
import { Search, Plus, BookOpen, Heart, ShoppingBag, Target, Pin, MessageSquare, Eye, ThumbsUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { forumBoards } from '@/data/forum-posts'
import type { ForumPost } from '@/types'

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

export function ClientForumPage({ posts }: { posts: ForumPost[] }) {
  const [activeBoard, setActiveBoard] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = posts.filter((p) => {
    const matchBoard = activeBoard === '全部' || p.board === activeBoard
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchBoard && matchSearch
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">校园论坛</h1>
          <p className="mt-1 text-sm text-muted-foreground">畅所欲言，交流分享</p>
        </div>
        <Button className="bg-[#C41A1A] hover:bg-[#a01515] text-white">
          <Plus className="h-4 w-4 mr-1" /> 发帖
        </Button>
      </div>

      {/* Board tabs */}
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

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索帖子..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Post list */}
      <div className="space-y-2">
        {filtered.map((post) => (
          <Link key={post.id} href={`/forum/${post.id}`}>
            <Card className={`border-l-4 ${boardColors[post.board]} border-[#003366]/10 transition-all hover:shadow-md hover:-translate-y-0.5`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar size="sm" className="mt-0.5 shrink-0">
                    <AvatarFallback className="bg-[#003366] text-white text-xs">{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.isPinned && <Pin className="h-3.5 w-3.5 text-[#C41A1A]" />}
                      <Badge variant="outline" className="text-xs bg-[#F5F5F5]">{boardLabels[post.board]}</Badge>
                      {post.isResolved && <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">已解决</Badge>}
                    </div>
                    <h3 className="text-sm font-semibold text-[#003366] leading-snug">{post.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.content}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{post.author.name}</span>
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
    </div>
  )
}
