'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Verified, Medal } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { mockBlogPosts } from '@/data/blog-posts'
import { getLevelInfo } from '@/lib/level'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = mockBlogPosts.find((p) => p.id === slug || p.id === slug)

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#003366] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回博客
      </Link>

      <div className="rounded-xl border border-[#003366]/10 bg-white p-6 shadow-sm">
        {/* User info */}
        <div className="flex items-center gap-2.5 mb-4">
          <Avatar size="default">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-[#003366] text-white text-xs">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#003366] flex items-center gap-1">{post.author.name} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(post.author.createdAt).level}</span></span>
              <Verified className="h-3.5 w-3.5 text-blue-500" />
              <Medal className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">{post.author.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {' 来自 '}{post.author.source || '河南师范大学'}
            </p>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

        {/* Images */}
        {post.images.length > 0 && (
          <div className={`grid ${post.images.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-1 rounded-lg overflow-hidden mb-4`}>
            {post.images.map((img, i) => (
              <div key={i} className="aspect-square bg-muted flex items-center justify-center text-muted-foreground/30">
                📷 {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Interaction bar */}
        <div className="flex items-center justify-between border-t border-[#003366]/5 pt-4">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#C41A1A] transition-colors">
            <Heart className="h-5 w-5" /> {post.likes}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
            <MessageCircle className="h-5 w-5" /> {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-emerald-500 transition-colors">
            <Share2 className="h-5 w-5" /> {post.shares}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-500 transition-colors">
            <Bookmark className="h-5 w-5" /> {post.favorites}
          </button>
        </div>
      </div>

      {/* Comments section */}
      <div className="mt-6 rounded-xl border border-[#003366]/10 bg-white p-6 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-[#003366] mb-4">评论 ({post.comments})</h3>
        <div className="flex gap-2 mb-4">
          <Avatar size="sm">
            <AvatarFallback className="bg-[#003366] text-white text-xs">我</AvatarFallback>
          </Avatar>
          <input
            placeholder="写下你的评论..."
            className="flex-1 h-9 rounded-lg border border-[#003366]/10 bg-[#F5F5F5] px-3 text-sm outline-none focus:border-[#003366] transition-colors"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">暂无评论，来说两句吧~</p>
      </div>
    </div>
  )
}
