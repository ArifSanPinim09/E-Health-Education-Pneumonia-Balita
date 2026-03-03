'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sessionContents } from '@/lib/constants/session-content';
import ContentRenderer from '@/components/session/ContentRenderer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, BookOpen, Lightbulb } from 'lucide-react';
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
  const [showTips, setShowTips] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <BookOpen className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Memuat sesi pembelajaran...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !sessionContent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl p-8 shadow-xl"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Sesi Tidak Ditemukan'}
          </h1>
          <p className="text-gray-600 mb-6">
            Sesi yang Anda cari tidak tersedia atau belum terbuka.
          </p>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Progress Bar - Minimal */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-1 bg-gray-200">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, scrollProgress)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kembali</span>
          </button>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {day}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {sessionContent.title}
                  </h1>
                  <p className="text-sm text-gray-600">Hari ke-{day} dari 5</p>
                </div>
              </div>
            </div>
            
            {/* Tips Button */}
            <div className="relative">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                title="Tips"
              >
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </button>
              
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-10"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-gray-900 text-sm">Tips Belajar</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Baca seluruh materi dengan seksama. Scroll ke bawah untuk melihat semua konten. Setelah progress mencapai 80%, tombol selesai akan muncul.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Content - Clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
        >
          <ContentRenderer sections={sessionContent.sections} />
        </motion.div>

        {/* Complete Button - Only show when progress >= 80% */}
        <AnimatePresence>
          {canComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="sticky bottom-4 z-20"
            >
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <Button
                  onClick={handleCompleteSession}
                  disabled={completing}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Selamat!
              </h2>
              <p className="text-gray-600 mb-4">
                {getSessionCompletionMessage(day)}
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium">
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
