'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Youtube } from 'lucide-react'
import { useState } from 'react'

interface VideoGuideProps {
  variant?: 'landing' | 'dashboard'
  className?: string
}

export function VideoGuide({ variant = 'landing', className = '' }: VideoGuideProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [isPlaying, setIsPlaying] = useState(false)

  // YouTube video ID dari URL: https://youtu.be/GMsrnDg_bg0
  const videoId = 'GMsrnDg_bg0'
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  if (variant === 'landing') {
    return (
      <section id="panduan" className={`py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white ${className}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {/* Header */}
            <div className="space-y-2 sm:space-y-3 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1F2933]">
                Panduan Penggunaan Program
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-[#1F2933]/70 font-light max-w-2xl mx-auto">
                Tonton video singkat ini untuk memahami cara menggunakan platform pembelajaran dengan mudah
              </p>
            </div>

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1F2933]/5 border border-[#2F5D50]/10 shadow-sm"
            >
              {!isPlaying ? (
                <>
                  {/* Thumbnail */}
                  <img
                    src={thumbnailUrl}
                    alt="Video Panduan Program"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2933]/60 via-[#1F2933]/20 to-transparent"></div>
                  
                  {/* Play Button */}
                  <button
                    onClick={handlePlayClick}
                    className="absolute inset-0 flex items-center justify-center group"
                    aria-label="Putar video panduan"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#2F5D50] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#274E43] transition-all group-hover:scale-110">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white ml-1" fill="white" />
                    </div>
                  </button>

                  {/* YouTube Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 shadow-sm">
                    <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF0000]" />
                    <span className="text-xs sm:text-sm font-medium text-[#1F2933]">Video Tutorial</span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#1F2933]/80 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-xs sm:text-sm font-medium text-white">
                    Video Panduan
                  </div>
                </>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Video Panduan Program"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </motion.div>

            {/* Info Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center space-y-2"
            >
              <p className="text-xs sm:text-sm text-[#1F2933]/60">
                Video ini menjelaskan langkah-langkah menggunakan platform, dari login hingga menyelesaikan program pembelajaran
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Dashboard variant
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.4 }}
      className={`bg-white rounded-xl p-4 sm:p-5 border border-[#2F5D50]/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#E07A5F]/10 flex items-center justify-center flex-shrink-0">
          <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-[#E07A5F]" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-[#1F2933]">
            Video Panduan
          </h3>
          <p className="text-xs text-[#1F2933]/60">
            Tutorial penggunaan
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#1F2933]/5 border border-[#2F5D50]/10 mb-3">
        {!isPlaying ? (
          <>
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt="Video Panduan"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2933]/50 via-[#1F2933]/10 to-transparent"></div>
            
            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Putar video panduan"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#2F5D50] rounded-full flex items-center justify-center shadow-md group-hover:bg-[#274E43] transition-all group-hover:scale-110">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" fill="white" />
              </div>
            </button>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-[#1F2933]/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white">
              Tutorial
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Video Panduan"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-[#1F2933]/70 leading-relaxed">
        Tonton tutorial singkat untuk memahami cara menggunakan dashboard dan fitur-fitur platform
      </p>
    </motion.div>
  )
}
