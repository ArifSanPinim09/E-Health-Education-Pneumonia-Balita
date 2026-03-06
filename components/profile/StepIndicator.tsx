'use client'

import { motion } from 'framer-motion'
import { User, Baby, CheckCircle } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: { label: string; icon: 'user' | 'baby' }[]
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  const getIcon = (iconType: 'user' | 'baby', isActive: boolean) => {
    const iconClass = "w-5 h-5 sm:w-6 sm:h-6"
    const strokeWidth = 2
    
    if (iconType === 'user') {
      return <User className={iconClass} strokeWidth={strokeWidth} />
    }
    return <Baby className={iconClass} strokeWidth={strokeWidth} />
  }

  return (
    <div className="mb-8 pb-8 border-b border-[#2F5D50]/10">
      <div className="flex items-center justify-between gap-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isActive = stepNumber <= currentStep
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Icon */}
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isActive ? 'bg-[#2F5D50] text-white' : 'bg-[#2F5D50]/10 text-[#2F5D50]/50'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                  ) : (
                    getIcon(step.icon, isActive)
                  )}
                </motion.div>
                
                {/* Step Label - Hidden on mobile */}
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium transition-colors ${isCurrent ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}>
                    Langkah {stepNumber}
                  </p>
                  <p className="text-xs text-[#1F2933]/50">{step.label}</p>
                </div>
              </div>
              
              {/* Progress Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-2 sm:mx-4 lg:mx-6">
                  <div className="h-1 bg-[#2F5D50]/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="h-full bg-[#2F5D50]"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Labels */}
      <div className="flex sm:hidden justify-between mt-4 text-xs">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCurrent = stepNumber === currentStep
          
          return (
            <span 
              key={stepNumber}
              className={`font-medium transition-colors ${isCurrent ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}
            >
              {step.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
