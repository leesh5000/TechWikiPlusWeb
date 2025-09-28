import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, GitBranch } from 'lucide-react'
import ReviewRevisionsContent from './ReviewRevisionsContent'
import { reviewService } from '@/lib/api/review.service'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
    reviewId: string
  }>
}

async function getDocument(id: string) {
  // Mock document data - replace with actual API call
  return {
    id: parseInt(id),
    title: 'React Hooks 완벽 가이드',
    category: 'React'
  }
}

async function getReviewInfo(reviewId: string) {
  // Mock review info - replace with actual API call
  const reviewIdNum = parseInt(reviewId)
  return {
    reviewId: reviewIdNum,
    status: reviewIdNum === 1 ? 'COMPLETED' : reviewIdNum === 2 ? 'IN_REVIEW' : 'CANCELLED',
    startedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    completedAt: reviewIdNum === 1 ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : null
  }
}

export default async function ReviewRevisionsPage({ params }: PageProps) {
  const { id: documentId, reviewId } = await params

  try {
    const [document, reviewInfo, revisions] = await Promise.all([
      getDocument(documentId),
      getReviewInfo(reviewId),
      reviewService.getReviewRevisions(documentId, reviewId)
    ])

    if (!document || !reviewInfo) {
      notFound()
    }

    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              문서
            </Link>
            <span>/</span>
            <Link
              href={`/docs/${documentId}`}
              className="hover:text-foreground transition-colors"
            >
              {document.title}
            </Link>
            <span>/</span>
            <Link
              href={`/docs/${documentId}/reviews`}
              className="hover:text-foreground transition-colors"
            >
              리뷰 내역
            </Link>
            <span>/</span>
            <span className="text-foreground">리뷰 #{reviewId}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/docs/${documentId}/reviews`}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              리뷰 내역으로 돌아가기
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">리뷰 #{reviewId} 수정본</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{document.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    <span>{revisions.length}개의 수정본</span>
                  </div>
                </div>
              </div>

              {/* Review Status Badge */}
              <div className={`rounded-full px-4 py-2 text-sm font-medium ${
                reviewInfo.status === 'IN_REVIEW'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : reviewInfo.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {reviewInfo.status === 'IN_REVIEW' ? '진행 중' :
                 reviewInfo.status === 'COMPLETED' ? '완료됨' : '취소됨'}
              </div>
            </div>
          </div>

          {/* Info Box */}
          {reviewInfo.status === 'IN_REVIEW' && (
            <div className="mb-6 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                이 리뷰는 현재 진행 중입니다. 커뮤니티 투표를 통해 가장 좋은 수정본이 선정됩니다.
              </p>
            </div>
          )}

          {/* Revisions Content */}
          <ReviewRevisionsContent
            revisions={revisions}
            documentId={documentId}
            reviewId={reviewId}
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading revisions:', error)
    notFound()
  }
}