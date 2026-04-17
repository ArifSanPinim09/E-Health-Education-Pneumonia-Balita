'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, X, CheckCircle, Loader2 } from 'lucide-react'

interface FeedbackFormProps {
  preScore: number
  postScore: number
  onSubmitSuccess?: () => void
}

export function FeedbackForm({ preScore, postScore, onSubmitSuccess }: FeedbackFormProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Rating states
  const [overallRating, setOverallRating] = useState(0)
  const [contentQuality, setContentQuality] = useState(0)
  const [easeOfUse, setEaseOfUse] = useState(0)
  const [chatbotHelpful, setChatbotHelpful] = useState(0)

  // Feedback text states
  const [positiveFeedback, setPositiveFeedback] = useState('')
  const [improvementFeedback, setImprovementFeedback] = useState('')

  // Hover states for star ratings
  const [overallHover, setOverallHover] = useState(0)
  const [contentHover, setContentHover] = useState(0)
  const [easeHover, setEaseHover] = useState(0)
  const [chatbotHover, setChatbotHover] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (overallRating === 0) {
      setError('Mohon berikan rating keseluruhan')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const improvementPercentage = preScore > 0 
        ? ((postScore - preScore) / 23 * 100).toFixed(2)
        : '0'

      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          overall_rating: overallRating,
          content_quality: contentQuality || null,
          ease_of_use: easeOfUse || null,
          chatbot_helpful: chatbotHelpful || null,
          positive_feedback: positiveFeedback.trim() || null,
          improvement_feedback: improvementFeedback.trim() || null,
          pre_test_score: preScore,
          post_test_score: postScore,
          improvement_percentage: parseFloat(improvementPercentage),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim feedback')
      }

      setIsSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        onSubmitSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    setIsOpen(false)
  }

  const StarRating = ({ 
    value, 
    hover, 
    onChange, 
    onHover, 
    label 
  }: { 
    value: number
    hover: number
    onChange: (rating: number) => void
    onHover: (rating: number) => void
    label: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#1F2933]">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:ring-offset-2 rounded"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hover || value)
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'fill-none text-[#1F2933]/20'
              }`}
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2F5D50]/10"
        >
          {isSuccess ? (
            // Success State
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-[#2F5D50] rounded-full mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-serif text-[#1F2933] mb-2">
                Terima Kasih!
              </h3>
              <p className="text-[#1F2933]/70 leading-relaxed">
                Feedback Anda sangat berharga untuk meningkatkan kualitas program pembelajaran
              </p>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#2F5D50]/10 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-[#1F2933] mb-1">
                    Bagaimana Pengalaman Anda?
                  </h3>
                  <p className="text-sm text-[#1F2933]/70">
                    Bantu kami meningkatkan kualitas program pembelajaran
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1F2933]/50 hover:text-[#1F2933] hover:bg-[#F4F7F5] rounded-lg transition-all"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Overall Rating - Required */}
                <div className="bg-[#2F5D50]/5 rounded-lg p-4 border border-[#2F5D50]/10">
                  <StarRating
                    value={overallRating}
                    hover={overallHover}
                    onChange={setOverallRating}
                    onHover={setOverallHover}
                    label="Rating Keseluruhan *"
                  />
                  <p className="text-xs text-[#1F2933]/60 mt-2">
                    Bagaimana penilaian Anda secara keseluruhan terhadap program ini?
                  </p>
                </div>

                {/* Optional Detailed Ratings */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-[#1F2933]/70">
                    Rating Detail (Opsional)
                  </p>
                  
                  <StarRating
                    value={contentQuality}
                    hover={contentHover}
                    onChange={setContentQuality}
                    onHover={setContentHover}
                    label="Kualitas Materi"
                  />

                  <StarRating
                    value={easeOfUse}
                    hover={easeHover}
                    onChange={setEaseOfUse}
                    onHover={setEaseHover}
                    label="Kemudahan Penggunaan"
                  />

                  <StarRating
                    value={chatbotHelpful}
                    hover={chatbotHover}
                    onChange={setChatbotHelpful}
                    onHover={setChatbotHover}
                    label="Kegunaan Chatbot"
                  />
                </div>

                {/* Positive Feedback */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2933]">
                    Apa yang Anda Sukai? (Opsional)
                  </label>
                  <textarea
                    value={positiveFeedback}
                    onChange={(e) => setPositiveFeedback(e.target.value)}
                    placeholder="Ceritakan hal-hal yang Anda sukai dari program ini..."
                    className="w-full min-h-[100px] px-4 py-3 border border-[#2F5D50]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent resize-none text-sm text-[#1F2933] placeholder:text-[#1F2933]/40"
                    maxLength={500}
                  />
                  <p className="text-xs text-[#1F2933]/60 text-right">
                    {positiveFeedback.length}/500
                  </p>
                </div>

                {/* Improvement Feedback */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F2933]">
                    Apa yang Perlu Diperbaiki? (Opsional)
                  </label>
                  <textarea
                    value={improvementFeedback}
                    onChange={(e) => setImprovementFeedback(e.target.value)}
                    placeholder="Bagikan saran Anda untuk meningkatkan program ini..."
                    className="w-full min-h-[100px] px-4 py-3 border border-[#2F5D50]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent resize-none text-sm text-[#1F2933] placeholder:text-[#1F2933]/40"
                    maxLength={500}
                  />
                  <p className="text-xs text-[#1F2933]/60 text-right">
                    {improvementFeedback.length}/500
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-lg p-3 flex items-center gap-2"
                  >
                    <X className="w-5 h-5 text-[#E07A5F] flex-shrink-0" strokeWidth={2} />
                    <p className="text-sm text-[#E07A5F]">{error}</p>
                  </motion.div>
                )}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2F5D50]/10">
                  <button
                    type="submit"
                    disabled={isSubmitting || overallRating === 0}
                    className="flex-1 min-h-[48px] bg-[#2F5D50] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#274E43] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" strokeWidth={2} />
                        Kirim Feedback
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    className="flex-1 min-h-[48px] border-2 border-[#2F5D50]/30 text-[#2F5D50] px-6 py-3 rounded-lg font-medium hover:border-[#2F5D50] hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lewati
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
