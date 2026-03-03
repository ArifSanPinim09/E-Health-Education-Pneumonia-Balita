'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Play, Clock } from 'lucide-react'
import Link from 'next/link'
import { CountdownTimer } from './CountdownTimer'

interface SessionCardProps {
  day: number
  title: string
  status: 'active' | 'completed' | 'locked'
  unlockTime?: string
  index: number
  onUnlock?: () => void
}

export function SessionCard({ day, title, status, unlockTime, index, onUnlock }: SessionCardProps) {
  const getStatusConfig = () => {
    if (status === 'completed') {
      return {
        icon: <CheckCircle2 className="w-5 h-5" />,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
        bgColor: 'bg-green-50',
        textColor: 'text-gray-900'
      }
    }
    if (status === 'locked') {
      return {
        icon: <Lock className="w-5 h-5" />,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-400',
        borderColor: 'border-gray-200',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-500'
      }
    }
    return {
      icon: <Play className="w-5 h-5" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      textColor: 'text-gray-900'
    }
  }

  const config = getStatusConfig()

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        relative overflow-hidden rounded-lg p-3 border transition-all
        ${config.bgColor} ${config.borderColor}
        ${status === 'locked' 
          ? 'cursor-not-allowed opacity-75' 
          : 'hover:shadow-md hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`${config.iconBg} rounded-lg p-2 ${config.iconColor} flex-shrink-0`}>
          {config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-gray-500">Hari {day}</span>
            {status === 'active' && (
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className={`text-sm font-bold ${config.textColor} truncate`}>
            {title}
          </h3>
          
          {/* Countdown for locked sessions */}
          {status === 'locked' && unlockTime && (
            <div className="mt-1">
              <CountdownTimer unlockTime={unlockTime} onUnlock={onUnlock} compact />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (status === 'locked') {
    return cardContent
  }

  return (
    <Link href={`/session/${day}`}>
      {cardContent}
    </Link>
  )
}
