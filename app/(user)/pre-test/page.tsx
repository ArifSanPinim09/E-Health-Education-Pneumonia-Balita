'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Send, Sparkles, Trophy, Target } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-br from-[#58CC02]/5 via-white to-[#1CB0F6]/5 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <div className="w-full h-full rounded-full border-4 border-[#58CC02]/20 border-t-[#58CC02]"></div>
          </motion.div>
          <p className="text-gray-700 font-medium">Memuat pertanyaan...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#58CC02]/5 via-white to-[#1CB0F6]/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-red-100 p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <Button onClick={fetchQuestions} className="bg-[#58CC02] hover:bg-[#58CC02]/90">
            Coba Lagi
          </Button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#58CC02]/5 via-white to-[#1CB0F6]/5 py-4 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfirmDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-[#58CC02]/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-gradient-to-br from-[#58CC02] to-[#58A700] rounded-full p-5 shadow-lg">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Siap Kirim Jawaban?
                </h3>
                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                  Pastikan semua jawaban sudah benar ya! Setelah dikirim, kamu tidak bisa mengubahnya lagi.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirmDialog(false)}
                    variant="outline"
                    className="flex-1 h-14 text-base font-semibold border-2"
                  >
                    Periksa Lagi
                  </Button>
                  <Button
                    onClick={confirmSubmit}
                    disabled={submitting}
                    className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-[#58CC02] to-[#58A700] hover:from-[#58A700] hover:to-[#58CC02] shadow-lg"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Ya, Kirim!
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Character */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block text-6xl mb-4"
          >
            🎯
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Pre-Test Pneumonia Balita
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Yuk jawab {questions.length} pertanyaan untuk mengukur pengetahuan awalmu!
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden"
        >
          {/* Progress Section with Gamified Design */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-[#58CC02]/10 via-[#1CB0F6]/10 to-[#FF9600]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#58CC02]" />
                <span className="text-sm font-bold text-gray-700">
                  Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#58CC02]">
                  {answeredQuestions.size}
                </span>
                <span className="text-sm text-gray-500">/ {questions.length}</span>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#58CC02] to-[#58A700] rounded-full shadow-sm"
              />
              {answeredQuestions.size === questions.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{ transform: 'translateX(-100%)' }}
                />
              )}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-600">
                {Math.round((answeredQuestions.size / questions.length) * 100)}% selesai
              </span>
              {answeredQuestions.size === questions.length && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-bold text-[#58CC02] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Semua terjawab!
                </motion.span>
              )}
            </div>
          </div>

          {/* Question Navigator - Duolingo Style */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: questions.length }, (_, i) => {
                const isAnswered = answeredQuestions.has(i)
                const isCurrent = i === currentQuestionIndex

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleNavigate(i)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all shadow-sm
                      ${
                        isCurrent
                          ? 'bg-gradient-to-br from-[#58CC02] to-[#58A700] text-white ring-4 ring-[#58CC02]/30 shadow-lg'
                          : isAnswered
                          ? 'bg-gradient-to-br from-[#1CB0F6] to-[#1890D6] text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-[#58CC02]/50'
                      }
                    `}
                    aria-label={`Pertanyaan ${i + 1}`}
                  >
                    {isAnswered && !isCurrent && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[#58CC02] rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                    {i + 1}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 py-4 bg-red-50 border-b border-red-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Question Content */}
          <div className="p-6 sm:p-8 min-h-[300px] flex items-center">
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

          {/* Navigation Footer - Gamified */}
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="lg"
                className="font-semibold border-2 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || answeredQuestions.size < questions.length}
                  size="lg"
                  className="flex-1 sm:flex-none font-bold bg-gradient-to-r from-[#58CC02] to-[#58A700] hover:from-[#58A700] hover:to-[#58CC02] shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Mengirim...</span>
                    </div>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5 mr-2" />
                      Kirim Jawaban
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  size="lg"
                  className="font-semibold bg-gradient-to-r from-[#1CB0F6] to-[#1890D6] hover:from-[#1890D6] hover:to-[#1CB0F6]"
                >
                  <span className="hidden sm:inline mr-1">Selanjutnya</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-gray-600"
        >
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9600]" />
            <span>Tidak ada jawaban benar atau salah, ini untuk mengukur pengetahuan awalmu</span>
            <Sparkles className="w-4 h-4 text-[#FF9600]" />
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
