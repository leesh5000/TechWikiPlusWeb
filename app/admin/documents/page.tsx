'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle, Timer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import { CATEGORY_COLORS, CATEGORIES } from '@/lib/constants'
import Dropdown from '@/components/ui/Dropdown'
import { postsService } from '@/lib/api/posts.service'
import { Document, VerificationStatus } from '@/lib/types/post.types'
import { useToast } from '@/lib/toast-context'

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'verified', label: '검증됨' },
  { value: 'verifying', label: '검수 중' },
  { value: 'unverified', label: '미검증' }
]

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('all')
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10
  const { showError } = useToast()

  // Fetch documents from API
  useEffect(() => {
    fetchDocuments()
  }, [currentPage])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await postsService.getDocumentsByPage(currentPage, pageSize)
      setDocuments(response.documents)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      showError('문서 로드 실패', error instanceof Error ? error.message : '문서를 불러오는데 실패했습니다.')
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  // 필터링 (클라이언트 사이드)
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === '전체' || doc.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || doc.verificationStatus === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // 통계 계산
  const stats = {
    total: totalElements,
    verified: documents.filter(d => d.verificationStatus === 'verified').length,
    verifying: documents.filter(d => d.verificationStatus === 'verifying').length,
    unverified: documents.filter(d => d.verificationStatus === 'unverified').length
  }

  const columns = [
    {
      key: 'id',
      title: 'ID',
      render: (value: string | number) => String(value).substring(0, 8),
      className: 'w-24'
    },
    {
      key: 'title',
      title: '제목',
      render: (value: string, item: Document) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{item.excerpt.substring(0, 50)}...</p>
        </div>
      )
    },
    {
      key: 'tags',
      title: '태그',
      render: (_: any, item: Document) => (
        <div className="flex flex-wrap gap-1">
          {item.tags && item.tags.length > 0 ? (
            item.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
      className: 'w-48'
    },
    {
      key: 'verificationStatus',
      title: '상태',
      render: (value: VerificationStatus) => (
        <span className={`inline-flex items-center gap-1 text-sm ${
          value === 'verified' ? 'text-green-600 dark:text-green-400' :
          value === 'verifying' ? 'text-blue-600 dark:text-blue-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>
          {value === 'verified' ? <CheckCircle className="h-4 w-4" /> :
           value === 'verifying' ? <Timer className="h-4 w-4" /> :
           <AlertCircle className="h-4 w-4" />}
          {value === 'verified' ? '검증됨' :
           value === 'verifying' ? '검수 중' : '미검증'}
        </span>
      ),
      className: 'w-32'
    },
    {
      key: 'viewCount',
      title: '조회수',
      render: (value: number) => value.toLocaleString(),
      className: 'w-24'
    },
    {
      key: 'createdAt',
      title: '생성일',
      render: (value: string) => new Date(value).toLocaleDateString('ko-KR'),
      className: 'w-32'
    },
    {
      key: 'actions',
      title: '작업',
      render: (_: any, item: Document) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 문서 보기
              window.open(`/docs/${item.id}`, '_blank')
            }}
            className="p-2 rounded hover:bg-accent flex items-center justify-center"
            title="보기"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/posts/${item.id}/edit`)
            }}
            className="p-2 rounded hover:bg-accent flex items-center justify-center"
            title="편집"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 문서 삭제
            }}
            className="p-2 rounded hover:bg-accent text-destructive flex items-center justify-center"
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: 'w-32'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">문서 관리</h1>
          <p className="text-muted-foreground">전체 문서를 관리하고 상태를 변경할 수 있습니다</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          AI 문서 생성
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Dropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          />
          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">전체 문서</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">검증됨</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.verified}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">검수 중</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.verifying}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">미검증</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {stats.unverified}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Data Table */}
          <DataTable
            data={filteredDocs}
            columns={columns}
            pageSize={pageSize}
            onRowClick={(doc) => router.push(`/docs/${doc.id}`)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
