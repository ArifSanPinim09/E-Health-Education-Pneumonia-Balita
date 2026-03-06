'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ContinueSessionProps {
  sessionNumber: number
  sessionTitle: string
  estimatedTime?: string
  href: string
}

export function ContinueSession({ 
  sessionNumber, 
  sessionTitle, 
  estimatedTime = '±5 menit',
  href
}: ContinueSessionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
          Lanjutkan Pembelajaran
        </h2>
        <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
      </div>

      {/* Session Info - No Card, Editorial Layout */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-lg text-[#1F2933]/70">
            Session {sessionNumber}
          </div>
          <h3 className="text-xl sm:text-2xl font-medium text-[#1F2933]">
            {sessionTitle}
          </h3>
          <p className="text-[#1F2933]/60">
            Durasi belajar {estimatedTime}
          </p>
        </div>

        {/* CTA Button - Minimal Style */}
        <Link href={href}>
          <button className="px-8 py-3 border-2 border-[#2F5D50] text-[#2F5D50] font-medium rounded-lg hover:bg-[#2F5D50] hover:text-white transition-all">
            Mulai Sesi
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
