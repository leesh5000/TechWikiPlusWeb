'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  username: string
  role: 'user' | 'contributor' | 'admin'
  avatar?: string
  points: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signupWithEmail: (email: string, password: string, username: string) => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerificationCode: (email: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock 사용자 데이터
const MOCK_USERS = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    username: 'testuser',
    role: 'user' as const,
    points: 100
  },
  {
    id: 2,
    email: 'admin@techwiki.com',
    password: 'admin123',
    username: 'admin',
    role: 'admin' as const,
    points: 0
  }
]

// 임시 사용자 및 인증 코드 저장소
interface PendingUser {
  email: string
  password: string
  username: string
  verificationCode: string
  expiresAt: number
}

const PENDING_USERS = new Map<string, PendingUser>()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)
    try {
      // Mock: localStorage에서 사용자 정보 확인
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    // Mock 로그인 구현
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)
    
    if (!mockUser) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    const { password: _, ...userWithoutPassword } = mockUser
    const loggedInUser = userWithoutPassword as User

    // 로그인 상태 저장
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser))
    setUser(loggedInUser)

    // 관리자는 관리자 페이지로, 일반 사용자는 홈으로
    if (loggedInUser.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }

  const signupWithEmail = async (email: string, password: string, username: string) => {
    // 이미 존재하는 사용자 확인
    const existingUser = MOCK_USERS.find(u => u.email === email || u.username === username)
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('이미 사용 중인 이메일입니다.')
      }
      throw new Error('이미 사용 중인 사용자명입니다.')
    }

    // 6자리 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 임시 사용자 저장 (5분 후 만료)
    PENDING_USERS.set(email, {
      email,
      password,
      username,
      verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000
    })

    // Mock: 콘솔에 인증 코드 출력 (실제로는 이메일 전송)
    console.log(`[이메일 인증] ${email}로 전송된 인증 코드: ${verificationCode}`)
  }

  const verifyEmail = async (email: string, code: string) => {
    const pendingUser = PENDING_USERS.get(email)
    
    if (!pendingUser) {
      throw new Error('인증 요청을 찾을 수 없습니다.')
    }

    // 만료 시간 확인
    if (Date.now() > pendingUser.expiresAt) {
      PENDING_USERS.delete(email)
      throw new Error('인증 코드가 만료되었습니다.')
    }

    // 인증 코드 확인
    if (pendingUser.verificationCode !== code) {
      throw new Error('잘못된 인증 코드입니다.')
    }

    // 새 사용자 생성
    const newUser: User = {
      id: MOCK_USERS.length + 1,
      email: pendingUser.email,
      username: pendingUser.username,
      role: 'user',
      points: 0
    }

    // Mock: 사용자 추가 (실제로는 서버에 저장)
    MOCK_USERS.push({ 
      ...newUser, 
      password: pendingUser.password,
      role: 'user' as const
    })

    // 임시 사용자 삭제
    PENDING_USERS.delete(email)

    // 자동 로그인
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    setUser(newUser)
    router.push('/')
  }

  const resendVerificationCode = async (email: string) => {
    const pendingUser = PENDING_USERS.get(email)
    
    if (!pendingUser) {
      throw new Error('인증 요청을 찾을 수 없습니다.')
    }

    // 새로운 인증 코드 생성
    const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 기존 정보 업데이트
    PENDING_USERS.set(email, {
      ...pendingUser,
      verificationCode: newVerificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000
    })

    // Mock: 콘솔에 인증 코드 출력 (실제로는 이메일 전송)
    console.log(`[이메일 재전송] ${email}로 전송된 인증 코드: ${newVerificationCode}`)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signupWithEmail,
      verifyEmail,
      resendVerificationCode,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}