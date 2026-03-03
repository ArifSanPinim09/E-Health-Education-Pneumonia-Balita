'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ProfileSetupInput, profileSetupSchema } from '@/lib/validations/profile-schema'
import { MotherInfoForm } from '@/components/profile/MotherInfoForm'
import { ChildInfoForm } from '@/components/profile/ChildInfoForm'
import { Button } from '@/components/ui/button'
import { User, Baby, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Single Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Lengkapi Profil
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Isi data diri Anda dan anak untuk melanjutkan pembelajaran
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  animate={{
                    scale: currentStep === 1 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    currentStep >= 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > 1 ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </motion.div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-semibold ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                    Langkah 1
                  </p>
                  <p className="text-xs text-gray-500">Data Ibu</p>
                </div>
              </div>

              {/* Progress Line */}
              <div className="flex-1 mx-3 sm:mx-4">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep >= 2 ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full bg-blue-600"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="hidden sm:block text-right">
                  <p className={`text-sm font-semibold ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                    Langkah 2
                  </p>
                  <p className="text-xs text-gray-500">Data Anak</p>
                </div>
                <motion.div
                  animate={{
                    scale: currentStep === 2 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    currentStep >= 2 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Baby className="w-5 h-5" />
                </motion.div>
              </div>
            </div>

            {/* Mobile Step Labels */}
            <div className="flex sm:hidden justify-between mt-3 text-xs">
              <span className={`font-medium ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                Data Ibu
              </span>
              <span className={`font-medium ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MotherInfoForm form={form} />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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
                  className="mt-6"
                >
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3">
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 h-11 text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              )}
              
              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  Lanjutkan
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 text-sm font-semibold bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Simpan
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
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
