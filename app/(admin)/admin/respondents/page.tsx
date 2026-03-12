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
            onClick={fetchRespondents}
            className="min-h-[48px] px-6 py-3 bg-[#2F5D50] text-white rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all shadow-sm"
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
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-2">Data Responden</h2>
                <p className="text-sm text-[#1F2933]/70">
                  Kelola dan pantau data semua responden
                </p>
              </div>
              <ExportButton />
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2F5D50]/10">
              <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-1">Total Responden</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1F2933]">{respondents.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2F5D50]/10">
              <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-1">Sedang Berlangsung</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#2563EB]">
                {respondents.filter((r) => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2F5D50]/10">
              <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-1">Selesai</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#10B981]">
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
