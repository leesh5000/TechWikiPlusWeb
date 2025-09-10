export interface User {
  id: string
  email: string
  nickname: string
  role: 'USER' | 'CONTRIBUTOR' | 'ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'BANNED' | 'DORMANT' | 'DELETED'
  points?: number
  createdAt?: string
  updatedAt?: string
}

export interface SignupRequest {
  email: string
  nickname: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export interface ApiError {
  code: string
  message: string
  timestamp: string
}

export interface TokenInfo {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerificationCode: (email: string) => Promise<void>
}