'use client'

import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface ContinueLearningCardProps {
  sessionNumber: number
  sessionTitle: string
  description: string
  href: string
  estimatedTime?: string
}

export function ContinueLearningCard({ 
  sessionNumber, 
  sessionTitle, 
  description, 
  href,
  estimatedTime = '15-20 menit'
}: ContinueLearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link href={href}>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer relative overflow-hidden group">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full">
                Lanjutkan Belajar
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-white/80 font-medium mb-1">Hari {sessionNumber}</p>
                <h3 className="text-xl font-semibold mb-2">{sessionTitle}</h3>
                <p className="text-sm text-white/90 leading-relaxed">{description}</p>
              </div>

              {/* Time estimate */}
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{estimatedTime}</span>
              </div>

              {/* CTA Button */}
              <motion.div
                className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-4 group-hover:bg-white/30 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="font-semibold">Lanjut Sesi</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
