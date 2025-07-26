'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  message: ToastMessage
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
}

export function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const Icon = toastIcons[message.type]

  useEffect(() => {
    // 마운트 시 애니메이션
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // 자동 닫기
    if (message.duration) {
      const timer = setTimeout(() => {
        handleClose()
      }, message.duration)

      return () => clearTimeout(timer)
    }
  }, [message.duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(message.id)
    }, 300) // 애니메이션 시간과 맞춤
  }

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        toastStyles[message.type],
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{message.title}</p>
            {message.description && (
              <p className="mt-1 text-sm opacity-90">{message.description}</p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
              onClick={handleClose}
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  messages: ToastMessage[]
  onClose: (id: string) => void
}

export function ToastContainer({ messages, onClose }: ToastContainerProps) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {messages.map((message) => (
          <Toast key={message.id} message={message} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}