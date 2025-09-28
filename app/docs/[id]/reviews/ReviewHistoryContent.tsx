'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ReviewHistoryItem, ReviewStatus } from '@/lib/types/review.types'
import {
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Calendar,
  Trophy,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

interface ReviewHistoryContentProps {
  reviewHistory: ReviewHistoryItem[]
  documentId: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}일 전`
  if (diffHours > 0) return `${diffHours}시간 전`
  if (diffMins > 0) return `${diffMins}분 전`
  return '방금 전'
}

function calculateTimeRemaining(deadline: string): string {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.getTime()

  if (diffMs <= 0) return '마감됨'

  const diffSecs = Math.floor(diffMs / 1000)
  const hours = Math.floor(diffSecs / 3600)
  const minutes = Math.floor((diffSecs % 3600) / 60)
  const seconds = diffSecs % 60

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}일 ${remainingHours}시간 남음`
  }

  return `${hours}시간 ${minutes}분 ${seconds}초 남음`
}

function getStatusBadge(status: string) {
  switch (status) {
    case ReviewStatus.IN_REVIEW:
    case 'IN_REVIEW':
      return {
        label: '진행 중',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        icon: Timer
      }
    case ReviewStatus.COMPLETED:
    case 'COMPLETED':
      return {
        label: '완료됨',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle2
      }
    case ReviewStatus.CANCELLED:
    case 'CANCELLED':
      return {
        label: '취소됨',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: XCircle
      }
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: AlertCircle
      }
  }
}

export default function ReviewHistoryContent({
  reviewHistory,
  documentId
}: ReviewHistoryContentProps) {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<{ [key: number]: string }>({})

  const handleReviewClick = (reviewId: number) => {
    router.push(`/docs/${documentId}/reviews/${reviewId}/revisions`)
  }

  useEffect(() => {
    // Update countdown for in-review items
    const updateCountdowns = () => {
      const newTimeRemaining: { [key: number]: string } = {}
      reviewHistory.forEach(item => {
        if (item.status === 'IN_REVIEW') {
          newTimeRemaining[item.reviewId] = calculateTimeRemaining(item.deadline)
        }
      })
      setTimeRemaining(newTimeRemaining)
    }

    updateCountdowns()
    const timer = setInterval(updateCountdowns, 1000)

    return () => clearInterval(timer)
  }, [reviewHistory])

  if (reviewHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">아직 리뷰 내역이 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          이 문서는 아직 검수가 진행되지 않았습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border dark:bg-border/70" />

        {reviewHistory.map((item, index) => {
          const statusInfo = getStatusBadge(item.status)
          const Icon = statusInfo.icon

          return (
            <div key={item.reviewId} className="relative flex gap-4 pb-8">
              {/* Timeline dot */}
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background ${
                  item.status === 'IN_REVIEW'
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : item.status === 'COMPLETED'
                    ? 'bg-green-500 dark:bg-green-600'
                    : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Content card */}
              <div className="flex-1">
                <div
                  className="rounded-lg border border-border dark:border-border/70 bg-card p-6 shadow-sm cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                  onClick={() => handleReviewClick(item.reviewId)}
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        리뷰 #{item.reviewId}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                          statusInfo.className
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Time information */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>시작: {formatDate(item.startedAt)}</span>
                      <span className="text-xs">({formatRelativeTime(item.startedAt)})</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>마감: {formatDate(item.deadline)}</span>
                    </div>

                    {item.status === 'IN_REVIEW' && timeRemaining[item.reviewId] && (
                      <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                        <Timer className="h-4 w-4" />
                        <span>{timeRemaining[item.reviewId]}</span>
                      </div>
                    )}

                    {item.status === 'COMPLETED' && item.completedAt && (
                      <>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>완료: {formatDate(item.completedAt)}</span>
                        </div>
                        {item.winningRevisionId && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Trophy className="h-4 w-4" />
                            <span>선정된 수정본 ID: #{item.winningRevisionId}</span>
                          </div>
                        )}
                      </>
                    )}

                    {item.status === 'CANCELLED' && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        이 리뷰는 취소되었습니다.
                      </div>
                    )}
                  </div>

                  {/* Progress bar for IN_REVIEW status */}
                  {item.status === 'IN_REVIEW' && (
                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-1000"
                          style={{
                            width: `${
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  ((new Date(item.deadline).getTime() - new Date().getTime()) /
                                    (new Date(item.deadline).getTime() -
                                      new Date(item.startedAt).getTime())) *
                                    100
                                )
                              )
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}