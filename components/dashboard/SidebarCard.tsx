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
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-[#E07A5F]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">Tips Hari Ini</h3>
      </div>

      <p className="text-sm text-[#1F2933]/70 leading-relaxed">
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
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 flex items-center justify-center">
          <Info className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">{title}</h3>
      </div>

      <p className="text-sm text-[#1F2933]/70 leading-relaxed">
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
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 flex items-center justify-center">
          <Award className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">Detail Pembelajaran</h3>
      </div>

      <div className="space-y-4">
        {/* Pre-Test Score */}
        <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
          <div>
            <div className="text-xs text-[#1F2933]/60 mb-1">Nilai Pre-Test</div>
            <div className="text-2xl font-semibold text-[#1F2933]">
              {preTestCompleted ? (preTestScore || 0) : '-'}
            </div>
          </div>
          {!preTestCompleted && (
            <span className="text-xs text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-1 rounded-full">
              Belum
            </span>
          )}
        </div>

        {/* Sessions Progress */}
        <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
          <div>
            <div className="text-xs text-[#1F2933]/60 mb-1">Sesi Selesai</div>
            <div className="text-2xl font-semibold text-[#1F2933]">
              {completedSessions}/{totalSessions}
            </div>
          </div>
          <div className="text-sm font-medium text-[#2F5D50]">
            {Math.round((completedSessions / totalSessions) * 100)}%
          </div>
        </div>

        {/* Post-Test Score */}
        <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
          <div>
            <div className="text-xs text-[#1F2933]/60 mb-1">Nilai Post-Test</div>
            <div className="text-2xl font-semibold text-[#1F2933]">
              {postTestCompleted ? (postTestScore || 0) : '-'}
            </div>
          </div>
          {!postTestCompleted && (
            <span className="text-xs text-[#1F2933]/40 bg-[#1F2933]/5 px-2 py-1 rounded-full">
              Belum
            </span>
          )}
        </div>

        {/* Improvement */}
        {preTestCompleted && postTestCompleted && improvement !== 0 && (
          <div className="flex items-center gap-2 p-3 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <div className="flex-1">
              <div className="text-xs text-[#22C55E] font-medium">Peningkatan</div>
              <div className="text-lg font-semibold text-[#22C55E]">
                +{improvement} poin
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
