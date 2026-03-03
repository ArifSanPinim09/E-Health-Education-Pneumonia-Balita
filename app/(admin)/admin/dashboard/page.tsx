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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-30 p-3 bg-white rounded-xl shadow-lg"
        >
          <svg
            className="w-6 h-6"
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
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Statistik</h2>
              <p className="text-gray-600">
                Ringkasan data responden dan hasil pembelajaran
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              description="Tes awal diselesaikan"
              color="green"
              index={1}
            />
            <StatsCard
              title="Post-Test Selesai"
              value={stats?.completed_post_tests || 0}
              icon={ClipboardList}
              description="Tes akhir diselesaikan"
              color="orange"
              index={2}
            />
            <StatsCard
              title="Rata-rata Pre-Test"
              value={`${formatNumberIndonesian(stats?.average_pre_score || 0, 1)}/23`}
              icon={TrendingUp}
              description="Skor tes awal"
              color="purple"
              index={3}
            />
            <StatsCard
              title="Rata-rata Post-Test"
              value={`${formatNumberIndonesian(stats?.average_post_score || 0, 1)}/23`}
              icon={Award}
              description="Skor tes akhir"
              color="pink"
              index={4}
            />
          </div>

          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Analisis Peningkatan Pengetahuan</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Comparison */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4">Perbandingan Skor</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Pre-Test</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatNumberIndonesian(stats?.average_pre_score || 0, 1)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
                        style={{
                          width: `${((stats?.average_pre_score || 0) / 23) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Post-Test</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatNumberIndonesian(stats?.average_post_score || 0, 1)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-1000"
                        style={{
                          width: `${((stats?.average_post_score || 0) / 23) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Percentage */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - Math.min(calculateImprovement(), 100) / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {calculateImprovement()}%
                    </span>
                    <span className="text-xs text-gray-500">Peningkatan</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Rata-rata peningkatan pengetahuan responden
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
