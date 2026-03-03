'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  selectedAnswer: boolean | null
  onAnswer: (answer: boolean) => void
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Question Text */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {questionText}
          </p>
        </div>
      </div>

      {/* Answer Buttons - Compact */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Benar Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(true)}
          className={`
            rounded-lg py-3 px-4 transition-all
            ${
              selectedAnswer === true
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-300'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <Check className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedAnswer === true ? 'text-white' : 'text-green-600'}`} strokeWidth={2.5} />
            <span className="text-sm font-semibold">BENAR</span>
          </div>
        </motion.button>

        {/* Salah Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(false)}
          className={`
            rounded-lg py-3 px-4 transition-all
            ${
              selectedAnswer === false
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-red-50 border border-gray-200 hover:border-red-300'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <X className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedAnswer === false ? 'text-white' : 'text-red-600'}`} strokeWidth={2.5} />
            <span className="text-sm font-semibold">SALAH</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
