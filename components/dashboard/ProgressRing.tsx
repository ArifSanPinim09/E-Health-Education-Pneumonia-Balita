'use client'

import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle2 } from 'lucide-react'

interface ProgressRingProps {
  percentage: number
}

export function ProgressRing({ percentage }: ProgressRingProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Health UI Color System - konsisten dengan design doc
  const getProgressColor = () => {
    if (percentage < 30) return { from: '#F59E0B', to: '#D97706' } // Warning Amber
    if (percentage < 60) return { from: '#38BDF8', to: '#2563EB' } // Sky to Primary Blue
    if (percentage < 90) return { from: '#2563EB', to: '#1D4ED8' } // Primary Blue
    return { from: '#22C55E', to: '#16A34A' } // Success Green
  }

  const colors = getProgressColor()

  const getMotivationalText = () => {
    if (percentage === 0) return 'Mulai Sekarang'
    if (percentage < 30) return 'Langkah Awal'
    if (percentage < 60) return 'Terus Semangat'
    if (percentage < 90) return 'Hampir Selesai'
    if (percentage < 100) return 'Sedikit Lagi'
    return 'Sempurna!'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative">
        <svg 
          width="160" 
          height="160" 
          viewBox="0 0 160 160" 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={`url(#gradient-${percentage})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
          />
          <defs>
            <linearGradient id={`gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            className="text-center"
          >
            <div className="text-4xl font-semibold text-gray-900 mb-1">{percentage}%</div>
            <div className="flex items-center gap-1.5 justify-center">
              {percentage === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-gray-500" />
              )}
              <div className="text-xs text-gray-600 font-medium">{getMotivationalText()}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative dots - Soft Health Modern */}
        {percentage > 0 && (
          <>
            <motion.div
              className="absolute top-0 left-1/2 w-3 h-3 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full shadow-sm"
              style={{ marginLeft: '-6px' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {percentage === 100 && (
              <motion.div
                className="absolute top-1/2 right-0 w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full shadow-sm"
                style={{ marginRight: '-6px', marginTop: '-6px' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
