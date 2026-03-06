'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sessionContents } from '@/lib/constants/session-content';
import ContentRenderer from '@/components/session/ContentRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
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
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setError(data.error || 'Gagal memeriksa akses sesi');
        setLoading(false);
        return;
      }

      const result = await response.json();
      const sessionData = result.data;

      if (!sessionData || !sessionData.unlocked) {
        setError('Sesi masih terkunci. Silakan tunggu hingga waktu unlock.');
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error('Error checking session access:', err);
      setError('Terjadi kesalahan saat memuat sesi');
      setLoading(false);
    }
  }

  async function handleCompleteSession() {
    if (completing) return;

    setCompleting(true);

    try {
      const response = await fetch('/api/session/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error?.includes('sudah diselesaikan')) {
          setShowCompletionModal(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
          return;
        }
        throw new Error(data.error || 'Gagal menyelesaikan sesi');
      }

      setShowCompletionModal(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error completing session:', err);
      alert(err instanceof Error ? err.message : 'Gagal menyelesaikan sesi');
      setCompleting(false);
    }
  }

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
            <BookOpen className="w-5 h-5 text-[#2F5D50] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[#1F2933]/70 text-sm">Memuat sesi pembelajaran...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !sessionContent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F7F5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 bg-[#E07A5F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h1 className="text-2xl font-serif text-[#1F2933] mb-2">
            {error || 'Sesi Tidak Ditemukan'}
          </h1>
          <p className="text-[#1F2933]/70 text-sm leading-relaxed mb-6">
            Sesi yang Anda cari tidak tersedia atau belum terbuka.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 h-11 px-6 bg-[#2F5D50] text-white text-sm font-medium rounded-lg hover:bg-[#274E43] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Progress Bar - Minimal & Clean */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#2F5D50]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="h-0.5 bg-[#2F5D50]/10">
            <motion.div 
              className="h-full bg-[#2F5D50]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, scrollProgress)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Container - Reading Experience */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header - Clean & Minimal */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#2F5D50]/80 font-medium mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
          
          {/* Title Section - Editorial Style */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2F5D50] text-white rounded-md flex items-center justify-center font-bold text-sm">
                {day}
              </div>
              <span className="text-xs text-[#1F2933]/50 font-medium uppercase tracking-wider">
                Hari ke-{day} dari 5
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1F2933] leading-tight">
              {sessionContent.title}
            </h1>
          </div>
        </motion.div>

        {/* Content - Article/Book Reading Style */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white mb-8"
        >
          <ContentRenderer sections={sessionContent.sections} />
        </motion.article>

        {/* Complete Button - Floating & Minimal */}
        <AnimatePresence>
          {canComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="sticky bottom-6 z-20"
            >
              <button
                onClick={handleCompleteSession}
                disabled={completing}
                className="w-full h-12 bg-[#2F5D50] hover:bg-[#274E43] text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {completing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Selesaikan Sesi
                  </span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal - Clean & Consistent */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1F2933]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-center"
            >
              <div className="w-14 h-14 bg-[#2F5D50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#2F5D50]" />
              </div>
              <h2 className="text-2xl font-serif text-[#1F2933] mb-2">
                Selamat!
              </h2>
              <p className="text-[#1F2933]/70 text-sm leading-relaxed mb-4">
                {getSessionCompletionMessage(day)}
              </p>
              <div className="bg-[#2F5D50]/5 rounded-lg p-4 border border-[#2F5D50]/10">
                <p className="text-sm text-[#2F5D50] font-medium">
                  Progress Anda telah disimpan
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
