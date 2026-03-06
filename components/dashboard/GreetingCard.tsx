'use client'

import { motion } from 'framer-motion'
import { Sparkles, Sun, Cloud, Moon } from 'lucide-react'

interface GreetingCardProps {
  userName: string
  progressPercentage?: number
}

export function GreetingCard({ userName, progressPercentage = 0 }: GreetingCardProps) {
  const currentHour = new Date().getHours()
  let greeting = 'Selamat Pagi'
  let icon = <Sun className="w-7 h-7" />
  
  if (currentHour >= 12 && currentHour < 15) {
    greeting = 'Selamat Siang'
    icon = <Sun className="w-7 h-7" />
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = 'Selamat Sore'
    icon = <Cloud className="w-7 h-7" />
  } else if (currentHour >= 18 || currentHour < 4) {
    greeting = 'Selamat Malam'
    icon = <Moon className="w-7 h-7" />
  }

  const getCurrentDate = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const now = new Date()
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 rounded-3xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden"
    >
      {/* Decorative elements - Soft Health Modern */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -ml-16 -mb-16" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
      
      <div className="relative z-10">
        {/* Desktop: Greeting + Progress Mini | Mobile: Stack */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Greeting Section */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-3"
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              >
                {icon}
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold mb-1">
                  {greeting}!
                </h1>
                <p className="text-base lg:text-lg text-white/95 font-medium">{userName}</p>
              </div>
            </div>
            
            {/* Date & Program Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <p className="text-sm font-medium">{getCurrentDate()}</p>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <p className="text-sm font-medium">Program Edukasi Pneumonia Balita</p>
              </div>
            </div>
          </div>

          {/* Progress Mini - Desktop Only */}
          <div className="hidden lg:block">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/90">Progress Anda</span>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">{progressPercentage}</span>
                <span className="text-xl font-semibold text-white/90">%</span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
