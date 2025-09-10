'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AdminGuardProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'CONTRIBUTOR'
}

export default function AdminGuard({ children, requiredRole = 'ADMIN' }: AdminGuardProps) {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        router.push('/login')
      } else {
        // requiredRole에 따라 접근 권한 확인
        if (requiredRole === 'ADMIN') {
          setHasAccess(user.role === 'ADMIN')
        } else if (requiredRole === 'CONTRIBUTOR') {
          setHasAccess(user.role === 'ADMIN' || user.role === 'CONTRIBUTOR')
        }
      }
    }
  }, [user, authLoading, isAuthenticated, requiredRole, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">관리자 권한 확인 중...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">접근 권한 없음</h1>
          <p className="text-muted-foreground mb-4">
            {requiredRole === 'ADMIN' 
              ? '관리자만 접근 가능한 페이지입니다.' 
              : '기여자 이상만 접근 가능한 페이지입니다.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}