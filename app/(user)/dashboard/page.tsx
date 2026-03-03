'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { ProgressRing } from '@/components/dashboard/ProgressRing'
import { SessionCard } from '@/components/dashboard/SessionCard'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck, Award, Lightbulb } from 'lucide-react'
import Link from 'next/link'

interface SessionStatus {
  day: number
  completed: boolean
  completed_at: string | null
  unlocked_at: string
  is_unlocked: boolean
}

interface ProgressData {
  pre_test_completed: boolean
  pre_test_score: number | null
  post_test_completed: boolean
  post_test_score: number | null
  sessions: SessionStatus[]
  overall_percentage: number
  completed_activities: number
  total_activities: number
}

interface ProfileData {
  mother: {
    name: string
  }
}

const SESSION_TITLES = [
  'Dasar-Dasar Pneumonia',
  'Mengenali Gejala',
  'Pengobatan & Komplikasi',
  'Praktik di Rumah',
  'Evaluasi'
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await fetch('/api/profile/get')
        if (!profileRes.ok) {
          if (profileRes.status === 401) {
            router.push('/login')
            return
          }
          if (profileRes.status === 404) {
            router.push('/profile-setup')
            return
          }
          throw new Error('Gagal memuat profil')
        }
        const profileData = await profileRes.json()
        setProfile(profileData)

        const progressRes = await fetch('/api/progress/get')
        if (!progressRes.ok) {
          throw new Error('Gagal memuat progress')
        }
        const progressData = await progressRes.json()
        setProgress(progressData.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSessionUnlock = async () => {
    try {
      const progressRes = await fetch('/api/progress/get')
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress(progressData.data)
      }
    } catch (err) {
      console.error('Failed to refresh progress:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !profile || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Gagal memuat data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const allSessionsCompleted = progress.sessions.length === 5 && 
    progress.sessions.every(s => s.completed)
  const completedSessions = progress.sessions.filter(s => s.completed).length
  const nextSession = progress.sessions.find(s => !s.completed && s.is_unlocked)

  const getMotivationalTip = () => {
    if (progress.overall_percentage === 0) {
      return "Mulai perjalanan Anda dengan Pre-Test untuk mengukur pengetahuan awal!"
    } else if (progress.overall_percentage < 30) {
      return "Langkah pertama sudah dimulai! Terus semangat belajar."
    } else if (progress.overall_percentage < 60) {
      return "Hebat! Anda sudah di tengah perjalanan. Konsistensi adalah kunci."
    } else if (progress.overall_percentage < 90) {
      return "Luar biasa! Anda hampir menyelesaikan program."
    } else if (progress.overall_percentage < 100) {
      return "Tinggal sedikit lagi! Selesaikan Post-Test untuk melihat peningkatan Anda."
    }
    return "Selamat! Anda telah menyelesaikan seluruh program pembelajaran!"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Greeting */}
        <GreetingCard userName={profile.mother.name} />

        {/* Main Card - Compact & Unified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Progress Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Progress Ring */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <ProgressRing percentage={progress.overall_percentage} />
              </div>

              {/* Progress Details */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Pre-Test</span>
                  <span className={`text-sm font-semibold ${progress.pre_test_completed ? "text-blue-600" : "text-gray-400"}`}>
                    {progress.pre_test_completed ? "✓" : "○"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Sesi Belajar</span>
                  <span className="text-sm font-semibold text-blue-600">{completedSessions}/5</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Post-Test</span>
                  <span className={`text-sm font-semibold ${progress.post_test_completed ? "text-blue-600" : "text-gray-400"}`}>
                    {progress.post_test_completed ? "✓" : "○"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="p-4 sm:p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                  Tips
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {getMotivationalTip()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="p-4 sm:p-6">
            {/* Pre-Test */}
            {!progress.pre_test_completed && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pre-Test</h3>
                    <p className="text-sm text-gray-600">Ukur pengetahuan awal</p>
                  </div>
                </div>
                <Link
                  href="/pre-test"
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
                >
                  Mulai
                </Link>
              </div>
            )}

            {/* Next Session */}
            {progress.pre_test_completed && nextSession && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Lanjutkan Belajar</p>
                    <h3 className="font-semibold text-gray-900">Hari {nextSession.day}: {SESSION_TITLES[nextSession.day - 1]}</h3>
                  </div>
                </div>
                <Link
                  href={`/session/${nextSession.day}`}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
                >
                  Lanjut
                </Link>
              </div>
            )}

            {/* All Sessions */}
            {progress.pre_test_completed && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">Semua Sesi</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {completedSessions}/5
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {progress.sessions.map((session, index) => {
                    let status: 'active' | 'completed' | 'locked' = 'locked'
                    
                    if (session.completed) {
                      status = 'completed'
                    } else if (session.is_unlocked) {
                      status = 'active'
                    }

                    return (
                      <SessionCard
                        key={session.day}
                        day={session.day}
                        title={SESSION_TITLES[session.day - 1]}
                        status={status}
                        unlockTime={session.unlocked_at}
                        index={index}
                        onUnlock={handleSessionUnlock}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Post-Test */}
            {allSessionsCompleted && !progress.post_test_completed && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-green-50 rounded-lg border border-green-100 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Post-Test</h3>
                    <p className="text-sm text-gray-600">Ukur peningkatan Anda</p>
                  </div>
                </div>
                <Link
                  href="/post-test"
                  className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center whitespace-nowrap"
                >
                  Mulai
                </Link>
              </div>
            )}

            {/* Completion */}
            {progress.post_test_completed && (
              <div className="p-4 sm:p-6 bg-green-50 rounded-lg border border-green-100">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Selamat!</h3>
                  <p className="text-sm text-gray-600">
                    Program pembelajaran selesai
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
                  <div className="flex items-center justify-around text-sm">
                    <div className="text-center">
                      <p className="text-gray-500 text-xs mb-1">Pre-Test</p>
                      <p className="text-2xl font-bold text-gray-900">{progress.pre_test_score || 0}</p>
                    </div>
                    <div className="text-xl text-gray-400">→</div>
                    <div className="text-center">
                      <p className="text-gray-500 text-xs mb-1">Post-Test</p>
                      <p className="text-2xl font-bold text-green-600">{progress.post_test_score || 0}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/results"
                  className="block bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors text-center text-sm"
                >
                  Lihat Hasil Lengkap
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
