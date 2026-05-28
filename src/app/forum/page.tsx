import { Suspense } from 'react'
import { getForumPosts } from '@/lib/api'
import { ClientForumPage } from './client-page'

export default async function ForumPage() {
  const posts = await getForumPosts()

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">加载中...</div>}>
      <ClientForumPage posts={posts} />
    </Suspense>
  )
}
