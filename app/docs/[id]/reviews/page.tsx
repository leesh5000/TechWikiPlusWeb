'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare,
  Plus,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Users,
  Hourglass,
  AlertTriangle
} from 'lucide-react'

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
  verificationDeadline?: string // 검수 마감 시간 (ISO 8601 형식)
}

interface ReviewSubmission {
  id: string
  documentId: number
  reviewer: string
  submittedAt: string
  suggestionsCount: number
  commentsCount: number
  status: 'pending' | 'approved' | 'rejected'
  votes: {
    approve: number
    reject: number
  }
}

interface ReviewsPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock 문서 데이터
const mockDocs: Document[] = [
  {
    id: 11,
    title: "React Native 앱 성능 최적화 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 234,
    verificationStatus: 'verifying' as VerificationStatus,
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "React Native 앱의 성능을 최적화하는 다양한 기법들을 소개합니다.",
    content: "",
    upvotes: 0,
    downvotes: 0,
    readingTime: 10,
    verificationDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72시간 후
  }
]

// Mock 검수 제출 데이터
const mockReviews: ReviewSubmission[] = [
  {
    id: "1",
    documentId: 11,
    reviewer: "김개발자",
    submittedAt: "2025-01-20T10:30:00",
    suggestionsCount: 3,
    commentsCount: 5,
    status: 'pending',
    votes: {
      approve: 2,
      reject: 0
    }
  },
  {
    id: "2",
    documentId: 11,
    reviewer: "이검수자",
    submittedAt: "2025-01-20T11:45:00",
    suggestionsCount: 2,
    commentsCount: 3,
    status: 'pending',
    votes: {
      approve: 1,
      reject: 1
    }
  },
  {
    id: "3",
    documentId: 11,
    reviewer: "박전문가",
    submittedAt: "2025-01-20T09:15:00",
    suggestionsCount: 5,
    commentsCount: 8,
    status: 'approved',
    votes: {
      approve: 4,
      reject: 0
    }
  }
]

// 자동 문서 업데이트 로직
function processExpiredReview(documentId: number, reviews: ReviewSubmission[]) {
  if (reviews.length === 0) {
    console.log('검수가 없어 자동 처리를 수행할 수 없습니다.')
    return
  }
  
  // 가장 많은 승인 투표를 받은 검수 찾기
  const topReview = reviews.reduce((prev, current) => {
    const prevScore = prev.votes.approve - prev.votes.reject
    const currentScore = current.votes.approve - current.votes.reject
    return currentScore > prevScore ? current : prev
  })
  
  // 최고 점수가 0 이하면 자동 거부
  const topScore = topReview.votes.approve - topReview.votes.reject
  if (topScore <= 0) {
    console.log('모든 검수가 부정적인 투표를 받아 자동 거부되었습니다.')
    // TODO: 문서 상태를 'unverified'로 변경
    return
  }
  
  console.log(`검수 ID ${topReview.id} (검수자: ${topReview.reviewer})가 가장 많은 승인을 받아 선택되었습니다.`)
  console.log(`최종 점수: 승인 ${topReview.votes.approve}, 거부 ${topReview.votes.reject}`)
  
  // TODO: 실제 구현에서는 API 호출로 다음 작업 수행:
  // 1. 선택된 검수의 수정 사항을 문서에 적용
  // 2. 문서 상태를 'verified'로 변경
  // 3. 선택된 검수를 'approved'로 표시
  // 4. 다른 검수들을 'rejected'로 표시
  
  alert(`검수가 자동으로 완료되었습니다!\n\n선택된 검수자: ${topReview.reviewer}\n수정 제안: ${topReview.suggestionsCount}개\n최종 점수: +${topReview.votes.approve} / -${topReview.votes.reject}`)
}

