'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProgressItem {
  label: string
  completed: boolean
  current?: boolean
  locked?: boolean
  unlockTime?: string
}

interface ProgressCardProps {
  items: ProgressItem[]
  percentage: number
}

function TimeUntilUnlock({ unlockTime }: { unlockTime: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const unlock = new Date(unlockTime).getTime()
      const difference = unlock - now

      if (difference <= 0) {
        setTimeLeft('Tersedia sekarang')
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days} hari lagi`)
      } else if (hours > 0) {
        setTimeLeft(`${hours} jam ${minutes} menit lagi`)
      } else {
        setTimeLeft(`${minutes} menit lagi`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [unlockTime])

  return (
    <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-[#E07A5F] flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {timeLeft}
    </span>
  )
}

export function ProgressCard({ items, percentage }: ProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-3 sm:mb-4">
        Progress Program
      </h2>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-[#1F2933]/60">Penyelesaian</span>
          <span className="text-xs sm:text-sm font-semibold text-[#2F5D50]">{percentage}%</span>
        </div>
        <div className="w-full bg-[#2F5D50]/10 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-[#2F5D50] h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Progress List */}
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {item.completed ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F5D50] flex-shrink-0" strokeWidth={2} />
            ) : item.current ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#E07A5F] flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E07A5F]" />
              </div>
            ) : (
              <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-[#1F2933]/20 flex-shrink-0" strokeWidth={2} />
            )}
            <div className={`flex-1 text-xs sm:text-sm lg:text-base ${
              item.completed 
                ? 'text-[#1F2933]' 
                : item.current 
                ? 'text-[#1F2933] font-medium' 
                : 'text-[#1F2933]/40'
            }`}>
              <div className="flex items-center flex-wrap gap-1">
                <span>{item.label}</span>
                {item.current && (
                  <span className="text-[10px] sm:text-xs text-[#E07A5F]">(sedang dipelajari)</span>
                )}
                {item.locked && item.unlockTime && (
                  <TimeUntilUnlock unlockTime={item.unlockTime} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
