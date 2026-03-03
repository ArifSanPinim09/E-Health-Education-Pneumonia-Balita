'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface QuestionNavigatorProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: Set<number>
  onNavigate: (questionIndex: number) => void
}

export default function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  const progress = (answeredQuestions.size / totalQuestions) * 100

  return (
    <div className="w-full mb-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          {answeredQuestions.size} / {totalQuestions} Terjawab
        </span>
        <span className="text-sm font-semibold text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
        />
      </div>

      {/* Question Dots */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = answeredQuestions.has(i)
          const isCurrent = i === currentQuestion

          return (
            <motion.button
              key={i}
              onClick={() => onNavigate(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all
                ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : isAnswered
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }
              `}
              aria-label={`Pertanyaan ${i + 1}`}
            >
              {isAnswered && !isCurrent ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                i + 1
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
