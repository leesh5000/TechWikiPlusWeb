import { apiClient } from './client'
import { UserRoleType } from '@/lib/types/auth.types'
import { AxiosError } from 'axios'

class TypesService {
  /**
   * Get user role types
   */
  async getUserRoles(): Promise<UserRoleType[]> {
    try {
      const response = await apiClient.get<UserRoleType[]>('/api/v1/types/user-roles')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: any): Error {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.')
  }
}

// Export singleton instance
export const typesService = new TypesService()

// Export class for testing
export default TypesService
