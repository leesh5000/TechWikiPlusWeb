import { apiClient } from './client'
import {
  StartReviewResponse,
  ReviewApiError,
  ReviewErrorCodes,
  ReviewCommentType,
  ReviewCommentTypesResponse,
  PostRevisionRequest,
  PostRevisionResponse,
  ReviewHistoryResponse,
  DocumentRevision
} from '@/lib/types/review.types'
import { AxiosError } from 'axios'

class ReviewService {
  /**
   * Start review/verification process for a post
   * @param postId - The post ID to start review for
   * @returns StartReviewResponse with verification timestamps
   */
  async startReview(postId: string): Promise<StartReviewResponse> {
    try {
      const response = await apiClient.post<StartReviewResponse>(
        `/api/v1/posts/${postId}/reviews`
      )
      
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      
      // Handle specific review errors
      if (axiosError.response?.data?.code === ReviewErrorCodes.ALREADY_REVIEWING) {
        throw new Error('이미 검수가 진행 중인 문서입니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.POST_NOT_FOUND) {
        throw new Error('문서를 찾을 수 없습니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.UNAUTHORIZED) {
        throw new Error('검수를 시작할 권한이 없습니다. 로그인이 필요합니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.REVIEW_NOT_ALLOWED) {
        throw new Error('이 문서는 검수할 수 없는 상태입니다')
      }
      
      if (axiosError.response?.data?.code === ReviewErrorCodes.INVALID_POST_STATUS) {
        throw new Error('문서가 검수 가능한 상태가 아닙니다')
      }
      
      // Handle HTTP status codes
      if (axiosError.response?.status === 401) {
        throw new Error('로그인이 필요합니다')
      }
      
      if (axiosError.response?.status === 403) {
        throw new Error('검수 권한이 없습니다')
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error('문서를 찾을 수 없습니다')
      }
      
      if (axiosError.response?.status === 409) {
        throw new Error('이미 검수가 진행 중입니다')
      }
      
      // Default error
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 시작에 실패했습니다. 잠시 후 다시 시도해주세요'
      )
    }
  }

  /**
   * End review/verification process for a post
   * @param postId - The post ID to end review for
   * @param reviewId - Optional review ID
   */
  async endReview(postId: string, reviewId?: string): Promise<void> {
    try {
      const endpoint = reviewId 
        ? `/api/v1/posts/${postId}/review/${reviewId}/end`
        : `/api/v1/posts/${postId}/review/end`
        
      await apiClient.post(endpoint)
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 종료에 실패했습니다'
      )
    }
  }

  /**
   * Submit a review for a post
   * @param postId - The post ID
   * @param reviewData - Review content and suggestions
   */
  async submitReview(
    postId: string,
    reviewData: {
      comments: Array<{
        lineStart: number
        lineEnd: number
        content: string
        type: 'improvement' | 'error' | 'suggestion' | 'question'
        suggestedChange?: string
      }>
      overallComment?: string
    }
  ): Promise<void> {
    try {
      await apiClient.post(`/api/v1/posts/${postId}/reviews`, reviewData)
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 제출에 실패했습니다'
      )
    }
  }

