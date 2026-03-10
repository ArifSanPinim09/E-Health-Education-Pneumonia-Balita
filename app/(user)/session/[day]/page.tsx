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
  Award,
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

      const result = await response.json();
      
      if (!result.success) {
        setError(result.error || 'Sesi belum dapat diakses');
        setLoading(false);
        return;
      }

      const sessionData = result.data;
      if (!sessionData.unlocked) {
        setError('Sesi masih terkunci. Silakan tunggu hingga waktu unlock.');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Progress Bar - Minimalist */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="h-0.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2F5D50] to-[#4A7C59]"
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Header - Clean & Minimal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2F5D50] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          {/* Title Section - Clean */}
          <div className="mb-6">
            {/* Day Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="inline-flex items-center gap-1.5 bg-[#2F5D50] text-white rounded-lg px-3 py-1 mb-3 text-xs font-medium"
            >
              <Calendar className="w-3 h-3" />
              <span>Hari {day} dari 5</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2"
            >
              {sessionContent.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-gray-600 mb-3"
            >
              {sessionContent.subtitle}
            </motion.p>

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{sessionContent.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pembelajaran Interaktif</span>
              </div>
            </motion.div>
          </div>

          {/* Reading Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2.5 border border-blue-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#2F5D50] rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Progress: {Math.round(scrollProgress)}%
              </span>
            </div>
            {canComplete && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5 text-green-600"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Siap Diselesaikan</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Content - Clean Layout */}
      <div className="pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ContentRenderer sections={sessionContent.sections} />
          
          {/* Page End */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 mb-8">
            <div className="text-center">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-3"></div>
              <p className="text-xs text-gray-400 italic">
                Akhir pembelajaran - Hari {day}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Complete Button - Floating */}
      <AnimatePresence>
        {canComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            <button
              onClick={completeSession}
              disabled={completing}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2F5D50] to-[#4A7C59] text-white px-6 py-3 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {completing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyelesaikan...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Selesaikan Pembelajaran</span>
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-7 h-7 text-white" />
              </motion.div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Selamat! 🎉
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                {getSessionCompletionMessage(day)}
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-[#2F5D50] to-[#4A7C59] text-white py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300"
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