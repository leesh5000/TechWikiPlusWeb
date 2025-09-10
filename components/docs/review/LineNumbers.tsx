'use client'

import { memo } from 'react'
import { Plus } from 'lucide-react'

interface LineNumbersProps {
  lineCount: number
  selectedLines: { start: number; end: number } | null
  hoveredLine: number | null
  hasComments: Set<number>
  hasSuggestions: Set<number>
  onLineClick: (lineNumber: number) => void
  onAddComment: (lineNumber: number) => void
  readOnly?: boolean
}

const LineNumbers = memo(function LineNumbers({
  lineCount,
  selectedLines,
  hoveredLine,
  hasComments,
  hasSuggestions,
  onLineClick,
  onAddComment,
  readOnly = false
}: LineNumbersProps) {
  return (
    <div className="select-none pr-4 text-right text-xs text-muted-foreground">
      {Array.from({ length: lineCount }, (_, i) => i + 1).map((lineNumber) => {
        const isSelected = selectedLines && 
          lineNumber >= selectedLines.start && 
          lineNumber <= selectedLines.end
        const isHovered = hoveredLine === lineNumber
        const hasComment = hasComments.has(lineNumber)
        const hasSuggestion = hasSuggestions.has(lineNumber)
        const showAddButton = !readOnly && isHovered && !hasComment && !hasSuggestion

        return (
          <div
            key={lineNumber}
            className={`relative h-6 flex items-center justify-end pr-2 ${
              isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''
            }`}
            onClick={() => !readOnly && onLineClick(lineNumber)}
          >
            <span className="mr-2">{lineNumber}</span>
            {hasComment && !hasSuggestion && (
              <span className="absolute left-0 h-2 w-2 rounded-full bg-blue-500" />
            )}
            {showAddButton && (
              <button
                className="absolute -right-6 flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddComment(lineNumber)
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
})

export default LineNumbers