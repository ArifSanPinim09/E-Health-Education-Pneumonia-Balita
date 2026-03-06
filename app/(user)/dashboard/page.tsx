'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { ProgressCard } from '@/components/dashboard/ProgressOverviewCard'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { TipsCard, InfoCard, DetailedStatsCard } from '@/components/dashboard/SidebarCard'
import GeminiChatBot from '@/components/chat/GeminiChatBot'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProgressRing } from '@/components/dashboard/ProgressRing'

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
  child?: {
    name: string
    age: number
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

  const getTipsMessage = () => {
    if (progress.overall_percentage < 30) {
      return "Pastikan balita mendapatkan ASI eksklusif dan imunisasi lengkap untuk mencegah pneumonia."
    } else if (progress.overall_percentage < 70) {
      return "Kenali gejala pneumonia: napas cepat, sesak napas, dan demam tinggi. Segera konsultasi ke dokter jika muncul gejala."
    }
    return "Pencegahan pneumonia dimulai dari lingkungan bersih, nutrisi baik, dan imunisasi lengkap."
  }

  const getCurrentSessionName = () => {
    if (!progress.pre_test_completed) return 'Pre-Test'
    if (nextSession) return `Session ${nextSession.day}`
    if (allSessionsCompleted && !progress.post_test_completed) return 'Post-Test'
    if (progress.post_test_completed) return 'Selesai'
    return '-'
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Container with max-width */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        
        {/* Greeting */}
        <GreetingCard 
          userName={profile.mother.name} 
          currentDay={progress.pre_test_completed ? completedSessions + 1 : 0}
        />

        {/* Overview Cards */}
        <OverviewCards
          progressPercentage={progress.overall_percentage}
          currentSession={getCurrentSessionName()}
          completedCount={progress.completed_activities}
          totalCount={progress.total_activities}
        />

        {/* Main Grid Layout: 2fr 1fr */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Card */}
            <ProgressCard
              percentage={progress.overall_percentage}
              items={[
                { 
                  label: 'Pre Test', 
                  completed: progress.pre_test_completed,
                  current: !progress.pre_test_completed
                },
                { 
                  label: 'Session 1', 
                  completed: progress.sessions[0]?.completed || false,
                  current: progress.pre_test_completed && !progress.sessions[0]?.completed && progress.sessions[0]?.is_unlocked
                },
                { 
                  label: 'Session 2', 
                  completed: progress.sessions[1]?.completed || false,
                  current: progress.sessions[0]?.completed && !progress.sessions[1]?.completed && progress.sessions[1]?.is_unlocked
                },
                { 
                  label: 'Session 3', 
                  completed: progress.sessions[2]?.completed || false,
                  current: progress.sessions[1]?.completed && !progress.sessions[2]?.completed && progress.sessions[2]?.is_unlocked
                },
                { 
                  label: 'Session 4', 
                  completed: progress.sessions[3]?.completed || false,
                  current: progress.sessions[2]?.completed && !progress.sessions[3]?.completed && progress.sessions[3]?.is_unlocked
                },
                { 
                  label: 'Session 5', 
                  completed: progress.sessions[4]?.completed || false,
                  current: progress.sessions[3]?.completed && !progress.sessions[4]?.completed && progress.sessions[4]?.is_unlocked
                },
                { 
                  label: 'Post Test', 
                  completed: progress.post_test_completed,
                  current: allSessionsCompleted && !progress.post_test_completed
                }
              ]}
            />

            {/* Continue Learning / Next Action */}
            {!progress.pre_test_completed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
              >
                <h2 className="text-xl font-semibold text-[#1F2933] mb-4">
                  Mulai Program
                </h2>
                <p className="text-sm text-[#1F2933]/70 mb-4">
                  Ukur pengetahuan awal Anda tentang pneumonia balita sebelum memulai pembelajaran
                </p>
                <Link href="/pre-test">
                  <button className="w-full bg-[#2F5D50] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#2F5D50]/90 transition-all">
                    Mulai Pre-Test
                  </button>
                </Link>
              </motion.div>
            ) : nextSession ? (
              <ContinueLearningCard
                sessionNumber={nextSession.day}
                sessionTitle={SESSION_TITLES[nextSession.day - 1]}
                href={`/session/${nextSession.day}`}
              />
            ) : allSessionsCompleted && !progress.post_test_completed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
              >
                <h2 className="text-xl font-semibold text-[#1F2933] mb-4">
                  Saatnya Evaluasi
                </h2>
                <p className="text-sm text-[#1F2933]/70 mb-4">
                  Ukur peningkatan pemahaman Anda setelah menyelesaikan semua sesi pembelajaran
                </p>
                <Link href="/post-test">
                  <button className="w-full bg-[#2F5D50] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#2F5D50]/90 transition-all">
                    Mulai Post-Test
                  </button>
                </Link>
              </motion.div>
            ) : progress.post_test_completed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
              >
                <h2 className="text-xl font-semibold text-[#1F2933] mb-4">
                  Program Selesai 🎉
                </h2>
                <p className="text-sm text-[#1F2933]/70 mb-6">
                  Selamat! Anda telah menyelesaikan seluruh program pembelajaran pneumonia balita.
                </p>
                
                {/* Score Comparison */}
                <div className="flex items-center justify-center gap-8 mb-6 p-4 bg-[#F8FAFC] rounded-xl">
                  <div className="text-center">
                    <div className="text-xs text-[#1F2933]/60 mb-1">Pre-Test</div>
                    <div className="text-3xl font-semibold text-[#1F2933]">{progress.pre_test_score || 0}</div>
                  </div>
                  <div className="text-2xl text-[#1F2933]/40">→</div>
                  <div className="text-center">
                    <div className="text-xs text-[#1F2933]/60 mb-1">Post-Test</div>
                    <div className="text-3xl font-semibold text-[#2F5D50]">{progress.post_test_score || 0}</div>
                  </div>
                </div>

                <Link href="/results">
                  <button className="w-full py-3 px-4 border-2 border-[#2F5D50] text-[#2F5D50] rounded-xl font-medium hover:bg-[#2F5D50] hover:text-white transition-all">
                    Lihat Hasil Lengkap
                  </button>
                </Link>
              </motion.div>
            ) : null}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Detailed Stats */}
            <DetailedStatsCard
              preTestScore={progress.pre_test_score}
              postTestScore={progress.post_test_score}
              completedSessions={completedSessions}
              totalSessions={5}
              preTestCompleted={progress.pre_test_completed}
              postTestCompleted={progress.post_test_completed}
            />

            {/* Tips */}
            <TipsCard tip={getTipsMessage()} />

            {/* Info */}
            <InfoCard
              title="Tahukah Anda?"
              content="Pneumonia merupakan salah satu penyebab kematian terbesar pada balita yang sebenarnya dapat dicegah dengan edukasi dan penanganan tepat."
            />
          </div>
        </div>
      </div>

      {/* Gemini Chatbot - Fixed Bottom Right */}
      <GeminiChatBot />
    </div>
  ) 
}
