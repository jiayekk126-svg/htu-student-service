'use client'

import { useState } from 'react'
import { Search, Plus, ImageIcon, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { productCategories } from '@/data/products'
import type { Product } from '@/types'

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center rounded-t-xl">
          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-[#003366] line-clamp-1 flex-1">{product.name}</h3>
            {product.status !== '在售' && <Badge variant="secondary" className="shrink-0 text-xs">{product.status}</Badge>}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#C41A1A]">¥{product.price}</span>
            {product.originalPrice && <span className="text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar size="sm">
                <AvatarFallback className="text-[10px] bg-[#003366] text-white">{product.seller.name[0]}</AvatarFallback>
              </Avatar>
              <span>{product.seller.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{product.views}</span>
              <span>{new Date(product.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ClientMarketPage({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = products.filter((p) => {
    const matchCategory = category === '全部' || p.category === category
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">校内交易市场</h1>
          <p className="mt-1 text-sm text-muted-foreground">二手好物，绿色循环</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#C41A1A] hover:bg-[#a01515] text-white">
              <Plus className="h-4 w-4 mr-1" /> 发布商品
            </Button>
          } />
          <DialogContent>
            <DialogHeader><DialogTitle>发布商品</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">商品名称</label>
                <Input placeholder="输入商品名称" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">价格 (¥)</label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">分类</label>
                <div className="flex flex-wrap gap-2">
                  {productCategories.filter(c => c !== '全部').map((cat) => (
                    <Badge key={cat} variant="outline" className="cursor-pointer">{cat}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">描述</label>
                <textarea className="w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring" placeholder="描述你的商品..." />
              </div>
              <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-input bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><ImageIcon className="h-6 w-6" />点击上传图片</span>
              </div>
              <Button className="w-full bg-[#003366] hover:bg-[#002244] text-white">发布</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索商品..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {productCategories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${category === cat ? 'bg-[#003366] text-white shadow-sm' : 'bg-[#F5F5F5] text-muted-foreground hover:bg-[#eee]'}`}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {filtered.length === 0 && <div className="py-16 text-center text-sm text-muted-foreground">暂无商品</div>}
    </div>
  )
}
