'use client'

import { Bookmark, Share2, MessageCircle, Heart, MoreHorizontal, Verified, Medal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { BlogPost } from '@/types'

function BlogPostCard({ post }: { post: BlogPost }) {
  const gridClass = post.images.length === 1 ? 'grid-cols-1' :
    post.images.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <Card className="border-0 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md mb-4 break-inside-avoid">
      <CardContent className="p-4">
        {/* User info */}
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-[#003366] text-white text-xs">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#003366]">{post.author.name}</span>
              <Verified className="h-3.5 w-3.5 text-blue-500" />
              <Medal className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">{post.author.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {' '} 来自 {post.author.source || '河南师范大学'}
            </p>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>

        {/* Images */}
        {post.images.length > 0 && (
          <div className={`grid ${gridClass} gap-1 rounded-lg overflow-hidden mb-3`}>
            {post.images.slice(0, 9).map((img, i) => (
              <div key={i} className={`aspect-square bg-muted flex items-center justify-center text-muted-foreground/30 text-xs ${post.images.length === 1 ? 'aspect-video' : ''}`}>
                📷 {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}

        {/* Interaction bar */}
        <div className="flex items-center justify-between border-t border-[#003366]/5 pt-3">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[#C41A1A] transition-colors group">
            <Heart className="h-4 w-4 group-hover:fill-[#C41A1A] group-hover:text-[#C41A1A]" />
            <span>{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-500 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments >= 1000 ? `${(post.comments / 1000).toFixed(1)}k` : post.comments}</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>{post.shares}</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-500 transition-colors">
            <Bookmark className="h-4 w-4" />
            <span>{post.favorites >= 1000 ? `${(post.favorites / 1000).toFixed(1)}k` : post.favorites}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const leftCol = posts.filter((_, i) => i % 2 === 0)
  const rightCol = posts.filter((_, i) => i % 2 === 1)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">学生博客</h1>
        <p className="mt-1 text-sm text-muted-foreground">分享你的校园故事</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {leftCol.map((post) => <BlogPostCard key={post.id} post={post} />)}
        </div>
        <div className="space-y-4">
          {rightCol.map((post) => <BlogPostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  )
}
