'use client'

import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  isVisible: boolean
  message: string
  type: ToastType
  title?: string
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
    duration: 3000,
  })

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'success',
      title?: string,
      duration: number = 3000
    ) => {
      setToast({
        isVisible: true,
        message,
        type,
        title,
        duration,
      })
    },
    []
  )

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'success', title, duration)
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'error', title, duration)
    },
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'warning', title, duration)
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast(message, 'info', title, duration)
    },
    [showToast]
  )

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
