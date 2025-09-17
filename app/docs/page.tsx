'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SearchAutocomplete, { SearchSuggestion } from '@/components/ui/SearchAutocomplete'
import SearchHighlight from '@/components/ui/SearchHighlight'
import AdvancedFilters, { FilterState } from '@/components/ui/AdvancedFilters'
import { 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Timer,
  Loader2
} from 'lucide-react'
import { postsService } from '@/lib/api/posts.service'
import { Document, VerificationStatus } from '@/lib/types/post.types'

// Initial mock data for fallback
const mockDocs: Document[] = [
  {
    id: '1',
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    viewCount: 1234,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 127,
    downvotes: 8,
    excerpt: "React 19에서 도입된 Server Components는 서버에서 렌더링되는 새로운 컴포넌트 타입입니다. 이 가이드에서는 Server Components의 동작 원리부터 실제 구현까지 상세히 다룹니다."
  },
  {
    id: '2',
    title: "TypeScript 5.0 마이그레이션 가이드",
    category: "TypeScript",
    createdAt: "2025-01-18",
    viewCount: 892,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 89,
    downvotes: 3,
    excerpt: "TypeScript 5.0은 성능 개선과 함께 여러 새로운 기능을 도입했습니다. 이 가이드에서는 기존 프로젝트를 TypeScript 5.0으로 마이그레이션하는 방법을 단계별로 설명합니다."
  },
  {
    id: '3',
    title: "Kubernetes 보안 모범 사례 2025",
    category: "DevOps",
    createdAt: "2025-01-18",
    viewCount: 567,
    verificationStatus: 'verifying' as VerificationStatus,
    upvotes: 45,
    downvotes: 12,
    verificationStartedAt: "2025-01-19T10:00:00Z",
    verificationEndAt: "2025-01-22T10:00:00Z",
    excerpt: "Kubernetes 클러스터를 안전하게 운영하기 위한 최신 보안 모범 사례를 소개합니다. RBAC, 네트워크 정책, Pod 보안 표준 등을 다룹니다."
  },
  {
    id: '4',
    title: "Next.js 15 App Router 성능 최적화 팁",
    category: "Next.js",
    createdAt: "2025-01-17",
    viewCount: 2103,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 210,
    downvotes: 15,
    excerpt: "Next.js 15의 App Router를 사용할 때 성능을 최대화하는 방법을 알아봅니다. 서버 컴포넌트, 클라이언트 컴포넌트 분리, 스트리밍 등을 다룹니다."
  },
  {
    id: '5',
    title: "Python 비동기 프로그래밍 심화 과정",
    category: "Python",
    createdAt: "2025-01-17",
    viewCount: 1456,
    verificationStatus: 'unverified' as VerificationStatus,
    upvotes: 0,
    downvotes: 0,
    excerpt: "asyncio를 활용한 고급 비동기 프로그래밍 패턴과 실전 예제를 다룹니다. 동시성 처리, 비동기 컨텍스트 매니저, 성능 최적화 기법 등을 포함합니다."
  },
  {
    id: '6',
    title: "GraphQL vs REST: 2025년 선택 가이드",
    category: "API",
    createdAt: "2025-01-16",
    viewCount: 789,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 67,
    downvotes: 5,
    excerpt: "GraphQL과 REST API의 장단점을 비교하고 프로젝트에 맞는 선택 방법을 안내합니다. 성능, 캐싱, 개발 경험 등 다양한 관점에서 분석합니다."
  },
  {
    id: '7',
    title: "Docker 멀티 스테이지 빌드 마스터하기",
    category: "DevOps",
    createdAt: "2025-01-16",
    viewCount: 1023,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 98,
    downvotes: 7,
    excerpt: "Docker 멀티 스테이지 빌드를 활용하여 이미지 크기를 줄이고 빌드 효율성을 높이는 방법을 학습합니다."
  },
  {
    id: '8',
    title: "Vue 3 Composition API 실전 가이드",
    category: "Vue",
    createdAt: "2025-01-15",
    viewCount: 634,
    verificationStatus: 'unverified' as VerificationStatus,
    upvotes: 0,
    downvotes: 0,
    excerpt: "Vue 3의 Composition API를 실제 프로젝트에 적용하는 방법을 다룹니다. 재사용 가능한 로직 구성과 타입 안전성 확보 방법을 포함합니다."
  },
  {
    id: '9',
    title: "AWS Lambda 서버리스 아키텍처 설계",
    category: "AWS",
    createdAt: "2025-01-15",
    viewCount: 1567,
    verificationStatus: 'verified' as VerificationStatus,
    upvotes: 156,
    downvotes: 11,
    excerpt: "AWS Lambda를 중심으로 한 서버리스 아키텍처 설계 원칙과 실제 구현 방법을 설명합니다. 비용 최적화와 성능 튜닝 방법도 다룹니다."
  },
  {
    id: '10',
    title: "MongoDB 인덱싱 전략과 성능 최적화",
    category: "Database",
    createdAt: "2025-01-14",
    viewCount: 891,
    verificationStatus: 'unverified' as VerificationStatus,
    upvotes: 0,
    downvotes: 0,
    excerpt: "MongoDB에서 효율적인 인덱싱 전략을 수립하고 쿼리 성능을 최적화하는 방법을 학습합니다. 복합 인덱스, 부분 인덱스 등을 다룹니다."
  },
  {
    id: '11',
    title: "React Native 앱 성능 최적화 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    viewCount: 234,
    verificationStatus: 'unverified' as VerificationStatus,
    upvotes: 0,
    downvotes: 0,
    excerpt: "React Native 앱의 성능을 최적화하는 다양한 기법들을 소개합니다. 메모리 관리, 렌더링 최적화, 네이티브 모듈 활용 등 실전 팁을 다룹니다."
  }
]

