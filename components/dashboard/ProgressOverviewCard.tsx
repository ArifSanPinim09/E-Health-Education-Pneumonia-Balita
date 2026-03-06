'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

interface ProgressItem {
  label: string
  completed: boolean
  current?: boolean
}

interface ProgressCardProps {
  items: ProgressItem[]
  percentage: number
}

export function ProgressCard({ items, percentage }: ProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <h2 className="text-xl font-semibold text-[#1F2933] mb-4">
        Progress Program
      </h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#1F2933]/60">Penyelesaian</span>
          <span className="text-sm font-semibold text-[#2F5D50]">{percentage}%</span>
        </div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-2">
          <div 
            className="bg-[#2F5D50] h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Progress List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-center gap-3"
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-[#2F5D50] flex-shrink-0" strokeWidth={2} />
            ) : item.current ? (
              <div className="w-5 h-5 rounded-full border-2 border-[#E07A5F] flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#E07A5F]" />
              </div>
            ) : (
              <Circle className="w-5 h-5 text-[#1F2933]/20 flex-shrink-0" strokeWidth={2} />
            )}
            <span className={`text-base ${
              item.completed 
                ? 'text-[#1F2933]' 
                : item.current 
                ? 'text-[#1F2933] font-medium' 
                : 'text-[#1F2933]/40'
            }`}>
              {item.label}
              {item.current && (
                <span className="ml-2 text-xs text-[#E07A5F]">(sedang dipelajari)</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
