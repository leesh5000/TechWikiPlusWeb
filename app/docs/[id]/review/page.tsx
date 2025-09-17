import { notFound } from 'next/navigation'
import ReviewPageContent from './ReviewPageContent'
import { postsService } from '@/lib/api/posts.service'

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
  verificationDeadline?: string // 검수 마감 시간
}

interface ReviewPageProps {
  params: Promise<{
    id: string
  }>
}

// Fetch document from API
async function getDocument(id: string): Promise<Document | null> {
  try {
    const post = await postsService.getPost(id)
    
    // Transform post to Document format
    const doc: Document = {
      id: parseInt(id),
      title: post.title,
      category: post.tags?.[0]?.name || 'General',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt || post.modifiedAt || post.createdAt,
      viewCount: post.views || 0,
      verificationStatus: post.verificationStatus || 'unverified',
      author: post.author?.username || 'Unknown',
      verifiedBy: post.verifiedBy || null,
      excerpt: post.summary || '',
      content: post.body || '',
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      readingTime: Math.ceil((post.body?.length || 0) / 200),
      verificationDeadline: post.verificationEndAt
    }
    
    return doc
  } catch (error) {
    // Don't log 404 errors, as we'll fallback to mock data
    if (error instanceof Error && !error.message.includes('not found')) {
      console.error('Failed to fetch document:', error)
    }
    return null
  }
}

// Keep mock data as fallback for development
const mockDocs: Document[] = [
  {
    id: 1,
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 1234,
    verificationStatus: 'verified' as VerificationStatus,
    author: "AI Writer",
    verifiedBy: "김개발자",
    excerpt: "React 19에서 도입된 Server Components는 서버에서 렌더링되는 새로운 컴포넌트 타입입니다.",
    content: `# React 19의 새로운 기능: Server Components 완벽 가이드

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
\`\`\``,
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
    verificationStatus: 'verified' as VerificationStatus,
    author: "AI Writer",
    verifiedBy: "박타입",
    excerpt: "TypeScript 5.0은 성능 개선과 함께 여러 새로운 기능을 도입했습니다.",
    content: `# TypeScript 5.0 마이그레이션 가이드

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

자세한 내용은 공식 문서를 참조하세요.`,
    upvotes: 89,
    downvotes: 3,
    readingTime: 8
  },
  {
    id: 11,
    title: "React Native 앱 성능 최적화 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 234,
    verificationStatus: 'unverified' as VerificationStatus,
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "React Native 앱의 성능을 최적화하는 다양한 기법들을 소개합니다.",
    content: `# React Native 앱 성능 최적화 완벽 가이드

React Native 앱의 성능을 최적화하는 것은 사용자 경험을 향상시키는 핵심 요소입니다. 이 가이드에서는 다양한 최적화 기법을 소개합니다.

## 메모리 관리

### 1. 불필요한 리렌더링 방지
React.memo와 useMemo를 활용하여 불필요한 컴포넌트 리렌더링을 방지합니다:

\`\`\`javascript
const MemoizedComponent = React.memo(({ data }) => {
  return <View>{/* 컴포넌트 내용 */}</View>
})
\`\`\`

### 2. 메모리 누수 방지
타이머나 이벤트 리스너는 반드시 정리해야 합니다:

\`\`\`javascript
useEffect(() => {
  const timer = setTimeout(() => {
    // 작업 수행
  }, 1000)
  
  return () => clearTimeout(timer)
}, [])
\`\`\`

## 렌더링 최적화

FlatList를 사용할 때는 다음과 같은 최적화를 적용합니다:

1. **getItemLayout** 제공
2. **keyExtractor** 최적화
3. **removeClippedSubviews** 활성화

## 네이티브 모듈 활용

성능이 중요한 작업은 네이티브 모듈로 구현하여 성능을 향상시킬 수 있습니다.

## 마무리

React Native 앱 성능 최적화는 지속적인 과정입니다. 프로파일링 도구를 활용하여 병목 지점을 찾고 개선해 나가세요.`,
    upvotes: 0,
    downvotes: 0,
    readingTime: 10
  }
]

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  
  // Try to fetch from API first
  let doc = await getDocument(id)
  
  // Fallback to mock data in development
  if (!doc && process.env.NODE_ENV === 'development') {
    const parsedId = parseInt(id)
    doc = mockDocs.find(d => d.id === parsedId) || null
  }
  
  if (!doc) {
    notFound()
  }

  return <ReviewPageContent doc={doc} />
}