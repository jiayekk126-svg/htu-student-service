'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  UserPlus, Send, Edit3, MapPin, ChevronRight, X, Loader2, Award, Eye, MessageSquare,
  Heart, Bookmark, Share2, Trash2, MapPinned, Plus, Image as ImageIcon, User, LogOut,
  ThumbsUp, Repeat, BookmarkCheck, Grid3X3, Camera, MessageCircle, Repeat2,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { api, getStoredGithubInfo, setStoredGithubInfo } from '@/lib/api-client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BlogComment, DeviceInfo, LocationInfo } from '@/types'
import { getLevelInfo } from '@/lib/level'

const skills = [
  { name: 'C语言', color: 'from-blue-500 to-blue-600', tag: 'blue' },
  { name: 'JAVA', color: 'from-orange-500 to-red-500', tag: 'blue' },
  { name: 'Python', color: 'from-yellow-500 to-amber-600', tag: 'blue' },
  { name: 'Pytorch', color: 'from-red-500 to-rose-600', tag: 'red' },
  { name: 'HTML', color: 'from-emerald-500 to-teal-600', tag: '' },
  { name: 'CSS', color: 'from-sky-500 to-indigo-500', tag: '' },
  { name: 'JavaScript', color: 'from-yellow-400 to-orange-500', tag: '' },
  { name: 'Spring框架', color: 'from-green-500 to-lime-600', tag: '' },
]

const moreSkills = [
  { name: 'Vue.js', color: 'from-green-600 to-emerald-700', tag: '' },
  { name: 'React', color: 'from-cyan-500 to-blue-600', tag: 'blue' },
  { name: 'Node.js', color: 'from-lime-500 to-green-600', tag: '' },
  { name: 'MySQL', color: 'from-blue-600 to-indigo-700', tag: '' },
  { name: 'Docker', color: 'from-sky-500 to-blue-600', tag: '' },
  { name: 'Git', color: 'from-orange-500 to-red-600', tag: 'red' },
]

function detectDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') return { type: 'desktop', name: 'Windows PC' }
  const ua = navigator.userAgent
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua)
  if (isMobile) {
    const m = ua.match(/(?:Android|iPhone|iPad)[^;]*\s*([^;)]+)/i)
    if (m) return { type: 'mobile', name: m[1].trim() }
    if (/android/i.test(ua)) return { type: 'mobile', name: 'Android手机' }
    if (/iphone|ipad/i.test(ua)) return { type: 'mobile', name: 'iOS手机' }
    return { type: 'mobile', name: '手机' }
  }
  if (/windows/i.test(ua)) return { type: 'desktop', name: 'Windows PC' }
  if (/mac/i.test(ua)) return { type: 'desktop', name: 'Mac' }
  if (/linux/i.test(ua)) return { type: 'desktop', name: 'Linux' }
  return { type: 'desktop', name: 'Windows PC' }
}

