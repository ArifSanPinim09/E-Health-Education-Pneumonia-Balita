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
    bgColor: 'from-[#58CC02] to-[#58A700]',
    borderColor: 'border-[#58CC02]/30',
    textColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bgColor: 'from-[#FF4B4B] to-[#CC0000]',
    borderColor: 'border-red-300',
    textColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'from-[#FF9600] to-[#FF7A00]',
    borderColor: 'border-[#FF9600]/30',
    textColor: 'text-white',
  },
  info: {
    icon: Info,
    bgColor: 'from-[#1CB0F6] to-[#1890D6]',
    borderColor: 'border-[#1CB0F6]/30',
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
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full sm:w-auto"
        >
          <div
            className={`bg-gradient-to-r ${config.bgColor} ${config.textColor} rounded-2xl shadow-2xl border-2 ${config.borderColor} overflow-hidden`}
          >
            <div className="p-5 flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex-shrink-0 bg-white/20 rounded-full p-2"
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="font-bold text-lg mb-1">{title}</h4>
                )}
                <p className="text-sm leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white/20 rounded-full p-1.5 transition-colors"
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
                className="h-1.5 bg-white/40 rounded-full"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
