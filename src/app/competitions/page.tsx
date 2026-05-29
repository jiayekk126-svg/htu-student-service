'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ExternalLink, Info, Star, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { competitionTabs, navData, aClassCompetitions, bClassCompetitions, cClassCompetitions, allCompetitions } from '@/data/competitions'
import type { NavEntry, CompEntry } from '@/data/competitions'

const classColors: Record<string, string> = {
  A: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  C: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
      ))}
    </span>
  )
}

function NavLinkCard({ entry, index }: { entry: NavEntry; index: number }) {
  return (
    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-lg border border-[#003366]/10 bg-white p-3 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-[#003366]/30">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003366]/5 text-lg">{entry.emoji || '🔗'}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#003366] group-hover:text-[#C41A1A] transition-colors truncate">{entry.name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.url}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {entry.note && <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">{entry.note}</Badge>}
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#003366] transition-colors" />
      </div>
    </a>
  )
}

function CompCard({ comp }: { comp: CompEntry }) {
  return (
    <div className="group flex items-start gap-3 rounded-lg border border-[#003366]/10 bg-white p-3 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-[#C41A1A]/30">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#003366]/5 text-xl">{comp.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#003366] group-hover:text-[#C41A1A] transition-colors">{comp.name}</h3>
          <Badge className={`text-xs ${classColors[comp.class]}`}>{comp.class}类</Badge>
          <StarRating count={comp.stars} />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{comp.description}</p>
        {comp.note && <p className="text-xs text-amber-600 mt-1">📌 {comp.note}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <a href={comp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-[#003366] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#002244] transition-colors">
            官网入口 <ExternalLink className="h-3 w-3" />
          </a>
          {comp.hasDetail && (
            <a href={`/competitions/${comp.id}`} className="inline-flex items-center gap-1 rounded-md border border-[#003366]/20 px-2.5 py-1 text-xs font-medium text-[#003366] hover:bg-[#003366]/5 transition-colors">
              详情 <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompetitionsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tabMap: Record<string, string> = { A: 'A类赛事', B: 'B类赛事', C: 'C类赛事' }
  const [activeTab, setActiveTab] = useState(tabParam ? (tabMap[tabParam] || 'A类赛事') : 'A类赛事')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (tabParam && tabMap[tabParam]) {
      setActiveTab(tabMap[tabParam])
    }
  }, [tabParam])

  const renderContent = () => {
    if (activeTab === '新生刚需' || activeTab === '学校官网' || activeTab === '考试考证') {
      const entries = navData[activeTab] || []
      return (
        <div className="space-y-2">
          {entries.map((entry, i) => <NavLinkCard key={i} entry={entry} index={i} />)}
        </div>
      )
    }

    let competitions: CompEntry[] = []
    if (activeTab === 'A类赛事') competitions = aClassCompetitions
    else if (activeTab === 'B类赛事') competitions = bClassCompetitions
    else if (activeTab === 'C类赛事') competitions = cClassCompetitions

    const filtered = searchQuery
      ? competitions.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : competitions

    return (
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">未找到相关竞赛</div>
        )}
        {filtered.map((comp) => <CompCard key={comp.id} comp={comp} />)}
        {activeTab === 'A类赛事' && <p className="text-xs text-muted-foreground text-center pt-2">共 {aClassCompetitions.length} 项 A 类赛事</p>}
        {activeTab === 'B类赛事' && <p className="text-xs text-muted-foreground text-center pt-2">共 {bClassCompetitions.length} 项 B 类赛事</p>}
        {activeTab === 'C类赛事' && <p className="text-xs text-muted-foreground text-center pt-2">共 {cClassCompetitions.length} 项 C 类赛事</p>}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">学科竞赛导航</h1>
        <p className="mt-1 text-sm text-muted-foreground">从新生入学到各类竞赛，一站式导航</p>
      </div>

      {/* Search */}
      {(activeTab === 'A类赛事' || activeTab === 'B类赛事' || activeTab === 'C类赛事') && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索竞赛名称..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-[#003366]/10 pb-1">
        {competitionTabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSearchQuery('') }}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-[#003366]' : 'text-muted-foreground hover:text-[#003366]'
            }`}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C41A1A]" />}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  )
}
