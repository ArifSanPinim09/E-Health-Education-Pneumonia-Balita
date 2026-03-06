'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, Award, Star, Sparkles } from 'lucide-react'

interface ResultsData {
  preScore: number
  postScore: number
}

// Balloon component for celebration animation
const Balloon = ({ delay, color, left }: { delay: number; color: string; left: string }) => {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0, rotate: 0 }}
      animate={{ 
        y: '-100vh', 
        opacity: [0, 1, 1, 0],
        rotate: [0, 10, -10, 5, -5, 0],
        x: [0, 20, -20, 10, -10, 0]
      }}
      transition={{ 
        duration: 6,
        delay: delay,
        ease: "easeOut"
      }}
      className="fixed pointer-events-none z-50"
      style={{ left }}
    >
      <div className={`w-12 h-14 ${color} rounded-full relative shadow-lg`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-400"></div>
      </div>
    </motion.div>
  )
}

// Confetti component
const Confetti = ({ delay }: { delay: number }) => {
  const colors = ['bg-[#2F5D50]', 'bg-[#E07A5F]', 'bg-yellow-400', 'bg-blue-400', 'bg-pink-400']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomLeft = Math.random() * 100
  const randomRotate = Math.random() * 360
  
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{ 
        y: '100vh', 
        opacity: [0, 1, 1, 0],
        rotate: randomRotate
      }}
      transition={{ 
        duration: 3,
        delay: delay,
        ease: "easeIn"
      }}
      className={`fixed w-2 h-2 ${randomColor} pointer-events-none z-50`}
      style={{ left: `${randomLeft}%` }}
    />
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch('/api/progress/get')

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Gagal mengambil data hasil')
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Gagal mengambil data hasil')
        }

        if (!data.data.pre_test_completed || !data.data.post_test_completed) {
          router.push('/dashboard')
          return
        }

        setResults({
          preScore: data.data.pre_test_score || 0,
          postScore: data.data.post_test_score || 0,
        })
        
        // Trigger celebration animation
        setTimeout(() => setShowCelebration(true), 500)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2F5D50] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#1F2933]/70 font-medium">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 p-8 max-w-md w-full text-center">
          <p className="text-[#E07A5F] mb-6 font-medium">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-6 h-12 bg-[#2F5D50] text-white rounded-lg font-medium hover:bg-[#274E43] transition-all duration-200"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  const maxScore = 23
  const improvement = results.postScore - results.preScore
  const improvementPercentage = ((improvement / maxScore) * 100).toFixed(1)
  const prePercentage = ((results.preScore / maxScore) * 100).toFixed(1)
  const postPercentage = ((results.postScore / maxScore) * 100).toFixed(1)

  // Determine achievement level
  const getAchievementLevel = () => {
    const percentage = parseFloat(postPercentage)
    if (percentage >= 90) return { title: 'Luar Biasa!', color: 'text-[#2F5D50]', icon: '🏆' }
    if (percentage >= 75) return { title: 'Sangat Baik!', color: 'text-[#2F5D50]', icon: '⭐' }
    if (percentage >= 60) return { title: 'Baik!', color: 'text-blue-600', icon: '👍' }
    return { title: 'Terus Belajar!', color: 'text-[#E07A5F]', icon: '💪' }
  }

  const achievement = getAchievementLevel()

  return (
    <div className="min-h-screen bg-[#F4F7F5] px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Celebration Animations */}
      <AnimatePresence>
        {showCelebration && improvement >= 0 && (
          <>
            {/* Balloons */}
            <Balloon delay={0} color="bg-[#2F5D50]" left="10%" />
            <Balloon delay={0.3} color="bg-[#E07A5F]" left="25%" />
            <Balloon delay={0.6} color="bg-yellow-400" left="40%" />
            <Balloon delay={0.9} color="bg-blue-400" left="60%" />
            <Balloon delay={1.2} color="bg-pink-400" left="75%" />
            <Balloon delay={1.5} color="bg-[#2F5D50]" left="90%" />
            
            {/* Confetti */}
            {Array.from({ length: 30 }).map((_, i) => (
              <Confetti key={i} delay={i * 0.1} />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Trophy */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2F5D50] to-[#274E43] rounded-full mb-4 shadow-lg"
          >
            <Award className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1F2933] mb-2">
            Selamat! {achievement.icon}
          </h1>
          <p className="text-[#1F2933]/70 leading-relaxed">
            Anda telah menyelesaikan program pembelajaran
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-[#2F5D50]/10 overflow-hidden"
        >
          {/* Achievement Banner */}
          <div className="bg-gradient-to-r from-[#2F5D50]/10 via-[#2F5D50]/5 to-transparent p-6 border-b border-[#2F5D50]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#2F5D50]" strokeWidth={2} fill="currentColor" />
                </div>
                <div>
                  <h2 className={`text-xl font-serif ${achievement.color}`}>
                    {achievement.title}
                  </h2>
                  <p className="text-sm text-[#1F2933]/70">
                    Skor Post-Test: {postPercentage}%
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3, delay: 1 }}
              >
                <Sparkles className="w-8 h-8 text-[#E07A5F]" strokeWidth={2} />
              </motion.div>
            </div>
          </div>

          {/* Score Comparison */}
          <div className="p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Pre-Test Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-6 border-2 border-blue-200"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-3">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <p className="text-sm font-medium text-blue-700 mb-2">Pre-Test</p>
                  <p className="text-4xl font-bold text-blue-900 mb-2">
                    {results.preScore}
                  </p>
                  <p className="text-sm text-blue-700 mb-3">dari {maxScore} soal</p>
                  <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prePercentage}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-blue-700 mt-2">{prePercentage}%</p>
                </div>
              </motion.div>

              {/* Post-Test Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#2F5D50]/10 to-[#2F5D50]/20 rounded-lg p-6 border-2 border-[#2F5D50]/30"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2F5D50] rounded-lg mb-3">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <p className="text-sm font-medium text-[#2F5D50] mb-2">Post-Test</p>
                  <p className="text-4xl font-bold text-[#1F2933] mb-2">
                    {results.postScore}
                  </p>
                  <p className="text-sm text-[#2F5D50] mb-3">dari {maxScore} soal</p>
                  <div className="w-full bg-[#2F5D50]/20 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${postPercentage}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-[#2F5D50] rounded-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-[#2F5D50] mt-2">{postPercentage}%</p>
                </div>
              </motion.div>
            </div>

            {/* Improvement Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className={`rounded-lg p-6 border-2 ${
                improvement > 0
                  ? 'bg-gradient-to-br from-[#2F5D50]/10 to-[#2F5D50]/5 border-[#2F5D50]/30'
                  : improvement === 0
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
                  : 'bg-gradient-to-br from-[#E07A5F]/10 to-[#E07A5F]/5 border-[#E07A5F]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    improvement > 0
                      ? 'bg-[#2F5D50]'
                      : improvement === 0
                      ? 'bg-blue-500'
                      : 'bg-[#E07A5F]'
                  }`}>
                    <TrendingUp className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1F2933]/70 mb-1">Peningkatan</p>
                    <p className={`text-4xl font-bold ${
                      improvement > 0
                        ? 'text-[#2F5D50]'
                        : improvement === 0
                        ? 'text-blue-600'
                        : 'text-[#E07A5F]'
                    }`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </p>
                    <p className="text-sm text-[#1F2933]/70 mt-1">
                      {improvement > 0 ? `+${improvementPercentage}%` : `${improvementPercentage}%`} dari skor awal
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-medium ${
                    improvement > 0
                      ? 'text-[#2F5D50]'
                      : improvement === 0
                      ? 'text-blue-600'
                      : 'text-[#E07A5F]'
                  }`}>
                    {improvement > 0
                      ? 'Pengetahuan Meningkat!'
                      : improvement === 0
                      ? 'Skor Konsisten'
                      : 'Tetap Semangat!'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F5D50]/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
                <p className="text-sm font-medium text-[#2F5D50]">
                  Program Pembelajaran Selesai
                </p>
              </div>
              <p className="text-[#1F2933]/70 leading-relaxed max-w-2xl mx-auto">
                Terima kasih telah menyelesaikan program pembelajaran. Semoga ilmu yang didapat bermanfaat untuk menjaga kesehatan buah hati Anda.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-6 bg-[#F4F7F5] border-t border-[#2F5D50]/10">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#2F5D50] text-white px-6 h-12 rounded-lg font-medium hover:bg-[#274E43] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Kembali ke Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
