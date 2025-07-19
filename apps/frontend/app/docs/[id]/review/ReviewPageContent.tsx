'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Dropdown from '@/components/ui/Dropdown'
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare,
  Plus,
  Shield,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

// 문서 검증 상태 타입
type VerificationStatus = 'unverified' | 'verifying' | 'verified'

// 검수 의견 타입
interface ReviewComment {
  id: string
  lineNumber: number
  content: string
  type: 'accurate' | 'inaccurate' | 'improvement' | 'question'
  author: string
  createdAt: string
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
}

const commentTypes = {
  accurate: { label: '정확함', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  inaccurate: { label: '부정확함', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  improvement: { label: '개선 필요', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  question: { label: '질문', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
}

interface ReviewPageContentProps {
  doc: Document
}

export default function ReviewPageContent({ doc }: ReviewPageContentProps) {
  const [comments, setComments] = useState<ReviewComment[]>([])
  const [activeLineComment, setActiveLineComment] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<ReviewComment['type']>('improvement')

  // 문서를 라인별로 분할
  const lines = doc.content.split('\n')

  const handleAddComment = (lineNumber: number) => {
    if (!newComment.trim()) return

    const comment: ReviewComment = {
      id: Date.now().toString(),
      lineNumber,
      content: newComment,
      type: commentType,
      author: '검수자',
      createdAt: new Date().toISOString()
    }

    setComments([...comments, comment])
    setNewComment('')
    setActiveLineComment(null)
  }

  const getLineComments = (lineNumber: number) => {
    return comments.filter(comment => comment.lineNumber === lineNumber)
  }

  const handleCompleteReview = (approved: boolean) => {
    // 검수 완료 로직 구현
    alert(approved ? '문서가 승인되었습니다!' : '문서가 거부되었습니다.')
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
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCompleteReview(false)}
                  className="flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <ThumbsDown className="h-4 w-4" />
                  거부
                </button>
                <button 
                  onClick={() => handleCompleteReview(true)}
                  className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  <ThumbsUp className="h-4 w-4" />
                  승인
                </button>
              </div>
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
                      각 라인을 클릭하여 검수 의견을 남길 수 있습니다.
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-sm">
                      {lines.map((line, index) => {
                        const lineNumber = index + 1
                        const lineComments = getLineComments(lineNumber)
                        const hasComments = lineComments.length > 0
                        
                        return (
                          <div key={index} className="group relative">
                            <div className={`flex transition-colors duration-200 hover:bg-muted/70 ${hasComments ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-2 border-l-blue-200 dark:border-l-blue-800' : ''}`}>
                              <div className={`w-14 shrink-0 select-none border-r px-3 py-2 text-xs font-medium text-center transition-colors ${hasComments ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}>
                                {lineNumber}
                                {hasComments && (
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-0.5"></div>
                                )}
                              </div>
                              <div className="flex-1 px-4 py-2 whitespace-pre-wrap">
                                {line || '\u00A0'}
                              </div>
                              {activeLineComment !== lineNumber && (
                                <button
                                  onClick={() => setActiveLineComment(lineNumber)}
                                  className="invisible group-hover:visible absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-200 hover:scale-105"
                                  title="의견 추가"
                                >
                                  <Plus className="h-4 w-4 text-primary" />
                                </button>
                              )}
                            </div>
                            
                            {/* 기존 코멘트 표시 */}
                            {lineComments.map((comment, commentIndex) => (
                              <div key={comment.id} className="ml-14 mr-4 my-2">
                                <div className={`rounded-lg border-l-4 bg-background/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-200 ${commentTypes[comment.type].bg} border-l-current`}>
                                  <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${commentTypes[comment.type].bg} ${commentTypes[comment.type].color}`}>
                                      {comment.author.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${commentTypes[comment.type].bg} ${commentTypes[comment.type].color}`}>
                                          <MessageSquare className="h-3 w-3" />
                                          {commentTypes[comment.type].label}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium">{comment.author}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                        {commentIndex === 0 && lineComments.length > 1 && (
                                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            +{lineComments.length - 1}개 의견
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* 새 코멘트 입력 */}
                            {activeLineComment === lineNumber && (
                              <div className="ml-14 mr-12 my-3">
                                <div className="rounded-lg border border-primary/20 bg-background shadow-lg p-4 animate-in slide-in-from-top-2 duration-200">
                                  <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-primary">새 검수 의견</span>
                                    <div className="ml-auto">
                                      <span className="text-xs text-muted-foreground">라인 {lineNumber}</span>
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
                                      <label className="text-sm font-semibold text-foreground mb-2 block">의견 내용</label>
                                      <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="구체적이고 건설적인 검수 의견을 입력해주세요. 예: '이 부분은 React 18 문법이 아닌 React 19 문법으로 수정이 필요합니다.'"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/70"
                                        rows={4}
                                        autoFocus
                                      />
                                      <div className="mt-1 flex justify-between items-center">
                                        <div className="text-xs text-muted-foreground">
                                          {newComment.length} / 500자
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          Shift + Enter로 줄바꿈
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t">
                                      <button
                                        onClick={() => setActiveLineComment(null)}
                                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        취소
                                      </button>
                                      <button
                                        onClick={() => handleAddComment(lineNumber)}
                                        disabled={!newComment.trim()}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                                      >
                                        의견 추가
                                      </button>
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
                    
                    {Object.entries(commentTypes).map(([key, type]) => {
                      const count = comments.filter(c => c.type === key).length
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className={`text-sm ${type.color}`}>{type.label}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      )
                    })}
                    
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        모든 검수를 완료한 후 승인 또는 거부를 선택하세요.
                      </p>
                    </div>
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