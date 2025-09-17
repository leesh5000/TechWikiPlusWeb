import { apiClient } from './client'
import { 
  User, 
  SignupRequest, 
  LoginRequest, 
  LoginResponse,
  ApiError 
} from '@/lib/types/auth.types'
import { AxiosError } from 'axios'

class AuthService {
  /**
   * User signup
   */
  async signup(data: SignupRequest): Promise<void> {
    try {
      await apiClient.post('/api/v1/users/signup', data)
      // Signup successful - user needs to verify email or login
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * User login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/v1/users/login', data)
      const loginData = response.data

      // Store tokens and userId
      apiClient.setAccessToken(loginData.accessToken, loginData.accessTokenExpiresAt)
      apiClient.setRefreshToken(loginData.refreshToken, loginData.refreshTokenExpiresAt)
      
      // Store userId if available in response
      if (loginData.userId) {
        apiClient.setUserId(loginData.userId)
      } else if (loginData.user?.id) {
        apiClient.setUserId(loginData.user.id)
      }

      return loginData
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    // No logout API endpoint, just clear tokens on client side
    apiClient.clearTokens()
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/api/v1/users/me')
      return response.data
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<LoginResponse> {
    const refreshToken = apiClient.getRefreshToken()
    const userId = apiClient.getUserId()
    
    if (!refreshToken || !userId) {
      throw new Error('No refresh token or user ID available')
    }

    try {
      const response = await apiClient.post<LoginResponse>('/api/v1/users/login/refresh', {
        userId,
        refreshToken
      })
      const data = response.data

      // Update tokens
      apiClient.setAccessToken(data.accessToken, data.accessTokenExpiresAt)
      apiClient.setRefreshToken(data.refreshToken, data.refreshTokenExpiresAt)

      return data
    } catch (error) {
      apiClient.clearTokens()
      throw this.handleAuthError(error)
    }
  }

  /**
   * Verify email with code
   */
  async verifyEmail(email: string, code: string): Promise<void> {
    try {
      await apiClient.post('/api/v1/users/verify', { email, registrationCode: code })
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await apiClient.post('/api/v1/users/verify/resend', { email })
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Reset password request
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/api/v1/users/reset-password', { email })
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    try {
      await apiClient.post('/api/v1/users/reset-password/confirm', {
        token,
        newPassword,
        confirmPassword
      })
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken()
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError
      
      // Create error with code property for special handling
      if (apiError?.code === 'USER_PENDING') {
        const err = new Error('인증 대기중인 계정입니다. 이메일 인증을 완료해주세요.')
        ;(err as any).code = 'USER_PENDING'
        return err
      }
      
      // Map specific error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        // Signup errors
        'EMAIL_ALREADY_EXISTS': '이미 사용 중인 이메일입니다.',
        'NICKNAME_ALREADY_EXISTS': '이미 사용 중인 닉네임입니다.',
        'PASSWORD_MISMATCH': '비밀번호가 일치하지 않습니다.',
        'PASSWORD_TOO_SHORT': '비밀번호는 8자 이상이어야 합니다.',
        'PASSWORD_TOO_LONG': '비밀번호는 30자 이하여야 합니다.',
        'PASSWORD_NO_UPPERCASE': '비밀번호는 대문자를 포함해야 합니다.',
        'PASSWORD_NO_LOWERCASE': '비밀번호는 소문자를 포함해야 합니다.',
        'PASSWORD_NO_SPECIAL': '비밀번호는 특수문자를 포함해야 합니다.',
        'NICKNAME_TOO_SHORT': '닉네임은 2자 이상이어야 합니다.',
        'NICKNAME_TOO_LONG': '닉네임은 20자 이하여야 합니다.',
        'NICKNAME_CONTAINS_SPACE': '닉네임에는 공백을 포함할 수 없습니다.',
        'NICKNAME_CONTAINS_SPECIAL_CHAR': '닉네임은 한글, 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다.',
        'INVALID_EMAIL_FORMAT': '올바른 이메일 형식이 아닙니다.',
        'BLANK_EMAIL': '이메일은 필수 입력 항목입니다.',
        'BLANK_NICKNAME': '닉네임은 필수 입력 항목입니다.',
        
        // Login errors
        'INVALID_CREDENTIALS': '이메일 또는 비밀번호가 올바르지 않습니다.',
        'USER_NOT_FOUND': '존재하지 않는 사용자입니다.',
        'USER_PENDING': '인증 대기중인 계정입니다. 이메일 인증을 완료해주세요.',
        'USER_BANNED': '차단된 계정입니다. 관리자에게 문의해주세요.',
        'USER_DORMANT': '휴면 계정입니다. 관리자에게 문의해주세요.',
        'USER_DELETED': '이미 삭제된 계정입니다.',
        
        // General errors
        'UNAUTHORIZED': '인증이 필요합니다.',
        'FORBIDDEN': '권한이 없습니다.',
        'NETWORK_ERROR': '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
        'SERVER_ERROR': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }

      if (apiError?.code && errorMessages[apiError.code]) {
        return new Error(errorMessages[apiError.code])
      }

      if (apiError?.message) {
        return new Error(apiError.message)
      }

      // Network or connection error
      if (!error.response) {
        return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
      }

      // Default error message based on status code
      const status = error.response.status
      if (status === 400) {
        return new Error('잘못된 요청입니다. 입력 내용을 확인해주세요.')
      } else if (status === 401) {
        return new Error('인증이 필요합니다. 다시 로그인해주세요.')
      } else if (status === 403) {
        return new Error('권한이 없습니다.')
      } else if (status === 404) {
        return new Error('요청한 리소스를 찾을 수 없습니다.')
      } else if (status >= 500) {
        return new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }

    return error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.')
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export class for testing
export default AuthService