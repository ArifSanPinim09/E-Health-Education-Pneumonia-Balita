'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, CheckCircle } from 'lucide-react'

interface OverviewCardsProps {
  progressPercentage: number
  currentSession: string
  completedCount: number
  totalCount: number
}

export function OverviewCards({ 
  progressPercentage, 
  currentSession, 
  completedCount, 
  totalCount 
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#2F5D50]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F5D50]" strokeWidth={2} />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-[#1F2933]/60">Progress Program</h3>
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-[#1F2933] mb-2">
          {progressPercentage}%
        </div>
        <div className="w-full bg-[#2F5D50]/10 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-[#2F5D50] h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </motion.div>

      {/* Current Session Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#E07A5F]/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#E07A5F]" strokeWidth={2} />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-[#1F2933]/60">Session Aktif</h3>
        </div>
        <div className="text-base sm:text-lg font-semibold text-[#1F2933]">
          {currentSession}
        </div>
      </motion.div>

      {/* Completed Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#22C55E]" strokeWidth={2} />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-[#1F2933]/60">Materi Selesai</h3>
        </div>
        <div className="text-2xl sm:text-3xl font-semibold text-[#1F2933]">
          {completedCount} / {totalCount}
        </div>
      </motion.div>
    </div>
  )
}
