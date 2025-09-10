'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer, ToastMessage, ToastType } from '@/components/ui/Toast'

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
  showInfo: (title: string, description?: string) => void
  showWarning: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const showToast = useCallback((
    type: ToastType,
    title: string,
    description?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString()
    const newMessage: ToastMessage = {
      id,
      type,
      title,
      description,
      duration,
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const removeToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    showToast('success', title, description)
  }, [showToast])

  const showError = useCallback((title: string, description?: string) => {
    showToast('error', title, description)
  }, [showToast])

  const showInfo = useCallback((title: string, description?: string) => {
    showToast('info', title, description)
  }, [showToast])

  const showWarning = useCallback((title: string, description?: string) => {
    showToast('warning', title, description)
  }, [showToast])

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <ToastContainer messages={messages} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}