'use client'

import { motion } from 'framer-motion'
import { ProgressRing } from './ProgressRing'
import { CheckCircle2, Circle } from 'lucide-react'

interface ProgressItem {
  label: string
  completed: boolean
}

interface ProgressOverviewCardProps {
  percentage: number
  items: ProgressItem[]
}

export function ProgressOverviewCard({ percentage, items }: ProgressOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Progress Pembelajaran</h2>
        <p className="text-sm text-gray-600">Pantau perkembangan Anda</p>
      </div>

      {/* Desktop: Side by side | Mobile: Stack */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing percentage={percentage} />
        </div>

        {/* Progress Stats */}
        <div className="flex-1 w-full space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                item.completed 
                  ? 'bg-blue-50 border border-blue-100' 
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <span className={`text-sm font-medium ${
                item.completed ? 'text-gray-900' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
