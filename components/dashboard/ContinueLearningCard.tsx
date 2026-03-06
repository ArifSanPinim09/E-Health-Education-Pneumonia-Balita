'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface ContinueLearningCardProps {
  sessionNumber: number
  sessionTitle: string
  estimatedTime?: string
  href: string
}

export function ContinueLearningCard({ 
  sessionNumber, 
  sessionTitle, 
  estimatedTime = '5 menit',
  href
}: ContinueLearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-3 sm:mb-4">
        Lanjutkan Pembelajaran
      </h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="text-xs sm:text-sm text-[#1F2933]/60 mb-1">Session {sessionNumber}</div>
          <h3 className="text-base sm:text-lg font-semibold text-[#1F2933] mb-2">
            {sessionTitle}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Durasi: {estimatedTime}</span>
          </div>
        </div>

        <Link href={href}>
          <button className="w-full bg-[#2F5D50] text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all flex items-center justify-center gap-2 group">
            <span>Lanjutkan Belajar</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
