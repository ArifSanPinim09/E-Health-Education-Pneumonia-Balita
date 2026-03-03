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
  blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  green: 'from-green-500/20 to-green-600/20 border-green-500/30',
  orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
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
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/50 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}