async function getLocationInfo(): Promise<LocationInfo> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({ lat: 0, lng: 0, city: '未知位置' }); return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=zh`, { signal: AbortSignal.timeout(5000) })
          const data = await res.json()
          const addr = data.address || {}
          const city = addr.city || addr.town || addr.county || addr.state || '未知位置'
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, city: addr.state ? `${addr.state}·${city}` : city })
        } catch { resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, city: '未知位置' }) }
      },
      () => resolve({ lat: 0, lng: 0, city: '未知位置' }),
      { timeout: 5000, enableHighAccuracy: false }
    )
  })
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return new Date(iso).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface PostData {
  id: string; content: string; images: string[]
  author: Record<string, unknown>; createdAt: string
  likesCount: number; commentsCount: number; bookmarksCount: number; forwardCount: number
  device?: string; location?: string; userId?: string
  liked?: boolean; bookmarked?: boolean
}

function CommentSection({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [comments, setComments] = useState<Record<string, unknown>[]>([])
  const [text, setText] = useState('')
  const { user, openLogin } = useAppStore()

  useEffect(() => { api.getComments(postId).then(r => setComments(r.comments)).catch(() => {}) }, [postId])

  const add = async () => {
    if (!user) { openLogin(); return }
    if (!text.trim()) return
    try {
      const c = await api.addComment(postId, text)
      setComments(prev => [...prev, c])
      setText('')
    } catch {}
  }

  return (
    <div className="border-t border-gray-100 pt-3 mt-3">
      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
        {comments.map((c: Record<string, unknown>) => (
          <div key={c.id as string} className="flex gap-2 text-xs">
            <span className="shrink-0 font-medium text-[#003366]">{(c.author as Record<string, unknown>)?.username as string || (c.user as Record<string, unknown>)?.username as string || '用户'}</span>
            <span className="text-gray-600">{c.content as string}</span>
            <span className="shrink-0 text-gray-400">{formatTime(c.createdAt as string)}</span>
          </div>
        ))}
        {comments.length === 0 && <p className="text-xs text-gray-400">暂无评论</p>}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入评论..." className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#003366]" />
        <button onClick={add} className="rounded-lg bg-[#003366] px-3 py-1.5 text-xs text-white hover:bg-[#002244]">发送</button>
      </div>
    </div>
  )
}

function PostCard({ post, onDelete, onUpdate, showInteractionPopups }: { post: PostData; onDelete?: (id: string) => void; onUpdate?: () => void; showInteractionPopups?: boolean }) {
  const { user, openLogin } = useAppStore()
  const router = useRouter()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(post.liked || false)
  const [likeCount, setLikeCount] = useState(post.likesCount)
  const [bm, setBm] = useState(post.bookmarked || false)
  const [bmCount, setBmCount] = useState(post.bookmarksCount)
  const [shareCount, setShareCount] = useState(post.forwardCount)
  const [showPopup, setShowPopup] = useState<'likes' | 'forwards' | 'bookmarks' | null>(null)
  const [popupUsers, setPopupUsers] = useState<Record<string, unknown>[]>([])

  const imgs: string[] = typeof post.images === 'string' ? (() => { try { return JSON.parse(post.images as string) } catch { return [] } })() : (post.images || [])

  const handleLike = async () => {
    if (!user) { openLogin(); return }
    try {
      const r = await api.toggleLike(post.id)
      setLiked(r.liked)
      setLikeCount(prev => r.liked ? prev + 1 : Math.max(0, prev - 1))
    } catch {}
  }

  const handleBookmark = async () => {
    if (!user) { openLogin(); return }
    try {
      const r = await api.toggleBookmark(post.id)
      setBm(r.bookmarked)
      setBmCount(prev => r.bookmarked ? prev + 1 : Math.max(0, prev - 1))
    } catch {}
  }

  const handleShare = async () => {
    if (!user) { openLogin(); return }
    try {
      await api.forwardPost(post.id)
      setShareCount(prev => prev + 1)
    } catch {}
  }

  const openPopup = async (type: 'likes' | 'forwards' | 'bookmarks') => {
    setShowPopup(type)
    try {
      let data: Record<string, unknown>[]
      if (type === 'likes') {
        const r = await api.getLikes(post.id)
        data = r.likes
      } else if (type === 'forwards') {
        const r = await api.getForwards(post.id)
        data = r.forwards
      } else {
        const r = await api.getBookmarks(post.id)
        data = r.bookmarks
      }
      setPopupUsers(data || [])
    } catch { setPopupUsers([]) }
  }

  const author = post.author as Record<string, unknown>
  const authorId = (author.id || post.userId || '') as string

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#C41A1A] text-sm font-bold text-white cursor-pointer hover:opacity-80 overflow-hidden"
            onClick={() => router.push(`/profile?id=${authorId}`)}>
            {(author.avatar as string) ? (
              <img src={author.avatar as string} alt="" className="w-full h-full object-cover" />
            ) : (
              (author.username as string)?.[0] || '?'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-[#003366] flex items-center gap-1"
                onClick={() => router.push(`/profile?id=${authorId}`)}>
                {author.username as string || '用户'} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">Lv.{getLevelInfo(author.createdAt as string).level}</span>
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
              <span className="text-xs text-gray-400">来自 {post.device || '河南师范大学'}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 flex items-center gap-2">
              <span>{formatTime(post.createdAt)}</span>
              {post.location && <span className="flex items-center gap-0.5"><MapPinned className="h-3 w-3" />{post.location}</span>}
            </p>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            {imgs.length > 0 && (
              <div className={`mt-3 grid gap-1 max-w-[350px] ${imgs.length === 1 ? 'grid-cols-1' : imgs.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {imgs.slice(0, 9).map((img, i) => (
                  <div key={i} className={`rounded-lg bg-gray-100 overflow-hidden border border-gray-100 ${imgs.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {user?.id === authorId && onDelete && (
            <button onClick={() => onDelete(post.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-50 px-5 py-2.5">
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <button onClick={handleBookmark} className={`flex items-center gap-1.5 transition-colors ${bm ? 'text-amber-500' : 'hover:text-[#C41A1A]'}`}>
            <Bookmark className={`h-4 w-4 ${bm ? 'fill-amber-500' : ''}`} />{bmCount}
          </button>
          <button onClick={() => openPopup('forwards')} className="flex items-center gap-1.5 hover:text-[#003366] transition-colors" title="查看转发">
            <Repeat2 className="h-4 w-4" />{shareCount}
          </button>
          <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-[#003366]' : 'hover:text-[#003366]'}`}>
            <MessageCircle className="h-4 w-4" />{post.commentsCount}
          </button>
          <button onClick={() => openPopup('likes')} className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-[#C41A1A]' : 'hover:text-[#C41A1A]'}`} title="查看点赞">
            <Heart className={`h-4 w-4 ${liked ? 'fill-[#C41A1A] text-[#C41A1A]' : ''}`} />{likeCount}
          </button>
        </div>
        {showComments && <CommentSection postId={post.id} onClose={() => setShowComments(false)} />}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPopup(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                {showPopup === 'likes' ? '点赞' : showPopup === 'forwards' ? '转发' : '收藏'}列表
              </h3>
              <button onClick={() => setShowPopup(null)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            {popupUsers.length === 0 && <p className="text-sm text-gray-400 text-center py-4">暂无数据</p>}
            {popupUsers.map((u: Record<string, unknown>, i: number) => {
              const uid = u.id || u.userId || ''
              const uname = u.username || u.name || '用户'
              const uavatar = u.avatar || ''
              return (
                <div key={i} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2" onClick={() => { router.push(`/profile?id=${uid}`); setShowPopup(null) }}>
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#003366] to-[#C41A1A] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                    {(uavatar as string) ? (
                      <img src={uavatar as string} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (uname as string)[0]
                    )}
                  </div>
                  <span className="text-sm">{uname as string}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, openLogin } = useAppStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = searchParams.get('id')

  const [profileUser, setProfileUser] = useState<Record<string, unknown> | null>(null)
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [showEditor, setShowEditor] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [showFullProfile, setShowFullProfile] = useState(false)
  const [showSkillsAll, setShowSkillsAll] = useState(false)
  const [showMsgDialog, setShowMsgDialog] = useState(false)
  const [msgText, setMsgText] = useState('')
  const [conversation, setConversation] = useState<Record<string, unknown>[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [showGitHubInput, setShowGitHubInput] = useState(false)
  const [gitHubUsername, setGitHubUsername] = useState('')
  const [githubInfo, setGithubInfo] = useState<Record<string, unknown> | null>(null)
  const [showLevelPopup, setShowLevelPopup] = useState(false)
  const [deviceInfo] = useState<DeviceInfo>(detectDeviceInfo)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLikesList, setShowLikesList] = useState<Record<string, unknown>[] | null>(null)
  const [showForwardsList, setShowForwardsList] = useState<Record<string, unknown>[] | null>(null)
  const [showBookmarksList, setShowBookmarksList] = useState<Record<string, unknown>[] | null>(null)
  const [loadingList, setLoadingList] = useState('')

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const uid = profileId || (user?.id || '2024001')
      const [uRes, pRes] = await Promise.all([
        api.getUser(uid),
        api.getPosts({ userId: uid, limit: 50 }),
      ])
      setProfileUser(uRes.user)
      setPosts((pRes.posts || []).map((p: Record<string, unknown>) => {
        const u = (p.user || {}) as Record<string, unknown>
        return {
          id: p.id as string,
          content: p.content as string,
          images: typeof p.images === 'string' ? (() => { try { return JSON.parse(p.images as string) } catch { return [] } })() : (p.images || []) as string[],
          author: { id: u.id, username: u.username, avatar: u.avatar, createdAt: u.createdAt as string },
          createdAt: p.createdAt as string,
          device: p.device as string || '',
          location: p.location as string || '',
          likesCount: p.likesCount as number || 0,
          commentsCount: p.commentsCount as number || 0,
          bookmarksCount: p.bookmarksCount as number || 0,
          forwardCount: p.forwardCount as number || 0,
          liked: false,
          bookmarked: false,
          userId: p.userId as string,
        } as unknown as PostData
      }))

      const cached = getStoredGithubInfo()
      if (cached) {
        setGithubInfo(cached)
      }
      const ghUsername = (uRes.user?.githubUsername || uRes.user?.github || '') as string
      if (ghUsername && !cached) {
        api.getGitHub(ghUsername).then((info) => {
          setGithubInfo(info)
          setStoredGithubInfo(info)
        }).catch(() => {})
      }

      if (user && uid !== user.id) {
        try {
          const fRes = await api.getFollows(user.id, 'following')
          setFollowed((fRes.users || []).some((u: Record<string, unknown>) => u.id === uid))
        } catch {}
      }
    } catch {} finally { setLoading(false) }
  }, [profileId, user])

  useEffect(() => { loadProfile() }, [loadProfile])

  const isSelf = !profileId || profileId === user?.id
  const displayName = (profileUser?.username as string) || '一只羊啊'
  const avatarUrl = profileUser?.avatar as string | undefined
  const allSkillList = showSkillsAll ? [...skills, ...moreSkills] : skills
  const levelInfo = getLevelInfo(profileUser?.createdAt as string | undefined)

  const handlePublish = async () => {
    if (!user) { openLogin(); return }
    if (!newContent.trim()) return
    setSaving(true)
    try {
      const loc = await getLocationInfo()
      const fd = new FormData()
      fd.set('content', newContent)
      fd.set('device', deviceInfo.name)
      fd.set('location', loc.city)
      newImageFiles.forEach((f) => fd.append('images', f))
      const p = await api.createPostWithFiles(fd)
      const u = (p.user || {}) as Record<string, unknown>
      setPosts(prev => [{
        id: p.id as string,
        content: p.content as string,
        images: typeof p.images === 'string' ? (() => { try { return JSON.parse(p.images as string) } catch { return [] } })() : (p.images || []) as string[],
        author: { id: u.id, username: u.username, avatar: u.avatar, createdAt: u.createdAt as string },
        createdAt: p.createdAt as string,
        device: p.device as string || '',
        location: p.location as string || '',
        likesCount: 0,
        commentsCount: 0,
        bookmarksCount: 0,
        forwardCount: 0,
        liked: false,
        bookmarked: false,
        userId: p.userId as string,
      } as unknown as PostData, ...prev])
      setNewContent(''); setNewImageFiles([]); setNewImagePreviews([]); setShowEditor(false)
    } catch {} finally { setSaving(false) }
  }

  const handleDeletePost = async (id: string) => {
    try { await api.deletePost(id); setPosts(prev => prev.filter(p => p.id !== id)) } catch {}
  }

  const handleFollow = async () => {
    if (!user) { openLogin(); return }
    const targetId = profileId || '2024001'
    try {
      const r = await api.toggleFollow(targetId)
      setFollowed(r.followed)
    } catch {}
  }

  const openMsgDialog = async () => {
    if (!user) { openLogin(); return }
    const targetId = profileId || '2024001'
    try {
      const r = await api.getMessages(targetId)
      setConversation(r.messages)
    } catch { setConversation([]) }
    setShowMsgDialog(true)
  }

  const sendMsg = async () => {
    if (!msgText.trim() || !user) return
    const targetId = profileId || '2024001'
    try {
      const msg = await api.sendMessage(targetId, msgText)
      setConversation(prev => [...prev, msg])
      setMsgText('')
    } catch {}
  }

  const openEditProfile = () => {
    setEditName(user?.name || '')
    setEditBio((profileUser?.bio as string) || '')
    setEditPhone((profileUser?.phone as string) || '')
    setEditEmail((profileUser?.email as string) || '')
    setShowEditProfile(true)
  }

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      await api.updateUser(user.id, { username: editName, bio: editBio, phone: editPhone, email: editEmail })
      useAppStore.getState().setUser({ ...user, name: editName, avatar: user.avatar, bio: editBio, contact: editPhone, email: editEmail })
      setShowEditProfile(false)
      loadProfile()
    } catch {}
  }

  const linkGitHub = async () => {
    if (!gitHubUsername.trim()) return
    try {
      const info = await api.getGitHub(gitHubUsername.trim())
      setGithubInfo(info)
      setStoredGithubInfo(info)
      if (user) { await api.updateUser(user.id, { githubUsername: gitHubUsername.trim() }).catch(() => {}) }
      setShowGitHubInput(false)
    } catch { alert('GitHub用户关联失败，请检查用户名或稍后重试') }
  }

  if (loading && !profileUser) {
    return <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="relative h-48 md:h-56 bg-gradient-to-r from-[#003366] via-[#004080] to-[#002244]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzB2MmgtMTB2LTJoMTB6TTIwIDIwdjJoLTEwdi0yaDEweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-20" />
        <div className="mx-auto max-w-6xl px-4 h-full relative">
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-20">
          <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#003366] to-[#C41A1A] cursor-pointer" onClick={() => isSelf && document.getElementById('avatar-upload')?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">{displayName[0]}</div>
            )}
            {isSelf && <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors"><Camera className="h-6 w-6 text-white opacity-0 hover:opacity-100" /></div>}
          </div>
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="pt-16 pb-4 md:pt-6 md:pb-6 md:ml-44">
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl font-bold text-[#003366]">{displayName}</h1>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white" title="认证">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white cursor-pointer hover:opacity-80" onClick={() => setShowLevelPopup(true)}>Lv.{levelInfo.level}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-600">{profileUser?.bio as string || '🧑‍💻 程序员'}</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> IP:河南</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="flex gap-2">
                {!isSelf && (
                  <button onClick={handleFollow}
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all ${followed ? 'bg-white border-2 border-[#C41A1A] text-[#C41A1A]' : 'bg-gradient-to-r from-[#C41A1A] to-[#a01515] text-white'}`}>
                    <UserPlus className="h-4 w-4" /> {followed ? '已关注' : '关注'}
                  </button>
                )}
                {!isSelf && (
                  <button onClick={openMsgDialog} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Send className="h-4 w-4" /> 私信
                  </button>
                )}
                {isSelf && (
                  <button onClick={openEditProfile} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Edit3 className="h-4 w-4" /> 编辑资料
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab('home')} className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'home' ? 'text-[#C41A1A]' : 'text-gray-500 hover:text-[#003366]'}`}>
            {isSelf ? '我的主页' : '他的主页'}{activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C41A1A]" />}
          </button>
          <button onClick={() => setActiveTab('photos')} className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'photos' ? 'text-[#C41A1A]' : 'text-gray-500 hover:text-[#003366]'}`}>
            相册{activeTab === 'photos' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C41A1A]" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[300px] shrink-0 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm relative">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-800">个人简介</span>
                </span>
                {isSelf && (
                  <button onClick={openEditProfile} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-[#003366]"><Edit3 className="h-3.5 w-3.5" /></button>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{profileUser?.bio as string || '程序员，嵌入式，AI，JAVA'}</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-gray-400">📋</span><span>姓名:{displayName}<br />学号:{profileUser?.schoolId as string || '2528724070'}</span></li>
                <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-gray-400">📞</span><div>手机号:{profileUser?.phone as string || '17539169851'}<br />邮箱:{profileUser?.email as string || '3619114044@qq.com'}</div></li>
                <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-gray-400">🔗</span><a href="https://space.bilibili.com/645726215" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:text-[#C41A1A] break-all">space.bilibili.com/645726215</a></li>
              </ul>
              <button onClick={() => setShowFullProfile(true)} className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-[#003366]">查看更多 <ChevronRight className="h-3 w-3" /></button>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">个人程序开发</h3>
                <span className="text-xs text-gray-400">❤️ 3</span>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-[#003366] to-[#004080] p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/80">已经收到 <b className="text-lg text-amber-400">{((profileUser?._count as Record<string, number>)?.likes || 0) + (githubInfo ? ((githubInfo.repos as number) * 10000 + (githubInfo.followers as number) * 100) : 299104)}</b> 浏览量</p>
                </div>
                <button onClick={() => { if (githubInfo) { window.open(`https://github.com/${githubInfo.username}`, '_blank') } else { setShowGitHubInput(true) } }} className="text-xs text-white/60 hover:text-white">立即查看更 &gt;</button>
                <div className="mt-2 text-[10px] text-white/40">点赞，评论，转发是我更新的巨大动力。</div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                {githubInfo ? (
                  <div className="flex items-center gap-3">
                    <img src={githubInfo.avatar as string} alt="" className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <a href={`https://github.com/${githubInfo.username}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#003366] hover:text-[#C41A1A]">{githubInfo.username as string}</a>
                      <p className="text-[10px] text-gray-400">{githubInfo.repos as number} 仓库 · {githubInfo.followers as number} Followers</p>
                    </div>
                    <button onClick={async () => {
                      try {
                        const info = await api.getGitHub(githubInfo.username as string)
                        setGithubInfo(info)
                        setStoredGithubInfo(info)
                      } catch {}
                    }} className="text-xs text-gray-400 hover:text-[#003366] p-1" title="刷新GitHub数据">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowGitHubInput(true)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#003366]">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> 关联GitHub
                  </button>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {displayName} 的更多程序 <b className="text-gray-700">更多</b> <a onClick={() => { if (githubInfo) { window.open(`https://github.com/${githubInfo.username}`, '_blank') } else { setShowGitHubInput(true) } }} className="text-[#003366] hover:text-[#C41A1A] cursor-pointer">去看看?</a>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">掌握技能</h3>
              <div className="grid grid-cols-4 gap-3">
                {allSkillList.map((skill) => (
                  <div key={skill.name} className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                        {skill.name[0]}
                      </div>
                      {(skill.tag === 'blue' || skill.tag === 'red') && (
                        <span className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white ${skill.tag === 'blue' ? 'bg-blue-500' : 'bg-[#C41A1A]'}`} />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 truncate max-w-[60px] text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowSkillsAll(!showSkillsAll)} className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-[#003366]">{showSkillsAll ? '收起' : '查看更多'} <ChevronRight className={`h-3 w-3 ${showSkillsAll ? 'rotate-90' : ''}`} /></button>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-[#C41A1A]" /> 我的成就
              </h3>
              <div className="space-y-3">
                {[
                  { title: '第三十八届河南省科技创新大赛省一等奖', href: '/competitions/a1' },
                  { title: '第二十二届河南自制教具发明赛省一等奖', href: '/competitions/a1' },
                ].map((award, i) => (
                  <Link key={i} href={award.href} className="flex gap-3 rounded-lg border border-gray-50 bg-gray-50/50 p-3 hover:bg-gray-50">
                    <div className="h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br from-[#003366]/10 to-[#C41A1A]/10 flex items-center justify-center text-2xl">🏆</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{award.title}</p>
                      <p className="mt-0.5 text-xs text-gray-400">文件格式：word(320K)</p>
                      <p className="mt-0.5 text-xs text-gray-400 flex items-center gap-1"><Eye className="h-3 w-3" /> 1已查看</p>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span className="text-[#003366]">正版证书</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#003366]">更多</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/competitions?tab=A" className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-[#003366]">查看更多 <ChevronRight className="h-3 w-3" /></Link>
            </div>

            {user && isSelf && (
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                {showEditor ? (
                  <div className="p-4">
                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} placeholder="分享你的校园生活..."
                      className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20" />
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {newImagePreviews.map((url, i) => (
                        <div key={i} className="relative">
                          <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden"><img src={url} alt="" className="h-full w-full object-cover" /></div>
                          <button onClick={() => { setNewImageFiles(newImageFiles.filter((_, j) => j !== i)); setNewImagePreviews(newImagePreviews.filter((_, j) => j !== i)) }} className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="h-2.5 w-2.5" /></button>
                        </div>
                      ))}
                      {newImageFiles.length < 9 && (
                        <button onClick={() => fileInputRef.current?.click()} className="h-14 w-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#003366] hover:text-[#003366]">
                          <ImageIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const newFiles = [...newImageFiles, ...files].slice(0, 9)
                      setNewImageFiles(newFiles)
                      Promise.all(newFiles.map((f) => new Promise<string>((resolve) => {
                        const reader = new FileReader()
                        reader.onload = () => resolve(reader.result as string)
                        reader.readAsDataURL(f)
                      }))).then(setNewImagePreviews)
                    }} />
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={() => { setShowEditor(false); setNewContent(''); setNewImageFiles([]); setNewImagePreviews([]) }} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50">取消</button>
                      <button onClick={handlePublish} disabled={!newContent.trim() || saving} className="rounded-lg bg-[#C41A1A] px-4 py-1.5 text-sm text-white hover:bg-[#a01515] disabled:opacity-50">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null}
                        {saving ? '发布中...' : '发布'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowEditor(true)} className="flex w-full items-center gap-3 p-4 text-left text-sm text-gray-400 hover:text-gray-600">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#C41A1A] text-sm font-bold text-white overflow-hidden">{user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || '?'
                    )}</div>
                    <span>分享你的校园生活...</span>
                  </button>
                )}
                <input type="file" accept="image/*" className="hidden" id="avatar-upload" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file || !user) return
                  try {
                    const result = await api.uploadAvatar(user.id, file)
                    const avatarUrl = result.avatar || ''
                    const updatedUser = { ...user, avatar: avatarUrl }
                    useAppStore.getState().setUser(updatedUser)
                    loadProfile()
                  } catch {}
                }} />
              </div>
            )}

            {activeTab === 'photos' ? (
              <div className="grid grid-cols-3 gap-2">
                {posts.filter(p => p.images && p.images.length > 0).flatMap(p => p.images.map((img, i) => (
                  <div key={`${p.id}-${i}`} className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )))}
                {posts.filter(p => p.images && p.images.length > 0).length === 0 && <div className="col-span-3 py-16 text-center text-sm text-gray-400">暂无图片</div>}
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={isSelf ? handleDeletePost : undefined} onUpdate={loadProfile} />
                ))}
                {posts.length === 0 && !loading && <div className="py-16 text-center text-sm text-gray-400">暂无动态</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {showFullProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowFullProfile(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">完整资料</h3>
              <button onClick={() => setShowFullProfile(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">学号</span><span className="text-gray-800 font-medium">{profileUser?.schoolId as string || '2528724070'}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">班级</span><span className="text-gray-800 font-medium">{profileUser?.className as string || '2024级计算机科学与技术1班'}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">院系</span><span className="text-gray-800 font-medium">{profileUser?.department as string || '计算机与信息工程学院'}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">标签</span>
                <span className="text-gray-800 font-medium flex flex-wrap gap-1">
                  {['程序员', '嵌入式', 'AI', 'JAVA'].map(t => <span key={t} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{t}</span>)}
                </span>
              </div>
              <div className="flex justify-between py-2"><span className="text-gray-500">IP属地</span><span className="text-gray-800 font-medium">河南</span></div>
            </div>
          </div>
        </div>
      )}

      {showMsgDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowMsgDialog(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl mx-4 flex flex-col" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh' }}>
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#C41A1A] text-xs font-bold text-white overflow-hidden">{avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName[0]
              )}</div>
              <span className="text-sm font-semibold text-gray-800">{displayName}</span>
              <button onClick={() => setShowMsgDialog(false)} className="ml-auto text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px' }}>
              {conversation.map((msg: Record<string, unknown>) => (
                <div key={msg.id as string} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${msg.senderId === user?.id ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-700'}`}>
                    <p>{msg.content as string}</p>
                    <p className={`mt-1 text-[10px] ${msg.senderId === user?.id ? 'text-white/60' : 'text-gray-400'}`}>{formatTime(msg.createdAt as string)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <input value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMsg()} placeholder="输入消息..." className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" />
              <button onClick={sendMsg} className="rounded-lg bg-[#003366] px-4 py-2 text-sm text-white hover:bg-[#002244]">发送</button>
            </div>
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowEditProfile(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800 mb-4">编辑个人资料</h3>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500 mb-1 block">昵称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">简介</label><textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={2} className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">手机号</label><input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">邮箱</label><input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" /></div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowEditProfile(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={handleSaveProfile} className="rounded-lg bg-[#003366] px-4 py-2 text-sm text-white hover:bg-[#002244]">保存</button>
            </div>
          </div>
        </div>
      )}

      {showGitHubInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowGitHubInput(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800 mb-4">关联GitHub账号</h3>
            <input value={gitHubUsername} onChange={(e) => setGitHubUsername(e.target.value)} placeholder="请输入GitHub用户名" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowGitHubInput(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={linkGitHub} className="rounded-lg bg-[#003366] px-4 py-2 text-sm text-white hover:bg-[#002244]">确认</button>
            </div>
          </div>
        </div>
      )}

      {showLevelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLevelPopup(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">等级信息</h3>
              <button onClick={() => setShowLevelPopup(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-lg font-bold text-white">Lv.{levelInfo.level}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">成长值</span>
                <span className="text-gray-800 font-medium">{levelInfo.points.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">当前等级</span>
                <span className="text-gray-800 font-medium">Lv.{levelInfo.level}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">下一等级</span>
                <span className="text-gray-800 font-medium">{levelInfo.level >= 10 ? '已满级' : `Lv.${levelInfo.level + 1}`}</span>
              </div>
              {levelInfo.level < 10 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>升级进度</span>
                    <span>{levelInfo.currentLevelPoints.toLocaleString()} / {levelInfo.nextLevelPoints.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${levelInfo.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">{levelInfo.progress.toFixed(1)}%</p>
                </div>
              )}
              {levelInfo.level >= 10 && (
                <p className="text-xs text-amber-600 text-center">已达到最高等级！</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
