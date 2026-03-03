'use client'

import { motion } from 'framer-motion'
import { formatNumberIndonesian } from '@/lib/utils/date-formatter'

interface ScoreComparisonProps {
  preScore: number
  postScore: number
}

export function ScoreComparison({ preScore, postScore }: ScoreComparisonProps) {
  const maxScore = 23
  const improvement = postScore - preScore
  const improvementPercentage = formatNumberIndonesian((improvement / maxScore) * 100, 1)
  const prePercentage = formatNumberIndonesian((preScore / maxScore) * 100, 1)
  const postPercentage = formatNumberIndonesian((postScore / maxScore) * 100, 1)
  
  // For progress bar width, we need the raw number
  const prePercentageRaw = ((preScore / maxScore) * 100).toFixed(1)
  const postPercentageRaw = ((postScore / maxScore) * 100).toFixed(1)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 px-4"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Hasil Pembelajaran Anda
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Selamat! Anda telah menyelesaikan program pembelajaran
        </p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pre-Test Score */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pre-Test</h3>
              <p className="text-sm text-gray-500">Sebelum Pembelajaran</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-blue-600">
                {preScore}
              </div>
              <div className="text-gray-600">dari {maxScore} soal</div>
              <div className="text-2xl font-semibold text-blue-600">
                {prePercentage}%
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prePercentageRaw}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Post-Test Score */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Post-Test</h3>
              <p className="text-sm text-gray-500">Setelah Pembelajaran</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-green-600">
                {postScore}
              </div>
              <div className="text-gray-600">dari {maxScore} soal</div>
              <div className="text-2xl font-semibold text-green-600">
                {postPercentage}%
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${postPercentageRaw}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Improvement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg border border-blue-100"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Peningkatan Pengetahuan
            </h3>
            <p className="text-gray-600 mt-2">
              {improvement > 0
                ? `Anda meningkat ${improvement} poin!`
                : improvement === 0
                ? 'Skor Anda tetap sama'
                : `Skor Anda menurun ${Math.abs(improvement)} poin`}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
            >
              {improvement > 0 ? '+' : ''}
              {improvement}
            </motion.div>
            <div className="text-left">
              <div className="text-3xl font-bold text-gray-900">
                {improvement > 0 ? '+' : ''}
                {improvementPercentage}%
              </div>
              <div className="text-sm text-gray-600">perubahan</div>
            </div>
          </div>
          
          {/* Visual Comparison Chart */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-sm font-medium text-gray-700">
                Pre-Test
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prePercentageRaw}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-blue-500 flex items-center justify-end pr-3"
                >
                  <span className="text-white text-sm font-semibold">
                    {preScore}
                  </span>
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-sm font-medium text-gray-700">
                Post-Test
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${postPercentageRaw}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-green-500 flex items-center justify-end pr-3"
                >
                  <span className="text-white text-sm font-semibold">
                    {postScore}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center space-y-2"
      >
        {improvement > 0 ? (
          <>
            <p className="text-lg font-semibold text-green-600">
              🎉 Luar biasa! Pengetahuan Anda meningkat!
            </p>
            <p className="text-gray-600">
              Terus terapkan ilmu yang sudah dipelajari untuk menjaga kesehatan buah hati Anda
            </p>
          </>
        ) : improvement === 0 ? (
          <>
            <p className="text-lg font-semibold text-blue-600">
              Skor Anda konsisten
            </p>
            <p className="text-gray-600">
              Terus terapkan ilmu yang sudah dipelajari untuk menjaga kesehatan buah hati Anda
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-amber-600">
              Tetap semangat!
            </p>
            <p className="text-gray-600">
              Anda sudah menyelesaikan program pembelajaran. Terus pelajari materi untuk meningkatkan pemahaman Anda
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
