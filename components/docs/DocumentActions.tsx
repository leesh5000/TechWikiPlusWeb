'use client'

import { useState, memo } from 'react'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Shield,
  Hourglass
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
  const timeRemaining = useCountdown(
    doc.verificationStatus === 'verifying' ? doc.verificationEndAt : undefined
  )

  const handleStartVerification = () => {
    if (doc.verificationStatus === 'unverified') {
      // 검수 페이지로 리디렉션
      window.location.href = `/docs/${doc.id}/review`
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
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Shield className="h-4 w-4" />
            문서 검증하기
          </button>
        )}
        {doc.verificationStatus === 'verifying' && (
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
      
      {/* 검증 중일 때 카운트다운 표시 */}
      {doc.verificationStatus === 'verifying' && timeRemaining && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hourglass className="h-4 w-4 animate-pulse" />
          <span className="font-medium">{timeRemaining}</span>
        </div>
      )}
    </div>
  )
})

export default DocumentActions