'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api/auth.service'
import { User, SignupRequest, AuthContextType } from '@/lib/types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      // MOCK: Use mock user for development
      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        nickname: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
        points: 5000,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
      setUser(mockUser)
      setIsAuthenticated(true)
      
      /* Original auth check - uncomment when backend is ready
      // Check if we have a token
      if (authService.isAuthenticated()) {
        // Try to get current user info
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      */
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      // Get user info after successful login
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)

      // Redirect based on user role
      if (currentUser.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      // Check if the error is USER_PENDING by error code
      if (error?.code === 'USER_PENDING') {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        // Don't throw the error, handle it gracefully
        return
      }
      throw error
    }
  }, [router])

  const signup = useCallback(async (data: SignupRequest) => {
    try {
      await authService.signup(data)
      // After successful signup, user needs to verify email
      // Redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    // Clear tokens on client side
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    // Stay on the current page after logout
    router.refresh()
  }, [router])

  const refreshAccessToken = useCallback(async () => {
    try {
      await authService.refreshAccessToken()
      // Token refreshed successfully
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Refresh failed, user needs to login again
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }, [router])

  const verifyEmailHandler = useCallback(async (email: string, code: string) => {
    try {
      await authService.verifyEmail(email, code)
      // After successful verification, redirect to login
      router.push('/login?verified=true')
    } catch (error) {
      throw error
    }
  }, [router])

  const resendVerificationCodeHandler = useCallback(async (email: string) => {
    try {
      await authService.resendVerificationEmail(email)
    } catch (error) {
      throw error
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      signup,
      logout,
      checkAuth,
      refreshAccessToken,
      verifyEmail: verifyEmailHandler,
      resendVerificationCode: resendVerificationCodeHandler
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

// Legacy support for existing code
export function signupWithEmail(email: string, password: string, username: string) {
  // This is kept for backward compatibility
  // The new signup uses nickname instead of username
  return authService.signup({
    email,
    nickname: username,
    password,
    confirmPassword: password
  })
}

export function verifyEmail(email: string, code: string) {
  return authService.verifyEmail(email, code)
}

export function resendVerificationCode(email: string) {
  return authService.resendVerificationEmail(email)
}