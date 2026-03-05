'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ProfileSetupInput, profileSetupSchema } from '@/lib/validations/profile-schema'
import { MotherInfoForm } from '@/components/profile/MotherInfoForm'
import { ChildInfoForm } from '@/components/profile/ChildInfoForm'
import { User, Baby, ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Toast from '@/components/shared/Toast'
import { useToast } from '@/lib/hooks/useToast'
import { SUCCESS_MESSAGES } from '@/lib/constants/indonesian-text'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast, showSuccess, hideToast } = useToast()

  // Clean up URL on mount to remove any query parameters from OAuth callback
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      console.log('🧹 Cleaning up URL query parameters')
      window.history.replaceState({}, '', '/profile-setup')
    }
  }, [])

  const form = useForm<ProfileSetupInput>({
    resolver: zodResolver(profileSetupSchema),
    mode: 'onChange',
  })

  const handleNext = async () => {
    const isValid = await form.trigger(
      currentStep === 1 
        ? ['mother.name', 'mother.age', 'mother.religion', 'mother.occupation', 'mother.address', 'mother.phone']
        : ['child.name', 'child.birth_date', 'child.gender']
    )

    if (isValid) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const onSubmit = async (data: ProfileSetupInput) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan profil')
      }

      // Show success message
      showSuccess(
        SUCCESS_MESSAGES.PROFILE_CREATED,
        '🎉 Berhasil!',
        2000
      )

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        {/* Card */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#2F5D50]/10">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-serif text-[#1F2933] mb-3"
            >
              Lengkapi Profil
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-[#1F2933]/70 leading-relaxed"
            >
              Isi data diri Anda dan anak untuk melanjutkan pembelajaran
            </motion.p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 pb-8 border-b border-[#2F5D50]/10">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentStep >= 1 
                      ? 'bg-[#2F5D50] text-white' 
                      : 'bg-[#2F5D50]/10 text-[#2F5D50]/50'
                  }`}
                >
                  {currentStep > 1 ? (
                    <CheckCircle className="w-6 h-6" strokeWidth={2} />
                  ) : (
                    <User className="w-6 h-6" strokeWidth={2} />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep === 1 ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}>
                    Langkah 1
                  </p>
                  <p className="text-xs text-[#1F2933]/50">Data Ibu</p>
                </div>
              </div>

              {/* Progress Line */}
              <div className="flex-1 mx-4 sm:mx-6">
                <div className="h-1 bg-[#2F5D50]/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep >= 2 ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="h-full bg-[#2F5D50]"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="hidden sm:block text-right">
                  <p className={`text-sm font-medium ${currentStep === 2 ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}>
                    Langkah 2
                  </p>
                  <p className="text-xs text-[#1F2933]/50">Data Anak</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentStep >= 2 
                      ? 'bg-[#2F5D50] text-white' 
                      : 'bg-[#2F5D50]/10 text-[#2F5D50]/50'
                  }`}
                >
                  <Baby className="w-6 h-6" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Mobile Step Labels */}
            <div className="flex sm:hidden justify-between mt-4 text-xs">
              <span className={`font-medium ${currentStep === 1 ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}>
                Data Ibu
              </span>
              <span className={`font-medium ${currentStep === 2 ? 'text-[#2F5D50]' : 'text-[#1F2933]/50'}`}>
                Data Anak
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <MotherInfoForm form={form} />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChildInfoForm form={form} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <div className="bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-sm text-[#E07A5F] font-medium leading-relaxed">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 h-12 inline-flex items-center justify-center px-6 text-[#2F5D50] font-medium rounded-lg border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] hover:bg-[#F4F7F5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                  Kembali
                </button>
              )}
              
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 inline-flex items-center justify-center px-6 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-all duration-300"
                >
                  Lanjutkan
                  <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 inline-flex items-center justify-center px-6 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" strokeWidth={2} />
                      Simpan
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
        title={toast.title}
      />
    </div>
  )
}
