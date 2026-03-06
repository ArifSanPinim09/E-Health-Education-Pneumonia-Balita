'use client'

import { motion } from 'framer-motion'

interface EducationInsightProps {
  insight: string
  highlightWord?: string
}

export function EducationInsight({ insight, highlightWord }: EducationInsightProps) {
  const renderInsight = () => {
    if (!highlightWord) return insight
    
    const parts = insight.split(new RegExp(`(${highlightWord})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={index} className="text-[#E07A5F] font-medium">{part}</span>
      ) : (
        part
      )
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
          Tahukah Anda?
        </h2>
        <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
      </div>

      {/* Insight Content - Editorial Style */}
      <p className="text-lg sm:text-xl text-[#1F2933]/70 font-light leading-relaxed max-w-3xl">
        {renderInsight()}
      </p>
    </motion.div>
  )
}
