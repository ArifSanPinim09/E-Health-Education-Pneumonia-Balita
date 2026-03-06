'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CountdownTimer } from './CountdownTimer'

interface Session {
  day: number
  title: string
  description: string
  completed: boolean
  isUnlocked: boolean
  unlockTime?: string
}

interface SessionTimelineProps {
  sessions: Session[]
  onUnlock?: () => void
}

export function SessionTimeline({ sessions, onUnlock }: SessionTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
          Program Edukasi
        </h2>
        <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
      </div>

      {/* Timeline - Academic Module Style */}
      <div className="space-y-8">
        {sessions.map((session, index) => {
          const isLocked = !session.isUnlocked
          const content = (
            <motion.div
              key={session.day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.35 + index * 0.05 }}
              className="space-y-3"
            >
              {/* Session Number & Title */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 text-lg font-medium ${
                  session.completed 
                    ? 'text-[#2F5D50]' 
                    : isLocked 
                    ? 'text-[#1F2933]/30' 
                    : 'text-[#E07A5F]'
                }`}>
                  {String(session.day).padStart(2, '0')}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className={`text-xl font-medium ${
                    session.completed 
                      ? 'text-[#1F2933]' 
                      : isLocked 
                      ? 'text-[#1F2933]/40' 
                      : 'text-[#1F2933]'
                  }`}>
                    {session.title}
                  </h3>
                  <div className="h-px bg-[#2F5D50]/10"></div>
                  <p className={`text-[#1F2933]/70 ${isLocked ? 'opacity-50' : ''}`}>
                    {session.description}
                  </p>
                  
                  {/* Countdown for locked sessions */}
                  {isLocked && session.unlockTime && (
                    <div className="pt-2">
                      <CountdownTimer 
                        unlockTime={session.unlockTime} 
                        onUnlock={onUnlock} 
                        compact 
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )

          if (isLocked) {
            return <div key={session.day}>{content}</div>
          }

          return (
            <Link key={session.day} href={`/session/${session.day}`}>
              <div className="cursor-pointer hover:opacity-70 transition-opacity">
                {content}
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
