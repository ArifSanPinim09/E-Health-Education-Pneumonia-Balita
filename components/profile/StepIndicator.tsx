'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isCompleted ? 'bg-blue-600 border-blue-600' : ''}
                    ${isCurrent ? 'bg-blue-600 border-blue-600 scale-110' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white border-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                      {stepNumber}
                    </span>
                  )}
                  
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-600"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative overflow-hidden">
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 bg-blue-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
