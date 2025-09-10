'use client'

import { memo } from 'react'
import { X, Edit3, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react'

interface ReviewComment {
  id: string
  lineStart: number
  lineEnd: number
  type: string
  comment: string
  author: string
  createdAt: Date
  suggestion?: string
}

interface CommentTooltipProps {
  comment: ReviewComment
  isVisible: boolean
  position: { top: number; left: number }
  onDelete: () => void
  readOnly?: boolean
}

const getCommentIcon = (type: string) => {
  switch (type) {
    case '개선':
      return <Edit3 className="h-4 w-4" />
    case '오류':
      return <AlertCircle className="h-4 w-4" />
    case '질문':
      return <HelpCircle className="h-4 w-4" />
    case '제안':
      return <Lightbulb className="h-4 w-4" />
    default:
      return <Edit3 className="h-4 w-4" />
  }
}

const CommentTooltip = memo(function CommentTooltip({
  comment,
  isVisible,
  position,
  onDelete,
  readOnly = false
}: CommentTooltipProps) {
  if (!isVisible) return null

  return (
    <div
      className="absolute z-50 w-80 rounded-lg border bg-background shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getCommentIcon(comment.type)}
            <span className="font-medium text-sm">{comment.type}</span>
          </div>
          {!readOnly && (
            <button
              onClick={onDelete}
              className="rounded p-1 hover:bg-accent"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{comment.comment}</p>
        
        {comment.suggestion && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">제안 내용:</p>
            <pre className="text-xs bg-muted/50 p-2 rounded whitespace-pre-wrap">
              {comment.suggestion}
            </pre>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{comment.author}</span>
          <span>{comment.createdAt.toLocaleString('ko-KR')}</span>
        </div>
      </div>
    </div>
  )
})

export default CommentTooltip