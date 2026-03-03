'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface SessionProgressProps {
  currentSection: number;
  totalSections: number;
  scrollProgress: number;
}

export default function SessionProgress({ 
  currentSection, 
  totalSections,
  scrollProgress 
}: SessionProgressProps) {
  const percentage = Math.min(100, Math.round(scrollProgress));

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-1.5">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Progress Membaca
            </span>
          </div>
          <div className="flex items-center gap-2">
            {percentage >= 80 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
              >
                <CheckCircle2 className="w-3 h-3" />
                Siap Selesai
              </motion.div>
            )}
            <span className="text-sm font-bold text-blue-600 min-w-[45px] text-right">
              {percentage}%
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Shimmer effect */}
          {percentage < 100 && (
            <motion.div
              className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                left: ['-80px', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </div>
        
        {/* Section indicator */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Bagian {Math.min(currentSection, totalSections)} dari {totalSections}</span>
          {percentage >= 80 ? (
            <span className="text-green-600 font-medium">✓ Materi selesai dibaca</span>
          ) : (
            <span>Scroll untuk melanjutkan</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
