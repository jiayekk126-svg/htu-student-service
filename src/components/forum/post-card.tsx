import Link from 'next/link'
import { MessageSquare, Eye, ThumbsUp, Pin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { ForumPost } from '@/types'
import { getLevelInfo } from '@/lib/level'

const boardLabels: Record<string, string> = {
  study: '学习交流',
  life: '生活分享',
  trade: '二手交易',
  career: '求职考研',
}

const boardColors: Record<string, string> = {
  study: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  life: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  trade: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  career: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

export function PostCard({ post }: { post: ForumPost }) {
  return (
    <Link href={`/forum/${post.id}`}>
      <Card className="transition-all hover:shadow-sm hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar size="sm" className="mt-0.5 shrink-0">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="text-xs">{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {post.isPinned && <Pin className="h-3.5 w-3.5 text-[#E67E22]" />}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${boardColors[post.board]}`}>
                  {boardLabels[post.board]}
                </span>
                {post.isResolved && (
                  <Badge variant="secondary" className="text-xs">已解决</Badge>
                )}
              </div>
              <h3 className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-[#003366] dark:group-hover:text-blue-300 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {post.content}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">{post.author.name} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(post.author.createdAt).level}</span></span>
                <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {post.commentCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> {post.likes}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
