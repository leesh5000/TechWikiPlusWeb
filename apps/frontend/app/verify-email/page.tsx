'use client'

import { Suspense } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

function VerifyEmailContent() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { verifyEmail, resendVerificationCode } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 재전송 쿨다운 타이머
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // 자동 포커스 이동
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // 다음 입력칸으로 자동 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // 모든 칸이 채워지면 자동 제출
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''))
    }
  }

  // 백스페이스 처리
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // 붙여넣기 처리
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (verificationCode: string) => {
    if (!email) {
      setError('이메일 정보가 없습니다.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await verifyEmail(email, verificationCode)
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || cooldown > 0) return

    setIsResending(true)
    setError('')

    try {
      await resendVerificationCode(email)
      setCooldown(60) // 60초 쿨다운
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">잘못된 접근입니다</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            회원가입 페이지로 이동해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">이메일 인증</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {email}로 전송된 6자리 인증 코드를 입력해주세요
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `${cooldown}초 후 재전송 가능` : '인증 코드 재전송'}
            </button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>인증 코드가 도착하지 않았다면 스팸 폴더를 확인해주세요.</p>
            <p className="mt-1">인증 코드는 5분간 유효합니다.</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="text-sm text-primary hover:underline"
            >
              다른 이메일로 가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}