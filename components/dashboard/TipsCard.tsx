'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'

interface TipsCardProps {
  tip: string
}

export function TipsCard({ tip }: TipsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full blur-2xl -mr-12 -mt-12" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-sky-100/30 rounded-full blur-xl -ml-10 -mb-10" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-xl p-3">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
          </motion.div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
            Tips Hari Ini
          </h3>
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            {tip}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
