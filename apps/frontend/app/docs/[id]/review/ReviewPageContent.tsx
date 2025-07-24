'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Dropdown from '@/components/ui/Dropdown'
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare,
  Plus,
  Shield,
  X,
  Check
} from 'lucide-react'

// 문서 검증 상태 타입
type VerificationStatus = 'unverified' | 'verifying' | 'verified'

// 검수 의견 타입
interface ReviewComment {
  id: string
  lineStart: number  // 시작 라인
  lineEnd: number    // 끝 라인 (멀티라인 지원)
  content: string
  type: 'accurate' | 'inaccurate' | 'improvement' | 'question'
  author: string
  createdAt: string
  suggestedChange?: string  // 수정 제안 내용 (선택적)
}

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

const commentTypes = {
  accurate: { label: '정확함', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  inaccurate: { label: '부정확함', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  improvement: { label: '개선 필요', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  question: { label: '질문', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
}

interface ReviewPageContentProps {
  doc: Document
  readOnly?: boolean
  initialComments?: ReviewComment[]
}

export default function ReviewPageContent({ doc, readOnly = false, initialComments = [] }: ReviewPageContentProps) {
  const router = useRouter()
  
  const [comments, setComments] = useState<ReviewComment[]>(initialComments)
  const [activeLineComment, setActiveLineComment] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<ReviewComment['type']>('improvement')
  const [suggestedChange, setSuggestedChange] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null)
  
  // 드래그 선택 상태
  const [selectionStart, setSelectionStart] = useState<number | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  
  // Tooltip timeout 관리
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 문서를 라인별로 분할
  const lines = doc.content.split('\n')

  // ESC 키로 선택 취소
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSelecting(false)
        setSelectionStart(null)
        setSelectionEnd(null)
        setActiveLineComment(null)
        setNewComment('')
        setSuggestedChange('')
        setValidationErrors({})
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 의견 창이 열릴 때 제안 내용에 원본 내용 자동 입력
  useEffect(() => {
    if (activeLineComment !== null && (commentType === 'inaccurate' || commentType === 'improvement')) {
      const selectedContent = getSelectedContent()
      if (selectedContent) {
        setSuggestedChange(selectedContent)
        
        // DOM이 업데이트된 후 textarea 높이 자동 조절
        setTimeout(() => {
          const textarea = document.querySelector('[placeholder="어떻게 수정되어야 하는지 구체적으로 작성해주세요."]') as HTMLTextAreaElement
          if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = textarea.scrollHeight + 'px'
          }
        }, 0)
      }
    }
  }, [activeLineComment, commentType])


  const handleAddComment = () => {
    if (selectionStart === null) return

    const errors: {[key: string]: string} = {}
    
    // 필수 항목 검증
    if (!newComment.trim()) {
      errors.comment = '변경 이유를 입력해주세요.'
    }
    
    if ((commentType === 'inaccurate' || commentType === 'improvement') && !suggestedChange.trim()) {
      errors.suggestedChange = '제안 내용을 입력해주세요.'
    }
    
    // 에러가 있으면 표시하고 리턴
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      
      // 첫 번째 에러 필드에 포커스
      if (errors.comment) {
        const textarea = document.querySelector('[placeholder*="변경이 필요한지"]') as HTMLTextAreaElement
        textarea?.focus()
      } else if (errors.suggestedChange) {
        const textarea = document.querySelector('[placeholder*="수정되어야 하는지"]') as HTMLTextAreaElement
        textarea?.focus()
      }
      return
    }

    const comment: ReviewComment = {
      id: Date.now().toString(),
      lineStart: Math.min(selectionStart, selectionEnd || selectionStart),
      lineEnd: Math.max(selectionStart, selectionEnd || selectionStart),
      content: newComment,
      type: commentType,
      author: '검수자',
      createdAt: new Date().toISOString(),
      ...(suggestedChange.trim() && (commentType === 'inaccurate' || commentType === 'improvement') 
        ? { suggestedChange: suggestedChange.trim() } 
        : {})
    }

    setComments([...comments, comment])
    setNewComment('')
    setSuggestedChange('')
    setValidationErrors({})
    setActiveLineComment(null)
    setSelectionStart(null)
    setSelectionEnd(null)
  }

  const getLineComments = (lineNumber: number) => {
    return comments.filter(comment => 
      lineNumber >= comment.lineStart && lineNumber <= comment.lineEnd
    )
  }

  // 드래그 이벤트 핸들러
  const handleMouseDown = (lineNumber: number) => {
    setIsSelecting(true)
    setSelectionStart(lineNumber)
    setSelectionEnd(lineNumber)
    setActiveLineComment(null)
  }

  // 선택 영역 외부 클릭 시 선택 해제 - 일시적으로 비활성화
  // const handleContainerClick = (e: React.MouseEvent) => {
  //   // 라인이나 버튼을 클릭한 경우가 아니면 선택 해제
  //   const target = e.target as HTMLElement
  //   if (!target.closest('[data-line]') && !target.closest('button')) {
  //     setSelectionStart(null)
  //     setSelectionEnd(null)
  //     setActiveLineComment(null)
  //   }
  // }

  const handleMouseMove = (lineNumber: number) => {
    if (isSelecting && selectionStart !== null) {
      setSelectionEnd(lineNumber)
    }
  }

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false)
      // 드래그 완료 - 선택 영역만 유지하고 의견 창은 열지 않음
    }
  }

  // 라인이 선택 영역에 포함되는지 확인
  const isLineInSelection = (lineNumber: number) => {
    if (!selectionStart || !selectionEnd) return false
    const start = Math.min(selectionStart, selectionEnd)
    const end = Math.max(selectionStart, selectionEnd)
    return lineNumber >= start && lineNumber <= end
  }

  // 선택된 라인의 원본 내용 가져오기
  const getSelectedContent = () => {
    if (!selectionStart || !selectionEnd) return ''
    const start = Math.min(selectionStart, selectionEnd) - 1
    const end = Math.max(selectionStart, selectionEnd) - 1
    return lines.slice(start, end + 1).join('\n')
  }

  // 검수 완료하기 핸들러
  const handleSubmitReview = () => {
    // 수정 제안이 있는 comments 확인
    const suggestedChanges = comments.filter(c => c.suggestedChange)
    
    if (suggestedChanges.length === 0) {
      alert('수정 제안이 없습니다. 검수 의견을 작성해주세요.')
      return
    }
    
    // 문서 업데이트 로직
    const updatedContent = applyChangesToDocument(doc.content, suggestedChanges)
    
    // 72시간 후 마감시간 설정
    const verificationDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    
    // TODO: 실제 환경에서는 API 호출로 다음 데이터 전송
    // - documentId: doc.id
    // - reviewComments: comments
    // - updatedContent: updatedContent
    // - status: 'verifying'
    // - verificationDeadline: verificationDeadline
    
    console.log('검수 제출 완료:', {
      documentId: doc.id,
      suggestionsCount: suggestedChanges.length,
      commentsCount: comments.length,
      verificationDeadline,
      reviewer: '검수자' // 실제 사용자 정보로 대체
    })
    
    // 성공 메시지
    alert(`검수가 완료되었습니다.\n${suggestedChanges.length}개의 수정 사항이 제출되었습니다.\n\n문서가 검수 중 상태로 변경되었습니다.\n검수 기간: 72시간`)
    
    // 검수 목록 페이지로 이동
    router.push(`/docs/${doc.id}/reviews`)
  }
  
  // Tooltip 표시 핸들러
  const handleShowTooltip = (commentId: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
    setHoveredCommentId(commentId)
  }
  
  // Tooltip 숨김 핸들러 (지연 포함)
  const handleHideTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setHoveredCommentId(null)
    }, 300)
  }
  
  // 의견 삭제 핸들러
  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId))
  }
  
  // 문서에 변경사항 적용
  const applyChangesToDocument = (content: string, changes: ReviewComment[]) => {
    const lines = content.split('\n')
    
    // 라인 번호 기준으로 역순 정렬 (뒤에서부터 수정)
    const sortedChanges = [...changes].sort((a, b) => b.lineEnd - a.lineEnd)
    
    sortedChanges.forEach(change => {
      if (change.suggestedChange) {
        // 기존 라인 제거하고 새 내용으로 교체
        const suggestionLines = change.suggestedChange.split('\n')
        lines.splice(change.lineStart - 1, change.lineEnd - change.lineStart + 1, ...suggestionLines)
      }
    })
    
    return lines.join('\n')
  }

  // textarea 키보드 단축키 핸들러
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.altKey && e.key === 'Enter') {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b py-4">
          <div className="container">
            <Link
              href={`/docs/${doc.id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              문서로 돌아가기
            </Link>
          </div>
        </section>

        {/* Review Header */}
        <section className="border-b bg-muted/30 py-6">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">문서 검수</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                  <div>작성자: {doc.author}</div>
                </div>
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSubmitReview}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    검수 완료하기
                  </button>
                </div>
              )}
              {readOnly && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">검수 완료</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Review Content */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Document Content */}
              <div className="lg:col-span-3">
                <div className="rounded-lg border bg-background">
                  <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">문서 내용</h2>
                    <p className="text-sm text-muted-foreground">
                      {readOnly ? '검수 완료된 내용입니다.' : '라인을 클릭하거나 여러 라인을 드래그하여 검수 의견을 남길 수 있습니다.'}
                    </p>
                  </div>
                  <div className="p-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <div className="font-mono text-sm">
                      {lines.map((line, index) => {
                        const lineNumber = index + 1
                        const lineComments = getLineComments(lineNumber)
                        const hasComments = lineComments.length > 0
                        const isSelected = isLineInSelection(lineNumber)
                        const isFirstLineOfComment = comments.some(c => c.lineStart === lineNumber)
                        const isLastLineOfComment = comments.some(c => c.lineEnd === lineNumber)
                        
                        // 이 라인에 대한 수정 제안이 있는지 확인
                        const suggestionComment = lineComments.find(c => c.suggestedChange)
                        const hasSuggestion = !!suggestionComment
                        
                        return (
                          <div key={index} className="group relative">
                            <div 
                              data-line={lineNumber}
                              className={`flex transition-colors duration-200 ${
                                isSelected 
                                  ? 'bg-primary/20 dark:bg-primary/30' 
                                  : hasSuggestion
                                    ? 'bg-gray-50 dark:bg-gray-900/20 border-l-2 border-transparent'
                                    : hasComments 
                                      ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-2 border-l-blue-200 dark:border-l-blue-800' 
                                      : 'hover:bg-muted/70'
                              } ${isSelecting ? 'select-none' : ''}`}
                              onMouseDown={() => !readOnly && handleMouseDown(lineNumber)}
                              onMouseMove={() => !readOnly && handleMouseMove(lineNumber)}
                              style={{ cursor: !readOnly && isSelecting ? 'text' : 'default' }}
                            >
                              <div className={`w-14 shrink-0 select-none border-r px-3 py-2 text-xs font-medium text-center transition-colors ${
                                isSelected
                                  ? 'bg-primary/30 dark:bg-primary/40 text-primary dark:text-primary-foreground'
                                  : hasComments 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                    : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'
                              }`}>
                                {lineNumber}
                                {hasComments && !hasSuggestion && !isSelected && (
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5"></div>
                                )}
                              </div>
                              <div className={`flex-1 px-4 py-2 whitespace-pre-wrap ${
                                hasSuggestion ? 'line-through text-gray-500 dark:text-gray-400' : ''
                              }`}>
                                {line || '\u00A0'}
                              </div>
                              {/* + 버튼: 단일 라인 또는 선택 영역의 마지막 라인에 표시 (수정 제안이 없는 경우만) */}
                              {!readOnly && !isSelecting && activeLineComment !== lineNumber && !hasSuggestion && (
                                (selectionStart === null && selectionEnd === null) || // 선택 영역이 없을 때 (단일 라인)
                                (selectionStart !== null && selectionEnd !== null && lineNumber === Math.max(selectionStart, selectionEnd)) // 선택 영역의 마지막 라인
                              ) && (
                                <button
                                  onMouseDown={(e) => e.stopPropagation()} // mouseDown 이벤트 전파 차단
                                  onClick={(e) => {
                                    e.stopPropagation() // 이벤트 버블링 중단
                                    
                                    // 타겟 라인 결정
                                    const targetLine = selectionStart !== null 
                                      ? Math.max(selectionStart, selectionEnd || selectionStart)
                                      : lineNumber
                                    
                                    if (selectionStart === null) {
                                      // 단일 라인 선택
                                      setSelectionStart(lineNumber)
                                      setSelectionEnd(lineNumber)
                                    }
                                    
                                    // 의견 창 열기
                                    setActiveLineComment(targetLine)
                                  }}
                                  className={`${
                                    selectionStart !== null ? 'visible' : 'invisible group-hover:visible'
                                  } absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-200 hover:scale-105`}
                                  title="의견 추가"
                                >
                                  <Plus className="h-4 w-4 text-primary" />
                                </button>
                              )}
                            </div>
                            
                            {/* 수정 제안이 있는 경우 초록색 라인으로 표시 - 마지막 라인 아래에 표시 */}
                            {hasSuggestion && suggestionComment && isLastLineOfComment && (
                              <div className="relative">
                                <div 
                                  className="flex bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors group"
                                  onMouseEnter={() => handleShowTooltip(suggestionComment.id)}
                                  onMouseLeave={handleHideTooltip}
                                >
                                  <div className="w-14 shrink-0 select-none border-r px-3 py-2 text-xs font-medium text-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                                    +
                                  </div>
                                  <div className="flex-1 px-4 py-2 whitespace-pre-wrap text-green-700 dark:text-green-300 font-mono text-sm">
                                    {suggestionComment.suggestedChange}
                                  </div>
                                  {!readOnly && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteComment(suggestionComment.id)
                                      }}
                                      className="invisible group-hover:visible px-2 py-1 m-1 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 transition-all"
                                      title="의견 삭제"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                
                                {/* Hover Tooltip */}
                                {hoveredCommentId === suggestionComment.id && (
                                  <div 
                                    className="absolute z-20 top-1/2 left-full transform -translate-y-1/2 ml-4"
                                    onMouseEnter={() => handleShowTooltip(suggestionComment.id)}
                                    onMouseLeave={handleHideTooltip}
                                  >
                                    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg border p-3 min-w-[250px] max-w-[400px]">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${commentTypes[suggestionComment.type].bg} ${commentTypes[suggestionComment.type].color}`}>
                                            {suggestionComment.author.charAt(0)}
                                          </div>
                                          <span className="text-sm font-medium">{suggestionComment.author}</span>
                                          <span className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${commentTypes[suggestionComment.type].bg} ${commentTypes[suggestionComment.type].color}`}>
                                            {commentTypes[suggestionComment.type].label}
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          <div className="font-medium text-muted-foreground mb-1">변경 이유:</div>
                                          <div className="text-foreground">{suggestionComment.content}</div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(suggestionComment.createdAt).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* 새 코멘트 입력 - 선택 영역의 마지막 라인에 표시 */}
                            {activeLineComment === lineNumber && (
                              <div className="ml-14 mr-12 my-3">
                                <div className="rounded-lg border border-primary/20 bg-background shadow-lg p-4 animate-in slide-in-from-top-2 duration-200">
                                  <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">새 검수 의견</span>
                                    <div className="ml-auto">
                                      <span className="text-xs text-muted-foreground">
                                        {selectionStart === selectionEnd 
                                          ? `라인 ${selectionStart}`
                                          : `라인 ${Math.min(selectionStart!, selectionEnd || selectionStart!)}-${Math.max(selectionStart!, selectionEnd || selectionStart!)}`
                                        }
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-semibold text-foreground mb-2 block">의견 유형</label>
                                      <div className="flex items-center gap-2">
                                        <Dropdown
                                          value={commentType}
                                          onChange={(value) => setCommentType(value as ReviewComment['type'])}
                                          options={Object.entries(commentTypes).map(([key, type]) => ({
                                            value: key,
                                            label: type.label
                                          }))}
                                        />
                                        <div className={`px-2 py-1 rounded text-xs font-semibold ${commentTypes[commentType].bg} ${commentTypes[commentType].color}`}>
                                          {commentTypes[commentType].label}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-semibold text-foreground mb-2 block">
                                        변경 이유 <span className="text-red-500">*</span>
                                      </label>
                                      <textarea
                                        value={newComment}
                                        onChange={(e) => {
                                          setNewComment(e.target.value)
                                          if (validationErrors.comment) {
                                            setValidationErrors(prev => {
                                              const next = {...prev}
                                              delete next.comment
                                              return next
                                            })
                                          }
                                        }}
                                        onKeyDown={handleTextareaKeyDown}
                                        onInput={(e) => {
                                          const target = e.currentTarget
                                          target.style.height = 'auto'
                                          target.style.height = target.scrollHeight + 'px'
                                        }}
                                        placeholder="왜 변경이 필요한지 구체적으로 설명해주세요. 예: 'React 19의 새로운 Server Components 패턴을 사용하면 성능이 향상됩니다.'"
                                        className={`w-full rounded-md border ${validationErrors.comment ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/70 min-h-[100px] overflow-hidden`}
                                        style={{ height: 'auto' }}
                                        autoFocus
                                      />
                                      {validationErrors.comment && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.comment}</p>
                                      )}
                                      <div className="mt-1 flex justify-between items-center">
                                        <div className="text-xs text-muted-foreground">
                                          {newComment.length} / 500자
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* 수정 제안 입력 - 부정확함 또는 개선 필요일 때만 표시 */}
                                    {(commentType === 'inaccurate' || commentType === 'improvement') && (
                                      <div className="space-y-3">
                                        <div>
                                          <label className="text-sm font-semibold text-foreground mb-2 block">수정 제안</label>
                                          <div className="space-y-4">
                                            {/* 원본 내용 */}
                                            <div>
                                              <label className="text-sm font-semibold text-foreground mb-2 block">원본 내용</label>
                                              <pre className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono whitespace-pre-wrap break-words">
                                                {getSelectedContent() || '선택된 라인 없음'}
                                              </pre>
                                            </div>
                                            
                                            {/* 수정 제안 입력 */}
                                            <div>
                                              <label className="text-sm font-semibold text-foreground mb-2 block">
                                                제안 내용 <span className="text-red-500">*</span>
                                              </label>
                                              <textarea
                                                value={suggestedChange}
                                                onChange={(e) => {
                                                  setSuggestedChange(e.target.value)
                                                  if (validationErrors.suggestedChange) {
                                                    setValidationErrors(prev => {
                                                      const next = {...prev}
                                                      delete next.suggestedChange
                                                      return next
                                                    })
                                                  }
                                                }}
                                                onKeyDown={handleTextareaKeyDown}
                                                onInput={(e) => {
                                                  const target = e.currentTarget
                                                  target.style.height = 'auto'
                                                  target.style.height = target.scrollHeight + 'px'
                                                }}
                                                placeholder="어떻게 수정되어야 하는지 구체적으로 작성해주세요."
                                                className={`w-full rounded-md border ${validationErrors.suggestedChange ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/70 min-h-[100px] overflow-hidden`}
                                                style={{ height: 'auto' }}
                                              />
                                              {validationErrors.suggestedChange && (
                                                <p className="mt-1 text-xs text-red-500">{validationErrors.suggestedChange}</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="flex flex-col gap-2">
                                      <div className="text-xs text-muted-foreground text-center">
                                        Alt + Enter: 의견 추가, ESC: 취소
                                      </div>
                                      <div className="flex items-center justify-between pt-2 border-t">
                                      <button
                                        onClick={() => {
                                          setActiveLineComment(null)
                                          setSelectionStart(null)
                                          setSelectionEnd(null)
                                          setNewComment('')
                                          setSuggestedChange('')
                                          setValidationErrors({})
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border border-muted-foreground/20 rounded-md hover:bg-muted hover:text-foreground transition-all duration-200"
                                      >
                                        <X className="h-4 w-4" />
                                        취소
                                      </button>
                                      <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                                      >
                                        의견 추가
                                      </button>
                                    </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border bg-background p-6">
                  <h3 className="text-lg font-semibold mb-4">검수 요약</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">총 의견 수</p>
                      <p className="text-2xl font-bold">{comments.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">수정 제안</p>
                      <p className="text-2xl font-bold text-primary">{comments.filter(c => c.suggestedChange).length}</p>
                    </div>
                    
                    {Object.entries(commentTypes).map(([key, type]) => {
                      const count = comments.filter(c => c.type === key).length
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className={`text-sm ${type.color}`}>{type.label}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      )
                    })}
                    
                    {!readOnly && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          수정 제안을 작성한 후 &apos;검수 완료하기&apos; 버튼을 클릭하세요.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}