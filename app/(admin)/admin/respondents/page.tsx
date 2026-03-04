'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import RespondentTable from '@/components/admin/RespondentTable'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ExportButton } from '@/components/admin/ExportButton'
import { X } from 'lucide-react'

interface Respondent {
  user_id: string
  email: string
  mother_name: string
  mother_age: number
  mother_religion: string
  mother_occupation: string
  mother_address: string
  mother_phone: string
  child_name: string
  child_birth_date: string
  child_gender: string
  child_age_years: number
  child_age_months: number
  child_age_days: number
  pre_test_score: number | null
  post_test_score: number | null
  sessions_completed: number
  status: string
  created_at: string
}

export default function RespondentsPage() {
  const router = useRouter()
  const [respondents, setRespondents] = useState<Respondent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchRespondents()
  }, [searchQuery, filterStatus])

  const fetchRespondents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterStatus !== 'all') params.append('filter', filterStatus)

      const response = await fetch(`/api/admin/respondents?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login')
          return
        }
        throw new Error(data.error || 'Gagal memuat data responden')
      }

      setRespondents(data.respondents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = (filter: string) => {
    setFilterStatus(filter)
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
            onClick={fetchRespondents}
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

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Responden</h2>
              <p className="text-gray-600">
                Kelola dan pantau data semua responden
              </p>
            </div>
            <ExportButton />
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Total Responden</p>
              <p className="text-3xl font-bold text-gray-900">{respondents.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Sedang Berlangsung</p>
              <p className="text-3xl font-bold text-blue-600">
                {respondents.filter((r) => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Selesai</p>
              <p className="text-3xl font-bold text-green-600">
                {respondents.filter((r) => r.status === 'completed').length}
              </p>
            </div>
          </motion.div>

          {/* Respondent Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <RespondentTable
              respondents={respondents}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
