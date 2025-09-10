'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface SearchHighlightProps {
  text: string
  searchQuery: string
  className?: string
  highlightClassName?: string
}

export default function SearchHighlight({
  text,
  searchQuery,
  className,
  highlightClassName = "bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 px-0.5 rounded"
}: SearchHighlightProps) {
  const highlightedText = useMemo(() => {
    if (!searchQuery.trim()) {
      return text
    }

    // 특수 문자 이스케이프 및 대소문자 무시 검색
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className={cn(highlightClassName)}
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }, [text, searchQuery, highlightClassName])

  return <span className={className}>{highlightedText}</span>
}