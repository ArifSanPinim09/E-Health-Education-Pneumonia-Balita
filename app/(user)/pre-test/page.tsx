'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Send, CheckCircle, AlertCircle } from 'lucide-react'
import QuestionCard from '@/components/test/QuestionCard'
import { Button } from '@/components/ui/button'
import Toast from '@/components/shared/Toast'
import { useToast } from '@/lib/hooks/useToast'
import { SUCCESS_MESSAGES } from '@/lib/constants/indonesian-text'

interface Question {
  id: string
  question_text: string
  order_number: number
}

export default function PreTestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast, showSuccess, hideToast } = useToast()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Gagal mengambil pertanyaan')
      }

      const data = await response.json()
      if (data.success && data.questions) {
        const sortedQuestions = data.questions.sort(
          (a: Question, b: Question) => a.order_number - b.order_number
        )
        setQuestions(sortedQuestions)
        setAnswers(new Array(sortedQuestions.length).fill(null))
      }
    } catch (err) {
      setError('Gagal memuat pertanyaan. Silakan coba lagi.')
      console.error('Error fetching questions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)

    const newAnsweredQuestions = new Set(answeredQuestions)
    newAnsweredQuestions.add(currentQuestionIndex)
    setAnsweredQuestions(newAnsweredQuestions)

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 300)
    }
  }

  const handleNavigate = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = async () => {
    if (answeredQuestions.size < questions.length) {
      setError('Mohon jawab semua pertanyaan sebelum mengirim')
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmSubmit = async () => {
    setShowConfirmDialog(false)
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/test/submit-pre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error(data.error || 'Gagal mengirim jawaban')
      }

      showSuccess(
        `${SUCCESS_MESSAGES.PRE_TEST_COMPLETED} Skor Anda: ${data.score}/23`,
        'Berhasil!',
        3000
      )

      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim jawaban')
      console.error('Error submitting pre-test:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2F5D50] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#1F2933]/70 font-medium">Memuat pertanyaan...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-[#E07A5F]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#E07A5F]" />
          </div>
          <p className="text-[#E07A5F] mb-6 font-medium">{error}</p>
          <Button onClick={fetchQuestions} className="bg-[#2F5D50] hover:bg-[#274E43]">
            Coba Lagi
          </Button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-[#F4F7F5] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfirmDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 p-8 max-w-md w-full"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-[#2F5D50]/10 rounded-lg p-4">
                    <CheckCircle className="w-12 h-12 text-[#2F5D50]" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-[#1F2933] mb-3 text-center">
                  Kirim Jawaban?
                </h3>
                <p className="text-[#1F2933]/70 text-center mb-8 leading-relaxed">
                  Pastikan semua jawaban sudah benar. Anda tidak dapat mengubahnya setelah dikirim.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 h-12 inline-flex items-center justify-center px-6 text-[#2F5D50] font-medium rounded-lg border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] hover:bg-[#F4F7F5] transition-all duration-200"
                  >
                    Periksa Lagi
                  </button>
                  <button
                    onClick={confirmSubmit}
                    disabled={submitting}
                    className="flex-1 h-12 inline-flex items-center justify-center px-6 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-all duration-200 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Ya, Kirim
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1F2933] mb-2">
            Pre-Test Pneumonia Balita
          </h1>
          <p className="text-[#1F2933]/70 leading-relaxed">
            Jawab {questions.length} pertanyaan untuk mengukur pengetahuan awal Anda
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 overflow-hidden"
        >
          {/* Progress Section */}
          <div className="px-6 py-5 bg-[#F4F7F5] border-b border-[#2F5D50]/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#1F2933]/70">
                Progress
              </span>
              <span className="text-sm font-medium text-[#2F5D50]">
                {answeredQuestions.size} / {questions.length}
              </span>
            </div>
            <div className="relative w-full bg-[#2F5D50]/10 rounded-lg h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-[#2F5D50] rounded-lg"
              />
            </div>
          </div>

          {/* Question Navigator */}
          <div className="px-6 py-4 border-b border-[#2F5D50]/10">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: questions.length }, (_, i) => {
                const isAnswered = answeredQuestions.has(i)
                const isCurrent = i === currentQuestionIndex

                return (
                  <button
                    key={i}
                    onClick={() => handleNavigate(i)}
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                      ${
                        isCurrent
                          ? 'bg-[#2F5D50] text-white shadow-sm'
                          : isAnswered
                          ? 'bg-[#2F5D50]/20 text-[#2F5D50]'
                          : 'bg-white text-[#1F2933]/40 border border-[#2F5D50]/20 hover:border-[#2F5D50]/40'
                      }
                    `}
                    aria-label={`Pertanyaan ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 py-4 bg-[#E07A5F]/10 border-b border-[#E07A5F]/30"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#E07A5F] font-medium leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Question Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <QuestionCard
                  key={currentQuestionIndex}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  questionText={currentQuestion.question_text}
                  selectedAnswer={answers[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="px-6 py-5 bg-[#F4F7F5] border-t border-[#2F5D50]/10">
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center justify-center px-6 h-12 text-[#2F5D50] font-medium rounded-lg border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] hover:bg-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredQuestions.size < questions.length}
                  className="inline-flex items-center justify-center px-6 h-12 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Jawaban
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="inline-flex items-center justify-center px-6 h-12 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-all duration-200 disabled:opacity-50"
                >
                  <span className="hidden sm:inline mr-1">Selanjutnya</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Completion Hint */}
            {answeredQuestions.size === questions.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-[#2F5D50] font-medium">
                  ✓ Semua pertanyaan telah dijawab
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-[#1F2933]/60 leading-relaxed">
            Tidak ada jawaban benar atau salah — ini untuk mengukur pengetahuan awal Anda
          </p>
        </motion.div>
      </div>

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
