import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { action, config } = body

  return NextResponse.json({
    success: true,
    message: `Agent API 端点已就绪。\n\n动作: ${action ?? 'unknown'}\n配置: ${JSON.stringify(config)}\n\n当接入实际的 AI Agent 后，这里将执行智能代理任务。`,
    data: null,
  })
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    version: '1.0.0',
    description: 'HTU AI Agent API - 占位端点',
    availableActions: ['chat', 'analyze', 'recommend', 'summarize'],
  })
}
