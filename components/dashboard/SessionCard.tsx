'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Play, ArrowRight } from 'lucide-react'
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
        icon: <CheckCircle2 className="w-6 h-6" />,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
        bgColor: 'bg-white',
        textColor: 'text-gray-900',
        badge: 'Selesai',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700'
      }
    }
    if (status === 'locked') {
      return {
        icon: <Lock className="w-6 h-6" />,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-400',
        borderColor: 'border-gray-200',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-500',
        badge: 'Terkunci',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-600'
      }
    }
    return {
      icon: <Play className="w-6 h-6" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      badge: 'Mulai',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700'
    }
  }

  const config = getStatusConfig()

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 border-2 transition-all duration-200
        ${config.bgColor} ${config.borderColor}
        ${status === 'locked' 
          ? 'cursor-not-allowed opacity-70' 
          : 'hover:shadow-md hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div className={`${config.iconBg} rounded-xl p-3 ${config.iconColor} flex-shrink-0`}>
          {config.icon}
        </div>
        
        {/* Badge */}
        <span className={`${config.badgeBg} ${config.badgeText} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {config.badge}
        </span>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hari {day}</span>
          {status === 'active' && (
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        <h3 className={`text-base font-semibold ${config.textColor} leading-snug`}>
          {title}
        </h3>
        
        {/* Countdown for locked sessions */}
        {status === 'locked' && unlockTime && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <CountdownTimer unlockTime={unlockTime} onUnlock={onUnlock} compact />
          </div>
        )}

        {/* Arrow for active/completed */}
        {status !== 'locked' && (
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600 mt-2">
            <span>Lihat Sesi</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
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
