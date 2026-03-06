'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { ProgressTimeline } from '@/components/dashboard/ProgressOverviewCard'
import { ContinueSession } from '@/components/dashboard/ContinueLearningCard'
import { SessionTimeline } from '@/components/dashboard/SessionTimeline'
import { EducationInsight } from '@/components/dashboard/TipsCard'
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

  const getEducationInsight = () => {
    if (progress.overall_percentage === 0) {
      return "Pneumonia adalah penyebab kematian anak nomor satu yang sebenarnya dapat dicegah dengan edukasi tepat."
    } else if (progress.overall_percentage < 50) {
      return "Mengenali gejala pneumonia sejak dini dapat menyelamatkan nyawa anak Anda."
    } else if (progress.overall_percentage < 100) {
      return "Pencegahan pneumonia dimulai dari pemahaman yang baik tentang penyakit ini."
    }
    return "Dengan pengetahuan yang tepat, Anda telah mengambil langkah penting untuk melindungi kesehatan anak."
  }

  const getSessionDescription = (day: number) => {
    const descriptions = [
      'Pengenalan penyakit pneumonia pada balita',
      'Gejala yang perlu diwaspadai',
      'Pengobatan dan komplikasi yang mungkin terjadi',
      'Praktik pencegahan di rumah',
      'Evaluasi pemahaman Anda'
    ]
    return descriptions[day - 1] || ''
  }

  const getCurrentDay = () => {
    if (!progress.pre_test_completed) return 0
    const completedCount = progress.sessions.filter(s => s.completed).length
    return completedCount + 1
  }
  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Editorial Container - Reading Flow */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 space-y-24">
        
        {/* Greeting Editorial */}
        <GreetingCard 
          userName={profile.mother.name} 
          currentDay={getCurrentDay()}
        />

        {/* Progress Timeline */}
        <ProgressTimeline
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

        {/* Continue Session or Pre-Test */}
        {!progress.pre_test_completed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
                Mulai Program
              </h2>
              <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-[#1F2933]/70 font-light leading-relaxed">
                Ukur pengetahuan awal Anda tentang pneumonia balita sebelum memulai pembelajaran
              </p>
              <Link href="/pre-test">
                <button className="px-8 py-3 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-all">
                  Mulai Pre-Test
                </button>
              </Link>
            </div>
          </motion.div>
        ) : nextSession ? (
          <ContinueSession
            sessionNumber={nextSession.day}
            sessionTitle={SESSION_TITLES[nextSession.day - 1]}
            href={`/session/${nextSession.day}`}
          />
        ) : allSessionsCompleted && !progress.post_test_completed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
                Saatnya Evaluasi
              </h2>
              <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-[#1F2933]/70 font-light leading-relaxed">
                Ukur peningkatan pemahaman Anda setelah menyelesaikan semua sesi pembelajaran
              </p>
              <Link href="/post-test">
                <button className="px-8 py-3 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-all">
                  Mulai Post-Test
                </button>
              </Link>
            </div>
          </motion.div>
        ) : progress.post_test_completed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2933]">
                Program Selesai
              </h2>
              <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-[#1F2933]/70 font-light leading-relaxed">
                Selamat! Anda telah menyelesaikan seluruh program pembelajaran pneumonia balita.
              </p>
              
              {/* Score Comparison - Editorial Style */}
              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-sm text-[#1F2933]/60 mb-1">Pre-Test</div>
                    <div className="text-4xl font-bold text-[#1F2933]">{progress.pre_test_score || 0}</div>
                  </div>
                  <div className="text-2xl text-[#1F2933]/40">→</div>
                  <div>
                    <div className="text-sm text-[#1F2933]/60 mb-1">Post-Test</div>
                    <div className="text-4xl font-bold text-[#2F5D50]">{progress.post_test_score || 0}</div>
                  </div>
                </div>
                <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
              </div>

              <Link href="/results">
                <button className="px-8 py-3 border-2 border-[#2F5D50] text-[#2F5D50] font-medium rounded-lg hover:bg-[#2F5D50] hover:text-white transition-all">
                  Lihat Hasil Lengkap
                </button>
              </Link>
            </div>
          </motion.div>
        ) : null}

        {/* Session Timeline - Only if pre-test completed */}
        {progress.pre_test_completed && (
          <SessionTimeline
            sessions={progress.sessions.map((session, index) => ({
              day: session.day,
              title: SESSION_TITLES[session.day - 1],
              description: getSessionDescription(session.day),
              completed: session.completed,
              isUnlocked: session.is_unlocked,
              unlockTime: session.unlocked_at
            }))}
            onUnlock={handleSessionUnlock}
          />
        )}

        {/* Education Insight */}
        <EducationInsight 
          insight={getEducationInsight()}
          highlightWord="dicegah"
        />
      </div>
    </div>
  ) 
}
