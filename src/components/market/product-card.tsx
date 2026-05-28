import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ImageIcon, Eye } from 'lucide-react'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-muted flex items-center justify-center rounded-t-xl">
          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-snip line-clamp-1 flex-1">
              {product.name}
            </h3>
            {product.status !== '在售' && (
              <Badge variant="secondary" className="shrink-0 text-xs">{product.status}</Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#E67E22]">¥{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">¥{product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar size="sm">
                <AvatarFallback className="text-[10px]">{product.seller.name[0]}</AvatarFallback>
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
