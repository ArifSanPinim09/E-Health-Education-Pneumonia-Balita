'use client'

import { useEffect, useState } from 'react'
import { Clock, Unlock } from 'lucide-react'

interface CountdownTimerProps {
  unlockTime: string
  onUnlock?: () => void
  compact?: boolean
}

export function CountdownTimer({ unlockTime, onUnlock, compact = false }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const unlock = new Date(unlockTime).getTime()
      const distance = unlock - now

      if (distance <= 0) {
        setTimeRemaining('Terbuka Sekarang!')
        setIsUnlocked(true)
        setProgress(100)
        
        // Call onUnlock callback to refresh dashboard
        if (onUnlock && !isUnlocked) {
          onUnlock()
        }
        return
      }

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      
      // Format display based on time remaining
      if (days > 0) {
        setTimeRemaining(`${days} hari ${hours} jam`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} jam ${minutes} menit`)
      } else {
        setTimeRemaining(`${minutes} menit`)
      }

      // Calculate progress (assuming 24 hours total lock time)
      const totalLockTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const elapsed = totalLockTime - distance
      setProgress(Math.min(100, Math.max(0, (elapsed / totalLockTime) * 100)))
    }

    // Initial update
    updateCountdown()
    
    // Update every minute (60000ms)
    const interval = setInterval(updateCountdown, 60000)

    return () => clearInterval(interval)
  }, [unlockTime, onUnlock, isUnlocked])

  if (isUnlocked) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 animate-pulse">
        <Unlock className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">
          Terbuka!
        </span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-gray-500">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">
          {timeRemaining}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <div>
          <p className="text-xs font-medium">Terbuka dalam:</p>
          <p className="text-sm font-bold text-gray-900">
            {timeRemaining}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
