'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThumbsUp, ThumbsDown, Share2, Shield, Timer, Loader2, Edit } from 'lucide-react'
import { reviewService } from '@/lib/api/review.service'

// 문서 검증 상태 타입
type VerificationStatus = 'unverified' | 'verifying' | 'verified'

interface Document {
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
}

interface DocumentActionsProps {
  doc: Document
}

export default function DocumentActions({ doc: initialDoc }: DocumentActionsProps) {
  const [doc, setDoc] = useState<Document>(initialDoc)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleUpvote = () => {
    if (!hasVoted && doc.verificationStatus === 'verifying') {
      setDoc({ ...doc, upvotes: doc.upvotes + 1 })
      setHasVoted(true)
    }
  }

  const handleDownvote = () => {
    if (!hasVoted && doc.verificationStatus === 'verifying') {
      setDoc({ ...doc, downvotes: doc.downvotes + 1 })
      setHasVoted(true)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.title,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
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
                  onClick={handleUpvote}
                  disabled={hasVoted}
                  className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {doc.upvotes}
                </button>
                <button 
                  onClick={handleDownvote}
                  disabled={hasVoted}
                  className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsDown className="h-4 w-4" />
                  {doc.downvotes}
                </button>
              </div>
              <Link
                href={`/docs/${doc.id}/review`}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                문서 수정본 작성
              </Link>
            </>
          )}
          {doc.verificationStatus === 'verified' && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent" disabled>
                <ThumbsUp className="h-4 w-4" />
                {doc.upvotes}
              </button>
              <button className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent" disabled>
                <ThumbsDown className="h-4 w-4" />
                {doc.downvotes}
              </button>
            </div>
          )}
          <button 
            onClick={handleShare}
            className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            <Share2 className="h-4 w-4" />
            공유
          </button>
        </div>
        
        {/* 검수 중일 때 진행 상황 표시 */}
        {doc.verificationStatus === 'verifying' && doc.verificationEndAt && (
          <div className="text-sm text-muted-foreground">
            <span>검증 마감: </span>
            <span className="font-medium">
              {new Date(doc.verificationEndAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 border-t pt-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              이 문서가 도움이 되었나요?
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
              <ThumbsUp className="h-4 w-4" />
              도움됨 ({doc.upvotes})
            </button>
            <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
              <ThumbsDown className="h-4 w-4" />
              개선 필요 ({doc.downvotes})
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </>
  )
}