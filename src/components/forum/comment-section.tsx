'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Reply, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Comment } from '@/types'

function CommentItem({ comment }: { comment: Comment }) {
  const [showReply, setShowReply] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar size="sm" className="mt-0.5 shrink-0">
          <AvatarFallback className="text-xs">{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            <span>{new Date(comment.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsDown className="h-3.5 w-3.5" /> {comment.dislikes}
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="h-3.5 w-3.5" /> 回复
            </button>
          </div>
          {showReply && (
            <div className="flex gap-2 mt-2">
              <Input placeholder="输入回复内容..." className="h-8 text-sm" />
              <Button size="sm" variant="outline">发送</Button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l pl-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentSection({
  comments,
  postId,
}: {
  comments: Comment[]
  postId: string
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-base font-semibold flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        评论 ({comments.length})
      </h3>

      <div className="flex gap-2">
        <Input placeholder="写下你的评论..." className="flex-1" />
        <Button size="sm">发表评论</Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">暂无评论</p>
      )}
    </div>
  )
}
