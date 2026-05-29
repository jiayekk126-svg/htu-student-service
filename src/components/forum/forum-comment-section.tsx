'use client'

import { useState } from 'react'
import { MessageSquare, Reply, Loader2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api-client'
import type { Comment } from '@/types'
import { getLevelInfo } from '@/lib/level'
function ForumCommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar size="sm" className="mt-0.5 shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="text-xs">{comment.author.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="font-medium text-foreground flex items-center gap-1">{comment.author.name} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(comment.author.createdAt).level}</span></span>
            <span>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l pl-4">
          {comment.replies.map((reply) => (
            <ForumCommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ForumCommentSection({
  comments: initialComments,
  postId,
}: {
  comments: Comment[]
  postId: string
}) {
  const { user, openLogin } = useAppStore()
  const [comments, setComments] = useState(initialComments)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!user) { openLogin(); return }
    if (!text.trim()) return
    setSending(true)
    try {
      const c = await api.addComment(postId, text)
      const raw = c as Record<string, unknown>
      const author = (raw.author || raw.user || {}) as Record<string, unknown>
      setComments(prev => [...prev, {
        id: raw.id as string,
        content: raw.content as string,
        postId,
        author: { id: author.id as string, name: (author.name || author.username || '') as string, avatar: (author.avatar || '') as string, studentId: '', major: '', email: '' },
        createdAt: raw.createdAt as string,
        likes: 0, dislikes: 0,
        replies: [],
      } as Comment])
      setText('')
    } catch {} finally { setSending(false) }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-base font-semibold flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        评论 ({comments.length})
      </h3>

      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="写下你的评论..." className="flex-1" />
        <Button size="sm" onClick={handleSubmit} disabled={!text.trim() || sending}>
          {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          发表评论
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <ForumCommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">暂无评论</p>
      )}
    </div>
  )
}
