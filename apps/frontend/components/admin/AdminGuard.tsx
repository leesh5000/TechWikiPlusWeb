'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'contributor'
}

export default function AdminGuard({ children, requiredRole = 'admin' }: AdminGuardProps) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: 실제 인증 로직으로 교체 필요
    // 현재는 mock 로직으로 임시 구현
    const checkAuth = () => {
      // localStorage에서 사용자 정보 확인
      const userStr = localStorage.getItem('currentUser')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          // requiredRole에 따라 접근 권한 확인
          if (requiredRole === 'admin') {
            setHasAccess(user.role === 'admin')
          } else if (requiredRole === 'contributor') {
            setHasAccess(user.role === 'admin' || user.role === 'contributor')
          }
        } catch (error) {
          setHasAccess(false)
        }
      } else {
        setHasAccess(false)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [requiredRole])

  if (isLoading) {
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
            {requiredRole === 'admin' 
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