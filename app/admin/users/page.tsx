'use client'

import { useState } from 'react'
import { Search, Filter, UserPlus, Edit, Ban, Shield, Mail, TrendingUp } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'

// Mock 사용자 데이터
const mockUsers = [
  {
    id: 1,
    username: 'devmaster',
    email: 'devmaster@example.com',
    role: 'contributor',
    joinedAt: '2024-12-15',
    points: 15420,
    contributions: 234,
    status: 'active',
    lastActive: '2025-01-20'
  },
  {
    id: 2,
    username: 'admin',
    email: 'admin@techwiki.com',
    role: 'admin',
    joinedAt: '2024-11-01',
    points: 0,
    contributions: 0,
    status: 'active',
    lastActive: '2025-01-20'
  },
  {
    id: 3,
    username: 'codewarrior',
    email: 'codewarrior@example.com',
    role: 'contributor',
    joinedAt: '2024-12-20',
    points: 12350,
    contributions: 189,
    status: 'active',
    lastActive: '2025-01-19'
  },
  {
    id: 4,
    username: 'newbie123',
    email: 'newbie@example.com',
    role: 'user',
    joinedAt: '2025-01-18',
    points: 50,
    contributions: 2,
    status: 'active',
    lastActive: '2025-01-20'
  },
  {
    id: 5,
    username: 'spammer99',
    email: 'spam@fake.com',
    role: 'user',
    joinedAt: '2025-01-10',
    points: 0,
    contributions: 0,
    status: 'suspended',
    lastActive: '2025-01-10'
  }
]

const roleOptions = [
  { value: 'all', label: '전체 역할' },
  { value: 'admin', label: '관리자' },
  { value: 'contributor', label: '기여자' },
  { value: 'user', label: '일반 사용자' }
]

const statusOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '활성' },
  { value: 'suspended', label: '정지' }
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  // 필터링
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const columns = [
    {
      key: 'id',
      title: 'ID',
      className: 'w-16'
    },
    {
      key: 'user',
      title: '사용자',
      render: (_: any, item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">{item.username[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium">{item.username}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: '역할',
      render: (value: string) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          value === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
          value === 'contributor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
        }`}>
          {value === 'admin' && <Shield className="h-3 w-3" />}
          {value === 'admin' ? '관리자' :
           value === 'contributor' ? '기여자' : '일반'}
        </span>
      ),
      className: 'w-32'
    },
    {
      key: 'contributions',
      title: '기여',
      render: (value: number, item: any) => (
        <div>
          <p className="font-medium">{value}건</p>
          <p className="text-xs text-muted-foreground">{item.points.toLocaleString()}P</p>
        </div>
      ),
      className: 'w-24'
    },
    {
      key: 'status',
      title: '상태',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {value === 'active' ? '활성' : '정지'}
        </span>
      ),
      className: 'w-24'
    },
    {
      key: 'joinedAt',
      title: '가입일',
      render: (value: string) => new Date(value).toLocaleDateString('ko-KR'),
      className: 'w-32'
    },
    {
      key: 'lastActive',
      title: '최근 활동',
      render: (value: string) => {
        const days = Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24))
        return days === 0 ? '오늘' : `${days}일 전`
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
              // 사용자 편집
            }}
            className="p-1 rounded hover:bg-accent"
            title="편집"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 이메일 전송
            }}
            className="p-1 rounded hover:bg-accent"
            title="이메일"
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 계정 정지/활성화
            }}
            className={`p-1 rounded hover:bg-accent ${
              item.status === 'active' ? 'text-destructive' : 'text-green-600'
            }`}
            title={item.status === 'active' ? '정지' : '활성화'}
          >
            <Ban className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold">사용자 관리</h1>
          <p className="text-muted-foreground">모든 사용자를 관리하고 권한을 설정할 수 있습니다</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          사용자 초대
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="사용자명 또는 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">전체 사용자</p>
          <p className="text-2xl font-bold">{mockUsers.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">활성 사용자</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {mockUsers.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">기여자</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {mockUsers.filter(u => u.role === 'contributor').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">신규 가입 (7일)</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">23</p>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        pageSize={10}
        onRowClick={(user) => setSelectedUser(user.id)}
      />
    </div>
  )
}