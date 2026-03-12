'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import StatsCard from '@/components/admin/StatsCard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ExportButton } from '@/components/admin/ExportButton'
import { formatNumberIndonesian } from '@/lib/utils/date-formatter'
import {
  Users,
  ClipboardCheck,
  ClipboardList,
  TrendingUp,
  Award,
  X,
} from 'lucide-react'

interface AdminStats {
  total_users: number
  completed_pre_tests: number
  completed_post_tests: number
  average_pre_score: number
  average_post_score: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login')
          return
        }
        throw new Error(data.error || 'Gagal memuat statistik')
      }

      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const calculateImprovement = () => {
    if (!stats || stats.average_pre_score === 0) return 0
    return Math.round(
      ((stats.average_post_score - stats.average_pre_score) / stats.average_pre_score) * 100
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#2F5D50]/20 border-t-[#2F5D50] mx-auto mb-4"></div>
          </div>
          <p className="text-[#1F2933]/70 text-sm">Memuat data...</p>
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
          <div className="w-14 h-14 bg-[#E07A5F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-7 h-7 text-[#E07A5F]" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-[#1F2933]/70 mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="min-h-[48px] px-6 py-3 bg-[#2F5D50] text-white rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all shadow-sm"
          >
            Coba Lagi
          </button>
        </motion.div>
      </div>
    )
  }

  const completionRate = stats?.total_users ? 
    Math.round((stats.completed_post_tests / stats.total_users) * 100) : 0
  
  const engagementRate = stats?.total_users ?
    Math.round((stats.completed_pre_tests / stats.total_users) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-50 min-h-[48px] min-w-[48px] p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-[#2F5D50]/10"
        >
          <svg
            className="w-6 h-6 text-[#1F2933]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
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
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-2">Dashboard Statistik</h2>
                <p className="text-sm text-[#1F2933]/70">
                  Ringkasan data responden dan hasil pembelajaran
                </p>
              </div>
              <ExportButton />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatsCard
              title="Total Responden"
              value={stats?.total_users || 0}
              icon={Users}
              description="Pengguna terdaftar"
              color="blue"
              index={0}
            />
            <StatsCard
              title="Pre-Test Selesai"
              value={stats?.completed_pre_tests || 0}
              icon={ClipboardCheck}
              description={`${engagementRate}% dari total responden`}
              color="green"
              index={1}
            />
            <StatsCard
              title="Post-Test Selesai"
              value={stats?.completed_post_tests || 0}
              icon={ClipboardList}
              description={`${completionRate}% tingkat penyelesaian`}
              color="orange"
              index={2}
            />
            <StatsCard
              title="Rata-rata Pre-Test"
              value={`${formatNumberIndonesian(stats?.average_pre_score || 0, 1)}/23`}
              icon={TrendingUp}
              description={`${Math.round(((stats?.average_pre_score || 0) / 23) * 100)}% skor awal`}
              color="purple"
              index={3}
            />
            <StatsCard
              title="Rata-rata Post-Test"
              value={`${formatNumberIndonesian(stats?.average_post_score || 0, 1)}/23`}
              icon={Award}
              description={`${Math.round(((stats?.average_post_score || 0) / 23) * 100)}% skor akhir`}
              color="pink"
              index={4}
            />
            <StatsCard
              title="Peningkatan Rata-rata"
              value={`${calculateImprovement()}%`}
              icon={TrendingUp}
              description="Perubahan pengetahuan"
              color="green"
              index={5}
            />
          </div>

          {/* Detailed Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Score Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2F5D50]/10"
            >
              <h3 className="text-base sm:text-lg font-semibold text-[#1F2933] mb-4 sm:mb-6">Distribusi Skor</h3>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Pre-Test Distribution */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Pre-Test</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                      {formatNumberIndonesian(stats?.average_pre_score || 0, 1)} / 23
                    </span>
                  </div>
                  <div className="h-3 bg-[#F4F7F5] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((stats?.average_pre_score || 0) / 23) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-[#1F2933]/60 mt-1">
                    {Math.round(((stats?.average_pre_score || 0) / 23) * 100)}% dari skor maksimal
                  </p>
                </div>

                {/* Post-Test Distribution */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Post-Test</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                      {formatNumberIndonesian(stats?.average_post_score || 0, 1)} / 23
                    </span>
                  </div>
                  <div className="h-3 bg-[#F4F7F5] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((stats?.average_post_score || 0) / 23) * 100}%` }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-[#1F2933]/60 mt-1">
                    {Math.round(((stats?.average_post_score || 0) / 23) * 100)}% dari skor maksimal
                  </p>
                </div>

                {/* Improvement Indicator */}
                <div className="pt-4 border-t border-[#2F5D50]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Peningkatan</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${calculateImprovement() >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-base sm:text-lg font-bold ${calculateImprovement() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {calculateImprovement() >= 0 ? '+' : ''}{calculateImprovement()}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Completion Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2F5D50]/10"
            >
              <h3 className="text-base sm:text-lg font-semibold text-[#1F2933] mb-4 sm:mb-6">Funnel Penyelesaian</h3>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Total Users */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Total Pendaftar</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                      {stats?.total_users || 0}
                    </span>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium">100%</span>
                  </div>
                </div>

                {/* Pre-Test Completed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Menyelesaikan Pre-Test</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                      {stats?.completed_pre_tests || 0}
                    </span>
                  </div>
                  <div 
                    className="h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center transition-all"
                    style={{ width: `${engagementRate}%` }}
                  >
                    <span className="text-white text-xs sm:text-sm font-medium">{engagementRate}%</span>
                  </div>
                </div>

                {/* Post-Test Completed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]/70">Menyelesaikan Post-Test</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                      {stats?.completed_post_tests || 0}
                    </span>
                  </div>
                  <div 
                    className="h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center transition-all"
                    style={{ width: `${completionRate}%` }}
                  >
                    <span className="text-white text-xs sm:text-sm font-medium">{completionRate}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-[#2F5D50]/10"
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#1F2933] mb-4 sm:mb-6">Analisis Peningkatan Pengetahuan</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Score Comparison */}
              <div>
                <h4 className="text-sm font-semibold text-[#1F2933]/70 mb-4">Perbandingan Skor Rata-rata</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-[#1F2933]/70">Pre-Test</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                        {formatNumberIndonesian(stats?.average_pre_score || 0, 1)}
                      </span>
                    </div>
                    <div className="h-3 bg-[#F4F7F5] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats?.average_pre_score || 0) / 23) * 100}%` }}
                        transition={{ duration: 1, delay: 1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-[#1F2933]/70">Post-Test</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                        {formatNumberIndonesian(stats?.average_post_score || 0, 1)}
                      </span>
                    </div>
                    <div className="h-3 bg-[#F4F7F5] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats?.average_post_score || 0) / 23) * 100}%` }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Percentage */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="#F4F7F5"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                      animate={{ 
                        strokeDashoffset: `${2 * Math.PI * 70 * (1 - Math.min(Math.abs(calculateImprovement()), 100) / 100)}`
                      }}
                      transition={{ duration: 1.5, delay: 1.3 }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1F2933]">
                      {calculateImprovement() >= 0 ? '+' : ''}{calculateImprovement()}%
                    </span>
                    <span className="text-xs text-[#1F2933]/60">Peningkatan</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#1F2933]/70 mt-4 text-center max-w-xs">
                  Rata-rata peningkatan pengetahuan responden setelah menyelesaikan program
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
