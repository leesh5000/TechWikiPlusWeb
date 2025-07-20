'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signupWithEmail } = useAuth()
  const router = useRouter()

  const validatePassword = () => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다'
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const passwordError = validatePassword()
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)

    try {
      await signupWithEmail(email, password, username)
      // 이메일 인증 페이지로 이동
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">회원가입</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              로그인
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                사용자명
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:border-2 focus:outline-none transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:border-2 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:border-2 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">8자 이상 입력해주세요</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:border-primary focus:border-2 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-input mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                <Link href="/terms" className="text-primary hover:underline">이용약관</Link> 및{' '}
                <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>에 동의합니다
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '인증 이메일 전송 중...' : '회원가입'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            회원가입 시 기여자로 활동하실 수 있습니다
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>AI 문서 검수</span>
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>포인트 적립</span>
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>현금 환급</span>
          </div>
        </div>
      </div>
    </div>
  )
}