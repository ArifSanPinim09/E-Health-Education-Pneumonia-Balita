'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Info, Award, TrendingUp } from 'lucide-react'

interface TipsCardProps {
  tip: string
}

export function TipsCard({ tip }: TipsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#E07A5F]/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#E07A5F]" strokeWidth={2} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1F2933]">Tips Hari Ini</h3>
      </div>

      <p className="text-xs sm:text-sm text-[#1F2933]/70 leading-relaxed">
        {tip}
      </p>
    </motion.div>
  )
}

interface InfoCardProps {
  title: string
  content: string
}

export function InfoCard({ title, content }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#2F5D50]/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1F2933]">{title}</h3>
      </div>

      <p className="text-xs sm:text-sm text-[#1F2933]/70 leading-relaxed">
        {content}
      </p>
    </motion.div>
  )
}

interface DetailedStatsCardProps {
  preTestScore: number | null
  postTestScore: number | null
  completedSessions: number
  totalSessions: number
  preTestCompleted: boolean
  postTestCompleted: boolean
}

export function DetailedStatsCard({ 
  preTestScore, 
  postTestScore, 
  completedSessions, 
  totalSessions,
  preTestCompleted,
  postTestCompleted
}: DetailedStatsCardProps) {
  const improvement = preTestScore && postTestScore ? postTestScore - preTestScore : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 }}
      className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 border border-[#2F5D50]/10"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-[#2F5D50]/10 flex items-center justify-center flex-shrink-0">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1F2933]">Detail Pembelajaran</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Pre-Test Score */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#F4F7F5] rounded-lg">
          <div>
            <div className="text-[10px] sm:text-xs text-[#1F2933]/60 mb-0.5 sm:mb-1">Nilai Pre-Test</div>
            <div className="text-xl sm:text-2xl font-semibold text-[#1F2933]">
              {preTestCompleted ? (preTestScore || 0) : '-'}
            </div>
          </div>
          {!preTestCompleted && (
            <span className="text-[10px] sm:text-xs text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-1 rounded-full">
              Belum
            </span>
          )}
        </div>

        {/* Sessions Progress */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#F4F7F5] rounded-lg">
          <div>
            <div className="text-[10px] sm:text-xs text-[#1F2933]/60 mb-0.5 sm:mb-1">Sesi Selesai</div>
            <div className="text-xl sm:text-2xl font-semibold text-[#1F2933]">
              {completedSessions}/{totalSessions}
            </div>
          </div>
          <div className="text-xs sm:text-sm font-medium text-[#2F5D50]">
            {Math.round((completedSessions / totalSessions) * 100)}%
          </div>
        </div>

        {/* Post-Test Score */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-[#F4F7F5] rounded-lg">
          <div>
            <div className="text-[10px] sm:text-xs text-[#1F2933]/60 mb-0.5 sm:mb-1">Nilai Post-Test</div>
            <div className="text-xl sm:text-2xl font-semibold text-[#1F2933]">
              {postTestCompleted ? (postTestScore || 0) : '-'}
            </div>
          </div>
          {!postTestCompleted && (
            <span className="text-[10px] sm:text-xs text-[#1F2933]/40 bg-[#1F2933]/5 px-2 py-1 rounded-full">
              Belum
            </span>
          )}
        </div>

        {/* Improvement */}
        {preTestCompleted && postTestCompleted && improvement !== 0 && (
          <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-[#22C55E]/10 rounded-lg border border-[#22C55E]/20">
            <TrendingUp className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[10px] sm:text-xs text-[#22C55E] font-medium">Peningkatan</div>
              <div className="text-base sm:text-lg font-semibold text-[#22C55E]">
                +{improvement} poin
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
