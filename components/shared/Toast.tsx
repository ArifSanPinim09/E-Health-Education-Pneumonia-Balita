'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
  title?: string
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: 'from-[#2F5D50] to-[#274E43]',
    borderColor: 'border-[#2F5D50]/30',
    textColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bgColor: 'from-[#E07A5F] to-[#D06A50]',
    borderColor: 'border-[#E07A5F]/30',
    textColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-300',
    textColor: 'text-white',
  },
  info: {
    icon: Info,
    bgColor: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-300',
    textColor: 'text-white',
  },
}

export default function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
  title,
}: ToastProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full sm:w-auto"
        >
          <div
            className={`bg-gradient-to-r ${config.bgColor} ${config.textColor} rounded-lg shadow-sm border-2 ${config.borderColor} overflow-hidden`}
          >
            <div className="p-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-medium text-base mb-1">{title}</h4>
                )}
                <p className="text-sm leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-1 bg-white/30"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