  /**
   * Vote on a review
   * @param postId - The post ID
   * @param reviewId - The review ID
   * @param voteType - 'approve' or 'reject'
   */
  async voteReview(
    postId: string,
    reviewId: string,
    voteType: 'approve' | 'reject'
  ): Promise<void> {
    try {
      await apiClient.post(
        `/api/v1/posts/${postId}/review/${reviewId}/vote`,
        { type: voteType }
      )
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '투표에 실패했습니다'
      )
    }
  }

  /**
   * Get all reviews for a post
   * @param postId - The post ID
   */
  async getReviews(postId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/v1/posts/${postId}/reviews`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수 목록을 불러올 수 없습니다'
      )
    }
  }

  /**
   * Get a specific review
   * @param postId - The post ID
   * @param reviewId - The review ID
   */
  async getReview(postId: string, reviewId: string): Promise<any> {
    try {
      const response = await apiClient.get(
        `/api/v1/posts/${postId}/reviews/${reviewId}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        '검수를 불러올 수 없습니다'
      )
    }
  }

  /**
   * Submit a post revision for a review
   * @param reviewId - The review ID
   * @param revisionData - Revision data including title, body and comments
   */
  async submitRevision(
    reviewId: string,
    revisionData: PostRevisionRequest
  ): Promise<PostRevisionResponse> {
    try {
      const response = await apiClient.post<PostRevisionResponse>(
        `/api/v1/reviews/${reviewId}/revisions`,
        revisionData
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>
      
      // Handle specific revision errors
      if (axiosError.response?.data?.code === 'BLANK_TITLE') {
        throw new Error('제목은 필수 입력 항목입니다')
      }
      
      if (axiosError.response?.data?.code === 'CONTENT_TOO_SHORT') {
        throw new Error('본문은 최소 30자 이상이어야 합니다')
      }
      
      if (axiosError.response?.data?.code === 'BLANK_REVIEW_COMMENT') {
        throw new Error('검수 의견은 필수 입력 항목입니다')
      }
      
      if (axiosError.response?.data?.code === 'INVALID_LINE_NUMBER') {
        throw new Error(axiosError.response.data.message || '유효하지 않은 라인 번호입니다')
      }
      
      throw new Error(
        axiosError.response?.data?.message || 
        '개정안 제출에 실패했습니다'
      )
    }
  }

  /**
   * Get review history for a post
   * @param postId - The post ID
   * @returns List of review history items
   */
  async getReviewHistory(postId: string): Promise<ReviewHistoryResponse> {
    try {
      const response = await apiClient.get<ReviewHistoryResponse>(
        `/api/v1/posts/${postId}/reviews`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ReviewApiError>

      if (axiosError.response?.status === 404) {
        // Return empty array if no reviews found
        return []
      }

      throw new Error(
        axiosError.response?.data?.message ||
        '리뷰 내역을 불러올 수 없습니다'
      )
    }
  }

  /**
   * Get revisions for a specific review
   * @param documentId - The document ID
   * @param reviewId - The review ID
   * @returns List of document revisions
   */
  async getReviewRevisions(documentId: string, reviewId: string): Promise<DocumentRevision[]> {
    try {
      const response = await apiClient.get<DocumentRevision[]>(
        `/api/v1/docs/${documentId}/reviews/${reviewId}/revisions`
      )
      return response.data
    } catch (error) {
      // Return mock data for now
      return this.getMockRevisions(documentId, reviewId)
    }
  }

  /**
   * Get mock revisions for development
   */
  private getMockRevisions(documentId: string, reviewId: string): DocumentRevision[] {
    const reviewIdNum = parseInt(reviewId) || 1  // Default to 1 if parsing fails

    // Ensure we have valid numbers
    if (isNaN(reviewIdNum)) {
      console.warn(`Invalid reviewId: ${reviewId}, using default value 1`)
      const fallbackReviewId = 1
      return this.generateMockRevisions(documentId, fallbackReviewId)
    }

    return this.generateMockRevisions(documentId, reviewIdNum)
  }

  private generateMockRevisions(documentId: string, reviewIdNum: number): DocumentRevision[] {
    // Generate different revisions based on review ID
    const baseRevisions: DocumentRevision[] = [
      {
        revisionId: reviewIdNum * 100 + 1,
        reviewId: reviewIdNum,
        documentId,
        userId: 'user1',
        username: 'developer_kim',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        title: 'React Hook 문서 개선 - useEffect 설명 보강',
        description: 'useEffect의 dependency array와 cleanup 함수에 대한 설명을 더 자세히 추가했습니다. 실제 사용 예제도 포함했습니다.',
        content: `# React Hooks 가이드

## useEffect Hook

\`useEffect\`는 React 컴포넌트에서 side effect를 수행할 수 있게 해주는 Hook입니다.

### 기본 사용법

\`\`\`javascript
useEffect(() => {
  // Side effect 수행
  console.log('Component rendered or updated');

  // Cleanup 함수 (optional)
  return () => {
    console.log('Component unmounting or dependencies changed');
  };
}, [/* dependencies */]);
\`\`\`

### Dependency Array

- **빈 배열 []**: 컴포넌트 마운트 시 한 번만 실행
- **값이 있는 배열 [value]**: value가 변경될 때마다 실행
- **배열 생략**: 모든 렌더링마다 실행

### 실제 사용 예제

\`\`\`javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();

        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    }

    fetchUser();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
\`\`\``,
        changes: [
          {
            type: 'added',
            lineNumber: 15,
            content: '### Dependency Array 섹션 추가'
          },
          {
            type: 'added',
            lineNumber: 23,
            content: '### 실제 사용 예제 섹션 추가'
          },
          {
            type: 'modified',
            lineNumber: 8,
            content: '// Cleanup 함수 설명 추가',
            original: '// Cleanup 함수'
          }
        ],
        votes: {
          upvotes: 24,
          downvotes: 2,
          userVote: null
        },
        status: reviewIdNum === 1 ? 'winner' : 'pending',
        comments: [
          {
            commentId: 1,
            userId: 'user5',
            username: 'reviewer_park',
            content: '예제 코드가 매우 실용적이고 이해하기 쉽습니다!',
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        revisionId: reviewIdNum * 100 + 2,
        reviewId: reviewIdNum,
        documentId,
        userId: 'user2',
        username: 'frontend_lee',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'React Hook 문서 수정 - 성능 최적화 내용 추가',
        description: 'useMemo와 useCallback을 활용한 성능 최적화 방법을 추가했습니다.',
        content: `# React Hooks 가이드

## 성능 최적화를 위한 Hooks

### useMemo

\`useMemo\`는 계산 비용이 높은 연산의 결과를 메모이제이션합니다.

\`\`\`javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
\`\`\`

### useCallback

\`useCallback\`은 함수를 메모이제이션하여 불필요한 리렌더링을 방지합니다.

\`\`\`javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
\`\`\``,
        changes: [
          {
            type: 'added',
            lineNumber: 3,
            content: '## 성능 최적화를 위한 Hooks 섹션 추가'
          }
        ],
        votes: {
          upvotes: 15,
          downvotes: 3,
          userVote: null
        },
        status: 'pending',
        comments: []
      },
      {
        revisionId: reviewIdNum * 100 + 3,
        reviewId: reviewIdNum,
        documentId,
        userId: 'user3',
        username: 'senior_choi',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        title: 'React Hook 문서 업데이트 - Custom Hook 패턴',
        description: 'Custom Hook을 작성하는 방법과 베스트 프랙티스를 추가했습니다.',
        content: `# React Hooks 가이드

## Custom Hooks

Custom Hook을 사용하면 컴포넌트 로직을 재사용 가능한 함수로 추출할 수 있습니다.

### Custom Hook 규칙

1. 이름은 반드시 "use"로 시작해야 합니다
2. 다른 Hooks를 호출할 수 있습니다
3. 일반 JavaScript 함수입니다

### 예제: useLocalStorage

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
\`\`\``,
        changes: [
          {
            type: 'added',
            lineNumber: 3,
            content: '## Custom Hooks 섹션 전체 추가'
          }
        ],
        votes: {
          upvotes: 18,
          downvotes: 1,
          userVote: 'up'
        },
        status: 'pending',
        comments: [
          {
            commentId: 2,
            userId: 'user6',
            username: 'junior_kim',
            content: 'Custom Hook 예제가 정말 도움이 됩니다. 실무에서 바로 사용할 수 있을 것 같아요.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            commentId: 3,
            userId: 'user7',
            username: 'tech_lead',
            content: 'error handling 부분도 잘 작성되어 있네요.',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ]

    // Filter based on review status
    if (reviewIdNum === 2) {
      // For in-review, show more recent revisions
      return baseRevisions.map(rev => ({
        ...rev,
        createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      }))
    }

    return baseRevisions
  }

  /**
   * Get review comment types
   * @returns List of available review comment types
   */
  async getReviewCommentTypes(): Promise<ReviewCommentType[]> {
    try {
      const response = await apiClient.get<any>(
        '/api/v1/types/review-comments'
      )
      
      // Handle the response format from API
      const data = response.data
      let types: ReviewCommentType[] = []
      
      // Response is an array with value and description
      if (Array.isArray(data)) {
        types = data.map(item => {
          // Map the API response to our ReviewCommentType format
          const typeMap: Record<string, { name: string, color: string, bgColor: string }> = {
            'INACCURACY': { 
              name: item.description || '부정확한 내용', 
              color: 'text-red-600', 
              bgColor: 'bg-red-50 dark:bg-red-900/20' 
            },
            'NEEDS_IMPROVEMENT': { 
              name: item.description || '개선이 필요한 내용', 
              color: 'text-yellow-600', 
              bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
            }
          }
          
          const mappedType = typeMap[item.value] || {
            name: item.description || item.value,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50 dark:bg-gray-900/20'
          }
          
          return {
            id: item.value,
            name: mappedType.name,
            color: mappedType.color,
            bgColor: mappedType.bgColor
          }
        })
      }
      
      // If we got valid types, return them
      if (types.length > 0) {
        return types
      }
      
      // Otherwise return defaults
      throw new Error('No valid types found in response')
      
    } catch (error) {
      console.warn('Using default comment types due to API error:', error)
      // Return default types if API fails - matching the API's expected format
      return [
        { 
          id: 'INACCURACY', 
          name: '부정확한 내용', 
          color: 'text-red-600', 
          bgColor: 'bg-red-50 dark:bg-red-900/20' 
        },
        { 
          id: 'NEEDS_IMPROVEMENT', 
          name: '개선이 필요한 내용', 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
        }
      ]
    }
  }
}

// Export singleton instance
export const reviewService = new ReviewService()

// Export class for testing
export default ReviewService