'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Award, BookOpen, MessageSquare, ShoppingBag, FolderOpen, Bot, ArrowRight, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { allCompetitions } from '@/data/competitions'
import { mockResources } from '@/data/resources'
import { api } from '@/lib/api-client'
import type { Competition, ForumPost, Resource } from '@/types'

const featuredCompetitions: Competition[] = allCompetitions.map((c) => ({
  id: c.id,
  name: c.name,
  url: c.url,
  category: c.class + '类',
  class: c.class,
  stars: c.stars,
  description: c.description,
  emoji: c.emoji,
  organizer: c.class + '类赛事',
  status: '报名中',
  registrationDeadline: '2026-12-31',
  tags: [c.class + '类', c.emoji],
  })).slice(0, 6) as Competition[]

const slides = [
  {
    title: '学在师大',
    subtitle: '一站式服务',
    desc: '竞赛、博客、论坛、交易、资源、AI助手 — 为师大学子打造全方位校园服务平台',
    gradient: 'from-[#003366] via-[#004080] to-[#002244]',
  },
  {
    title: '学科竞赛导航',
    subtitle: '助你逐梦赛场',
    desc: 'A类/B类/C类赛事全覆盖，含金量一目了然，一键直达官网报名',
    gradient: 'from-[#C41A1A] via-[#a01515] to-[#003366]',
  },
  {
    title: 'AI 智能助手',
    subtitle: '24小时在线',
    desc: '智能问答、作业辅导、学习规划，你的专属校园AI伙伴',
    gradient: 'from-[#003366] via-[#1a5276] to-[#C41A1A]',
  },
]

const features = [
  { title: '学科竞赛', description: '赛事资讯·报名提醒·备赛资源', icon: Award, href: '/competitions', color: 'bg-blue-50 text-[#003366]' },
  { title: '学生博客', description: '学习心得·技术分享·校园故事', icon: BookOpen, href: '/blog', color: 'bg-emerald-50 text-emerald-600' },
  { title: '校园论坛', description: '话题讨论·经验交流·互帮互助', icon: MessageSquare, href: '/forum', color: 'bg-violet-50 text-violet-600' },
  { title: '交易市场', description: '二手好物·教材转卖·闲置交易', icon: ShoppingBag, href: '/market', color: 'bg-amber-50 text-amber-600' },
  { title: '学习资源', description: '课程笔记·真题试卷·电子书籍', icon: FolderOpen, href: '/resources', color: 'bg-rose-50 text-rose-600' },
  { title: 'AI 助手', description: '智能问答·作业辅导·学习规划', icon: Bot, href: '/ai', color: 'bg-cyan-50 text-cyan-600' },
]

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setCompetitions(featuredCompetitions)
  }, [])

  useEffect(() => {
    api.getPosts({ isForum: true, limit: 5 }).then((res) => {
      const mapped = (res.posts || []).map((p: Record<string, unknown>) => {
        const u = (p.user || {}) as Record<string, unknown>
        return {
          id: p.id as string,
          title: p.content as string,
          content: p.content as string,
          author: { id: u.id as string || p.userId as string, name: u.username as string || '匿名', avatar: u.avatar as string || '' },
          board: (p.forumCategory || 'study') as string,
          tags: [] as string[],
          createdAt: p.createdAt as string,
          updatedAt: p.createdAt as string,
          views: (p.viewCount || 0) as number,
          likes: 0, dislikes: 0, commentCount: 0, isPinned: false,
        } as ForumPost
      })
      setPosts(mapped)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setResources(mockResources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4))
  }, [])

  const goNext = () => setSlideIndex((i) => (i + 1) % slides.length)
  const goPrev = () => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)

  return (
    <>
      {/* Hero Carousel */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${slides[slideIndex].gradient} transition-all duration-700`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzB2MmgtMTB2LTJoMTB6TTIwIDIwdjJoLTEwdi0yaDEweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-30" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 relative">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 mb-4 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C41A1A] animate-pulse" />
                河南师范大学自制学生服务平台
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                {slides[slideIndex].title}
                <span className="block text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{slides[slideIndex].subtitle}</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-white/70 md:text-lg">
                {slides[slideIndex].desc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/competitions">
                  <button className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-[#C41A1A] text-white text-sm font-medium hover:bg-[#a01515] transition-colors">
                    探索竞赛 <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/ai">
                  <button className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                    AI 助手
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={goPrev} className="p-1.5 rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={goNext} className="p-1.5 rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 mt-6">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)} className={`h-1.5 rounded-full transition-all ${i === slideIndex ? 'w-8 bg-[#C41A1A]' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards 2x4 */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-[#003366]">功能服务</h2>
          <p className="mt-1 text-sm text-muted-foreground">全方位覆盖你的校园生活</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.href} href={feature.href} className="group">
                <Card className="h-full border-0 bg-[#003366] text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:border-l-4 hover:border-l-[#C41A1A]">
                  <CardHeader className="p-4 md:p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-sm text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-xs text-white/60">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-[#003366] mb-6">快捷入口</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#003366]/10">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C41A1A]" />
                  <CardTitle className="text-sm text-[#003366]">竞赛倒计时</CardTitle>
                </div>
              </CardHeader>
              <div className="p-4 space-y-1">
                {competitions.slice(0, 4).map((c) => {
                  const daysLeft = Math.ceil((new Date(c.registrationDeadline!).getTime() - Date.now()) / 86400000)
                  return (
                    <Link key={c.id} href={`/competitions`} className="group flex items-center justify-between rounded-lg p-2 hover:bg-white transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:text-[#003366]">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.organizer}</p>
                      </div>
                      <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'} className="shrink-0 ml-2 text-xs">
                        {daysLeft <= 0 ? '已截止' : `${daysLeft}天`}
                      </Badge>
                    </Link>
                  )
                })}
                {competitions.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">暂无竞赛数据</p>}
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#003366]/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#003366]" />
                  <CardTitle className="text-sm text-[#003366]">最新论坛帖子</CardTitle>
                </div>
              </CardHeader>
              <div className="p-4 space-y-1 max-h-[320px] overflow-hidden">
                {posts.map((post) => (
                  <Link key={post.id} href={`/forum/${post.id}`} className="group flex items-start gap-2 rounded-lg p-2 hover:bg-white transition-colors">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C41A1A]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate group-hover:text-[#003366]">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.author.name} · {new Date(post.createdAt).toLocaleDateString('zh-CN')}</p>
                    </div>
                  </Link>
                ))}
                {posts.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">暂无帖子</p>}
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#003366]/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm text-[#003366]">最新资源</CardTitle>
                </div>
              </CardHeader>
              <div className="p-4 space-y-1">
                {resources.slice(0, 4).map((r) => (
                  <Link key={r.id} href="/resources" className="group flex items-center justify-between rounded-lg p-2 hover:bg-white transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-[#003366]">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.uploader.name} · {r.fileSize}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 ml-2 text-xs">{r.fileType}</Badge>
                  </Link>
                ))}
                {resources.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">暂无资源</p>}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-xl bg-gradient-to-r from-[#003366] to-[#001a33] p-6 md:p-10 text-center">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white">河南师范大学</h2>
          <p className="mt-2 text-white/70 text-sm">河南省新乡市建设东路46号</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-white/20 text-white/80">📚 学习通</Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">🏛️ 学校官网</Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">📋 教务系统</Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">💰 缴费平台</Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">📖 教务处</Badge>
          </div>
        </div>
      </section>
    </>
  )
}
