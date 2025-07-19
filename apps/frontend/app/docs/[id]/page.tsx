import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CodeBlock from '@/components/markdown/CodeBlock'
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookOpen
} from 'lucide-react'

// Mock data - 실제로는 API에서 가져옴
const mockDocs = [
  {
    id: 1,
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 1234,
    isVerified: true,
    author: "AI Writer",
    verifiedBy: "김개발자",
    excerpt: "React 19에서 도입된 Server Components는 서버에서 렌더링되는 새로운 컴포넌트 타입입니다.",
    content: `
# React 19의 새로운 기능: Server Components 완벽 가이드

React 19에서 가장 주목받는 기능 중 하나는 **Server Components**입니다. 이 가이드에서는 Server Components의 핵심 개념부터 실제 구현까지 상세히 다룹니다.

## Server Components란?

Server Components는 서버에서 렌더링되는 React 컴포넌트로, 클라이언트로 전송되는 JavaScript 번들 크기를 줄이고 초기 로딩 성능을 향상시킵니다.

### 주요 특징

1. **서버에서 실행**: 서버에서만 실행되므로 클라이언트 번들에 포함되지 않습니다
2. **데이터 접근**: 데이터베이스나 파일 시스템에 직접 접근할 수 있습니다
3. **보안**: 민감한 로직을 서버에서 안전하게 처리할 수 있습니다

## 기본 사용법

\`\`\`jsx
// ServerComponent.js (서버 컴포넌트)
import { db } from './db'

export default async function UserList() {
  const users = await db.users.findMany()
  
  return (
    <div>
      <h2>사용자 목록</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

## 클라이언트 컴포넌트와의 조합

Server Components와 Client Components를 효과적으로 조합하여 사용할 수 있습니다:

\`\`\`jsx
// Page.js (서버 컴포넌트)
import UserList from './UserList' // 서버 컴포넌트
import SearchBox from './SearchBox' // 클라이언트 컴포넌트

export default function Page() {
  return (
    <div>
      <SearchBox /> {/* 클라이언트에서 상호작용 */}
      <UserList />  {/* 서버에서 데이터 페치 */}
    </div>
  )
}
\`\`\`

## 성능 최적화

Server Components를 사용할 때 고려해야 할 성능 최적화 방법들:

1. **스트리밍**: Suspense와 함께 사용하여 점진적 로딩
2. **캐싱**: 서버 사이드 캐싱으로 응답 시간 단축
3. **코드 분할**: 필요한 컴포넌트만 로드

## 주의사항

- **상태 사용 불가**: useState, useEffect 등 사용 불가
- **브라우저 API 접근 불가**: window, document 등 사용 불가
- **이벤트 핸들러 사용 불가**: onClick 등 직접 사용 불가

## 마무리

Server Components는 React 19의 핵심 기능으로, 적절히 활용하면 성능과 개발 경험을 크게 향상시킬 수 있습니다. 기존 패러다임과는 다른 접근이 필요하지만, 그만큼 강력한 도구가 될 것입니다.
    `,
    upvotes: 127,
    downvotes: 8,
    readingTime: 12
  },
  {
    id: 2,
    title: "TypeScript 5.0 마이그레이션 가이드",
    category: "TypeScript",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-18",
    viewCount: 892,
    isVerified: true,
    author: "AI Writer",
    verifiedBy: "박타입",
    excerpt: "TypeScript 5.0은 성능 개선과 함께 여러 새로운 기능을 도입했습니다.",
    content: `
# TypeScript 5.0 마이그레이션 가이드

TypeScript 5.0은 성능 향상과 새로운 기능들을 제공합니다. 이 가이드에서는 기존 프로젝트를 TypeScript 5.0으로 업그레이드하는 방법을 설명합니다.

## 주요 변경사항

### 1. 데코레이터 지원 개선
새로운 데코레이터 구문을 지원합니다:

\`\`\`typescript
class MyClass {
  @logged
  myMethod() {
    // ...
  }
}
\`\`\`

### 2. const 타입 파라미터
타입 파라미터에 const 수식어를 사용할 수 있습니다:

\`\`\`typescript
function createArray<const T>(items: readonly T[]): T[] {
  return [...items]
}
\`\`\`

## 마이그레이션 절차

1. TypeScript 버전 업데이트
2. 설정 파일 검토
3. 타입 오류 수정
4. 테스트 실행

자세한 내용은 공식 문서를 참조하세요.
    `,
    upvotes: 89,
    downvotes: 3,
    readingTime: 8
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

interface DocPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params
  const doc = mockDocs.find(d => d.id === parseInt(id))
  
  if (!doc) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b py-4">
          <div className="container">
            <Link
              href="/docs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              문서 목록으로 돌아가기
            </Link>
          </div>
        </section>

        {/* Document Header */}
        <section className="border-b py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Category & Verification Status */}
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    categoryColors[doc.category] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {doc.category}
                </span>
                {doc.isVerified ? (
                  <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    검증됨
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    검증 중
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {doc.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {doc.viewCount.toLocaleString()} 조회
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  약 {doc.readingTime}분 소요
                </div>
                <div>
                  작성: {doc.author}
                  {doc.verifiedBy && (
                    <>
                      {' | '}
                      검증: {doc.verifiedBy}
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                    <ThumbsUp className="h-4 w-4" />
                    {doc.upvotes}
                  </button>
                  <button className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                    <ThumbsDown className="h-4 w-4" />
                    {doc.downvotes}
                  </button>
                </div>
                <button className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  <Share2 className="h-4 w-4" />
                  공유
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Document Content */}
        <section className="py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-7 text-foreground">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-6 list-disc">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 ml-6 list-decimal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-border pl-4 my-4 italic text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className, ...props }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <CodeBlock className={className} inline={false}>
                          {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                      )
                    },
                    a: ({ href, children }) => (
                      <a 
                        href={href}
                        className="text-primary hover:underline"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border border-border">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border px-4 py-2 text-left bg-muted font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-4 py-2 text-left">
                        {children}
                      </td>
                    ),
                    hr: () => (
                      <hr className="my-8 border-border" />
                    )
                  }}
                >
                  {doc.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <section className="border-t py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">
                    이 문서가 도움이 되었나요?
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
                    <ThumbsUp className="h-4 w-4" />
                    도움됨 ({doc.upvotes})
                  </button>
                  <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
                    <ThumbsDown className="h-4 w-4" />
                    개선 필요 ({doc.downvotes})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Documents */}
        <section className="border-t bg-muted/30 py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h3 className="mb-6 text-xl font-semibold">관련 문서</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {mockDocs
                  .filter(d => d.id !== doc.id && d.category === doc.category)
                  .slice(0, 2)
                  .map(relatedDoc => (
                    <Link
                      key={relatedDoc.id}
                      href={`/docs/${relatedDoc.id}`}
                      className="group block rounded-lg border bg-background p-4 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            categoryColors[relatedDoc.category] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {relatedDoc.category}
                        </span>
                        {relatedDoc.isVerified && (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <h4 className="mb-1 font-medium group-hover:text-primary">
                        {relatedDoc.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {relatedDoc.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// Generate static paths for known document IDs
export function generateStaticParams() {
  return mockDocs.map((doc) => ({
    id: doc.id.toString(),
  }))
}