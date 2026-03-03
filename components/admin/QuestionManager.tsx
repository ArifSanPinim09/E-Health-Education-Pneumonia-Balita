'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface QuizQuestion {
  id: string
  question_text: string
  correct_answer: boolean
  order_number: number
  created_at?: string
  updated_at?: string
}

export function QuestionManager() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAnswer, setFilterAnswer] = useState<'all' | 'true' | 'false'>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    question_text: '',
    correct_answer: true,
    order_number: 1,
  })

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions()
  }, [])

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/questions', {
        credentials: 'include',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal mengambil data pertanyaan')
      }

      setQuestions(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal membuat pertanyaan')
      }

      // Reset form and refresh list
      setFormData({
        question_text: '',
        correct_answer: true,
        order_number: questions.length + 1,
      })
      setIsDialogOpen(false)
      setSuccess('Pertanyaan berhasil ditambahkan!')
      await fetchQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/questions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal memperbarui pertanyaan')
      }

      // Reset form and refresh list
      setFormData({
        question_text: '',
        correct_answer: true,
        order_number: 1,
      })
      setEditingId(null)
      setIsDialogOpen(false)
      setSuccess('Pertanyaan berhasil diperbarui!')
      await fetchQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Gagal menghapus pertanyaan')
      }

      setDeletingId(null)
      setSuccess('Pertanyaan berhasil dihapus!')
      await fetchQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const openCreateDialog = () => {
    setFormData({
      question_text: '',
      correct_answer: true,
      order_number: questions.length + 1,
    })
    setDialogMode('create')
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (question: QuizQuestion) => {
    setFormData({
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      order_number: question.order_number,
    })
    setDialogMode('edit')
    setEditingId(question.id)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    if (!isSubmitting) {
      setFormData({
        question_text: '',
        correct_answer: true,
        order_number: questions.length + 1,
      })
      setEditingId(null)
      setIsDialogOpen(false)
    }
  }

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterAnswer === 'all' ||
      (filterAnswer === 'true' && q.correct_answer) ||
      (filterAnswer === 'false' && !q.correct_answer)
    return matchesSearch && matchesFilter
  })

  // Statistics
  const stats = {
    total: questions.length,
    trueAnswers: questions.filter((q) => q.correct_answer).length,
    falseAnswers: questions.filter((q) => !q.correct_answer).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{success}</div>
            <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pertanyaan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jawaban Benar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.trueAnswers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jawaban Salah</p>
              <p className="text-2xl font-bold text-gray-900">{stats.falseAnswers}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterAnswer}
              onChange={(e) => setFilterAnswer(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Jawaban</option>
              <option value="true">Benar</option>
              <option value="false">Salah</option>
            </select>
            <Button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pertanyaan
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Tambah Pertanyaan Baru' : 'Edit Pertanyaan'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Isi form di bawah untuk menambahkan pertanyaan kuis baru'
                : 'Ubah informasi pertanyaan yang ingin diperbarui'}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={dialogMode === 'create' ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="question_text" className="text-gray-700 font-medium">
                Pertanyaan <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="question_text"
                value={formData.question_text}
                onChange={(e) =>
                  setFormData({ ...formData, question_text: e.target.value })
                }
                className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                placeholder="Masukkan pertanyaan kuis..."
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tulis pertanyaan dengan jelas dan mudah dipahami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="correct_answer" className="text-gray-700 font-medium">
                  Jawaban Benar <span className="text-red-500">*</span>
                </Label>
                <select
                  id="correct_answer"
                  value={formData.correct_answer.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correct_answer: e.target.value === 'true',
                    })
                  }
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                  disabled={isSubmitting}
                >
                  <option value="true">✓ Benar (True)</option>
                  <option value="false">✗ Salah (False)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="order_number" className="text-gray-700 font-medium">
                  Nomor Urut <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="order_number"
                  type="number"
                  min="1"
                  value={formData.order_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_number: parseInt(e.target.value) || 1,
                    })
                  }
                  className="mt-2 h-11"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {dialogMode === 'create' ? 'Tambah Pertanyaan' : 'Simpan Perubahan'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Questions list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold shadow-sm">
                      {question.order_number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        question.correct_answer
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {question.correct_answer ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Benar
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Salah
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">{question.question_text}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(question)}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeletingId(question.id)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredQuestions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-gray-200"
          >
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchQuery || filterAnswer !== 'all'
                ? 'Tidak ada pertanyaan yang sesuai dengan filter'
                : 'Belum ada pertanyaan'}
            </p>
            <p className="text-gray-400 text-sm">
              {!searchQuery && filterAnswer === 'all' && (
                <>Klik tombol &quot;Tambah Pertanyaan&quot; untuk membuat pertanyaan baru</>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
                  <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus pertanyaan ini? Data yang sudah dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeletingId(null)}>
                  Batal
                </Button>
                <Button
                  onClick={() => handleDelete(deletingId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Pertanyaan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
