import { notFound } from 'next/navigation'
import ReviewPageContent from '../../review/ReviewPageContent'

// 검수 의견 타입
interface ReviewComment {
  id: string
  lineStart: number
  lineEnd: number
  content: string
  type: 'accurate' | 'inaccurate' | 'improvement' | 'question'
  author: string
  createdAt: string
  suggestedChange?: string
}

interface Document {
  id: number
  title: string
  category: string
  createdAt: string
  updatedAt: string
  viewCount: number
  verificationStatus: 'unverified' | 'verifying' | 'verified'
  author: string
  verifiedBy: string | null
  excerpt: string
  content: string
  upvotes: number
  downvotes: number
  readingTime: number
  verificationDeadline?: string // 검수 마감 시간
}

interface ReviewDetail {
  id: string
  documentId: number
  documentTitle: string
  documentContent: string
  reviewer: string
  submittedAt: string
  comments: ReviewComment[]
  status: 'pending' | 'approved' | 'rejected'
  votes: {
    approve: number
    reject: number
  }
}

interface ReviewDetailPageProps {
  params: Promise<{
    id: string
    reviewId: string
  }>
}

// Mock 검수 상세 데이터
const mockReviewDetail: ReviewDetail = {
  id: "1",
  documentId: 11,
  documentTitle: "React Native 앱 성능 최적화 완벽 가이드",
  documentContent: `# React Native 앱 성능 최적화 완벽 가이드

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
\`\`\``,
  reviewer: "김개발자",
  submittedAt: "2025-01-20T10:30:00",
  comments: [
    {
      id: "1",
      lineStart: 8,
      lineEnd: 8,
      content: "React.memo 사용 시 props 비교 함수를 추가하면 더 정확한 최적화가 가능합니다.",
      type: 'improvement',
      author: "김개발자",
      createdAt: "2025-01-20T10:25:00",
      suggestedChange: "React.memo와 useMemo를 활용하여 불필요한 컴포넌트 리렌더링을 방지합니다. 커스텀 비교 함수를 사용하면 더 세밀한 제어가 가능합니다:"
    },
    {
      id: "2",
      lineStart: 11,
      lineEnd: 13,
      content: "예제 코드에 props 타입 정의가 누락되었습니다.",
      type: 'inaccurate',
      author: "김개발자",
      createdAt: "2025-01-20T10:26:00",
      suggestedChange: `const MemoizedComponent = React.memo<{ data: any }>(({ data }) => {
  return <View>{/* 컴포넌트 내용 */}</View>
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data
})`
    },
    {
      id: "3",
      lineStart: 22,
      lineEnd: 22,
      content: "cleanup 함수의 중요성이 잘 설명되어 있습니다.",
      type: 'accurate',
      author: "김개발자",
      createdAt: "2025-01-20T10:28:00"
    }
  ],
  status: 'pending',
  votes: {
    approve: 2,
    reject: 0
  }
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id, reviewId } = await params
  
  // 실제로는 API에서 검수 상세 정보를 가져옴
  const review = mockReviewDetail
  
  if (!review || review.documentId !== parseInt(id)) {
    notFound()
  }
  
  // 문서 객체 생성
  const doc: Document = {
    id: review.documentId,
    title: review.documentTitle,
    category: "React",
    createdAt: "2025-01-19",
    updatedAt: "2025-01-19",
    viewCount: 234,
    verificationStatus: 'verifying',
    author: "AI Writer",
    verifiedBy: null,
    excerpt: "React Native 앱의 성능을 최적화하는 다양한 기법들을 소개합니다.",
    content: review.documentContent,
    upvotes: 0,
    downvotes: 0,
    readingTime: 10
  }
  
  return (
    <ReviewPageContent 
      doc={doc} 
      readOnly={true} 
      initialComments={review.comments} 
    />
  )
}