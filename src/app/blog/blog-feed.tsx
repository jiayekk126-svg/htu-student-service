'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, MessageCircle, Heart, MoreHorizontal, Verified, Medal, MapPinned, Repeat2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api-client'
import type { BlogPost } from '@/types'
import { getLevelInfo } from '@/lib/level'

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return new Date(iso).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface PostItem {
  id: string; content: string; images: string[]
  userId: string; username: string; avatar: string
  createdAt: string; device: string; location?: string
  likesCount: number; commentsCount: number; bookmarksCount: number; forwardCount: number
  liked: boolean; bookmarked: boolean
  user?: Record<string, unknown>
}

function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Record<string, unknown>[]>([])
  const [text, setText] = useState('')
  const { user, openLogin } = useAppStore()

  useEffect(() => { api.getComments(postId).then(r => setComments(r.comments)).catch(() => {}) }, [postId])

  const add = async () => {
    if (!user) { openLogin(); return }
    if (!text.trim()) return
    try {
      const c = await api.addComment(postId, text)
      setComments(prev => [...prev, c])
      setText('')
    } catch {}
  }

  return (
    <div className="border-t border-[#003366]/5 pt-3 mt-3">
      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
        {comments.map((c: Record<string, unknown>) => (
          <div key={c.id as string} className="flex gap-2 text-xs">
            <span className="shrink-0 font-medium text-[#003366]">{(c.user as Record<string, unknown>)?.username as string || '用户'}</span>
            <span className="text-gray-600">{c.content as string}</span>
            <span className="shrink-0 text-gray-400">{formatTime(c.createdAt as string)}</span>
          </div>
        ))}
        {comments.length === 0 && <p className="text-xs text-gray-400">暂无评论</p>}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入评论..." className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#003366]" />
        <button onClick={add} className="rounded-lg bg-[#003366] px-3 py-1.5 text-xs text-white hover:bg-[#002244]">发送</button>
      </div>
    </div>
  )
}

