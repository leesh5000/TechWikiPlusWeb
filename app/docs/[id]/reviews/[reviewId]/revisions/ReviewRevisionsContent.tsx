'use client'

import React, { useState } from 'react'
import { DocumentRevision } from '@/lib/types/review.types'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trophy,
  Clock,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Plus,
  Minus,
  Edit2
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ReviewRevisionsContentProps {
  revisions: DocumentRevision[]
  documentId: string
  reviewId: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}일 전`
  if (diffHours > 0) return `${diffHours}시간 전`
  if (diffMins > 0) return `${diffMins}분 전`
  return '방금 전'
}

export default function ReviewRevisionsContent({
  revisions,
  documentId,
  reviewId
}: ReviewRevisionsContentProps) {
  const [expandedRevisions, setExpandedRevisions] = useState<Set<number>>(new Set())
  const [showChanges, setShowChanges] = useState<Set<number>>(new Set())
  const [isDarkMode, setIsDarkMode] = useState(false)

  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

  const toggleRevisionExpanded = (revisionId: number) => {
    setExpandedRevisions(prev => {
      const next = new Set(prev)
      if (next.has(revisionId)) {
        next.delete(revisionId)
      } else {
        next.add(revisionId)
      }
      return next
    })
  }

  const toggleShowChanges = (revisionId: number) => {
    setShowChanges(prev => {
      const next = new Set(prev)
      if (next.has(revisionId)) {
        next.delete(revisionId)
      } else {
        next.add(revisionId)
      }
      return next
    })
  }

  const handleVote = (revisionId: number, voteType: 'up' | 'down') => {
    console.log(`Vote ${voteType} on revision ${revisionId}`)
    // TODO: Implement vote API call
  }

  const getStatusBadge = (status: DocumentRevision['status']) => {
    switch (status) {
      case 'winner':
        return {
          label: '채택됨',
          className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: Trophy
        }
      case 'approved':
        return {
          label: '승인됨',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: ChevronUp
        }
      case 'rejected':
        return {
          label: '거부됨',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: ChevronDown
        }
      default:
        return {
          label: '검토 중',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: Clock
        }
    }
  }

  const getChangeIcon = (type: 'added' | 'removed' | 'modified') => {
    switch (type) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'removed':
        return <Minus className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'modified':
        return <Edit2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    }
  }

  if (revisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">아직 제출된 수정본이 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          이 리뷰에 대한 문서 수정본이 아직 제출되지 않았습니다.
        </p>
      </div>
    )
  }

  // Sort revisions: winner first, then by votes, then by date
  const sortedRevisions = [...revisions].sort((a, b) => {
    if (a.status === 'winner' && b.status !== 'winner') return -1
    if (b.status === 'winner' && a.status !== 'winner') return 1

    const aScore = a.votes.upvotes - a.votes.downvotes
    const bScore = b.votes.upvotes - b.votes.downvotes
    if (aScore !== bScore) return bScore - aScore

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-6">
      {sortedRevisions.map((revision) => {
        const isExpanded = expandedRevisions.has(revision.revisionId)
        const showingChanges = showChanges.has(revision.revisionId)
        const statusInfo = getStatusBadge(revision.status)
        const StatusIcon = statusInfo.icon

        return (
          <div
            key={revision.revisionId}
            className={`rounded-lg border ${
              revision.status === 'winner'
                ? 'border-green-500 dark:border-green-600 shadow-lg'
                : 'border-border dark:border-border/70'
            } bg-card overflow-hidden`}
          >
            {/* Header */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{revision.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                        statusInfo.className
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">
                    {revision.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{revision.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatRelativeTime(revision.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote and Action Buttons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(revision.revisionId, 'up')}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${
                      revision.votes.userVote === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{revision.votes.upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleVote(revision.revisionId, 'down')}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${
                      revision.votes.userVote === 'down'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm font-medium">{revision.votes.downvotes}</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleShowChanges(revision.revisionId)}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  <GitBranch className="h-4 w-4" />
                  <span>{showingChanges ? '내용 보기' : '변경사항 보기'}</span>
                </button>

                <button
                  onClick={() => toggleRevisionExpanded(revision.revisionId)}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>접기</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>펼치기</span>
                    </>
                  )}
                </button>

                {revision.comments.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{revision.comments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border dark:border-border/70">
                {/* Changes or Content */}
                {showingChanges ? (
                  <div className="p-6">
                    <h4 className="mb-4 text-sm font-semibold">변경사항</h4>
                    <div className="space-y-2">
                      {revision.changes.map((change, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-md bg-muted/30 p-3"
                        >
                          {getChangeIcon(change.type)}
                          <div className="flex-1">
                            <div className="mb-1 text-xs text-muted-foreground">
                              Line {change.lineNumber}
                            </div>
                            {change.type === 'modified' && change.original && (
                              <div className="mb-2">
                                <span className="text-xs text-muted-foreground">원본:</span>
                                <div className="mt-1 rounded bg-red-50 dark:bg-red-900/10 p-2 text-sm line-through text-red-700 dark:text-red-400">
                                  {change.original}
                                </div>
                              </div>
                            )}
                            <div>
                              <span className="text-xs text-muted-foreground">
                                {change.type === 'added' ? '추가:' : change.type === 'removed' ? '삭제:' : '변경:'}
                              </span>
                              <div className={`mt-1 rounded p-2 text-sm ${
                                change.type === 'added'
                                  ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400'
                                  : change.type === 'removed'
                                  ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'
                                  : 'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400'
                              }`}>
                                {change.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={isDarkMode ? vscDarkPlus : vs}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {revision.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {revision.comments.length > 0 && (
                  <div className="border-t border-border dark:border-border/70 bg-muted/10 p-6">
                    <h4 className="mb-4 text-sm font-semibold">댓글 ({revision.comments.length})</h4>
                    <div className="space-y-3">
                      {revision.comments.map((comment) => (
                        <div
                          key={comment.commentId}
                          className="rounded-md bg-background p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-3.5 w-3.5" />
                              <span className="font-medium">{comment.username}</span>
                              <span className="text-muted-foreground">
                                · {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}