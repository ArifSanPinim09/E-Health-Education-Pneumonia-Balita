'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { ProgressCard } from '@/components/dashboard/ProgressOverviewCard'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { InfoCard, DetailedStatsCard } from '@/components/dashboard/SidebarCard'
import { UserNavbar } from '@/components/user/UserNavbar'
import GeminiChatBot from '@/components/chat/GeminiChatBot'
import { VideoGuide } from '@/components/shared/VideoGuide'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { startUserGuide, shouldShowGuide } from '@/lib/userGuide'
import '@/styles/driver-custom.css'
import { CelebrationModal } from '@/components/dashboard/CelebrationModal'

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
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'pretest' | 'session1' | 'session' | 'posttest'>('pretest')
  const [celebrationData, setCelebrationData] = useState<any>(null)

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

  // Trigger user guide untuk first-time user
  useEffect(() => {
    if (!loading && profile && progress && shouldShowGuide()) {
      // Delay sedikit agar UI sudah ter-render sempurna
      const timer = setTimeout(() => {
        startUserGuide()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [loading, profile, progress])

  // Check for celebration modals
  useEffect(() => {
    if (!loading && progress) {
      // Check Pre-Test celebration
      const pretestData = localStorage.getItem('show_pretest_celebration')
      if (pretestData) {
        const data = JSON.parse(pretestData)
        setCelebrationType('pretest')
        setCelebrationData(data)
        setShowCelebration(true)
        localStorage.removeItem('show_pretest_celebration')
        return
      }

      // Check Session 1 celebration
      const session1Data = localStorage.getItem('show_session1_celebration')
      if (session1Data) {
        const data = JSON.parse(session1Data)
        const nextSession = progress.sessions.find(s => s.day === 2)
        setCelebrationType('session1')
        setCelebrationData({
          ...data,
          nextSessionDay: 2,
          nextSessionTitle: SESSION_TITLES[1],
          unlockTime: nextSession?.unlocked_at
        })
        setShowCelebration(true)
        localStorage.removeItem('show_session1_celebration')
        return
      }

      // Check other session celebration
      const sessionData = localStorage.getItem('show_session_celebration')
      if (sessionData) {
        const data = JSON.parse(sessionData)
        const nextSession = progress.sessions.find(s => s.day === data.day + 1)
        setCelebrationType('session')
        setCelebrationData({
          ...data,
          nextSessionDay: data.day + 1,
          nextSessionTitle: SESSION_TITLES[data.day],
          unlockTime: nextSession?.unlocked_at
        })
        setShowCelebration(true)
        localStorage.removeItem('show_session_celebration')
        return
      }
    }
  }, [loading, progress])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#2F5D50]/20 border-t-[#2F5D50] mx-auto mb-4"></div>
          </div>
          <p className="text-[#1F2933]/70 text-sm">Memuat dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !profile || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 bg-[#E07A5F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <p className="text-[#E07A5F] text-sm mb-4">{error || 'Gagal memuat data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="h-11 px-6 bg-[#2F5D50] text-white text-sm font-medium rounded-lg hover:bg-[#274E43] transition-colors"
          >
            Coba Lagi
          </button>
        </motion.div>
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
    <>
      {/* Navbar */}
      <UserNavbar userName={profile.mother.name} />
      
      <div className="min-h-screen bg-[#F4F7F5] pt-16 sm:pt-20">
        {/* Container with max-width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Greeting */}
          <div id="greeting-card">
            <GreetingCard 
              userName={profile.mother.name} 
              currentDay={progress.pre_test_completed ? completedSessions + 1 : 0}
            />
          </div>

          {/* Overview Cards */}
          <div id="overview-cards">
            <OverviewCards
              progressPercentage={progress.overall_percentage}
              currentSession={getCurrentSessionName()}
              completedCount={progress.completed_activities}
              totalCount={progress.total_activities}
            />
          </div>

          {/* Main Grid Layout: 2fr 1fr */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              
              {/* Progress Card */}
              <div id="progress-card">
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
                      current: progress.pre_test_completed && !progress.sessions[0]?.completed && progress.sessions[0]?.is_unlocked,
                      locked: !progress.sessions[0]?.is_unlocked,
                      unlockTime: progress.sessions[0]?.unlocked_at
                    },
                    { 
                      label: 'Session 2', 
                      completed: progress.sessions[1]?.completed || false,
                      current: progress.sessions[0]?.completed && !progress.sessions[1]?.completed && progress.sessions[1]?.is_unlocked,
                      locked: !progress.sessions[1]?.is_unlocked,
                      unlockTime: progress.sessions[1]?.unlocked_at
                    },
                    { 
                      label: 'Session 3', 
                      completed: progress.sessions[2]?.completed || false,
                      current: progress.sessions[1]?.completed && !progress.sessions[2]?.completed && progress.sessions[2]?.is_unlocked,
                      locked: !progress.sessions[2]?.is_unlocked,
                      unlockTime: progress.sessions[2]?.unlocked_at
                    },
                    { 
                      label: 'Session 4', 
                      completed: progress.sessions[3]?.completed || false,
                      current: progress.sessions[2]?.completed && !progress.sessions[3]?.completed && progress.sessions[3]?.is_unlocked,
                      locked: !progress.sessions[3]?.is_unlocked,
                      unlockTime: progress.sessions[3]?.unlocked_at
                    },
                    { 
                      label: 'Session 5', 
                      completed: progress.sessions[4]?.completed || false,
                      current: progress.sessions[3]?.completed && !progress.sessions[4]?.completed && progress.sessions[4]?.is_unlocked,
                      locked: !progress.sessions[4]?.is_unlocked,
                      unlockTime: progress.sessions[4]?.unlocked_at
                    },
                    { 
                      label: 'Post Test', 
                      completed: progress.post_test_completed,
                      current: allSessionsCompleted && !progress.post_test_completed
                    }
                  ]}
                />
              </div>
              
              {/* Session unlock indicator untuk guide */}
              {!progress.pre_test_completed && (
                <div id="session-cards" className="hidden"></div>
              )}

              {/* Continue Learning / Next Action */}
              {!progress.pre_test_completed ? (
                <motion.div
                  id="pretest-button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-2 sm:mb-3">
                    Mulai Program
                  </h2>
                  <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-3 sm:mb-4 leading-relaxed">
                    Ukur pengetahuan awal Anda tentang pneumonia balita sebelum memulai pembelajaran
                  </p>
                  <Link href="/pre-test">
                    <button className="w-full bg-[#2F5D50] text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all">
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
                  className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-2 sm:mb-3">
                    Saatnya Evaluasi
                  </h2>
                  <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-3 sm:mb-4 leading-relaxed">
                    Ukur peningkatan pemahaman Anda setelah menyelesaikan semua sesi pembelajaran
                  </p>
                  <Link href="/post-test">
                    <button className="w-full bg-[#2F5D50] text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#274E43] transition-all">
                      Mulai Post-Test
                    </button>
                  </Link>
                </motion.div>
              ) : progress.post_test_completed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-2 sm:mb-3">
                    Program Selesai
                  </h2>
                  <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-4 sm:mb-6 leading-relaxed">
                    Selamat! Anda telah menyelesaikan seluruh program pembelajaran pneumonia balita.
                  </p>
                  
                  {/* Score Comparison */}
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6 p-3 sm:p-4 bg-[#F4F7F5] rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-[#1F2933]/60 mb-1">Pre-Test</div>
                      <div className="text-2xl sm:text-3xl font-semibold text-[#1F2933]">{progress.pre_test_score || 0}</div>
                    </div>
                    <div className="text-xl sm:text-2xl text-[#1F2933]/40">→</div>
                    <div className="text-center">
                      <div className="text-xs text-[#1F2933]/60 mb-1">Post-Test</div>
                      <div className="text-2xl sm:text-3xl font-semibold text-[#2F5D50]">{progress.post_test_score || 0}</div>
                    </div>
                  </div>

                  <Link href="/results">
                    <button className="w-full py-2.5 sm:py-3 px-4 border-2 border-[#2F5D50] text-[#2F5D50] rounded-lg text-sm font-medium hover:bg-[#2F5D50] hover:text-white transition-all">
                      Lihat Hasil Lengkap
                    </button>
                  </Link>
                </motion.div>
              ) : null}

              {/* Completed Sessions - Can be accessed again */}
              {progress.pre_test_completed && progress.sessions.some(s => s.completed) && (
                <motion.div
                  id="session-cards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933] mb-2 sm:mb-3">
                    Sesi yang Telah Dipelajari
                  </h2>
                  <p className="text-xs sm:text-sm text-[#1F2933]/70 mb-3 sm:mb-4 leading-relaxed">
                    Anda dapat mengakses kembali materi yang sudah dipelajari kapan saja
                  </p>
                  <div className="space-y-2">
                    {progress.sessions.map((session, index) => 
                      session.completed ? (
                        <motion.div
                          key={session.day}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xs sm:text-sm font-semibold text-[#2F5D50]">
                                {session.day}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-[#1F2933]">
                                {SESSION_TITLES[session.day - 1]}
                              </p>
                            </div>
                          </div>
                          <Link href={`/session/${session.day}`}>
                            <span className="text-xs sm:text-sm font-medium text-[#2F5D50] hover:text-[#274E43] hover:underline cursor-pointer transition-all whitespace-nowrap">
                              Pelajari Lagi
                            </span>
                          </Link>
                        </motion.div>
                      ) : null
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Detailed Stats */}
              <DetailedStatsCard
                preTestScore={progress.pre_test_score}
                postTestScore={progress.post_test_score}
                completedSessions={completedSessions}
                totalSessions={5}
                preTestCompleted={progress.pre_test_completed}
                postTestCompleted={progress.post_test_completed}
              />

              {/* Video Guide - Moved to Sidebar */}
              <motion.div
                id="video-panduan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <VideoGuide variant="dashboard" />
              </motion.div>

              {/* Info */}
              <InfoCard
                title="Tahukah Anda?"
                content="Pneumonia merupakan salah satu penyebab kematian terbesar pada balita yang sebenarnya dapat dicegah dengan edukasi dan penanganan tepat."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gemini Chatbot - Fixed Bottom Right */}
      <GeminiChatBot />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        type={celebrationType}
        score={celebrationData?.score}
        nextSessionDay={celebrationData?.nextSessionDay}
        nextSessionTitle={celebrationData?.nextSessionTitle}
        unlockTime={celebrationData?.unlockTime}
      />
    </>
  ) 
}
