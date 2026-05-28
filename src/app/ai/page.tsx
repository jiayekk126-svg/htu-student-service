'use client'

import { useState } from 'react'
import { Settings, MessageSquare, Bot } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/ai/chat-interface'
import { ModelSelector } from '@/components/ai/model-selector'
import { AgentPanel } from '@/components/ai/agent-panel'

export default function AIPage() {
  const [tab, setTab] = useState('chat')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#003366] md:text-3xl">AI 助手</h1>
        <p className="mt-1 text-sm text-muted-foreground">智能问答 · 作业辅导 · 学习规划</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-[#F5F5F5]">
          <TabsTrigger value="chat" className="flex items-center gap-1.5 data-active:bg-[#003366] data-active:text-white">
            <MessageSquare className="h-4 w-4" /> 对话
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-1.5 data-active:bg-[#003366] data-active:text-white">
            <Settings className="h-4 w-4" /> 配置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="config">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-[#003366]/10 bg-white p-5 shadow-sm">
              <h3 className="font-heading text-sm font-semibold text-[#003366]">模型选择</h3>
              <ModelSelector />
            </div>
            <div className="space-y-4 rounded-xl border border-[#003366]/10 bg-white p-5 shadow-sm">
              <h3 className="font-heading text-sm font-semibold text-[#003366]">Agent 配置</h3>
              <AgentPanel />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
