'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { X } from 'lucide-react'
import { COMMENT_TYPES } from '@/lib/constants'

interface CommentDialogProps {
  isOpen: boolean
  selectedLines: { start: number; end: number }
  selectedContent: string
  onClose: () => void
  onSubmit: (type: string, comment: string, suggestion?: string) => void
}

const CommentDialog = memo(function CommentDialog({
  isOpen,
  selectedLines,
  selectedContent,
  onClose,
  onSubmit
}: CommentDialogProps) {
  const [commentType, setCommentType] = useState('개선')
  const [comment, setComment] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const suggestionRef = useRef<HTMLTextAreaElement>(null)

  // 자동 높이 조절 함수
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }

  // 의견 유형 변경 시 제안 내용 표시 여부 결정
  useEffect(() => {
    setShowSuggestion(commentType === '개선' || commentType === '오류')
    if (commentType === '개선' || commentType === '오류') {
      setSuggestion(selectedContent)
    }
  }, [commentType, selectedContent])

  // 제안 내용 초기 높이 조절
  useEffect(() => {
    if (showSuggestion && suggestionRef.current) {
      adjustHeight(suggestionRef.current)
    }
  }, [showSuggestion, suggestion])

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Alt + Enter: 의견 추가
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      // ESC: 취소
      else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, comment, commentType, suggestion, showSuggestion])

  const handleSubmit = () => {
    if (!comment.trim()) return
    onSubmit(commentType, comment, showSuggestion ? suggestion : undefined)
    // 상태 초기화
    setComment('')
    setSuggestion('')
    setCommentType('개선')
  }

  if (!isOpen) return null

  return (
    <div 
      ref={dialogRef}
      className="absolute z-50 w-96 rounded-lg border bg-background shadow-lg"
      style={{
        top: `${(selectedLines.end + 1) * 24}px`,
        left: '50px'
      }}
    >
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">새 검수 의견</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 의견 유형 */}
        <div>
          <label className="block text-sm font-medium mb-2">의견 유형</label>
          <select
            value={commentType}
            onChange={(e) => setCommentType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {COMMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* 변경 이유 */}
        <div>
          <label className="block text-sm font-medium mb-2">변경 이유</label>
          <textarea
            ref={commentRef}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              adjustHeight(e.target)
            }}
            onInput={(e) => adjustHeight(e.currentTarget)}
            placeholder="변경이 필요한 이유를 설명해주세요"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none overflow-hidden"
            style={{ minHeight: '80px' }}
          />
        </div>

        {/* 수정 제안 */}
        {showSuggestion && (
          <div>
            <h4 className="text-sm font-medium mb-2">수정 제안</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">원본 내용</label>
                <div className="rounded-md border bg-muted/50 p-2 text-sm max-h-24 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-xs">{selectedContent}</pre>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">제안 내용</label>
                <textarea
                  ref={suggestionRef}
                  value={suggestion}
                  onChange={(e) => {
                    setSuggestion(e.target.value)
                    adjustHeight(e.target)
                  }}
                  onInput={(e) => adjustHeight(e.currentTarget)}
                  placeholder="수정된 내용을 입력해주세요"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none overflow-hidden"
                  style={{ minHeight: '60px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 키보드 단축키 안내 */}
        <div className="text-xs text-muted-foreground">
          Alt + Enter: 의견 추가, ESC: 취소
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            의견 추가
          </button>
        </div>
      </div>
    </div>
  )
})

export default CommentDialog