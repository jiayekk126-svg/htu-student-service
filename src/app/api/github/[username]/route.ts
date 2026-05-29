import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  try {
    const res = await fetch('https://api.github.com/users/' + username, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'HTU-Student-Service' },
    })
    if (res.status === 403 || res.status === 429) {
      return NextResponse.json({ error: 'GitHub API 频率限制，请稍后重试' }, { status: 429 })
    }
    if (res.status === 404) {
      return NextResponse.json({ error: 'GitHub用户不存在' }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: '获取GitHub信息失败' }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json({
      username: data.login,
      avatar: data.avatar_url,
      repos: data.public_repos,
      followers: data.followers,
      htmlUrl: data.html_url,
    })
  } catch {
    return NextResponse.json({ error: '获取GitHub信息失败' }, { status: 500 })
  }
}
