'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { sendChatMessage } from '@/lib/api'
import type { ChatMessage } from '@/types'

export function ChatInterface() {
  const { chatMessages, addChatMessage, clearChatMessages, aiConfig } = useAppStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    addChatMessage(userMessage)
    setInput('')
    setIsLoading(true)
    try {
      const response = await sendChatMessage([...chatMessages, userMessage])
      addChatMessage(response)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-[#003366]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#003366]/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#C41A1A]" />
          <span className="text-sm font-semibold text-[#003366]">AI 助手</span>
          <span className="text-xs text-muted-foreground">({aiConfig.model})</span>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChatMessages} className="text-muted-foreground">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-[#003366]">你好！我是师大AI助手</p>
            <p className="text-xs text-muted-foreground/60 mt-1">可以问我关于学习、竞赛、校园生活等任何问题</p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#003366] text-white' : 'bg-[#F5F5F5] text-[#003366]'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-[#003366] text-white' : 'bg-[#F5F5F5] text-foreground'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]"><Bot className="h-4 w-4 text-[#003366]" /></div>
            <div className="rounded-lg bg-[#F5F5F5] px-3 py-2"><Loader2 className="h-4 w-4 animate-spin text-[#003366]" /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#003366]/10 p-3">
        <div className="flex gap-2">
          <Input placeholder="输入你的问题..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1" />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-[#C41A1A] hover:bg-[#a01515] text-white" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
