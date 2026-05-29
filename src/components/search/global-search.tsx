'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, TrendingUp, Award, BookOpen, FolderOpen, MessageSquare, ShoppingBag } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { allCompetitions } from '@/data/competitions'
import { mockBlogPosts } from '@/data/blog-posts'
import { mockForumPosts } from '@/data/forum-posts'
import { mockProducts } from '@/data/products'
import { mockResources } from '@/data/resources'
import type { SearchResult } from '@/types'

const searchModules = [
  { key: 'all', label: '全部', icon: Search },
  { key: 'competition', label: '竞赛', icon: Award },
  { key: 'blog', label: '博客', icon: BookOpen },
  { key: 'resource', label: '资源', icon: FolderOpen },
  { key: 'forum', label: '论坛', icon: MessageSquare },
  { key: 'product', label: '交易', icon: ShoppingBag },
] as const

type ModuleKey = (typeof searchModules)[number]['key']

const mockClickCounts: Record<string, number> = {}

function fuzzyMatch(text: string, query: string): boolean {
  const q = query.toLowerCase()
  return text.toLowerCase().includes(q)
}

function getAllResults(query: string): SearchResult[] {
  if (!query.trim()) return []

  const results: SearchResult[] = []

  for (const comp of allCompetitions) {
    if (fuzzyMatch(comp.name, query) || fuzzyMatch(comp.description, query)) {
      results.push({
        id: `comp-${comp.id}`, title: comp.name, summary: comp.description,
        module: 'competition', url: `/competitions/${comp.id}`,
        hotScore: mockClickCounts[`comp-${comp.id}`] || 0,
        clicks: mockClickCounts[`comp-${comp.id}`] || 0,
        badge: `${comp.class}类`, emoji: comp.emoji,
      })
    }
  }

  for (const blog of mockBlogPosts) {
    if (fuzzyMatch(blog.content, query)) {
      results.push({
        id: `blog-${blog.id}`, title: blog.content.slice(0, 40) + '...', summary: blog.content.slice(0, 80),
        module: 'blog', url: `/blog/${blog.id}`,
        hotScore: mockClickCounts[`blog-${blog.id}`] || 0,
        clicks: mockClickCounts[`blog-${blog.id}`] || 0,
        badge: blog.tags?.[0] || '博客',
      })
    }
  }

  for (const resource of mockResources) {
    if (fuzzyMatch(resource.name, query) || fuzzyMatch(resource.description, query)) {
      results.push({
        id: `res-${resource.id}`, title: resource.name, summary: resource.description,
        module: 'resource', url: '/resources',
        hotScore: resource.downloadCount,
        clicks: resource.downloadCount,
        badge: resource.fileType, emoji: '📄',
      })
    }
  }

  for (const post of mockForumPosts) {
    if (fuzzyMatch(post.title, query) || fuzzyMatch(post.content, query)) {
      results.push({
        id: `forum-${post.id}`, title: post.title, summary: post.content.slice(0, 80),
        module: 'forum', url: `/forum/${post.id}`,
        hotScore: post.views * 2 + post.likes * 3,
        clicks: post.views,
        badge: post.board === 'study' ? '学习' : post.board === 'life' ? '生活' : post.board === 'trade' ? '交易' : '求职',
      })
    }
  }

  for (const product of mockProducts) {
    if (fuzzyMatch(product.name, query) || fuzzyMatch(product.description, query)) {
      results.push({
        id: `prod-${product.id}`, title: product.name, summary: product.description,
        module: 'product', url: '/market',
        hotScore: product.views * 2,
        clicks: product.views,
        badge: product.category, emoji: '🏷️',
      })
    }
  }

  results.sort((a, b) => b.hotScore - a.hotScore)
  return results
}

const moduleIcons: Record<ModuleKey, React.ElementType> = {
  all: Search, competition: Award, blog: BookOpen, resource: FolderOpen, forum: MessageSquare, product: ShoppingBag,
}

const moduleColors: Record<string, string> = {
  competition: 'bg-blue-100 text-blue-700',
  blog: 'bg-emerald-100 text-emerald-700',
  resource: 'bg-rose-100 text-rose-700',
  forum: 'bg-violet-100 text-violet-700',
  product: 'bg-amber-100 text-amber-700',
}

export function GlobalSearch() {
  const { searchOpen, setSearchOpen, searchHistory, addSearchHistory, clearSearchHistory } = useAppStore()
  const [query, setQuery] = useState('')
  const [activeModule, setActiveModule] = useState<ModuleKey>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIdx, setSelectedIdx] = useState(-1)

  const allResults = useMemo(() => getAllResults(query), [query])
  const filteredResults = useMemo(() =>
    activeModule === 'all' ? allResults : allResults.filter((r) => r.module === activeModule),
    [allResults, activeModule]
  )

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    if (!searchOpen) {
      setQuery('')
      setActiveModule('all')
    }
  }, [searchOpen])

  useEffect(() => {
    setSelectedIdx(-1)
  }, [query, activeModule])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
      if (!searchOpen) return
      if (e.key === 'Escape') { setSearchOpen(false) }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filteredResults.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && selectedIdx >= 0 && filteredResults[selectedIdx]) {
        addSearchHistory(query)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [searchOpen, filteredResults, selectedIdx, query])

  if (!searchOpen) return null

  const handleSelect = (result: SearchResult) => {
    addSearchHistory(query)
    mockClickCounts[result.id] = (mockClickCounts[result.id] || 0) + 1
    setSearchOpen(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[15vh]" onClick={() => setSearchOpen(false)}>
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3.5">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索竞赛、博客、资源、论坛、商品..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">ESC</kbd>
          {query && (
            <button onClick={() => setQuery('')} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {query.trim() && (
          <div className="flex gap-1 border-b border-gray-50 px-4 py-2 overflow-x-auto">
            {searchModules.map((mod) => {
              const Icon = mod.icon
              const isActive = activeModule === mod.key
              return (
                <button key={mod.key} onClick={() => setActiveModule(mod.key)}
                  className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? 'bg-[#003366] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#003366]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {mod.label}
                </button>
              )
            })}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && filteredResults.length > 0 && (
            <div className="py-2">
              <p className="px-5 py-1.5 text-xs text-gray-400">找到 {filteredResults.length} 个结果</p>
              {filteredResults.slice(0, 20).map((result, idx) => {
                const colorClass = moduleColors[result.module] || 'bg-gray-100 text-gray-700'
                return (
                  <Link key={result.id} href={result.url} onClick={() => handleSelect(result)}
                    className={`flex items-start gap-3 px-5 py-3 transition-colors hover:bg-gray-50 ${idx === selectedIdx ? 'bg-gray-50' : ''}`}
                  >
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-medium ${colorClass}`}>
                      {result.emoji || result.module.slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">{result.badge}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{result.summary}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                      <TrendingUp className="h-3 w-3" />
                      {result.clicks}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {query.trim() && filteredResults.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
              <Search className="h-8 w-8" />
              <p className="text-sm">未找到相关结果</p>
            </div>
          )}

          {!query.trim() && searchHistory.length > 0 && (
            <div className="py-3 px-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">搜索历史</p>
                <button onClick={clearSearchHistory} className="text-xs text-gray-400 hover:text-gray-600">清除</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((h, i) => (
                  <button key={i} onClick={() => setQuery(h)} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 transition-colors">
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && searchHistory.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
              <Search className="h-8 w-8" />
              <p className="text-sm">输入关键词搜索全部内容</p>
              <p className="text-xs text-gray-300">⌘K 快速打开搜索</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
