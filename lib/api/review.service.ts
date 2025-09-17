import { apiClient } from './client'
import { 
  StartReviewResponse, 
  ReviewApiError,
  ReviewErrorCodes,
  ReviewCommentType,
  ReviewCommentTypesResponse,
  PostRevisionRequest,
  PostRevisionResponse
} from '@/lib/types/review.types'
import { AxiosError } from 'axios'

class ReviewService {
  /**
   * Start review/verification process for a post
   * @param postId - The post ID to start review for
   * @returns StartReviewResponse with verification timestamps
   */
  async startReview(postId: string): Promise<StartReviewResponse> {
    try {
      const response = await apiClient.post<StartReviewResponse>(
        `/api/v1/posts/${postId}/reviews`
      )
      
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      
      // Handle specific review errors
      if (axiosError.response?.data?.code === ReviewErrorCodes.ALREADY_REVIEWING) {
        throw new Error('이미 검수가 진행 중인 문서입니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.POST_NOT_FOUND) {
        throw new Error('문서를 찾을 수 없습니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.UNAUTHORIZED) {
        throw new Error('검수를 시작할 권한이 없습니다. 로그인이 필요합니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.REVIEW_NOT_ALLOWED) {
        throw new Error('이 문서는 검수할 수 없는 상태입니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.INVALID_POST_STATUS) {
        throw new Error('문서가 검수 가능한 상태가 아닙니다')
      }
      
      // Handle HTTP status codes
      if (axiosError.response?.status === 401) {
        throw new Error('로그인이 필요합니다')
      }
      
      if (axiosError.response?.status === 403) {
        throw new Error('검수 권한이 없습니다')
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error('문서를 찾을 수 없습니다')
      }
      
      if (axiosError.response?.status === 409) {
        throw new Error('이미 검수가 진행 중입니다')
      }
      
      // Default error
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 시작에 실패했습니다. 잠시 후 다시 시도해주세요'
      )
    }
  }

  /**
   * End review/verification process for a post
   * @param postId - The post ID to end review for
   * @param reviewId - Optional review ID
   */
  async endReview(postId: string, reviewId?: string): Promise<void> {
    try {
      const endpoint = reviewId 
        ? `/api/v1/posts/${postId}/review/${reviewId}/end`
        : `/api/v1/posts/${postId}/review/end`
        
      await apiClient.post(endpoint)
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 종료에 실패했습니다'
      )
    }
  }

  /**
   * Submit a review for a post
   * @param postId - The post ID
   * @param reviewData - Review content and suggestions
   */
  async submitReview(
    postId: string,
    reviewData: {
      comments: Array<{
        lineStart: number
        lineEnd: number
        content: string
        type: 'improvement' | 'error' | 'suggestion' | 'question'
        suggestedChange?: string
      }>
      overallComment?: string
    }
  ): Promise<void> {
    try {
      await apiClient.post(`/api/v1/posts/${postId}/reviews`, reviewData)
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 제출에 실패했습니다'
      )
    }
  }

  /**
   * Vote on a review
   * @param postId - The post ID
   * @param reviewId - The review ID
   * @param voteType - 'approve' or 'reject'
   */
  async voteReview(
    postId: string,
    reviewId: string,
    voteType: 'approve' | 'reject'
  ): Promise<void> {
    try {
      await apiClient.post(
        `/api/v1/posts/${postId}/review/${reviewId}/vote`,
        { type: voteType }
      )
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '투표에 실패했습니다'
      )
    }
  }

  /**
   * Get all reviews for a post
   * @param postId - The post ID
   */
  async getReviews(postId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/v1/posts/${postId}/reviews`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 목록을 불러올 수 없습니다'
      )
    }
  }

  /**
   * Get a specific review
   * @param postId - The post ID
   * @param reviewId - The review ID
   */
  async getReview(postId: string, reviewId: string): Promise<any> {
    try {
      const response = await apiClient.get(
        `/api/v1/posts/${postId}/reviews/${reviewId}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수를 불러올 수 없습니다'
      )
    }
  }

  /**
   * Submit a post revision for a review
   * @param reviewId - The review ID
   * @param revisionData - Revision data including title, body and comments
   */
  async submitRevision(
    reviewId: string,
    revisionData: PostRevisionRequest
  ): Promise<PostRevisionResponse> {
    try {
      const response = await apiClient.post<PostRevisionResponse>(
        `/api/v1/reviews/${reviewId}/revisions`,
        revisionData
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      
      // Handle specific revision errors
      if (axiosError.response?.data?.code === 'BLANK_TITLE') {
        throw new Error('제목은 필수 입력 항목입니다')
      }
      
      if (axiosError.response?.data?.code === 'CONTENT_TOO_SHORT') {
        throw new Error('본문은 최소 30자 이상이어야 합니다')
      }
      
      if (axiosError.response?.data?.code === 'BLANK_REVIEW_COMMENT') {
        throw new Error('검수 의견은 필수 입력 항목입니다')
      }
      
      if (axiosError.response?.data?.code === 'INVALID_LINE_NUMBER') {
        throw new Error(axiosError.response.data.message || '유효하지 않은 라인 번호입니다')
      }
      
      throw new Error(
        axiosError.response?.data?.message || 
        '개정안 제출에 실패했습니다'
      )
    }
  }

  /**
   * Get review comment types
   * @returns List of available review comment types
   */
  async getReviewCommentTypes(): Promise<ReviewCommentType[]> {
    try {
      const response = await apiClient.get<any>(
        '/api/v1/types/review-comments'
      )
      
      // Handle the response format from API
      const data = response.data
      let types: ReviewCommentType[] = []
      
      // Response is an array with value and description
      if (Array.isArray(data)) {
        types = data.map(item => {
          // Map the API response to our ReviewCommentType format
          const typeMap: Record<string, { name: string, color: string, bgColor: string }> = {
            'INACCURACY': { 
              name: item.description || '부정확한 내용', 
              color: 'text-red-600', 
              bgColor: 'bg-red-50 dark:bg-red-900/20' 
            },
            'NEEDS_IMPROVEMENT': { 
              name: item.description || '개선이 필요한 내용', 
              color: 'text-yellow-600', 
              bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
            }
          }
          
          const mappedType = typeMap[item.value] || {
            name: item.description || item.value,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 dark:bg-gray-900/20'
          }
          
          return {
            id: item.value,
            name: mappedType.name,
            color: mappedType.color,
            bgColor: mappedType.bgColor
          }
        })
      }
      
      // If we got valid types, return them
      if (types.length > 0) {
        return types
      }
      
      // Otherwise return defaults
      throw new Error('No valid types found in response')
      
    } catch (error) {
      console.warn('Using default comment types due to API error:', error)
      // Return default types if API fails - matching the API's expected format
      return [
        { 
          id: 'INACCURACY', 
          name: '부정확한 내용', 
          color: 'text-red-600', 
          bgColor: 'bg-red-50 dark:bg-red-900/20' 
        },
        { 
          id: 'NEEDS_IMPROVEMENT', 
          name: '개선이 필요한 내용', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
        }
      ]
    }
  }
}

// Export singleton instance
export const reviewService = new ReviewService()

// Export class for testing
export default ReviewService