'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Star, MessageSquare, TrendingUp, Users, Download } from 'lucide-react'
import { formatNumberIndonesian } from '@/lib/utils/date-formatter'

interface FeedbackData {
  id: string
  user_id: string
  overall_rating: number
  content_quality: number | null
  ease_of_use: number | null
  chatbot_helpful: number | null
  positive_feedback: string | null
  improvement_feedback: string | null
  pre_test_score: number | null
  post_test_score: number | null
  improvement_percentage: number | null
  created_at: string
  mother_profiles: {
    name: string
    phone: string
  }
}

interface FeedbackStats {
  total_feedback: number
  average_rating: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export default function AdminFeedbackPage() {
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([])
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/feedback')
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login')
          return
        }
        throw new Error(data.error || 'Gagal memuat feedback')
      }

      setFeedbackList(data.data || [])
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!feedbackList.length) return

    const headers = [
      'Nama',
      'Telepon',
      'Rating Keseluruhan',
      'Kualitas Materi',
      'Kemudahan Penggunaan',
      'Kegunaan Chatbot',
      'Pre-Test Score',
      'Post-Test Score',
      'Peningkatan (%)',
      'Feedback Positif',
      'Saran Perbaikan',
      'Tanggal Submit'
    ]

    const rows = feedbackList.map(f => [
      f.mother_profiles.name,
      f.mother_profiles.phone,
      f.overall_rating,
      f.content_quality || '-',
      f.ease_of_use || '-',
      f.chatbot_helpful || '-',
      f.pre_test_score || '-',
      f.post_test_score || '-',
      f.improvement_percentage ? `${f.improvement_percentage}%` : '-',
      f.positive_feedback ? `"${f.positive_feedback.replace(/"/g, '""')}"` : '-',
      f.improvement_feedback ? `"${f.improvement_feedback.replace(/"/g, '""')}"` : '-',
      new Date(f.created_at).toLocaleDateString('id-ID')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-[#F59E0B] text-[#F59E0B]'
              : 'fill-none text-[#1F2933]/20'
          }`}
          strokeWidth={2}
        />
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#2F5D50]/20 border-t-[#2F5D50] mx-auto mb-4"></div>
          <p className="text-[#1F2933]/70 text-sm">Memuat feedback...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center border border-[#2F5D50]/10"
        >
          <p className="text-[#E07A5F] mb-6">{error}</p>
          <button
            onClick={fetchFeedback}
            className="min-h-[48px] px-6 py-3 bg-[#2F5D50] text-white rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all"
          >
            Coba Lagi
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-50 min-h-[48px] min-w-[48px] p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-[#2F5D50]/10"
        >
          <svg className="w-6 h-6 text-[#1F2933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-2">
                  Rating & Masukan Pengguna
                </h2>
                <p className="text-sm text-[#1F2933]/70">
                  Feedback dari responden yang telah menyelesaikan program
                </p>
              </div>
              <button
                onClick={exportToCSV}
                disabled={!feedbackList.length}
                className="min-h-[48px] px-6 py-3 bg-[#2F5D50] text-white rounded-lg font-medium hover:bg-[#274E43] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" strokeWidth={2} />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-[#2F5D50]/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2933]/70 mb-1">Total Feedback</p>
                    <p className="text-2xl font-bold text-[#1F2933]">{stats.total_feedback}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-[#2F5D50]/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2933]/70 mb-1">Rating Rata-rata</p>
                    <p className="text-2xl font-bold text-[#1F2933]">
                      {formatNumberIndonesian(stats.average_rating, 1)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-[#2F5D50]/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2933]/70 mb-1">Rating 5 Bintang</p>
                    <p className="text-2xl font-bold text-[#1F2933]">
                      {stats.rating_distribution[5]}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-[#2F5D50]/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2933]/70 mb-1">Dengan Komentar</p>
                    <p className="text-2xl font-bold text-[#1F2933]">
                      {feedbackList.filter(f => f.positive_feedback || f.improvement_feedback).length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Rating Distribution */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-[#2F5D50]/10 mb-6 sm:mb-8"
            >
              <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Distribusi Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution]
                  const percentage = stats.total_feedback > 0 ? (count / stats.total_feedback) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium text-[#1F2933]">{rating}</span>
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" strokeWidth={2} />
                      </div>
                      <div className="flex-1 h-6 bg-[#F4F7F5] rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-[#F59E0B] rounded-lg"
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1F2933] w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Feedback List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-[#2F5D50]/10 overflow-hidden"
          >
            <div className="p-6 border-b border-[#2F5D50]/10">
              <h3 className="text-lg font-semibold text-[#1F2933]">
                Semua Feedback ({feedbackList.length})
              </h3>
            </div>

            {feedbackList.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-[#1F2933]/20 mx-auto mb-4" strokeWidth={2} />
                <p className="text-[#1F2933]/70">Belum ada feedback dari pengguna</p>
              </div>
            ) : (
              <div className="divide-y divide-[#2F5D50]/10">
                {feedbackList.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="p-6 hover:bg-[#F4F7F5] transition-colors cursor-pointer"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#1F2933]">
                            {feedback.mother_profiles.name}
                          </h4>
                          <StarDisplay rating={feedback.overall_rating} />
                        </div>
                        <p className="text-sm text-[#1F2933]/70 mb-3">
                          {feedback.mother_profiles.phone}
                        </p>
                        
                        {/* Score Info */}
                        {feedback.pre_test_score !== null && feedback.post_test_score !== null && (
                          <div className="flex items-center gap-4 mb-3 text-sm">
                            <span className="text-[#1F2933]/70">
                              Pre: {feedback.pre_test_score}/23
                            </span>
                            <span className="text-[#1F2933]/70">→</span>
                            <span className="text-[#2F5D50] font-medium">
                              Post: {feedback.post_test_score}/23
                            </span>
                            {feedback.improvement_percentage !== null && (
                              <span className="text-[#2F5D50] font-medium">
                                (+{formatNumberIndonesian(feedback.improvement_percentage, 1)}%)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Feedback Preview */}
                        {feedback.positive_feedback && (
                          <p className="text-sm text-[#1F2933] line-clamp-2 mb-2">
                            💚 {feedback.positive_feedback}
                          </p>
                        )}
                        {feedback.improvement_feedback && (
                          <p className="text-sm text-[#1F2933]/70 line-clamp-2">
                            💡 {feedback.improvement_feedback}
                          </p>
                        )}
                      </div>

                      <div className="text-sm text-[#1F2933]/60">
                        {new Date(feedback.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFeedback(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2F5D50]/10"
          >
            <div className="sticky top-0 bg-white border-b border-[#2F5D50]/10 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif text-[#1F2933] mb-1">
                  {selectedFeedback.mother_profiles.name}
                </h3>
                <p className="text-sm text-[#1F2933]/70">
                  {selectedFeedback.mother_profiles.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1F2933]/50 hover:text-[#1F2933] hover:bg-[#F4F7F5] rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Rating */}
              <div>
                <p className="text-sm font-medium text-[#1F2933]/70 mb-2">Rating Keseluruhan</p>
                <StarDisplay rating={selectedFeedback.overall_rating} />
              </div>

              {/* Detailed Ratings */}
              {(selectedFeedback.content_quality || selectedFeedback.ease_of_use || selectedFeedback.chatbot_helpful) && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#1F2933]/70">Rating Detail</p>
                  {selectedFeedback.content_quality && (
                    <div>
                      <p className="text-sm text-[#1F2933] mb-1">Kualitas Materi</p>
                      <StarDisplay rating={selectedFeedback.content_quality} />
                    </div>
                  )}
                  {selectedFeedback.ease_of_use && (
                    <div>
                      <p className="text-sm text-[#1F2933] mb-1">Kemudahan Penggunaan</p>
                      <StarDisplay rating={selectedFeedback.ease_of_use} />
                    </div>
                  )}
                  {selectedFeedback.chatbot_helpful && (
                    <div>
                      <p className="text-sm text-[#1F2933] mb-1">Kegunaan Chatbot</p>
                      <StarDisplay rating={selectedFeedback.chatbot_helpful} />
                    </div>
                  )}
                </div>
              )}

              {/* Score Progress */}
              {selectedFeedback.pre_test_score !== null && selectedFeedback.post_test_score !== null && (
                <div className="bg-[#F4F7F5] rounded-lg p-4">
                  <p className="text-sm font-medium text-[#1F2933]/70 mb-3">Progress Pembelajaran</p>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-[#1F2933]/60 mb-1">Pre-Test</p>
                      <p className="text-2xl font-bold text-[#1F2933]">{selectedFeedback.pre_test_score}</p>
                    </div>
                    <div className="text-2xl text-[#1F2933]/40">→</div>
                    <div className="text-center">
                      <p className="text-xs text-[#1F2933]/60 mb-1">Post-Test</p>
                      <p className="text-2xl font-bold text-[#2F5D50]">{selectedFeedback.post_test_score}</p>
                    </div>
                    {selectedFeedback.improvement_percentage !== null && (
                      <>
                        <div className="text-2xl text-[#1F2933]/40">=</div>
                        <div className="text-center">
                          <p className="text-xs text-[#1F2933]/60 mb-1">Peningkatan</p>
                          <p className="text-2xl font-bold text-[#2F5D50]">
                            +{formatNumberIndonesian(selectedFeedback.improvement_percentage, 1)}%
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Positive Feedback */}
              {selectedFeedback.positive_feedback && (
                <div>
                  <p className="text-sm font-medium text-[#1F2933]/70 mb-2">Yang Disukai</p>
                  <div className="bg-[#2F5D50]/5 rounded-lg p-4 border border-[#2F5D50]/10">
                    <p className="text-sm text-[#1F2933] leading-relaxed">
                      {selectedFeedback.positive_feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Improvement Feedback */}
              {selectedFeedback.improvement_feedback && (
                <div>
                  <p className="text-sm font-medium text-[#1F2933]/70 mb-2">Saran Perbaikan</p>
                  <div className="bg-[#E07A5F]/5 rounded-lg p-4 border border-[#E07A5F]/10">
                    <p className="text-sm text-[#1F2933] leading-relaxed">
                      {selectedFeedback.improvement_feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-sm text-[#1F2933]/60 text-center pt-4 border-t border-[#2F5D50]/10">
                Dikirim pada {new Date(selectedFeedback.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