function PostCard({ post, onUpdate }: { post: PostItem; onUpdate: () => void }) {
  const { user, openLogin } = useAppStore()
  const router = useRouter()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likesCount)
  const [bm, setBm] = useState(post.bookmarked)
  const [bmCount, setBmCount] = useState(post.bookmarksCount)

  const imgs: string[] = typeof post.images === 'string' ? JSON.parse(post.images as string) : (post.images || [])

  const handleLike = async () => {
    if (!user) { openLogin(); return }
    try { const r = await api.toggleLike(post.id); setLiked(r.liked); setLikeCount(prev => r.liked ? prev + 1 : Math.max(0, prev - 1)) } catch {}
  }

  const handleBookmark = async () => {
    if (!user) { openLogin(); return }
    try { const r = await api.toggleBookmark(post.id); setBm(r.bookmarked); setBmCount(prev => r.bookmarked ? prev + 1 : Math.max(0, prev - 1)) } catch {}
  }

  const handleShare = async () => {
    if (!user) { openLogin(); return }
    try { await api.forwardPost(post.id); onUpdate() } catch {}
  }

  const gridClass = imgs.length === 1 ? 'grid-cols-1' : imgs.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <Card className="border-0 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md mb-4 break-inside-avoid">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar size="sm" className="cursor-pointer" onClick={() => router.push(`/profile?id=${post.userId}`)}>
            <AvatarImage src={post.avatar} />
            <AvatarFallback className="bg-[#003366] text-white text-xs">{post.username[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#003366] cursor-pointer hover:underline flex items-center gap-1" onClick={() => router.push(`/profile?id=${post.userId}`)}>
                {post.username} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(post.user?.createdAt as string).level}</span>
              </span>
              <Verified className="h-3.5 w-3.5 text-blue-500" />
              <Medal className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{formatTime(post.createdAt)}</span>
              <span>来自 {post.device || '河南师范大学'}</span>
              {post.location && <span className="flex items-center gap-0.5"><MapPinned className="h-3 w-3" />{post.location}</span>}
            </p>
          </div>
          <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>

        {imgs.length > 0 && (
          <div className={`grid ${gridClass} gap-1 rounded-lg overflow-hidden mb-3`}>
            {imgs.slice(0, 9).map((img, i) => (
              <div key={i} className={`${imgs.length === 1 ? 'aspect-video' : 'aspect-square'} bg-muted overflow-hidden`}>
                <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class=\"text-muted-foreground/30 text-xs flex items-center justify-center h-full\">📷</span>' }} />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#003366]/5 pt-3">
          <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors group ${liked ? 'text-[#C41A1A]' : 'text-muted-foreground hover:text-[#C41A1A]'}`}>
            <Heart className={`h-4 w-4 ${liked ? 'fill-[#C41A1A]' : ''}`} />
            <span>{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}</span>
          </button>
          <button onClick={() => { if (!user) { openLogin(); return }; setShowComments(!showComments) }} className={`flex items-center gap-1 text-xs transition-colors ${showComments ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'}`}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount >= 1000 ? `${(post.commentsCount / 1000).toFixed(1)}k` : post.commentsCount}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500">
            <Repeat2 className="h-4 w-4" />
            <span>{post.forwardCount}</span>
          </button>
          <button onClick={handleBookmark} className={`flex items-center gap-1 text-xs transition-colors ${bm ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}>
            <Bookmark className={`h-4 w-4 ${bm ? 'fill-amber-500' : ''}`} />
            <span>{bmCount >= 1000 ? `${(bmCount / 1000).toFixed(1)}k` : bmCount}</span>
          </button>
        </div>

        {showComments && <CommentSection postId={post.id} />}
      </CardContent>
    </Card>
  )
}

export function BlogFeed({ posts: initialPosts }: { posts: BlogPost[] }) {
  const { user } = useAppStore()
  const [posts, setPosts] = useState<PostItem[]>([])

  const fetchPosts = async () => {
    try {
      const res = await api.getPosts({ limit: 50 })
      setPosts((res.posts || []).map((p: Record<string, unknown>) => {
        const u = p.user as Record<string, unknown> || {}
        const rawImages = p.images as string
        return {
          id: p.id as string,
          content: p.content as string,
          images: rawImages ? (typeof rawImages === 'string' ? (() => { try { return JSON.parse(rawImages) } catch { return [rawImages] } })() : rawImages as unknown as string[]) : [],
          userId: u.id as string || p.userId as string,
          username: u.username as string || '用户',
          avatar: u.avatar as string || '',
          createdAt: p.createdAt as string,
          device: p.device as string || '',
          location: p.location as string || '',
          likesCount: (p.likesCount as number) || 0,
          commentsCount: (p.commentsCount as number) || 0,
          bookmarksCount: (p.bookmarksCount as number) || 0,
          forwardCount: (p.forwardCount as number) || 0,
          user: u,
          liked: false,
          bookmarked: false,
        }
      }))
    } catch {
      setPosts(initialPosts.map(p => ({
        id: p.id, content: p.content, images: p.images.map(img => img.replace('/images/blog/', '/blog-images/')),
        userId: p.author.id, username: p.author.name, avatar: p.author.avatar, user: p.author as unknown as Record<string, unknown>,
        createdAt: p.createdAt, device: p.author.source || '', location: '',
        likesCount: p.likes, commentsCount: p.comments, bookmarksCount: p.favorites, forwardCount: p.shares,
        liked: false, bookmarked: false,
      })))
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const leftCol = posts.filter((_, i) => i % 2 === 0)
  const rightCol = posts.filter((_, i) => i % 2 === 1)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">学生博客</h1>
        <p className="mt-1 text-sm text-muted-foreground">分享你的校园故事</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">{leftCol.map((post) => <PostCard key={post.id} post={post} onUpdate={fetchPosts} />)}</div>
        <div className="space-y-4">{rightCol.map((post) => <PostCard key={post.id} post={post} onUpdate={fetchPosts} />)}</div>
      </div>
    </div>
  )
}
