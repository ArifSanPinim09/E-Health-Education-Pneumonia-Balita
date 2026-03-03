'use client'

import { motion } from 'framer-motion'
import { Sparkles, Sun, Cloud, Moon, Star } from 'lucide-react'

interface GreetingCardProps {
  userName: string
}

export function GreetingCard({ userName }: GreetingCardProps) {
  const currentHour = new Date().getHours()
  let greeting = 'Selamat Pagi'
  let icon = <Sun className="w-6 h-6" />
  let gradientFrom = 'from-amber-500'
  let gradientTo = 'to-orange-600'
  
  if (currentHour >= 12 && currentHour < 15) {
    greeting = 'Selamat Siang'
    icon = <Sun className="w-6 h-6" />
    gradientFrom = 'from-yellow-400'
    gradientTo = 'to-orange-500'
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = 'Selamat Sore'
    icon = <Cloud className="w-6 h-6" />
    gradientFrom = 'from-orange-500'
    gradientTo = 'to-red-600'
  } else if (currentHour >= 18 || currentHour < 4) {
    greeting = 'Selamat Malam'
    icon = <Moon className="w-6 h-6" />
    gradientFrom = 'from-indigo-600'
    gradientTo = 'to-purple-700'
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
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {icon}
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {greeting}!
              </h1>
              <p className="text-sm text-white/90 font-medium">{userName}</p>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/80 mb-0.5">Hari ini</p>
              <p className="text-sm font-semibold">{getCurrentDate()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80 mb-0.5">Program</p>
              <p className="text-sm font-semibold">Pneumonia Balita</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
