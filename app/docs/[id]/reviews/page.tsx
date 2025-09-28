import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewHistoryContent from './ReviewHistoryContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { reviewService } from '@/lib/api/review.service'
import { postsService } from '@/lib/api/posts.service'
import { ReviewHistoryResponse } from '@/lib/types/review.types'
import { ArrowLeft } from 'lucide-react'

interface ReviewHistoryPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock data for development
const mockReviewHistory: ReviewHistoryResponse = [
  {
    reviewId: 1,
    status: 'COMPLETED',
    startedAt: '2025-01-18T10:00:00Z',
    deadline: '2025-01-21T10:00:00Z',
    completedAt: '2025-01-19T15:30:00Z',
    winningRevisionId: 101
  },
  {
    reviewId: 2,
    status: 'IN_REVIEW',
    startedAt: '2025-01-20T14:00:00Z',
    deadline: '2025-01-23T14:00:00Z',
    completedAt: null,
    winningRevisionId: null
  },
  {
    reviewId: 3,
    status: 'CANCELLED',
    startedAt: '2025-01-15T09:00:00Z',
    deadline: '2025-01-18T09:00:00Z',
    completedAt: null,
    winningRevisionId: null
  }
]

async function getDocumentTitle(id: string): Promise<string> {
  try {
    const post = await postsService.getPost(id)
    return post.title
  } catch (error) {
    // Return a default title if document not found
    return '문서'
  }
}

async function getReviewHistory(postId: string): Promise<ReviewHistoryResponse> {
  try {
    return await reviewService.getReviewHistory(postId)
  } catch (error) {
    console.error('Failed to fetch review history:', error)

    // Return mock data in development
    if (process.env.NODE_ENV === 'development') {
      return mockReviewHistory
    }

    return []
  }
}

export default async function ReviewHistoryPage({ params }: ReviewHistoryPageProps) {
  const { id } = await params

  // Fetch document title and review history
  const [documentTitle, reviewHistory] = await Promise.all([
    getDocumentTitle(id),
    getReviewHistory(id)
  ])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b dark:border-border/70 py-4">
          <div className="container">
            <div className="flex items-center gap-4">
              <Link
                href={`/docs/${id}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                문서로 돌아가기
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-foreground">리뷰 내역</span>
            </div>
          </div>
        </section>

        {/* Page Header */}
        <section className="border-b dark:border-border/70 py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                리뷰 내역
              </h1>
              <p className="text-muted-foreground">
                "{documentTitle}" 문서의 검수 진행 내역입니다.
              </p>
            </div>
          </div>
        </section>

        {/* Review History Content */}
        <section className="py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <ReviewHistoryContent
                reviewHistory={reviewHistory}
                documentId={id}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}