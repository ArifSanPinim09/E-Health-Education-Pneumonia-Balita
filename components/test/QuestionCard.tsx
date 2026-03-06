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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Question Number */}
      <div className="mb-6">
        <span className="inline-block px-4 py-2 bg-[#2F5D50]/10 text-[#2F5D50] text-sm font-medium rounded-lg">
          Pertanyaan {questionNumber} dari {totalQuestions}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <div className="bg-[#F4F7F5] rounded-lg p-6 border border-[#2F5D50]/10">
          <p className="text-base sm:text-lg text-[#1F2933] leading-relaxed">
            {questionText}
          </p>
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Benar Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(true)}
          className={`
            rounded-lg py-4 px-6 transition-all duration-200 border-2
            ${
              selectedAnswer === true
                ? 'bg-[#2F5D50] text-white border-[#2F5D50] shadow-sm'
                : 'bg-white text-[#1F2933] border-[#2F5D50]/30 hover:border-[#2F5D50] hover:bg-[#F4F7F5]'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <Check 
              className={`w-5 h-5 ${selectedAnswer === true ? 'text-white' : 'text-[#2F5D50]'}`} 
              strokeWidth={2.5} 
            />
            <span className="text-sm font-medium">BENAR</span>
          </div>
        </motion.button>

        {/* Salah Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswer(false)}
          className={`
            rounded-lg py-4 px-6 transition-all duration-200 border-2
            ${
              selectedAnswer === false
                ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-sm'
                : 'bg-white text-[#1F2933] border-[#E07A5F]/30 hover:border-[#E07A5F] hover:bg-[#E07A5F]/5'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <X 
              className={`w-5 h-5 ${selectedAnswer === false ? 'text-white' : 'text-[#E07A5F]'}`} 
              strokeWidth={2.5} 
            />
            <span className="text-sm font-medium">SALAH</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
