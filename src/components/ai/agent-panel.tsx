'use client'

import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AgentPanel() {
  const { aiConfig, setAIConfig } = useAppStore()

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">System Prompt</label>
        <textarea
          className="w-full min-h-24 rounded-lg border border-[#003366]/10 bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-[#003366] resize-none"
          value={aiConfig.systemPrompt}
          onChange={(e) => setAIConfig({ systemPrompt: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Temperature ({aiConfig.temperature})</label>
          <input type="range" min="0" max="2" step="0.1" value={aiConfig.temperature}
            onChange={(e) => setAIConfig({ temperature: parseFloat(e.target.value) })} className="w-full accent-[#003366]" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Tokens</label>
          <Input type="number" value={aiConfig.maxTokens}
            onChange={(e) => setAIConfig({ maxTokens: parseInt(e.target.value) || 2048 })} />
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full border-[#003366]/20 text-[#003366]">保存配置</Button>
    </div>
  )
}
