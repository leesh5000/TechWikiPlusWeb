import { Document } from './constants'

// Mock 문서 데이터
export const mockDocs: Document[] = [
  {
    id: 1,
    title: "React 19의 새로운 기능: Server Components 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 1234,
    verificationStatus: 'verified',
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
    verificationStatus: 'verified',
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
  },
  {
    id: 3,
    title: "Kubernetes 보안 모범 사례 2025",
    category: "DevOps",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-18",
    viewCount: 567,
    verificationStatus: 'verifying',
    upvotes: 45,
    downvotes: 12,
    verificationStartedAt: "2025-01-19T10:00:00Z",
    verificationEndAt: "2025-01-22T10:00:00Z",
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "Kubernetes 클러스터를 안전하게 운영하기 위한 최신 보안 모범 사례를 소개합니다. RBAC, 네트워크 정책, Pod 보안 표준 등을 다룹니다.",
    content: "# Kubernetes 보안 모범 사례",
    readingTime: 15
  },
  {
    id: 4,
    title: "Next.js 15 App Router 성능 최적화 팁",
    category: "Next.js",
    createdAt: "2025-01-17",
    updatedAt: "2025-01-17",
    viewCount: 2103,
    verificationStatus: 'verified',
    author: "AI Writer",
    verifiedBy: "이넥스트",
    excerpt: "Next.js 15의 App Router를 사용할 때 성능을 최대화하는 방법을 알아봅니다. 서버 컴포넌트, 클라이언트 컴포넌트 분리, 스트리밍 등을 다룹니다.",
    content: "# Next.js 15 App Router 성능 최적화",
    upvotes: 210,
    downvotes: 15,
    readingTime: 10
  },
  {
    id: 5,
    title: "Python 비동기 프로그래밍 심화 과정",
    category: "Python",
    createdAt: "2025-01-17",
    updatedAt: "2025-01-17",
    viewCount: 1456,
    verificationStatus: 'unverified',
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "asyncio를 활용한 고급 비동기 프로그래밍 패턴과 실전 예제를 다룹니다. 동시성 처리, 비동기 컨텍스트 매니저, 성능 최적화 기법 등을 포함합니다.",
    content: "# Python 비동기 프로그래밍",
    upvotes: 0,
    downvotes: 0,
    readingTime: 18
  },
  {
    id: 6,
    title: "GraphQL vs REST: 2025년 선택 가이드",
    category: "API",
    createdAt: "2025-01-16",
    updatedAt: "2025-01-16", 
    viewCount: 789,
    verificationStatus: 'verified',
    author: "AI Writer",
    verifiedBy: "김API",
    excerpt: "GraphQL과 REST API의 장단점을 비교하고 프로젝트에 맞는 선택 방법을 안내합니다. 성능, 캐싱, 개발 경험 등 다양한 관점에서 분석합니다.",
    content: "# GraphQL vs REST",
    upvotes: 67,
    downvotes: 5,
    readingTime: 14
  },
  {
    id: 7,
    title: "Docker 멀티 스테이지 빌드 마스터하기",
    category: "DevOps",
    createdAt: "2025-01-16",
    updatedAt: "2025-01-16",
    viewCount: 1023,
    verificationStatus: 'verified',
    author: "AI Writer",
    verifiedBy: "박도커",
    excerpt: "Docker 멀티 스테이지 빌드를 활용하여 이미지 크기를 줄이고 빌드 효율성을 높이는 방법을 학습합니다.",
    content: "# Docker 멀티 스테이지 빌드",
    upvotes: 98,
    downvotes: 7,
    readingTime: 11
  },
  {
    id: 8,
    title: "Vue 3 Composition API 실전 가이드",
    category: "Vue",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    viewCount: 634,
    verificationStatus: 'unverified',
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "Vue 3의 Composition API를 실제 프로젝트에 적용하는 방법을 다룹니다. 재사용 가능한 로직 구성과 타입 안전성 확보 방법을 포함합니다.",
    content: "# Vue 3 Composition API",
    upvotes: 0,
    downvotes: 0,
    readingTime: 13
  },
  {
    id: 9,
    title: "AWS Lambda 서버리스 아키텍처 설계",
    category: "AWS",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
    viewCount: 1567,
    verificationStatus: 'verified',
    author: "AI Writer",
    verifiedBy: "이람다",
    excerpt: "AWS Lambda를 중심으로 한 서버리스 아키텍처 설계 원칙과 실제 구현 방법을 설명합니다. 비용 최적화와 성능 튜닝 방법도 다룹니다.",
    content: "# AWS Lambda 서버리스 아키텍처",
    upvotes: 156,
    downvotes: 11,
    readingTime: 20
  },
  {
    id: 10,
    title: "MongoDB 인덱싱 전략과 성능 최적화",
    category: "Database",
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
    viewCount: 891,
    verificationStatus: 'unverified',
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "MongoDB에서 효율적인 인덱싱 전략을 수립하고 쿼리 성능을 최적화하는 방법을 학습합니다. 복합 인덱스, 부분 인덱스 등을 다룹니다.",
    content: "# MongoDB 인덱싱 전략",
    upvotes: 0,
    downvotes: 0,
    readingTime: 16
  },
  {
    id: 11,
    title: "React Native 앱 성능 최적화 완벽 가이드",
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 234,
    verificationStatus: 'unverified',
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "React Native 앱의 성능을 최적화하는 다양한 기법들을 소개합니다.",
    content: `
# React Native 앱 성능 최적화 완벽 가이드

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

React Native 앱 성능 최적화는 지속적인 과정입니다. 프로파일링 도구를 활용하여 병목 지점을 찾고 개선해 나가세요.
    `,
    upvotes: 0,
    downvotes: 0,
    readingTime: 10
  }
]

// Mock 리뷰 제출 데이터
export interface ReviewSubmission {
  id: number
  documentId: number
  userId: string
  submittedAt: string
  voteType: 'approve' | 'reject'
  comments: any[]
}

export const mockReviews: ReviewSubmission[] = [
  {
    id: 1,
    documentId: 11,
    userId: 'reviewer1',
    submittedAt: '2025-01-19T11:00:00Z',
    voteType: 'approve',
    comments: []
  },
  {
    id: 2,
    documentId: 11,
    userId: 'reviewer2',
    submittedAt: '2025-01-19T12:00:00Z',
    voteType: 'approve',
    comments: []
  },
  {
    id: 3,
    documentId: 11,
    userId: 'reviewer3',
    submittedAt: '2025-01-19T13:00:00Z',
    voteType: 'reject',
    comments: []
  }
]

// Mock 기여자 데이터
export const mockContributors = [
  {
    id: 1,
    rank: 1,
    username: "devmaster",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=devmaster`,
    points: 15420,
    contributions: 234,
    earnings: 924.20,
    badge: "gold"
  },
  {
    id: 2,
    rank: 2,
    username: "codewarrior",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=codewarrior`,
    points: 12350,
    contributions: 189,
    earnings: 741.00,
    badge: "silver"
  },
  {
    id: 3,
    rank: 3,
    username: "techguru",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=techguru`,
    points: 10890,
    contributions: 167,
    earnings: 653.40,
    badge: "bronze"
  },
  {
    id: 4,
    rank: 4,
    username: "bugfixer",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=bugfixer`,
    points: 8920,
    contributions: 145,
    earnings: 535.20,
    badge: null
  },
  {
    id: 5,
    rank: 5,
    username: "docmaster",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=docmaster`,
    points: 7650,
    contributions: 128,
    earnings: 459.00,
    badge: null
  }
]