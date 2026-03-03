'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

interface ProgressRingProps {
  percentage: number
}

export function ProgressRing({ percentage }: ProgressRingProps) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on progress
  const getProgressColor = () => {
    if (percentage < 30) return { from: '#EF4444', to: '#DC2626' } // Red
    if (percentage < 60) return { from: '#F59E0B', to: '#D97706' } // Orange
    if (percentage < 90) return { from: '#3B82F6', to: '#2563EB' } // Blue
    return { from: '#10B981', to: '#059669' } // Green
  }

  const colors = getProgressColor()

  const getMotivationalText = () => {
    if (percentage === 0) return 'Mulai!'
    if (percentage < 30) return 'Bagus!'
    if (percentage < 60) return 'Semangat!'
    if (percentage < 90) return 'Hampir!'
    if (percentage < 100) return 'Sedikit lagi!'
    return 'Sempurna!'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative">
        <svg 
          width="144" 
          height="144" 
          viewBox="0 0 144 144" 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={`url(#gradient-${percentage})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
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
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-0.5">{percentage}%</div>
            <div className="flex items-center gap-1 justify-center">
              <TrendingUp className="w-3 h-3 text-gray-500" />
              <div className="text-xs text-gray-500 font-medium">{getMotivationalText()}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative dots */}
        {percentage > 0 && (
          <>
            <motion.div
              className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full -ml-1.25"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {percentage === 100 && (
              <motion.div
                className="absolute top-1/2 right-0 w-2.5 h-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full -mr-1.25 -mt-1.25"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
