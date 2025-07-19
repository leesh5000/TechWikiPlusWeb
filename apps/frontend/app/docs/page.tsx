'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  ChevronDown 
} from 'lucide-react'

// Mock data - 실제로는 API에서 가져옴
const mockDocs = [
  {
    id: 1,
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    viewCount: 1234,
    isVerified: true,
    excerpt: "React 19에서 도입된 Server Components는 서버에서 렌더링되는 새로운 컴포넌트 타입입니다. 이 가이드에서는 Server Components의 동작 원리부터 실제 구현까지 상세히 다룹니다."
  },
  {
    id: 2,
    title: "TypeScript 5.0 마이그레이션 가이드",
    category: "TypeScript",
    createdAt: "2025-01-18",
    viewCount: 892,
    isVerified: true,
    excerpt: "TypeScript 5.0은 성능 개선과 함께 여러 새로운 기능을 도입했습니다. 이 가이드에서는 기존 프로젝트를 TypeScript 5.0으로 마이그레이션하는 방법을 단계별로 설명합니다."
  },
  {
    id: 3,
    title: "Kubernetes 보안 모범 사례 2025",
    category: "DevOps",
    createdAt: "2025-01-18",
    viewCount: 567,
    isVerified: false,
    excerpt: "Kubernetes 클러스터를 안전하게 운영하기 위한 최신 보안 모범 사례를 소개합니다. RBAC, 네트워크 정책, Pod 보안 표준 등을 다룹니다."
  },
  {
    id: 4,
    title: "Next.js 15 App Router 성능 최적화 팁",
    category: "Next.js",
    createdAt: "2025-01-17",
    viewCount: 2103,
    isVerified: true,
    excerpt: "Next.js 15의 App Router를 사용할 때 성능을 최대화하는 방법을 알아봅니다. 서버 컴포넌트, 클라이언트 컴포넌트 분리, 스트리밍 등을 다룹니다."
  },
  {
    id: 5,
    title: "Python 비동기 프로그래밍 심화 과정",
    category: "Python",
    createdAt: "2025-01-17",
    viewCount: 1456,
    isVerified: false,
    excerpt: "asyncio를 활용한 고급 비동기 프로그래밍 패턴과 실전 예제를 다룹니다. 동시성 처리, 비동기 컨텍스트 매니저, 성능 최적화 기법 등을 포함합니다."
  },
  {
    id: 6,
    title: "GraphQL vs REST: 2025년 선택 가이드",
    category: "API",
    createdAt: "2025-01-16",
    viewCount: 789,
    isVerified: true,
    excerpt: "GraphQL과 REST API의 장단점을 비교하고 프로젝트에 맞는 선택 방법을 안내합니다. 성능, 캐싱, 개발 경험 등 다양한 관점에서 분석합니다."
  },
  {
    id: 7,
    title: "Docker 멀티 스테이지 빌드 마스터하기",
    category: "DevOps",
    createdAt: "2025-01-16",
    viewCount: 1023,
    isVerified: true,
    excerpt: "Docker 멀티 스테이지 빌드를 활용하여 이미지 크기를 줄이고 빌드 효율성을 높이는 방법을 학습합니다."
  },
  {
    id: 8,
    title: "Vue 3 Composition API 실전 가이드",
    category: "Vue",
    createdAt: "2025-01-15",
    viewCount: 634,
    isVerified: false,
    excerpt: "Vue 3의 Composition API를 실제 프로젝트에 적용하는 방법을 다룹니다. 재사용 가능한 로직 구성과 타입 안전성 확보 방법을 포함합니다."
  },
  {
    id: 9,
    title: "AWS Lambda 서버리스 아키텍처 설계",
    category: "AWS",
    createdAt: "2025-01-15",
    viewCount: 1567,
    isVerified: true,
    excerpt: "AWS Lambda를 중심으로 한 서버리스 아키텍처 설계 원칙과 실제 구현 방법을 설명합니다. 비용 최적화와 성능 튜닝 방법도 다룹니다."
  },
  {
    id: 10,
    title: "MongoDB 인덱싱 전략과 성능 최적화",
    category: "Database",
    createdAt: "2025-01-14",
    viewCount: 891,
    isVerified: false,
    excerpt: "MongoDB에서 효율적인 인덱싱 전략을 수립하고 쿼리 성능을 최적화하는 방법을 학습합니다. 복합 인덱스, 부분 인덱스 등을 다룹니다."
  }
]

const categories = ["전체", "React", "TypeScript", "DevOps", "Next.js", "Python", "API", "Vue", "AWS", "Database"]
const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "views", label: "조회수순" }
]

const categoryColors: Record<string, string> = {
  React: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  TypeScript: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DevOps: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  Python: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  API: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Vue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  AWS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Database: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [verificationFilter, setVerificationFilter] = useState('전체') // 전체, 검증됨, 검증 중
  const [sortBy, setSortBy] = useState('latest')
  const [showFilters, setShowFilters] = useState(false)

  // 필터링 및 정렬된 문서 목록
  const filteredDocs = useMemo(() => {
    let filtered = mockDocs.filter(doc => {
      // 검색 쿼리 필터
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 카테고리 필터  
      const matchesCategory = selectedCategory === '전체' || doc.category === selectedCategory
      
      // 검증 상태 필터
      const matchesVerification = verificationFilter === '전체' ||
                                (verificationFilter === '검증됨' && doc.isVerified) ||
                                (verificationFilter === '검증 중' && !doc.isVerified)
      
      return matchesSearch && matchesCategory && matchesVerification
    })

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.viewCount - a.viewCount
        case 'views':
          return b.viewCount - a.viewCount
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, verificationFilter, sortBy])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/30 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                기술 문서 둘러보기
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                AI가 생성하고 커뮤니티가 검증한 신뢰할 수 있는 기술 문서를 찾아보세요
              </p>
              
              {/* Search Bar */}
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="문서 제목이나 내용으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b py-6">
          <div className="container">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Filter Toggle & Sort */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <Filter className="h-4 w-4" />
                  필터
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">검증 상태:</span>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    <option value="전체">전체</option>
                    <option value="검증됨">검증됨</option>
                    <option value="검증 중">검증 중</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {filteredDocs.length}개의 문서를 찾았습니다
              </p>
            </div>

            {/* Documents Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc) => (
                <article
                  key={doc.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between border-b p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        categoryColors[doc.category] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.category}
                    </span>
                    {doc.isVerified ? (
                      <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        검증됨
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        검증 중
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2 text-lg font-semibold leading-tight">
                      <Link
                        href={`/docs/${doc.id}`}
                        className="hover:text-primary"
                      >
                        {doc.title}
                      </Link>
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      {doc.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          {doc.viewCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <Link
                    href={`/docs/${doc.id}`}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">Read more</span>
                  </Link>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredDocs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">검색 조건에 맞는 문서를 찾을 수 없습니다.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('전체')
                    setVerificationFilter('전체')
                  }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}