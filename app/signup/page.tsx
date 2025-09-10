'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { SignupRequest } from '@/lib/types/auth.types'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  })
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  // Validate password in real-time
  useEffect(() => {
    if (password) {
      setPasswordValidation({
        length: password.length >= 8 && password.length <= 30,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      })
    } else {
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        special: false
      })
    }
  }, [password])

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(false)
    }
  }, [password, confirmPassword])

  const validateForm = () => {
    // Email validation
    if (!email || !email.includes('@')) {
      return '올바른 이메일 주소를 입력해주세요'
    }

    // Nickname validation
    if (!nickname || nickname.trim().length < 2) {
      return '닉네임은 2자 이상이어야 합니다'
    }
    if (nickname.length > 20) {
      return '닉네임은 20자 이하여야 합니다'
    }
    if (nickname.includes(' ')) {
      return '닉네임에는 공백을 포함할 수 없습니다'
    }
    // Check for special characters (only allow Korean, English, numbers, underscore, hyphen)
    const nicknameRegex = /^[가-힣a-zA-Z0-9_-]+$/
    if (!nicknameRegex.test(nickname)) {
      return '닉네임은 한글, 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다'
    }

    // Password validation
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다'
    }
    if (password.length > 30) {
      return '비밀번호는 30자 이하여야 합니다'
    }
    if (!/[A-Z]/.test(password)) {
      return '비밀번호는 대문자를 포함해야 합니다'
    }
    if (!/[a-z]/.test(password)) {
      return '비밀번호는 소문자를 포함해야 합니다'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return '비밀번호는 특수문자를 포함해야 합니다'
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const signupData: SignupRequest = {
        email,
        nickname,
        password,
        confirmPassword
      }
      
      await signup(signupData)
      // Success - will redirect to verification page automatically
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다')
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
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium mb-2">
                닉네임
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  autoComplete="username"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="nickname"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                2-20자, 한글/영문/숫자/언더스코어(_)/하이픈(-)
              </p>
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
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    {passwordValidation.length ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.length ? 'text-green-500' : 'text-red-500'}`}>
                      8-30자 길이
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.uppercase ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                      대문자 포함
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.lowercase ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                      소문자 포함
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.special ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${passwordValidation.special ? 'text-green-500' : 'text-red-500'}`}>
                      특수문자 포함 (!@#$%^&*(),.?":{}|&lt;&gt;)
                    </span>
                  </div>
                </div>
              )}
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
                  className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordsMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                disabled={isLoading}
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
            {isLoading ? '처리 중...' : '회원가입'}
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