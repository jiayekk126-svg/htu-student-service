import { Suspense } from 'react'
import { getProducts } from '@/lib/api'
import { ClientMarketPage } from './client-page'

export default async function MarketPage() {
  const products = await getProducts()

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">加载中...</div>}>
      <ClientMarketPage products={products} />
    </Suspense>
  )
}
