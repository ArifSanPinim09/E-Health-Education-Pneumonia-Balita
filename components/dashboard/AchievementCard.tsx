'use client'

import { motion } from 'framer-motion'
import { Award, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

interface AchievementCardProps {
  preTestScore: number
  postTestScore: number
}

export function AchievementCard({ preTestScore, postTestScore }: AchievementCardProps) {
  const improvement = postTestScore - preTestScore
  const improvementPercentage = preTestScore > 0 ? Math.round((improvement / preTestScore) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 lg:p-8 border-2 border-green-200 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl -ml-12 -mb-12" />
      
      <div className="relative z-10">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Award className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Selamat! 🎉
          </h2>
          <p className="text-gray-600">
            Anda telah menyelesaikan program pembelajaran
          </p>
        </div>

        {/* Score Comparison */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-green-100">
          <div className="flex items-center justify-around">
            {/* Pre Test */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                Pre-Test
              </p>
              <p className="text-4xl font-bold text-gray-900">{preTestScore}</p>
            </div>

            {/* Arrow with improvement */}
            <div className="flex flex-col items-center">
              <TrendingUp className="w-6 h-6 text-green-600 mb-1" />
              {improvement > 0 && (
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{improvement}
                </span>
              )}
            </div>

            {/* Post Test */}
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                Post-Test
              </p>
              <p className="text-4xl font-bold text-green-600">{postTestScore}</p>
            </div>
          </div>

          {/* Improvement percentage */}
          {improvement > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <p className="text-sm text-gray-700">
                  Peningkatan <span className="font-bold text-green-600">{improvementPercentage}%</span>
                </p>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href="/results">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            Lihat Hasil Lengkap
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
