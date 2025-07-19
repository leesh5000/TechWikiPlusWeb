import Link from 'next/link'
import { Clock, Eye, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

// Mock data - 실제로는 API에서 가져옴
const mockPosts = [
  {
    id: 1,
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    viewCount: 1234,
    isVerified: true,
    excerpt: "React 19에서 도입된 Server Components는 서버에서 렌더링되는 새로운 컴포넌트 타입입니다..."
  },
  {
    id: 2,
    title: "TypeScript 5.0 마이그레이션 가이드",
    category: "TypeScript",
    createdAt: "2025-01-18",
    viewCount: 892,
    isVerified: true,
    excerpt: "TypeScript 5.0은 성능 개선과 함께 여러 새로운 기능을 도입했습니다. 이 가이드에서는..."
  },
  {
    id: 3,
    title: "Kubernetes 보안 모범 사례 2025",
    category: "DevOps",
    createdAt: "2025-01-18",
    viewCount: 567,
    isVerified: false,
    excerpt: "Kubernetes 클러스터를 안전하게 운영하기 위한 최신 보안 모범 사례를 소개합니다..."
  },
  {
    id: 4,
    title: "Next.js 15 App Router 성능 최적화 팁",
    category: "Next.js",
    createdAt: "2025-01-17",
    viewCount: 2103,
    isVerified: true,
    excerpt: "Next.js 15의 App Router를 사용할 때 성능을 최대화하는 방법을 알아봅니다..."
  },
  {
    id: 5,
    title: "Python 비동기 프로그래밍 심화 과정",
    category: "Python",
    createdAt: "2025-01-17",
    viewCount: 1456,
    isVerified: false,
    excerpt: "asyncio를 활용한 고급 비동기 프로그래밍 패턴과 실전 예제를 다룹니다..."
  },
  {
    id: 6,
    title: "GraphQL vs REST: 2025년 선택 가이드",
    category: "API",
    createdAt: "2025-01-16",
    viewCount: 789,
    isVerified: true,
    excerpt: "GraphQL과 REST API의 장단점을 비교하고 프로젝트에 맞는 선택 방법을 안내합니다..."
  }
]

const categoryColors: Record<string, string> = {
  React: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  TypeScript: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DevOps: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  Python: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  API: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

export default function RecentPosts() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            최신 기술 문서
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            AI가 매일 생성하는 최신 기술 트렌드와 가이드를 확인하세요
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between border-b p-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    categoryColors[post.category] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.category}
                </span>
                {post.isVerified ? (
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
                    href={`/docs/${post.id}`}
                    className="hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {post.viewCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <Link
                href={`/docs/${post.id}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">Read more</span>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/docs"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            모든 문서 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}