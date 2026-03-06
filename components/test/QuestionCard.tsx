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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      className="w-full"
    >
      {/* Question Number Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="flex justify-center mb-6"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#58CC02]/10 to-[#1CB0F6]/10 px-5 py-2 rounded-full border-2 border-[#58CC02]/20">
          <span className="text-sm font-bold text-gray-600">Pertanyaan</span>
          <span className="text-lg font-bold text-[#58CC02]">{questionNumber}</span>
          <span className="text-sm text-gray-500">dari {totalQuestions}</span>
        </div>
      </motion.div>

      {/* Question Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium text-center">
            {questionText}
          </p>
        </div>
      </motion.div>

      {/* Answer Buttons - Duolingo Style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Benar Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(true)}
          className={`
            relative rounded-2xl py-6 px-6 transition-all duration-300 shadow-lg
            ${
              selectedAnswer === true
                ? 'bg-gradient-to-br from-[#58CC02] to-[#58A700] text-white shadow-[#58CC02]/30 ring-4 ring-[#58CC02]/20'
                : 'bg-white text-gray-700 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 border-2 border-gray-200 hover:border-[#58CC02] hover:shadow-xl'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={selectedAnswer === true ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.5 }}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                ${
                  selectedAnswer === true
                    ? 'bg-white/20'
                    : 'bg-green-100'
                }
              `}
            >
              <Check 
                className={`w-8 h-8 ${selectedAnswer === true ? 'text-white' : 'text-[#58CC02]'}`} 
                strokeWidth={3} 
              />
            </motion.div>
            <span className="text-lg font-bold tracking-wide">BENAR</span>
          </div>
          
          {selectedAnswer === true && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-xl">✓</span>
            </motion.div>
          )}
        </motion.button>

        {/* Salah Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(false)}
          className={`
            relative rounded-2xl py-6 px-6 transition-all duration-300 shadow-lg
            ${
              selectedAnswer === false
                ? 'bg-gradient-to-br from-[#FF4B4B] to-[#CC0000] text-white shadow-red-300 ring-4 ring-red-200'
                : 'bg-white text-gray-700 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 border-2 border-gray-200 hover:border-red-400 hover:shadow-xl'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={selectedAnswer === false ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.5 }}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                ${
                  selectedAnswer === false
                    ? 'bg-white/20'
                    : 'bg-red-100'
                }
              `}
            >
              <X 
                className={`w-8 h-8 ${selectedAnswer === false ? 'text-white' : 'text-red-600'}`} 
                strokeWidth={3} 
              />
            </motion.div>
            <span className="text-lg font-bold tracking-wide">SALAH</span>
          </div>
          
          {selectedAnswer === false && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-xl">✓</span>
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Hint Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-gray-500 italic">
          Pilih jawaban yang menurutmu paling tepat
        </p>
      </motion.div>
    </motion.div>
  )
}
