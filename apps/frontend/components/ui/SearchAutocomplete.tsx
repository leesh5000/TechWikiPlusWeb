'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Clock, TrendingUp, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchSuggestion {
  id: string
  type: 'recent' | 'trending' | 'category' | 'document'
  text: string
  category?: string
  count?: number
}

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: SearchSuggestion) => void
  placeholder?: string
  suggestions?: SearchSuggestion[]
  className?: string
  disabled?: boolean
}

// Mock 데이터 - 실제로는 API에서 가져옴
const mockSuggestions: SearchSuggestion[] = [
  { id: '1', type: 'recent', text: 'React 19' },
  { id: '2', type: 'recent', text: 'TypeScript 마이그레이션' },
  { id: '3', type: 'trending', text: 'Next.js 15', count: 156 },
  { id: '4', type: 'trending', text: 'Server Components', count: 89 },
  { id: '5', type: 'category', text: 'DevOps', category: 'DevOps' },
  { id: '6', type: 'category', text: 'React', category: 'React' },
  { id: '7', type: 'document', text: 'Kubernetes 보안 모범 사례', category: 'DevOps' },
  { id: '8', type: 'document', text: 'GraphQL vs REST', category: 'API' }
]

export default function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "검색...",
  suggestions = mockSuggestions,
  className,
  disabled = false
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // 검색어에 따른 필터링된 제안사항
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 8) // 최대 8개만 표시

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredSuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0) {
            handleSelectSuggestion(filteredSuggestions[highlightedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setHighlightedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, highlightedIndex, filteredSuggestions])

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(newValue.length > 0)
    setHighlightedIndex(-1)
  }

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSelect?.(suggestion)
    inputRef.current?.blur()
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'category':
        return <Hash className="h-4 w-4 text-blue-500" />
      case 'document':
        return <Search className="h-4 w-4 text-green-500" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return '최근 검색'
      case 'trending':
        return '인기 검색'
      case 'category':
        return '카테고리'
      case 'document':
        return '문서'
      default:
        return ''
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-card dark:focus-visible:ring-primary/50"
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          <ul
            ref={listRef}
            className="py-2"
            role="listbox"
            aria-label="검색 제안사항"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li key={suggestion.id}>
                <button
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    highlightedIndex === index && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  role="option"
                  aria-selected={highlightedIndex === index}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{suggestion.text}</span>
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count}회
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getSuggestionLabel(suggestion.type)}</span>
                      {suggestion.category && (
                        <>
                          <span>·</span>
                          <span>{suggestion.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}