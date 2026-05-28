'use client'

import { useState } from 'react'
import { Download, Star, Upload, FileText, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { resourceCategories } from '@/data/resources'
import type { Resource } from '@/types'

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs bg-[#F5F5F5]">{resource.category}</Badge>
          <Badge className="text-xs bg-[#003366]">{resource.fileType}</Badge>
        </div>
        <h3 className="text-sm font-semibold text-[#003366] line-clamp-2">{resource.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px] bg-[#003366] text-white">{resource.uploader.name[0]}</AvatarFallback>
          </Avatar>
          <span>{resource.uploader.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {resource.downloadCount}</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {resource.rating}</span>
          <span>{resource.fileSize}</span>
        </div>
        <Button size="sm" variant="outline" className="w-full border-[#003366]/20 text-[#003366] hover:bg-[#003366]/5">
          <Download className="h-3.5 w-3.5 mr-1" /> 下载
        </Button>
      </CardContent>
    </Card>
  )
}

export function ClientResourcesPage({ resources }: { resources: Resource[] }) {
  const [category, setCategory] = useState('全部')
  const filtered = category === '全部' ? resources : resources.filter((r) => r.category === category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">学习资源汇总</h1>
          <p className="mt-1 text-sm text-muted-foreground">优质资源，共享学习</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#C41A1A] hover:bg-[#a01515] text-white">
              <Upload className="h-4 w-4 mr-1" /> 上传资源
            </Button>
          } />
          <DialogContent>
            <DialogHeader><DialogTitle>上传资源</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium mb-1 block">资源名称</label><Input placeholder="输入资源名称" /></div>
              <div><label className="text-sm font-medium mb-1 block">分类</label>
                <div className="flex flex-wrap gap-2">{resourceCategories.filter(c => c !== '全部').map((cat) => (<Badge key={cat} variant="outline" className="cursor-pointer">{cat}</Badge>))}</div>
              </div>
              <div><label className="text-sm font-medium mb-1 block">描述</label>
                <textarea className="w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring" placeholder="描述你的资源..." />
              </div>
              <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-input bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><FileText className="h-6 w-6" />点击上传文件</span>
              </div>
              <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white">上传</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {resourceCategories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${category === cat ? 'bg-[#003366] text-white shadow-sm' : 'bg-[#F5F5F5] text-muted-foreground hover:bg-[#eee]'}`}
          >{cat}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
      </div>
      {filtered.length === 0 && <div className="py-16 text-center text-sm text-muted-foreground">暂无资源</div>}
    </div>
  )
}
