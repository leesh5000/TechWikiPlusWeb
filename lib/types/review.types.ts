export interface StartReviewRequest {
  postId: string
}

export interface StartReviewResponse {
  postId: string
  reviewId?: string
  verificationStatus: 'verifying'
  verificationStartedAt: string
  verificationEndAt: string
  message?: string
}

export interface SubmitReviewRequest {
  comments: Array<{
    lineStart: number
    lineEnd: number
    content: string
    type: 'improvement' | 'error' | 'suggestion' | 'question'
    suggestedChange?: string
  }>
  overallComment?: string
}

export interface SubmitReviewResponse {
  reviewId: string
  postId: string
  status: 'submitted' | 'pending' | 'approved' | 'rejected'
  message?: string
}

// 개정안(Revision) 관련 타입
export interface PostRevisionRequest {
  title: string
  body: string
  reviewComments: Array<{
    lineNumber: number
    comment: string
    type: string // 'INACCURACY', 'NEEDS_IMPROVEMENT' 등
    suggestedChange?: string
  }>
}

export interface PostRevisionResponse {
  revisionId: string
  reviewId: string
  status: string
  message?: string
}

export interface ReviewCommentType {
  id: string
  name: string
  description?: string
  color?: string
  bgColor?: string
}

export interface ReviewCommentTypesResponse {
  types: ReviewCommentType[]
}

export interface ReviewApiError {
  code: string
  message: string
  timestamp?: string
  details?: Record<string, any>
}

export const ReviewErrorCodes = {
  ALREADY_REVIEWING: 'ALREADY_REVIEWING',
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  REVIEW_NOT_ALLOWED: 'REVIEW_NOT_ALLOWED',
  INVALID_POST_STATUS: 'INVALID_POST_STATUS',
  REVIEW_SUBMISSION_FAILED: 'REVIEW_SUBMISSION_FAILED',
  INVALID_REVIEW_DATA: 'INVALID_REVIEW_DATA',
} as const

export type ReviewErrorCode = typeof ReviewErrorCodes[keyof typeof ReviewErrorCodes]

// UI 타입과 API 타입 간 변환 헬퍼
export const mapUICommentTypeToAPI = (uiType: string): string => {
  // API expects the raw type values like 'INACCURACY', 'NEEDS_IMPROVEMENT'
  // Since we're using the API values directly as IDs, just return the uiType
  return uiType
}