// 카테고리 색상 매핑
export const CATEGORY_COLORS: Record<string, string> = {
  React: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  TypeScript: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  DevOps: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
  Python: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  API: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Vue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  AWS: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Database: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
}

// 카테고리 목록
export const CATEGORIES = ["전체", "React", "TypeScript", "DevOps", "Next.js", "Python", "API", "Vue", "AWS", "Database"]

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "views", label: "조회수순" }
]

// 검증 상태 필터 옵션
export const VERIFICATION_FILTER_OPTIONS = [
  { value: '전체', label: '전체' },
  { value: '검증됨', label: '검증됨' },
  { value: '검수 중', label: '검수 중' },
  { value: '미검증', label: '미검증' }
]

// 검수 의견 타입
export const COMMENT_TYPES = [
  { value: '개선', label: '개선' },
  { value: '오류', label: '오류' },
  { value: '제안', label: '제안' },
  { value: '질문', label: '질문' }
]

// 검증 상태 타입
export type VerificationStatus = 'unverified' | 'verifying' | 'verified'

// 문서 인터페이스
export interface Document {
  id: number
  title: string
  category: string
  createdAt: string
  updatedAt: string
  viewCount: number
  verificationStatus: VerificationStatus
  author: string
  verifiedBy: string | null
  excerpt: string
  content: string
  upvotes: number
  downvotes: number
  readingTime: number
  verificationStartedAt?: string
  verificationEndAt?: string
  reviewId?: string
}