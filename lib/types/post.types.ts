// Post/Document types based on OpenAPI specification

// API Post Status
export type PostStatus = 'DRAFT' | 'IN_REVIEW' | 'REVIEWED'

// Frontend Verification Status (mapped from PostStatus)
export type VerificationStatus = 'unverified' | 'verifying' | 'verified'

// Tag structure from API
export interface Tag {
  name: string
  displayOrder: number
}

// Single Post from API
export interface Post {
  id: string
  title: string
  summary?: string // Optional for detail response
  body?: string // Full body for detail response
  status: PostStatus
  tags: Tag[]
  createdAt: string
  updatedAt?: string // Optional for list response
  modifiedAt?: string // Alternative field name from API
  authorId?: string
  viewCount?: number
  upvotes?: number
  downvotes?: number
}

// API Response for paginated posts (cursor-based)
export interface PostScrollResponse {
  posts: Post[]
  hasNext: boolean
  nextCursor: string | null
}

// API Response for page-based pagination
export interface PostPageResponse {
  posts: Post[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

// Frontend Document type (transformed from Post)
export interface Document {
  id: string | number
  title: string
  tags: Tag[]
  createdAt: string
  updatedAt?: string
  viewCount: number
  verificationStatus: VerificationStatus
  upvotes: number
  downvotes: number
  excerpt: string // mapped from summary
  content?: string // Full content for detail view
  author?: string
  verifiedBy?: string | null
  readingTime?: number
  verificationStartedAt?: string
  verificationEndAt?: string
}

// Mapper function types
export type PostToDocumentMapper = (post: Post) => Document

// Filter and sort options
export interface PostFilters {
  limit?: number
  cursor?: string | null
  status?: PostStatus[]
  tags?: string[]
  searchQuery?: string
}

// Error response from API
export interface PostApiError {
  code: string
  message: string
  timestamp: string
}

// Helper function to map PostStatus to VerificationStatus
export function mapPostStatusToVerificationStatus(status: PostStatus): VerificationStatus {
  switch (status) {
    case 'REVIEWED':
      return 'verified'
    case 'IN_REVIEW':
      return 'verifying'
    case 'DRAFT':
    default:
      return 'unverified'
  }
}


// Calculate reading time from content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Transform Post to Document for frontend
export function transformPostToDocument(post: Post): Document {
  const verificationStatus = mapPostStatusToVerificationStatus(post.status)

  // Calculate verification dates for IN_REVIEW status
  let verificationStartedAt: string | undefined
  let verificationEndAt: string | undefined

  if (verificationStatus === 'verifying') {
    const dateToUse = post.updatedAt || post.modifiedAt || post.createdAt
    verificationStartedAt = dateToUse
    const endDate = new Date(dateToUse)
    endDate.setHours(endDate.getHours() + 72) // 72 hours verification period
    verificationEndAt = endDate.toISOString()
  }

  // Determine author and verifiedBy based on status
  const author = "AI Writer" // Default author
  const verifiedBy = verificationStatus === 'verified' ? "커뮤니티" : null

  return {
    id: post.id,
    title: post.title,
    tags: post.tags || [],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt || post.modifiedAt,
    viewCount: post.viewCount || 0,
    verificationStatus,
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    excerpt: post.summary || (post.body ? post.body.substring(0, 200) + '...' : ''),
    content: post.body,
    author,
    verifiedBy,
    readingTime: post.body ? calculateReadingTime(post.body) : undefined,
    verificationStartedAt,
    verificationEndAt
  }
}