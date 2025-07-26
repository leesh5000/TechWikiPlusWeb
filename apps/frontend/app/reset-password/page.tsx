'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Mock 비밀번호 재설정 이메일 전송
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 실제 구현에서는 백엔드 API 호출
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      setIsSuccess(true)
    } catch (err: any) {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">이메일을 확인해주세요</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {email}로 비밀번호 재설정 링크를 전송했습니다.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              로그인으로 돌아가기
            </Link>

            <button
              onClick={() => {
                setIsSuccess(false)
                setEmail('')
              }}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              다른 이메일로 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">비밀번호 재설정</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '전송 중...' : '재설정 링크 전송'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              로그인으로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}