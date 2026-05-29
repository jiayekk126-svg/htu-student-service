import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, MessageSquare, Pin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getForumPostById, getCommentsByPostId } from '@/lib/api'
import { ForumCommentSection } from '@/components/forum/forum-comment-section'
import { getLevelInfo } from '@/lib/level'

const boardLabels: Record<string, string> = {
  study: '学习交流',
  life: '生活分享',
  trade: '二手交易',
  career: '求职考研',
}

export default async function ForumPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, comments] = await Promise.all([
    getForumPostById(id),
    getCommentsByPostId(id),
  ])

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#003366] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回论坛
      </Link>

      <article className="mb-8 rounded-xl border border-[#003366]/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{boardLabels[post.board]}</Badge>
          {post.isPinned && <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-700"><Pin className="h-3 w-3" /> 置顶</Badge>}
        </div>

        <h1 className="font-heading text-xl font-bold text-[#003366] md:text-2xl mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Link href={`/profile?id=${post.author.id}`}>
            <Avatar size="sm">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-[#003366] text-white text-xs">{post.author.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-sm">
            <Link href={`/profile?id=${post.author.id}`} className="font-medium text-[#003366] hover:text-[#C41A1A] flex items-center gap-1">{post.author.name} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(post.author.createdAt).level}</span></Link>
            <span className="text-muted-foreground ml-2">{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views}</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {post.commentCount}</span>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-[#003366]">
          <p className="text-sm leading-relaxed">{post.content}</p>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
          </div>
        )}
      </article>

      <div className="rounded-xl border border-[#003366]/10 bg-white p-6 shadow-sm">
        <ForumCommentSection comments={comments} postId={post.id} />
      </div>
    </div>
  )
}
