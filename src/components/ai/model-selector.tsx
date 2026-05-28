'use client'

import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek' },
  { id: 'qwen2.5', name: 'Qwen 2.5', provider: '阿里云' },
]

export function ModelSelector() {
  const { aiConfig, setAIConfig } = useAppStore()

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">选择模型</label>
      <div className="flex flex-wrap gap-2">
        {models.map((model) => (
          <button key={model.id} onClick={() => setAIConfig({ model: model.id })}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              aiConfig.model === model.id
                ? 'border-[#003366] bg-[#003366]/10 text-[#003366]'
                : 'border-[#003366]/10 text-muted-foreground hover:border-[#003366]/30 hover:text-[#003366]'
            }`}
          >
            {model.name}
            <Badge variant="outline" className="text-[10px] px-1 py-0">{model.provider}</Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