function ReviewCountdown({ deadline, documentId, reviews }: { 
  deadline: string
  documentId: number
  reviews: ReviewSubmission[]
}) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number
    minutes: number
    seconds: number
    total: number
  } | null>(null)

  const calculateTimeRemaining = (endTime: string) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const difference = end - now

    if (difference <= 0) {
      return null
    }

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      hours,
      minutes,
      seconds,
      total: difference
    }
  }

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining(deadline)
      setTimeRemaining(remaining)
      
      if (!remaining) {
        // 마감 시간이 지났을 때 자동 처리 로직
        processExpiredReview(documentId, reviews)
        return
      }
    }

    // 초기 설정
    updateTimer()
    
    // 매초마다 업데이트
    const timer = setInterval(updateTimer, 1000)
    
    return () => clearInterval(timer)
  }, [deadline])

  if (!timeRemaining) {
    return (
      <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/30 p-6 text-center animate-pulse">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <h2 className="text-2xl font-bold text-red-600">검수 마감</h2>
        </div>
        <p className="text-red-700 dark:text-red-300">검수 기간이 종료되어 자동으로 처리 중입니다.</p>
      </div>
    )
  }

  // 시간대에 따른 색상 및 스타일 결정
  const totalHours = timeRemaining.total / (1000 * 60 * 60)
  let colorClasses = ''
  let iconAnimation = ''
  
  if (totalHours > 24) {
    // 24시간 이상: 초록색 (안전)
    colorClasses = 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300'
  } else if (totalHours > 6) {
    // 6-24시간: 노란색 (주의)
    colorClasses = 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300'
    iconAnimation = 'animate-pulse'
  } else {
    // 6시간 미만: 빨간색 (긴급)
    colorClasses = 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
    iconAnimation = 'animate-bounce'
  }

  return (
    <div className={`rounded-lg border-2 ${colorClasses} p-6 text-center`}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <Hourglass className={`h-8 w-8 ${iconAnimation}`} />
        <h2 className="text-2xl font-bold">검수 마감까지 남은 시간</h2>
      </div>
      
      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold font-mono">{timeRemaining.hours.toString().padStart(2, '0')}</div>
          <div className="text-sm font-medium opacity-75">시간</div>
        </div>
        <div className="text-3xl font-bold opacity-50">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold font-mono">{timeRemaining.minutes.toString().padStart(2, '0')}</div>
          <div className="text-sm font-medium opacity-75">분</div>
        </div>
        <div className="text-3xl font-bold opacity-50">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold font-mono">{timeRemaining.seconds.toString().padStart(2, '0')}</div>
          <div className="text-sm font-medium opacity-75">초</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm opacity-75">
        <AlertTriangle className="h-4 w-4" />
        <span>마감 후 가장 많은 투표를 받은 검수가 자동으로 적용됩니다</span>
      </div>
    </div>
  )
}

export default function ReviewsListPage({ params }: ReviewsPageProps) {
  const [mounted, setMounted] = useState(false)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  
  useEffect(() => {
    setMounted(true)
    params.then(setResolvedParams)
  }, [params])
  
  if (!mounted || !resolvedParams) {
    return null // SSR 이슈 방지
  }
  
  const parsedId = parseInt(resolvedParams.id)
  const doc = mockDocs.find(d => d.id === parsedId)
  
  if (!doc) {
    notFound()
  }
  
  const reviews = mockReviews.filter(r => r.documentId === parsedId)
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b py-4">
          <div className="container">
            <Link
              href={`/docs/${doc.id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              문서로 돌아가기
            </Link>
          </div>
        </section>

        {/* Header */}
        <section className="border-b bg-muted/30 py-6">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">검수 목록</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                  <div>작성자: {doc.author}</div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    검수자 {reviews.length}명
                  </div>
                </div>
              </div>
              <Link
                href={`/docs/${doc.id}/review`}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                새 검수 작성
              </Link>
            </div>
          </div>
        </section>

        {/* Countdown Widget - 검수 중 상태일 때만 표시 */}
        {doc.verificationStatus === 'verifying' && doc.verificationDeadline && (
          <section className="py-6">
            <div className="container">
              <ReviewCountdown 
                deadline={doc.verificationDeadline} 
                documentId={doc.id}
                reviews={reviews}
              />
            </div>
          </section>
        )}

        {/* Reviews List */}
        <section className="py-8">
          <div className="container">
            <div className="grid gap-6">
              {reviews.length === 0 ? (
                <div className="rounded-lg border bg-muted/10 p-8 text-center">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">아직 검수가 없습니다</p>
                  <p className="mt-2 text-sm text-muted-foreground">첫 번째 검수자가 되어보세요!</p>
                  <Link
                    href={`/docs/${doc.id}/review`}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    검수 시작하기
                  </Link>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-sm text-muted-foreground">총 검수</p>
                      <p className="text-2xl font-bold">{reviews.length}</p>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-sm text-muted-foreground">수정 제안</p>
                      <p className="text-2xl font-bold text-primary">
                        {reviews.reduce((sum, r) => sum + r.suggestionsCount, 0)}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-sm text-muted-foreground">승인된 검수</p>
                      <p className="text-2xl font-bold text-green-600">
                        {reviews.filter(r => r.status === 'approved').length}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-background p-4">
                      <p className="text-sm text-muted-foreground">검수 상태</p>
                      <p className="text-lg font-bold text-orange-600">검수 중</p>
                    </div>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-lg border bg-background p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {review.reviewer.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium">{review.reviewer}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.submittedAt).toLocaleDateString('ko-KR', {
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {review.status === 'approved' && (
                                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  <Shield className="h-3 w-3" />
                                  승인됨
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-4 flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>의견 {review.commentsCount}개</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-primary" />
                                <span className="text-primary font-medium">수정 제안 {review.suggestionsCount}개</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-4">
                              <button className="flex items-center gap-2 rounded-md border border-green-200 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20">
                                <ThumbsUp className="h-4 w-4" />
                                승인 ({review.votes.approve})
                              </button>
                              <button className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                                <ThumbsDown className="h-4 w-4" />
                                거부 ({review.votes.reject})
                              </button>
                              <Link
                                href={`/docs/${doc.id}/reviews/${review.id}`}
                                className="ml-auto text-sm text-primary hover:underline"
                              >
                                상세 보기 →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}