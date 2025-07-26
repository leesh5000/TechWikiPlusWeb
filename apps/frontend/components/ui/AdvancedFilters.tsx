'use client'

import { useState } from 'react'
import { 
  SlidersHorizontal, 
  X, 
  Calendar,
  Eye,
  TrendingUp,
  CheckCircle,
  Timer,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import Dropdown from './Dropdown'

export interface FilterState {
  categories: string[]
  verificationStatus: string[]
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  minViews: number
  sortBy: string
}

interface AdvancedFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
  categories?: string[]
  className?: string
}

const verificationOptions = [
  { 
    value: 'verified', 
    label: '검증됨', 
    icon: CheckCircle, 
    color: 'text-green-600 dark:text-green-400' 
  },
  { 
    value: 'verifying', 
    label: '검증 중', 
    icon: Timer, 
    color: 'text-blue-600 dark:text-blue-400' 
  },
  { 
    value: 'unverified', 
    label: '미검증', 
    icon: AlertCircle, 
    color: 'text-gray-600 dark:text-gray-400' 
  }
]

const dateRangeOptions = [
  { value: 'all', label: '전체 기간' },
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'year', label: '올해' }
]

const sortOptions = [
  { value: 'latest', label: '최신순', icon: Calendar },
  { value: 'popular', label: '인기순', icon: TrendingUp },
  { value: 'views', label: '조회수순', icon: Eye }
]

const viewsRanges = [
  { value: 0, label: '전체' },
  { value: 100, label: '100회 이상' },
  { value: 500, label: '500회 이상' },
  { value: 1000, label: '1,000회 이상' },
  { value: 5000, label: '5,000회 이상' }
]

export default function AdvancedFilters({
  filters,
  onChange,
  onReset,
  categories = [],
  className
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    updateFilter('categories', newCategories)
  }

  const toggleVerificationStatus = (status: string) => {
    const newStatuses = filters.verificationStatus.includes(status)
      ? filters.verificationStatus.filter(s => s !== status)
      : [...filters.verificationStatus, status]
    updateFilter('verificationStatus', newStatuses)
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.verificationStatus.length > 0 ||
    filters.dateRange !== 'all' ||
    filters.minViews > 0

  return (
    <div className={cn("border-b bg-muted/30 dark:bg-muted/10", className)}>
      <div className="container py-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              고급 필터
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {filters.categories.length + filters.verificationStatus.length + 
                   (filters.dateRange !== 'all' ? 1 : 0) + 
                   (filters.minViews > 0 ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                초기화
              </Button>
            )}
          </div>

          {/* Quick Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">정렬:</span>
            <Dropdown
              value={filters.sortBy}
              onChange={(value) => updateFilter('sortBy', value)}
              options={sortOptions.map(option => ({
                value: option.value,
                label: option.label
              }))}
            />
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="mt-4 space-y-6 border-t pt-4">
            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold">카테고리</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        filters.categories.includes(category)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">검증 상태</h3>
              <div className="flex flex-wrap gap-2">
                {verificationOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = filters.verificationStatus.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleVerificationStatus(option.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date Range & Views */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold">작성일</h3>
                <Dropdown
                  value={filters.dateRange}
                  onChange={(value) => updateFilter('dateRange', value)}
                  options={dateRangeOptions}
                />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">최소 조회수</h3>
                <Dropdown
                  value={filters.minViews.toString()}
                  onChange={(value) => updateFilter('minViews', parseInt(value, 10))}
                  options={viewsRanges.map(range => ({
                    value: range.value.toString(),
                    label: range.label
                  }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}