'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle, Timer } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import { mockDocs } from '@/lib/mock-data'
import { CATEGORY_COLORS, CATEGORIES } from '@/lib/constants'
import Dropdown from '@/components/ui/Dropdown'

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'verified', label: '검증됨' },
  { value: 'verifying', label: '검증 중' },
  { value: 'unverified', label: '미검증' }
]

export default function AdminDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null)

  // 필터링
  const filteredDocs = mockDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === '전체' || doc.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || doc.verificationStatus === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const columns = [
    {
      key: 'id',
      title: 'ID',
      className: 'w-16'
    },
    {
      key: 'title',
      title: '제목',
      render: (value: string, item: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{item.excerpt.substring(0, 50)}...</p>
        </div>
      )
    },
    {
      key: 'category',
      title: '카테고리',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          CATEGORY_COLORS[value] || "bg-gray-100 text-gray-800"
        }`}>
          {value}
        </span>
      ),
      className: 'w-32'
    },
    {
      key: 'verificationStatus',
      title: '상태',
      render: (value: string) => (
        <span className={`inline-flex items-center gap-1 text-sm ${
          value === 'verified' ? 'text-green-600 dark:text-green-400' :
          value === 'verifying' ? 'text-blue-600 dark:text-blue-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>
          {value === 'verified' ? <CheckCircle className="h-4 w-4" /> :
           value === 'verifying' ? <Timer className="h-4 w-4" /> :
           <AlertCircle className="h-4 w-4" />}
          {value === 'verified' ? '검증됨' :
           value === 'verifying' ? '검증 중' : '미검증'}
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
      render: (_: any, item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 문서 보기
            }}
            className="p-1 rounded hover:bg-accent"
            title="보기"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 문서 편집
            }}
            className="p-1 rounded hover:bg-accent"
            title="편집"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 문서 삭제
            }}
            className="p-1 rounded hover:bg-accent text-destructive"
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
          <p className="text-2xl font-bold">{mockDocs.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">검증됨</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {mockDocs.filter(d => d.verificationStatus === 'verified').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">검증 중</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {mockDocs.filter(d => d.verificationStatus === 'verifying').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">미검증</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {mockDocs.filter(d => d.verificationStatus === 'unverified').length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredDocs}
        columns={columns}
        pageSize={10}
        onRowClick={(doc) => setSelectedDoc(doc.id)}
      />
    </div>
  )
}