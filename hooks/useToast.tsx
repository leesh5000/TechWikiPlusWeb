'use client'

import { useState, useCallback } from 'react'
import { ToastMessage, ToastType } from '@/components/ui/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((
    title: string,
    type: ToastType = 'info',
    description?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString()
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      duration
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return {
    toasts,
    showToast,
    removeToast
  }
}