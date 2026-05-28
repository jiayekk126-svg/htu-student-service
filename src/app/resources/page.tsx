import { Suspense } from 'react'
import { getResources } from '@/lib/api'
import { ClientResourcesPage } from './client-page'

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">加载中...</div>}>
      <ClientResourcesPage resources={resources} />
    </Suspense>
  )
}
