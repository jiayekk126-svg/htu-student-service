'use client'

import { useState } from 'react'
import { X, Mail, IdCard, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore, mockLogin, mockRegister } from '@/lib/store'

export function LoginDialog() {
  const { isLoginOpen, closeLogin, setUser } = useAppStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginType, setLoginType] = useState<'email' | 'studentId'>('email')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [email, setEmail] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regId, setRegId] = useState('')
  const [regMajor, setRegMajor] = useState('')
  const [regPwd, setRegPwd] = useState('')

  if (!isLoginOpen) return null

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const identifier = loginType === 'email' ? email : studentId
    if (!identifier || !password) {
      setError('请填写完整信息')
      setLoading(false)
      return
    }
    const user = await mockLogin(identifier, password)
    if (user) {
      setUser(user)
      setSuccess(true)
      setTimeout(() => { closeLogin(); setSuccess(false) }, 800)
    } else {
      setError('账号或密码错误')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    setError('')
    if (!regName || !regEmail || !regId || !regMajor || !regPwd) {
      setError('请填写完整信息')
      return
    }
    setLoading(true)
    const user = await mockRegister({ name: regName, email: regEmail, studentId: regId, password: regPwd, major: regMajor })
    setUser(user)
    setSuccess(true)
    setTimeout(() => { closeLogin(); setSuccess(false) }, 800)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeLogin}>
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeLogin} className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="text-lg font-medium text-emerald-600">登录成功！</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-[#003366]">{mode === 'login' ? '登录' : '注册'}</h2>
              <p className="mt-1 text-sm text-gray-500">河南师范大学学生服务平台</p>
            </div>

            <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
              <button onClick={() => setMode('login')} className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-white text-[#003366] shadow-sm' : 'text-gray-500 hover:text-[#003366]'}`}>登录</button>
              <button onClick={() => setMode('register')} className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'register' ? 'bg-white text-[#003366] shadow-sm' : 'text-gray-500 hover:text-[#003366]'}`}>注册</button>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

            {mode === 'login' ? (
              <div className="space-y-4">
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setLoginType('email')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${loginType === 'email' ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <Mail className="h-3.5 w-3.5" /> 邮箱登录
                  </button>
                  <button onClick={() => setLoginType('studentId')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${loginType === 'studentId' ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <IdCard className="h-3.5 w-3.5" /> 学号登录
                  </button>
                </div>
                <div className="relative">
                  {loginType === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  ) : (
                    <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  )}
                  <Input
                    placeholder={loginType === 'email' ? '邮箱地址' : '学号'}
                    value={loginType === 'email' ? email : studentId}
                    onChange={(e) => loginType === 'email' ? setEmail(e.target.value) : setStudentId(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Input type={showPwd ? 'text' : 'password'} placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button onClick={handleLogin} disabled={loading} className="w-full bg-[#C41A1A] hover:bg-[#a01515] text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? '登录中...' : '登录'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input placeholder="姓名" value={regName} onChange={(e) => setRegName(e.target.value)} />
                <Input placeholder="邮箱地址" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                <Input placeholder="学号" value={regId} onChange={(e) => setRegId(e.target.value)} />
                <Input placeholder="专业" value={regMajor} onChange={(e) => setRegMajor(e.target.value)} />
                <div className="relative">
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Input type={showPwd ? 'text' : 'password'} placeholder="设置密码" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} />
                </div>
                <Button onClick={handleRegister} disabled={loading} className="w-full bg-[#C41A1A] hover:bg-[#a01515] text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? '注册中...' : '注册'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
