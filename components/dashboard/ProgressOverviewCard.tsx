'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

interface ProgressItem {
  label: string
  completed: boolean
  current?: boolean
}

interface ProgressTimelineProps {
  items: ProgressItem[]
}

export function ProgressTimeline({ items }: ProgressTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
          Progress Program
        </h2>
        <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
      </div>

      {/* Timeline List - Research Progress Style */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.15 + index * 0.05 }}
            className="flex items-start gap-4"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#2F5D50]" strokeWidth={1.5} />
              ) : item.current ? (
                <div className="w-3 h-3 rounded-full bg-[#E07A5F]" />
              ) : (
                <Circle className="w-5 h-5 text-[#1F2933]/20" strokeWidth={1.5} />
              )}
            </div>

            {/* Label */}
            <div className={`text-lg ${
              item.completed 
                ? 'text-[#1F2933]' 
                : item.current 
                ? 'text-[#1F2933] font-medium' 
                : 'text-[#1F2933]/40'
            }`}>
              {item.label}
              {item.current && (
                <span className="ml-2 text-sm text-[#E07A5F]">sedang dipelajari</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
