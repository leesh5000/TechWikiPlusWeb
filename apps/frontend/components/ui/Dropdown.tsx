'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  className?: string
}

export default function Dropdown({ value, options, onChange, className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 선택된 옵션의 라벨 찾기
  const selectedOption = options.find(opt => opt.value === value)
  const selectedLabel = selectedOption ? selectedOption.label : options[0]?.label || ''

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 rounded-md border border-input dark:border-input/70 bg-background dark:bg-card px-3 py-2 text-sm text-foreground hover:bg-accent dark:hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-primary/50 transition-colors"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 z-10 mt-1 w-full min-w-[160px] -translate-x-1/2 rounded-md border border-input dark:border-input/70 bg-background dark:bg-card shadow-md dark:shadow-primary/5">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent dark:hover:bg-accent transition-colors ${
                  value === option.value ? 'bg-accent dark:bg-accent' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}