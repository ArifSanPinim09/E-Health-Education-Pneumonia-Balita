'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { ProgressOverviewCard } from '@/components/dashboard/ProgressOverviewCard'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { SessionCard } from '@/components/dashboard/SessionCard'
import { TipsCard } from '@/components/dashboard/TipsCard'
import { AchievementCard } from '@/components/dashboard/AchievementCard'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck } from 'lucide-react'
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

  const getMotivationalTip = () => {
    if (progress.overall_percentage === 0) {
      return "Mulai perjalanan Anda dengan Pre-Test untuk mengukur pengetahuan awal tentang pneumonia balita!"
    } else if (progress.overall_percentage < 30) {
      return "Langkah pertama sudah dimulai! Terus semangat belajar untuk melindungi si kecil dari pneumonia."
    } else if (progress.overall_percentage < 60) {
      return "Hebat! Anda sudah di tengah perjalanan. Konsistensi adalah kunci untuk memahami pencegahan pneumonia."
    } else if (progress.overall_percentage < 90) {
      return "Luar biasa! Anda hampir menyelesaikan program. Pengetahuan Anda tentang pneumonia semakin lengkap."
    } else if (progress.overall_percentage < 100) {
      return "Tinggal sedikit lagi! Selesaikan Post-Test untuk melihat peningkatan pemahaman Anda tentang pneumonia balita."
    }
    return "Selamat! Anda telah menyelesaikan seluruh program pembelajaran pneumonia balita dengan sempurna!"
  }

  const getSessionDescription = (day: number) => {
    const descriptions = [
      'Pelajari dasar-dasar pneumonia dan penyebabnya',
      'Kenali gejala pneumonia pada balita',
      'Pahami pengobatan dan komplikasi pneumonia',
      'Praktik pencegahan pneumonia di rumah',
      'Evaluasi pemahaman Anda tentang pneumonia'
    ]
    return descriptions[day - 1] || 'Lanjutkan pembelajaran Anda'
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Container with proper max-width system */}
      <div className="max-w-7xl mx-auto px-5 py-6 lg:px-8 lg:py-8">
        
        {/* Greeting Hero - Full Width */}
        <GreetingCard 
          userName={profile.mother.name} 
          progressPercentage={progress.overall_percentage}
        />

        {/* Main Content Grid */}
        <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
          
          {/* Desktop: 2 Column | Mobile: Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <ProgressOverviewCard
              percentage={progress.overall_percentage}
              items={[
                { label: 'Pre-Test', completed: progress.pre_test_completed },
                { label: `Sesi Belajar (${completedSessions}/5)`, completed: completedSessions === 5 },
                { label: 'Post-Test', completed: progress.post_test_completed }
              ]}
            />

            {/* Continue Learning or Next Action */}
            <div>
              {/* Pre-Test Card */}
              {!progress.pre_test_completed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/pre-test">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer relative overflow-hidden group h-full">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="relative z-10">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 w-fit mb-4">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Mulai Pre-Test</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Ukur pengetahuan awal Anda tentang pneumonia balita sebelum memulai pembelajaran
                        </p>
                        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4 group-hover:bg-white/30 transition-colors">
                          <span className="font-semibold">Mulai Sekarang</span>
                          <span className="text-2xl">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Continue Learning - Next Session */}
              {progress.pre_test_completed && nextSession && (
                <ContinueLearningCard
                  sessionNumber={nextSession.day}
                  sessionTitle={SESSION_TITLES[nextSession.day - 1]}
                  description={getSessionDescription(nextSession.day)}
                  href={`/session/${nextSession.day}`}
                />
              )}

              {/* Post-Test Card */}
              {allSessionsCompleted && !progress.post_test_completed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link href="/post-test">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer relative overflow-hidden group h-full">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="relative z-10">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 w-fit mb-4">
                          <ClipboardCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Saatnya Post-Test!</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Ukur peningkatan pemahaman Anda setelah menyelesaikan semua sesi pembelajaran
                        </p>
                        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4 group-hover:bg-white/30 transition-colors">
                          <span className="font-semibold">Mulai Post-Test</span>
                          <span className="text-2xl">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Achievement - Program Completed */}
              {progress.post_test_completed && (
                <AchievementCard
                  preTestScore={progress.pre_test_score || 0}
                  postTestScore={progress.post_test_score || 0}
                />
              )}
            </div>
          </div>

          {/* Session Grid - Only show if pre-test completed */}
          {progress.pre_test_completed && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Sesi Pembelajaran</h2>
                  <p className="text-sm text-gray-600 mt-1">5 sesi untuk memahami pneumonia balita</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                  {completedSessions}/5 Selesai
                </span>
              </div>

              {/* Session Grid: Desktop 3 cols | Tablet 2 cols | Mobile 1 col */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Tips Section */}
          <TipsCard tip={getMotivationalTip()} />
        </div>
      </div>
    </div>
  ) 
}
