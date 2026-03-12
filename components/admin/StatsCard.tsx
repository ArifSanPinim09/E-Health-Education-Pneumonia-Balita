'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'pink'
  index?: number
}

const colorClasses = {
  blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
  green: 'from-green-500/10 to-green-600/10 border-green-500/20',
  orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/20',
  purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
  pink: 'from-pink-500/10 to-pink-600/10 border-pink-500/20',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
}

const iconBgClasses = {
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
  orange: 'bg-orange-500/10',
  purple: 'bg-purple-500/10',
  pink: 'bg-pink-500/10',
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'blue',
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow bg-white`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-[#1F2933]/70 mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-1">{value}</p>
          {description && (
            <p className="text-xs text-[#1F2933]/60 line-clamp-2">{description}</p>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-lg ${iconBgClasses[color]} ${iconColorClasses[color]} flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </motion.div>
  )
}
