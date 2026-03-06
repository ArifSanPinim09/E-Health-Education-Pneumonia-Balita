'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'pretest' | 'session1' | 'session' | 'posttest'
  score?: number
  nextSessionDay?: number
  nextSessionTitle?: string
  unlockTime?: string
}

interface ContentType {
  emoji: string
  title: string
  message: string
  scoreMessage: string
  nextAction: string
  buttonText: string
  buttonLink: string
  showClock?: boolean
  showGoodbye?: boolean
  showArrow?: boolean
}

export function CelebrationModal({ 
  isOpen, 
  onClose, 
  type, 
  score,
  nextSessionDay,
  nextSessionTitle,
  unlockTime
}: CelebrationModalProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!unlockTime) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const unlock = new Date(unlockTime).getTime()
      const difference = unlock - now

      if (difference <= 0) {
        setTimeLeft('Tersedia sekarang')
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`${days} hari`)
      } else if (hours > 0) {
        setTimeLeft(`${hours} jam ${minutes} menit`)
      } else {
        setTimeLeft(`${minutes} menit`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000)

    return () => clearInterval(interval)
  }, [unlockTime])

  const getContent = (): ContentType => {
    switch (type) {
      case 'pretest':
        return {
          emoji: '🎉',
          title: 'Pre-Test Selesai!',
          message: 'Selamat! Anda telah menyelesaikan Pre-Test dengan baik.',
          scoreMessage: score !== undefined ? `Skor Anda: ${score}/23` : '',
          nextAction: 'Sekarang saatnya memulai pembelajaran. Mari kita mulai dengan Session 1 untuk mempelajari dasar-dasar pneumonia pada balita!',
          buttonText: 'Mulai Session 1 Sekarang',
          buttonLink: '/session/1',
          showArrow: true
        }
      
      case 'session1':
        return {
          emoji: '🎊',
          title: 'Session 1 Selesai!',
          message: 'Hebat! Anda telah menyelesaikan Session 1 - Dasar-Dasar Pneumonia dengan baik.',
          scoreMessage: '',
          nextAction: unlockTime 
            ? `Session 2 akan terbuka dalam ${timeLeft}. Istirahat dulu dan kembali lagi besok untuk melanjutkan pembelajaran. Sampai jumpa!`
            : 'Session berikutnya sudah tersedia!',
          buttonText: 'Kembali ke Dashboard',
          buttonLink: '/dashboard',
          showClock: true,
          showGoodbye: true
        }
      
      case 'session':
        const sessionNum = nextSessionDay ? nextSessionDay - 1 : 0
        const isLastSession = sessionNum === 5
        
        return {
          emoji: isLastSession ? '🏆' : '✨',
          title: `Session ${sessionNum} Selesai!`,
          message: isLastSession 
            ? 'Luar biasa! Anda telah menyelesaikan semua sesi pembelajaran.'
            : 'Hebat! Anda semakin dekat dengan menyelesaikan program.',
          scoreMessage: '',
          nextAction: isLastSession
            ? 'Sekarang saatnya mengukur peningkatan pengetahuan Anda dengan Post-Test. Mari kita lihat seberapa banyak yang telah Anda pelajari!'
            : unlockTime 
              ? `Session ${nextSessionDay} akan terbuka dalam ${timeLeft}. Sampai jumpa besok!`
              : 'Session berikutnya sudah tersedia!',
          buttonText: isLastSession ? 'Mulai Post-Test Sekarang' : 'Kembali ke Dashboard',
          buttonLink: isLastSession ? '/post-test' : '/dashboard',
          showClock: !isLastSession,
          showGoodbye: !isLastSession,
          showArrow: isLastSession
        }
      
      case 'posttest':
        return {
          emoji: '🏆',
          title: 'Program Selesai!',
          message: 'Selamat! Anda telah menyelesaikan seluruh program pembelajaran.',
          scoreMessage: score !== undefined ? `Skor Post-Test: ${score}` : '',
          nextAction: 'Lihat hasil lengkap untuk melihat perkembangan Anda.',
          buttonText: 'Lihat Hasil',
          buttonLink: '/results'
        }
      
      default:
        return {
          emoji: '🎉',
          title: 'Selamat!',
          message: 'Anda telah menyelesaikan tahap ini.',
          scoreMessage: '',
          nextAction: '',
          buttonText: 'Lanjutkan',
          buttonLink: '/dashboard'
        }
    }
  }

  const content = getContent()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F4F7F5] transition-colors z-10"
              >
                <X className="w-5 h-5 text-[#1F2933]/60" />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8 text-center">
                {/* Emoji Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    delay: 0.2,
                    stiffness: 200,
                    damping: 10
                  }}
                  className="text-6xl sm:text-7xl mb-4"
                >
                  {content.emoji}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-3"
                >
                  {content.title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base text-[#1F2933]/70 mb-4"
                >
                  {content.message}
                </motion.p>

                {/* Score */}
                {content.scoreMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F5D50]/10 rounded-lg mb-4"
                  >
                    <CheckCircle className="w-5 h-5 text-[#2F5D50]" />
                    <span className="text-lg font-semibold text-[#2F5D50]">
                      {content.scoreMessage}
                    </span>
                  </motion.div>
                )}

                {/* Next Action */}
                {content.nextAction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#F4F7F5] rounded-xl p-4 mb-6"
                  >
                    {content.showClock && timeLeft && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-[#E07A5F]" />
                        <span className="text-sm font-medium text-[#E07A5F]">
                          {timeLeft}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-[#1F2933]/80 leading-relaxed">
                      {content.nextAction}
                    </p>
                    {content.showGoodbye && (
                      <p className="text-sm text-[#2F5D50] font-medium mt-2">
                        👋 Sampai jumpa besok!
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link href={content.buttonLink}>
                    <button
                      onClick={onClose}
                      className="w-full bg-[#2F5D50] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#274E43] transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                    >
                      {content.buttonText}
                      {content.showArrow && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </Link>
                </motion.div>

                {/* Secondary Action */}
                {type !== 'posttest' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={onClose}
                    className="mt-3 text-sm text-[#1F2933]/60 hover:text-[#1F2933] transition-colors"
                  >
                    Tutup
                  </motion.button>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2F5D50] via-[#E07A5F] to-[#2F5D50]" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
