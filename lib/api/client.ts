import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { ApiError } from '@/lib/types/auth.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Skip authentication handling for certain endpoints
        const skipAuthEndpoints = [
          '/api/v1/users/verify',
          '/api/v1/users/resend-verify',
          '/api/v1/auth/login',
          '/api/v1/auth/signup',
          '/api/v1/users/login',
          '/api/v1/users/signup',
          '/api/v1/users/reset-password'
        ]
        
        const shouldSkipAuth = skipAuthEndpoints.some(endpoint => 
          originalRequest.url?.includes(endpoint)
        )

        // For auth endpoints, just return the error without redirect
        if (shouldSkipAuth) {
          return Promise.reject(error)
        }

        // Handle 401 Unauthorized - try to refresh token (except for auth endpoints)
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(this.client(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = this.getRefreshToken()
            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            const response = await this.refreshToken(refreshToken)
            const { accessToken } = response.data

            this.setAccessToken(accessToken)
            this.notifyRefreshSubscribers(accessToken)
            
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.clearTokens()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
            this.refreshSubscribers = []
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private notifyRefreshSubscribers(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
  }

  private async refreshToken(refreshToken: string) {
    // This endpoint should be implemented in the backend
    return this.client.post('/api/v1/auth/refresh', { refreshToken })
  }

  // Token management methods
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken')
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken')
  }

  setAccessToken(token: string, expiresAt?: string) {
    const expires = expiresAt ? new Date(expiresAt) : undefined
    Cookies.set('accessToken', token, { 
      expires,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
  }

  setRefreshToken(token: string, expiresAt?: string) {
    const expires = expiresAt ? new Date(expiresAt) : undefined
    Cookies.set('refreshToken', token, { 
      expires,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
  }

  clearTokens() {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  }

  // Public API methods
  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }

  // Get the raw axios instance for special cases
  getInstance() {
    return this.client
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

// Export for type usage
export default ApiClient