'use client'

import Link from 'next/link'
import { Bot } from 'lucide-react'

export function FloatingAIButton() {
  return (
    <Link
      href="/ai"
      className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#C41A1A] text-white shadow-lg hover:bg-[#a01515] transition-all hover:scale-110 animate-breathe"
      aria-label="AI助手"
    >
      <Bot className="h-5 w-5" />
    </Link>
  )
}
