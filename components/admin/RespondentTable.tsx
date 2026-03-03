'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateIndonesian } from '@/lib/utils/date-formatter'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Baby,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
} from 'lucide-react'

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

interface RespondentTableProps {
  respondents: Respondent[]
  onSearch: (query: string) => void
  onFilter: (filter: string) => void
}

export default function RespondentTable({
  respondents,
  onSearch,
  onFilter,
}: RespondentTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRespondent, setSelectedRespondent] = useState<Respondent | null>(null)
  const [sortField, setSortField] = useState<'name' | 'date' | 'progress'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilter = (filter: string) => {
    setFilterStatus(filter)
    onFilter(filter)
  }

  const handleSort = (field: 'name' | 'date' | 'progress') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedRespondents = [...respondents].sort((a, b) => {
    let comparison = 0
    if (sortField === 'name') {
      comparison = a.mother_name.localeCompare(b.mother_name)
    } else if (sortField === 'date') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    } else if (sortField === 'progress') {
      comparison = a.sessions_completed - b.sessions_completed
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        )
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Berlangsung
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Belum Mulai
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return formatDateIndonesian(dateString)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama ibu, anak, atau email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => handleFilter(e.target.value)}
            className="pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="in-progress">Berlangsung</option>
            <option value="not-started">Belum Mulai</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Nama Ibu
                    {sortField === 'name' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Nama Anak
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Pre-Test
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Post-Test
                </th>
                <th
                  onClick={() => handleSort('progress')}
                  className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    Sesi
                    {sortField === 'progress' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Tanggal Daftar
                    {sortField === 'date' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRespondents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data responden
                  </td>
                </tr>
              ) : (
                sortedRespondents.map((respondent, index) => (
                  <motion.tr
                    key={respondent.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {respondent.mother_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{respondent.child_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{respondent.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`text-sm font-medium ${
                          respondent.pre_test_score !== null
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {respondent.pre_test_score !== null
                          ? `${respondent.pre_test_score}/23`
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`text-sm font-medium ${
                          respondent.post_test_score !== null
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {respondent.post_test_score !== null
                          ? `${respondent.post_test_score}/23`
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {respondent.sessions_completed}/5
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(respondent.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(respondent.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelectedRespondent(respondent)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRespondent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRespondent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Detail Responden</h3>
                <button
                  onClick={() => setSelectedRespondent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Mother Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-bold text-gray-900">Data Ibu</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nama</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Usia</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_age} tahun
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Agama</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_religion}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pekerjaan</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_occupation}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.email}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Telepon
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_phone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Alamat
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.mother_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Child Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Baby className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-bold text-gray-900">Data Anak</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nama</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.child_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.child_gender === 'male'
                          ? 'Laki-laki'
                          : 'Perempuan'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Tanggal Lahir
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedRespondent.child_birth_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Usia</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRespondent.child_age_years} tahun{' '}
                        {selectedRespondent.child_age_months} bulan{' '}
                        {selectedRespondent.child_age_days} hari
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-bold text-gray-900">Progress Pembelajaran</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-purple-600 mb-1">Pre-Test</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {selectedRespondent.pre_test_score !== null
                          ? `${selectedRespondent.pre_test_score}/23`
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-blue-600 mb-1">Sesi Selesai</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedRespondent.sessions_completed}/5
                      </p>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-pink-600 mb-1">Post-Test</p>
                      <p className="text-2xl font-bold text-pink-900">
                        {selectedRespondent.post_test_score !== null
                          ? `${selectedRespondent.post_test_score}/23`
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {getStatusBadge(selectedRespondent.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Tanggal Daftar</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedRespondent.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
