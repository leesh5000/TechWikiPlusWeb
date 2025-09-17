'use client'

import { useState, memo } from 'react'
import Link from 'next/link'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { reviewService } from '@/lib/api/review.service'
import { 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Shield,
  Hourglass,
  Loader2,
  Edit
} from 'lucide-react'

type VerificationStatus = 'unverified' | 'verifying' | 'verified'

interface DocumentActionsProps {
  initialDoc: {
    id: number
    verificationStatus: VerificationStatus
    upvotes: number
    downvotes: number
    verificationStartedAt?: string
    verificationEndAt?: string
  }
  showFooterActions?: boolean
}

const DocumentActions = memo(function DocumentActions({ initialDoc }: DocumentActionsProps) {
  const [doc, setDoc] = useState(initialDoc)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeRemaining = useCountdown(
    doc.verificationStatus === 'verifying' ? doc.verificationEndAt : undefined
  )

  const handleStartVerification = async () => {
    if (doc.verificationStatus === 'unverified') {
      setIsLoading(true)
      setError(null)
      
      try {
        // Call API to start review
        const response = await reviewService.startReview(doc.id.toString())
        
        // Update local state with response data
        setDoc({
          ...doc,
          verificationStatus: 'verifying',
          verificationStartedAt: response.verificationStartedAt,
          verificationEndAt: response.verificationEndAt,
          upvotes: 0,
          downvotes: 0
        })
        
        // Redirect to review page after successful API call
        setTimeout(() => {
          window.location.href = `/docs/${doc.id}/review`
        }, 500)
      } catch (err) {
        // Handle error
        const errorMessage = err instanceof Error ? err.message : '검수 시작에 실패했습니다'
        setError(errorMessage)
        console.error('Failed to start review:', err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVote = (type: 'up' | 'down') => {
    if (doc.verificationStatus === 'verifying') {
      setDoc({
        ...doc,
        upvotes: type === 'up' ? doc.upvotes + 1 : doc.upvotes,
        downvotes: type === 'down' ? doc.downvotes + 1 : doc.downvotes
      })
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {doc.verificationStatus === 'unverified' && (
          <button 
            onClick={handleStartVerification}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                검수 시작 중...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                문서 검수하기
              </>
            )}
          </button>
        )}
        {doc.verificationStatus === 'verifying' && (
          <>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleVote('up')}
                className="flex items-center gap-1 rounded-md border border-input dark:border-input/70 px-3 py-2 text-sm hover:bg-accent dark:hover:bg-accent transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                {doc.upvotes}
              </button>
              <button 
                onClick={() => handleVote('down')}
                className="flex items-center gap-1 rounded-md border border-input dark:border-input/70 px-3 py-2 text-sm hover:bg-accent dark:hover:bg-accent transition-colors"
              >
                <ThumbsDown className="h-4 w-4" />
                {doc.downvotes}
              </button>
            </div>
            <Link
              href={`/docs/${doc.id}/review`}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              문서 수정본 작성
            </Link>
          </>
        )}
        {doc.verificationStatus === 'verified' && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-md border border-input dark:border-input/70 px-3 py-2 text-sm hover:bg-accent dark:hover:bg-accent transition-colors opacity-50 cursor-not-allowed" disabled>
              <ThumbsUp className="h-4 w-4" />
              {doc.upvotes}
            </button>
            <button className="flex items-center gap-1 rounded-md border border-input dark:border-input/70 px-3 py-2 text-sm hover:bg-accent dark:hover:bg-accent transition-colors opacity-50 cursor-not-allowed" disabled>
              <ThumbsDown className="h-4 w-4" />
              {doc.downvotes}
            </button>
          </div>
        )}
        <button className="flex items-center gap-1 rounded-md border border-input dark:border-input/70 px-3 py-2 text-sm hover:bg-accent dark:hover:bg-accent transition-colors">
          <Share2 className="h-4 w-4" />
          공유
        </button>
      </div>
      
      {/* 검수 중일 때 카운트다운 표시 */}
      {doc.verificationStatus === 'verifying' && timeRemaining && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hourglass className="h-4 w-4 animate-pulse" />
          <span className="font-medium">{timeRemaining}</span>
        </div>
      )}
      
      {/* Error message display */}
      {error && (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-2">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
})

export default DocumentActions