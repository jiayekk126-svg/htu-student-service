'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Award,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  FolderOpen,
  Bot,
  Menu,
  Home,
  Moon,
  Sun,
  User,
  LogOut,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/lib/store'
import { getStoredUser } from '@/lib/api-client'
import { getLevelInfo } from '@/lib/level'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useEffect } from 'react'

const navLinks = [
  { href: '/', label: '首页', icon: Home },
  { href: '/competitions', label: '学科竞赛', icon: Award },
  { href: '/blog', label: '学生博客', icon: BookOpen },
  { href: '/forum', label: '校园论坛', icon: MessageSquare },
  { href: '/market', label: '交易市场', icon: ShoppingBag },
  { href: '/resources', label: '学习资源', icon: FolderOpen },
  { href: '/ai', label: 'AI助手', icon: Bot },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, theme, toggleTheme, isMobileMenuOpen, setMobileMenuOpen, openLogin, setSearchOpen, setUser } =
    useAppStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    const stored = getStoredUser()
    if (stored && !user) setUser(stored as any)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-[#003366] shadow-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/htu-logo.svg" alt="学生服务平台" width={144} height={32} className="h-8 w-auto brightness-0 invert" priority />
          <span className="hidden font-heading text-sm font-bold text-white sm:inline-block">
            学生服务平台
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/15'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-[#C41A1A] rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-white/75 hover:text-white hover:bg-white/10 transition-colors text-xs">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">搜索</span>
            <kbd className="hidden md:inline-flex items-center rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/50">⌘K</kbd>
          </button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white/75 hover:text-white hover:bg-white/10">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar size="sm">
                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback className="bg-[#003366] text-white text-xs">{user.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">{user.name} <span className="inline-flex items-center rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Lv.{getLevelInfo(user.createdAt).level}</span></span>
                      <span className="text-xs text-muted-foreground">{user.studentId}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUser(null)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" className="bg-[#C41A1A] hover:bg-[#a01515] text-white" onClick={openLogin}>
              登录
            </Button>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            } />
            <SheetContent side="right" className="w-64 p-0 pt-14">
              <SheetTitle className="sr-only">导航菜单</SheetTitle>
              <nav className="flex flex-col gap-1 p-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#003366]/10 text-[#003366] border-l-2 border-[#C41A1A]'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
