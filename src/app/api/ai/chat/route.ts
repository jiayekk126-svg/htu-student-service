import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { messages, model } = body

  return NextResponse.json({
    id: `resp-${Date.now()}`,
    role: 'assistant',
    content: `这是一个占位响应。AI Chat API 端点已就绪。\n\n收到 ${messages?.length ?? 0} 条消息，使用模型: ${model ?? 'default'}\n\n当接入实际的 AI 模型后，这里将返回智能回复。`,
    timestamp: new Date().toISOString(),
  })
}
