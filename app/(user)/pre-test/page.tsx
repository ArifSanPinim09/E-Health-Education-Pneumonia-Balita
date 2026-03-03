'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Send, Lightbulb, CheckCircle2 } from 'lucide-react'
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
  const [showTip, setShowTip] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast, showSuccess, hideToast } = useToast()

  // Fetch questions on mount
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

    // Auto-advance to next question after a short delay
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

    // Show confirmation dialog
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchQuestions}>Coba Lagi</Button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-6">
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-50 rounded-full p-4">
                    <CheckCircle2 className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  Kirim Jawaban?
                </h3>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  Pastikan semua jawaban sudah benar. Anda tidak dapat mengubahnya setelah dikirim.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirmDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={confirmSubmit}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? 'Mengirim...' : 'Ya, Kirim'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card - Unified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  Pre-Test Pneumonia Balita
                </h1>
                <p className="text-sm text-gray-600">
                  Jawab {questions.length} pertanyaan untuk mengukur pengetahuan awal
                </p>
              </div>
              <button
                onClick={() => setShowTip(!showTip)}
                className="flex-shrink-0 w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Tips Pengerjaan"
              >
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            {/* Tips Section - Collapsible */}
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                      Tips Pengerjaan
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Jawab setiap pertanyaan dengan Benar atau Salah. Gunakan tombol navigasi atau klik nomor pertanyaan untuk berpindah. Tidak ada jawaban benar atau salah - ini untuk mengukur pengetahuan awal Anda.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Section */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                {answeredQuestions.size} / {questions.length} Terjawab
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {Math.round((answeredQuestions.size / questions.length) * 100)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>

          {/* Question Navigator */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {Array.from({ length: questions.length }, (_, i) => {
                const isAnswered = answeredQuestions.has(i)
                const isCurrent = i === currentQuestionIndex

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleNavigate(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all
                      ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : isAnswered
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }
                    `}
                    aria-label={`Pertanyaan ${i + 1}`}
                  >
                    {i + 1}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 sm:px-6 py-3 bg-red-50 border-b border-red-100">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Question Content */}
          <div className="p-4 sm:p-6">
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
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline ml-1">Sebelumnya</span>
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || answeredQuestions.size < questions.length}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      <span className="ml-2">Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span className="ml-2">Kirim Jawaban</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  size="sm"
                  className="text-sm"
                >
                  <span className="hidden sm:inline mr-1">Selanjutnya</span>
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>

            {/* Submit Hint */}
            {answeredQuestions.size === questions.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center"
              >
                <p className="text-xs text-blue-600 font-medium">
                  ✓ Semua pertanyaan telah dijawab
                </p>
              </motion.div>
            )}
          </div>
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
