'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowLeft, Award, Calendar } from 'lucide-react'
import { UserNavbar } from '@/components/user/UserNavbar'

interface ReviewItem {
  id: string
  questionNumber: number
  questionText: string
  correctAnswer: boolean
  userAnswer: boolean
  isCorrect: boolean
}

interface ReviewData {
  score: number
  totalQuestions: number
  completedAt: string
  review: ReviewItem[]
}

export default function PostTestReviewPage() {
  const router = useRouter()
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileRes = await fetch('/api/profile/get')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }

      // Fetch review data
      const reviewRes = await fetch('/api/test/review-post')
      
      if (!reviewRes.ok) {
        if (reviewRes.status === 401) {
          router.push('/login')
          return
        }
        if (reviewRes.status === 404) {
          setError('Anda belum menyelesaikan post-test')
          return
        }
        throw new Error('Gagal mengambil data review')
      }

      const data = await reviewRes.json()
      if (data.success) {
        setReviewData(data)
      }
    } catch (err) {
      console.error('Error fetching review:', err)
      setError('Gagal memuat data review')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2F5D50] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#1F2933]/70 font-medium">Memuat review...</p>
        </div>
      </div>
    )
  }

  if (error || !reviewData) {
    return (
      <>
        {profile && <UserNavbar userName={profile.mother.name} />}
        <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4 pt-24">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 p-8 max-w-md text-center"
          >
            <div className="w-16 h-16 bg-[#E07A5F]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-[#E07A5F]" />
            </div>
            <p className="text-[#E07A5F] mb-6 font-medium">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </motion.div>
        </div>
      </>
    )
  }

  const correctCount = reviewData.review.filter(item => item.isCorrect).length
  const incorrectCount = reviewData.totalQuestions - correctCount
  const percentage = Math.round((correctCount / reviewData.totalQuestions) * 100)

  return (
    <>
      {profile && <UserNavbar userName={profile.mother.name} />}
      
      <div className="min-h-screen bg-[#F4F7F5] px-4 sm:px-6 lg:px-8 py-10 pt-24 sm:pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push('/results')}
              className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#274E43] mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali ke Hasil</span>
            </button>
            
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1F2933] mb-2">
              Review Jawaban Post-Test
            </h1>
            <p className="text-[#1F2933]/70">
              Lihat jawaban Anda dan bandingkan dengan jawaban yang benar
            </p>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 p-6 mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#2F5D50]/5 rounded-lg">
                <Award className="w-8 h-8 text-[#2F5D50] mx-auto mb-2" />
                <p className="text-sm text-[#1F2933]/60 mb-1">Skor Anda</p>
                <p className="text-3xl font-bold text-[#2F5D50]">
                  {reviewData.score}/{reviewData.totalQuestions}
                </p>
                <p className="text-sm text-[#1F2933]/60 mt-1">{percentage}%</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-[#1F2933]/60 mb-1">Benar</p>
                <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-[#1F2933]/60 mb-1">Salah</p>
                <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#2F5D50]/10 flex items-center justify-center gap-2 text-sm text-[#1F2933]/60">
              <Calendar className="w-4 h-4" />
              <span>
                Diselesaikan: {new Date(reviewData.completedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </motion.div>

          {/* Questions Review */}
          <div className="space-y-4">
            {reviewData.review.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.02 }}
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
                  item.isCorrect 
                    ? 'border-green-200' 
                    : 'border-red-200'
                }`}
              >
                {/* Question Header */}
                <div className={`p-4 flex items-center justify-between ${
                  item.isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-sm font-bold ${
                        item.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {item.questionNumber}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      item.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.isCorrect ? 'Jawaban Benar' : 'Jawaban Salah'}
                    </span>
                  </div>
                  
                  {item.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                {/* Question Content */}
                <div className="p-6">
                  <p className="text-[#1F2933] leading-relaxed mb-6">
                    {item.questionText}
                  </p>

                  <div className="space-y-3">
                    {/* User Answer */}
                    <div className={`p-4 rounded-lg border-2 ${
                      item.isCorrect 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#1F2933]/60 mb-1">Jawaban Anda:</p>
                          <p className={`font-semibold ${
                            item.isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {item.userAnswer ? 'Benar' : 'Salah'}
                          </p>
                        </div>
                        {item.isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>

                    {/* Correct Answer (only show if user was wrong) */}
                    {!item.isCorrect && (
                      <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[#1F2933]/60 mb-1">Jawaban yang Benar:</p>
                            <p className="font-semibold text-green-700">
                              {item.correctAnswer ? 'Benar' : 'Salah'}
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/results')}
              className="px-6 py-3 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-colors"
            >
              Lihat Hasil Lengkap
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border-2 border-[#2F5D50]/30 text-[#2F5D50] font-medium rounded-lg hover:border-[#2F5D50] hover:bg-[#F4F7F5] transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