const categories = ["전체", "React", "TypeScript", "DevOps", "Next.js", "Python", "API", "Vue", "AWS", "Database"]

const categoryColors: Record<string, string> = {
  React: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  TypeScript: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  DevOps: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
  Python: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  API: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Vue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
  AWS: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Database: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    verificationStatus: [],
    dateRange: 'all',
    minViews: 0,
    sortBy: 'latest'
  })
  
  // API data state
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Fetch documents from API
  const fetchDocuments = useCallback(async (cursor?: string | null) => {
    try {
      if (!cursor) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsLoadingMore(true)
      }
      
      const response = await postsService.getDocuments({
        limit: 20,
        cursor: cursor || undefined
      })
      
      if (!cursor) {
        setDocuments(response.documents)
      } else {
        setDocuments(prev => [...prev, ...response.documents])
      }
      
      setHasNext(response.hasNext)
      setNextCursor(response.nextCursor)
    } catch (err) {
      console.error('Failed to fetch documents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load documents')
      
      // Use mock data as fallback on error
      if (!cursor) {
        setDocuments(mockDocs)
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])
  
  // Initial load
  useEffect(() => {
    fetchDocuments()
  }, [])
  
  // Load more handler
  const handleLoadMore = () => {
    if (hasNext && nextCursor && !isLoadingMore) {
      fetchDocuments(nextCursor)
    }
  }
  
  // 필터링 및 정렬된 문서 목록
  const filteredDocs = useMemo(() => {
    let filtered = documents.filter(doc => {
      // 검색 쿼리 필터
      const matchesSearch = searchQuery === '' || 
                          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.excerpt && doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // 카테고리 필터 - selectedCategory와 filters.categories 중 하나만 적용
      let matchesCategory = true
      if (filters.categories.length > 0) {
        // 고급 필터의 카테고리가 설정된 경우 이것만 사용
        matchesCategory = filters.categories.includes(doc.category)
      } else if (selectedCategory !== '전체') {
        // 그렇지 않으면 quick filter의 선택된 카테고리 사용
        matchesCategory = doc.category === selectedCategory
      }
      
      // 검증 상태 필터
      const matchesVerification = 
        filters.verificationStatus.length === 0 || 
        filters.verificationStatus.includes(doc.verificationStatus)
      
      // 조회수 필터
      const matchesViews = doc.viewCount >= filters.minViews
      
      // 날짜 필터
      let matchesDate = true
      if (filters.dateRange !== 'all') {
        const docDate = new Date(doc.createdAt)
        const now = new Date()
        
        switch (filters.dateRange) {
          case 'today':
            matchesDate = docDate.toDateString() === now.toDateString()
            break
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = docDate >= weekAgo
            break
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            matchesDate = docDate >= monthAgo
            break
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
            matchesDate = docDate >= yearAgo
            break
        }
      }
      
      return matchesSearch && matchesCategory && matchesVerification && matchesViews && matchesDate
    })

    // 정렬
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
        case 'views':
          return b.viewCount - a.viewCount
        default:
          return 0
      }
    })

    return filtered
  }, [documents, searchQuery, selectedCategory, filters])

  // 검색 제안사항 핸들러
  const handleSearchSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category' && suggestion.category) {
      setSelectedCategory(suggestion.category)
    }
  }

  // 필터 초기화
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('전체')
    setFilters({
      categories: [],
      verificationStatus: [],
      dateRange: 'all',
      minViews: 0,
      sortBy: 'latest'
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/30 dark:bg-muted/20 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                기술 문서 둘러보기
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                AI가 생성하고 커뮤니티가 검증한 신뢰할 수 있는 기술 문서를 찾아보세요
              </p>
              
              {/* Search Bar */}
              <div className="mx-auto max-w-xl">
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleSearchSuggestion}
                  placeholder="문서 제목이나 내용으로 검색..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Category Filters */}
        <section className="border-b py-6">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted dark:bg-muted/30 text-muted-foreground hover:bg-muted/80 dark:hover:bg-muted/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Filters */}
        <AdvancedFilters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          categories={categories.filter(cat => cat !== '전체')}
        />

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {filteredDocs.length}개의 문서를 찾았습니다
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">문서를 불러오는 중...</span>
              </div>
            )}
            
            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <p className="text-destructive">
                  오류: {error}
                </p>
                <button
                  onClick={() => fetchDocuments()}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  다시 시도
                </button>
              </div>
            )}
            
            {/* Documents Grid */}
            {!isLoading && documents.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((doc) => (
                <article
                  key={doc.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-border dark:border-border/70 bg-card dark:bg-card shadow-sm dark:shadow-none transition-all hover:shadow-md dark:hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between border-b dark:border-border/70 p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        categoryColors[doc.category] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.category}
                    </span>
                    {doc.verificationStatus === 'verified' ? (
                      <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        검증됨
                      </span>
                    ) : doc.verificationStatus === 'verifying' ? (
                      <span className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                        <Timer className="mr-1 h-3 w-3" />
                        검수 중
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        미검증
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
                        <SearchHighlight 
                          text={doc.title} 
                          searchQuery={searchQuery}
                        />
                      </Link>
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                      <SearchHighlight 
                        text={doc.excerpt} 
                        searchQuery={searchQuery}
                      />
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
            )}
            
            {/* Load More Button */}
            {!isLoading && hasNext && filteredDocs.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[200px] px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로딩 중...
                    </span>
                  ) : (
                    '더 보기'
                  )}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && documents.length > 0 && filteredDocs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">검색 조건에 맞는 문서를 찾을 수 없습니다.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  모든 필터 초기화
                </button>
              </div>
            )}
            
            {/* No Documents State */}
            {!isLoading && documents.length === 0 && !error && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">아직 등록된 문서가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}