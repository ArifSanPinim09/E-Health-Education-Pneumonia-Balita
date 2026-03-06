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
      transition={{ duration: 0.3 }}
      className="mb-6 sm:mb-8"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1F2933] mb-2">
        {greeting}, {userName} 👋
      </h1>
      <p className="text-sm sm:text-base text-[#1F2933]/60">
        Anda sedang berada di hari ke-{currentDay} Program Edukasi Pneumonia Balita
      </p>
    </motion.div>
  )
}
