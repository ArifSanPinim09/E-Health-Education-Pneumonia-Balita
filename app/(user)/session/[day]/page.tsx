'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sessionContents } from '@/lib/constants/session-content';
import ContentRenderer from '@/components/session/ContentRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Calendar,
  Sparkles,
  Award,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { getSessionCompletionMessage } from '@/lib/constants/indonesian-text';

export default function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const sessionContent = sessionContents.find(s => s.day === day);
  const canComplete = scrollProgress >= 80;

  useEffect(() => {
    if (!day || day < 1 || day > 5 || !sessionContent) {
      setError('Sesi tidak ditemukan');
      setLoading(false);
      return;
    }

    checkSessionAccess();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, scrollPercentage));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [day, sessionContent]);

  async function checkSessionAccess() {
    try {
      const response = await fetch(`/api/session/check-unlock?day=${day}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat sesi');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!data.success || !data.unlocked) {
        setError(data.error || 'Sesi belum dapat diakses');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat memuat sesi');
      setLoading(false);
    }
  }
  async function completeSession() {
    if (completing || !canComplete) return;

    setCompleting(true);
    try {
      const response = await fetch('/api/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day })
      });

      if (response.ok) {
        setShowCompletionModal(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Gagal menyelesaikan sesi');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyelesaikan sesi');
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F7F5] via-white to-[#E8F5E8] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#2F5D50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2F5D50] font-medium">Memuat pembelajaran...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F7F5] via-white to-[#E8F5E8] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#2F5D50] text-white rounded-lg hover:bg-[#1a3d35] transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!sessionContent) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7F5] via-white to-[#E8F5E8]">
      {/* Progress Bar - Book Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="h-1 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2F5D50] to-[#4A7C59]"
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Book Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-[#2F5D50] hover:text-[#1a3d35] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>

          {/* Book Cover Style Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-[#2F5D50] to-[#1a3d35] p-6 sm:p-8 text-white relative">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <BookOpen className="w-12 h-12" />
              </div>

              {/* Day Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Hari {day} dari 5</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-3"
              >
                {sessionContent.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90 mb-4"
              >
                {sessionContent.subtitle}
              </motion.p>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 text-sm text-white/80"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>~{sessionContent.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Pembelajaran Interaktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Untuk Ibu & Balita</span>
                </div>
              </motion.div>
            </div>

            {/* Reading Progress Indicator */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#2F5D50] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Progress Membaca: {Math.round(scrollProgress)}%
                  </span>
                </div>
                {canComplete && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Siap Diselesaikan</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Book Content */}
      <div className="pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 mx-4 sm:mx-6 lg:mx-8 overflow-hidden"
          >
            {/* Book Pages */}
            <div className="relative">
              {/* Page Shadow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-100/30 pointer-events-none"></div>
              
              <ContentRenderer sections={sessionContent.sections} />
              
              {/* Page End Decoration */}
              <div className="px-6 sm:px-8 lg:px-10 py-8 border-t border-gray-100 bg-gradient-to-r from-[#F4F7F5] to-white">
                <div className="text-center">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#2F5D50] to-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500 italic">
                    Akhir halaman - Hari {day}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Complete Button - Floating */}
      <AnimatePresence>
        {canComplete && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            <button
              onClick={completeSession}
              disabled={completing}
              className="flex items-center gap-3 bg-gradient-to-r from-[#2F5D50] to-[#4A7C59] text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-semibold">Menyelesaikan...</span>
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Selesaikan Pembelajaran</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Selamat! 🎉
              </h3>
              
              <p className="text-gray-600 mb-6">
                {getSessionCompletionMessage(day)}
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-[#2F5D50] to-[#4A7C59] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Kembali ke Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}