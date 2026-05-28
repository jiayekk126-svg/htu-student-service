import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-[#003366]/10 bg-[#003366] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/htu-logo.svg" alt="河南师范大学" width={120} height={30} className="brightness-0 invert" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              河南师范大学学生一站式服务平台<br />
              为师大学子提供竞赛、博客、论坛、交易、资源、AI助手等全方位服务
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">快速通道</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><a href="https://v8.chaoxing.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">学习通</a></li>
              <li><a href="https://www.htu.edu.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">学校官网</a></li>
              <li><a href="https://jwc.htu.edu.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">教务管理系统</a></li>
              <li><a href="https://www.htu.edu.cn/teaching/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">教务处</a></li>
              <li><a href="http://wsjf.htu.edu.cn/payment/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">缴费平台</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">功能导航</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/competitions" className="hover:text-white transition-colors">学科竞赛导航</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">学生博客</Link></li>
              <li><Link href="/forum" className="hover:text-white transition-colors">校园论坛</Link></li>
              <li><Link href="/market" className="hover:text-white transition-colors">交易市场</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">学习资源</Link></li>
              <li><Link href="/ai" className="hover:text-white transition-colors">AI助手</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">联系方式</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>地址：河南省新乡市建设东路46号</li>
              <li>邮编：453007</li>
              <li>邮箱：service@htu.edu.cn</li>
              <li className="pt-2">
                <a href="https://www.htu.edu.cn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                  VPN入口
                </a>
                <span className="mx-2 text-white/30">|</span>
                <a href="https://www.htu.edu.cn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                  校历
                </a>
                <span className="mx-2 text-white/30">|</span>
                <a href="https://www.htu.edu.cn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-white transition-colors">
                  校长信箱
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} 河南师范大学学生服务平台 | HTU Student Service</p>
          <p className="mt-1">地址：河南省新乡市建设东路46号 邮编：453007</p>
        </div>
      </div>
    </footer>
  )
}
