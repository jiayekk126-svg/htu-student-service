import { Suspense } from 'react'
import { mockBlogPosts } from '@/data/blog-posts'
import { BlogFeed } from './blog-feed'

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">加载中...</div>}>
      <BlogFeed posts={mockBlogPosts} />
    </Suspense>
  )
}
