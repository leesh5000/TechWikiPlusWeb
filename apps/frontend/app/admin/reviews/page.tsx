'use client'

import { useState } from 'react'
import { Search, Clock, CheckCircle2, XCircle, AlertTriangle, Timer, Users, FileText } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import { useCountdown } from '@/lib/hooks/useCountdown'

// Mock 검수 데이터
const mockReviews = [
  {
    id: 1,
    documentId: 3,
    documentTitle: 'Kubernetes 보안 모범 사례 2025',
    status: 'in_progress',
    startedAt: '2025-01-19T10:00:00Z',
    endAt: '2025-01-22T10:00:00Z',
    participantCount: 5,
    approveVotes: 3,
    rejectVotes: 2,
    totalComments: 15
  },
  {
    id: 2,
    documentId: 11,
    documentTitle: 'React Native 앱 성능 최적화 완벽 가이드',
    status: 'in_progress',
    startedAt: '2025-01-18T15:00:00Z',
    endAt: '2025-01-21T15:00:00Z',
    participantCount: 8,
    approveVotes: 6,
    rejectVotes: 2,
    totalComments: 23
  },
  {
    id: 3,
    documentId: 5,
    documentTitle: 'Python 비동기 프로그래밍 심화 과정',
    status: 'completed',
    startedAt: '2025-01-15T09:00:00Z',
    endAt: '2025-01-18T09:00:00Z',
    participantCount: 12,
    approveVotes: 10,
    rejectVotes: 2,
    totalComments: 45,
    result: 'approved'
  },
  {
    id: 4,
    documentId: 8,
    documentTitle: 'Vue 3 Composition API 실전 가이드',
    status: 'disputed',
    startedAt: '2025-01-17T14:00:00Z',
    endAt: '2025-01-20T14:00:00Z',
    participantCount: 10,
    approveVotes: 5,
    rejectVotes: 5,
    totalComments: 67
  }
]

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'disputed', label: '분쟁' }
]

// Countdown 컴포넌트
function ReviewCountdown({ endAt }: { endAt: string }) {
  const timeRemaining = useCountdown(endAt)
  
  if (!timeRemaining || timeRemaining === '검증 종료') {
    return <span className="text-gray-500">종료됨</span>
  }
  
  return (
    <div className="flex items-center gap-1 text-sm">
      <Timer className="h-3 w-3" />
      <span>{timeRemaining}</span>
    </div>
  )
}

export default function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 필터링
  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.documentTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'id',
      title: 'ID',
      className: 'w-16'
    },
    {
      key: 'documentTitle',
      title: '문서',
      render: (value: string, item: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">문서 ID: {item.documentId}</p>
        </div>
      )
    },
    {
      key: 'status',
      title: '상태',
      render: (value: string, item: any) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          value === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
          value === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          value === 'disputed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
        }`}>
          {value === 'in_progress' ? '진행 중' :
           value === 'completed' ? (item.result === 'approved' ? '승인됨' : '거부됨') :
           value === 'disputed' ? '분쟁' : '대기'}
        </span>
      ),
      className: 'w-24'
    },
    {
      key: 'progress',
      title: '진행 상황',
      render: (_: any, item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span>{item.approveVotes}</span>
            <XCircle className="h-3 w-3 text-red-600 ml-2" />
            <span>{item.rejectVotes}</span>
          </div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-600 dark:bg-green-400"
                style={{ width: `${(item.approveVotes / (item.approveVotes + item.rejectVotes)) * 100}%` }}
              />
              <div 
                className="bg-red-600 dark:bg-red-400"
                style={{ width: `${(item.rejectVotes / (item.approveVotes + item.rejectVotes)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'participants',
      title: '참여',
      render: (_: any, item: any) => (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{item.participantCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{item.totalComments}</span>
          </div>
        </div>
      ),
      className: 'w-32'
    },
    {
      key: 'timeRemaining',
      title: '남은 시간',
      render: (_: any, item: any) => {
        if (item.status === 'completed') {
          return <span className="text-gray-500">종료됨</span>
        }
        return <ReviewCountdown endAt={item.endAt} />
      },
      className: 'w-32'
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: any, item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 검수 상세 보기
            }}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            상세보기
          </button>
          {item.status === 'disputed' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                // 분쟁 중재
              }}
              className="rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700"
            >
              중재하기
            </button>
          )}
        </div>
      ),
      className: 'w-40'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">검수 관리</h1>
        <p className="text-muted-foreground">진행 중인 검수를 모니터링하고 분쟁을 중재할 수 있습니다</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="문서 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">진행 중</p>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{mockReviews.filter(r => r.status === 'in_progress').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">완료됨</p>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold">{mockReviews.filter(r => r.status === 'completed').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">분쟁 중</p>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold">{mockReviews.filter(r => r.status === 'disputed').length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">평균 참여자</p>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">
            {Math.round(mockReviews.reduce((acc, r) => acc + r.participantCount, 0) / mockReviews.length)}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {filteredReviews.some(r => r.status === 'disputed') && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="font-medium text-yellow-900 dark:text-yellow-100">
              {filteredReviews.filter(r => r.status === 'disputed').length}개의 검수에서 분쟁이 발생했습니다
            </p>
          </div>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            승인과 거부 투표가 동일하여 관리자의 중재가 필요합니다.
          </p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={filteredReviews}
        columns={columns}
        pageSize={10}
      />
    </div>
  )
}