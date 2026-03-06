'use client'

import { motion } from 'framer-motion'

interface GreetingCardProps {
  userName: string
  currentDay: number
}

export function GreetingCard({ userName, currentDay }: GreetingCardProps) {
  const currentHour = new Date().getHours()
  let greeting = 'Selamat pagi'
  
  if (currentHour >= 12 && currentHour < 15) {
    greeting = 'Selamat siang'
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = 'Selamat sore'
  } else if (currentHour >= 18 || currentHour < 4) {
    greeting = 'Selamat malam'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Editorial Welcome - No Card */}
      <div className="space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F2933] leading-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-lg sm:text-xl text-[#1F2933]/70 font-light leading-relaxed max-w-3xl">
          Anda sedang berada di hari ke-{currentDay} program edukasi pneumonia balita.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
    </motion.div>
  )
}
