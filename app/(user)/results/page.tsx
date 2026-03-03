'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface ResultsData {
  preScore: number
  postScore: number
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
  const prePercentage = ((results.preScore / maxScore) * 100).toFixed(1)
  const postPercentage = ((results.postScore / maxScore) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-6">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Hasil Pembelajaran
            </h1>
            <p className="text-sm text-gray-600">
              Selamat! Anda telah menyelesaikan program pembelajaran
            </p>
          </div>

          {/* Score Comparison */}
          <div className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Pre-Test */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Pre-Test</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {results.preScore}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">dari {maxScore} soal</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prePercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{prePercentage}%</p>
                </div>
              </div>

              {/* Post-Test */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Post-Test</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {results.postScore}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">dari {maxScore} soal</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${postPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full bg-green-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{postPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Improvement */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">Peningkatan</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">
                  {improvement > 0 ? '+' : ''}{improvement}
                </p>
                <p className="text-sm text-gray-600">
                  {improvement > 0
                    ? 'Pengetahuan Anda meningkat!'
                    : improvement === 0
                    ? 'Skor Anda konsisten'
                    : 'Tetap semangat belajar!'}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>Terima kasih telah menyelesaikan program pembelajaran</p>
              <p>Semoga ilmu yang didapat bermanfaat untuk menjaga kesehatan buah hati</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Kembali ke Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
