'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for error in URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const errorParam = params.get('error')
      
      if (errorParam) {
        const errorMessages: Record<string, string> = {
          'auth_failed': 'Gagal masuk. Silakan coba lagi.',
          'no_code': 'Kode autentikasi tidak ditemukan.',
          'no_user': 'Data pengguna tidak ditemukan.',
          'server_error': 'Terjadi kesalahan server. Silakan coba lagi.',
          'session_expired': 'Sesi kedaluwarsa. Silakan masuk kembali.',
        }
        
        setError(errorMessages[errorParam] || 'Terjadi kesalahan. Silakan coba lagi.')
        
        // Clean up URL
        window.history.replaceState({}, '', '/login')
      }
    }
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError(err instanceof Error ? err.message : 'Gagal masuk dengan Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Back to Home - Fixed Position */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#2F5D50]/80 lg:text-white lg:hover:text-white/80 transition-colors duration-250 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:ring-offset-2 rounded-md px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Editorial Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-screen">
        
        {/* LEFT PANEL - Educational Content (Desktop Only) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="hidden lg:flex bg-[#2F5D50] text-white p-12 xl:p-20 flex-col justify-center items-center"
        >
          <div className="max-w-xl w-full space-y-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white font-bold text-lg">P</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl xl:text-4xl font-serif leading-tight">
                Edukasi Pneumonia untuk Kesehatan Anak Indonesia
              </h1>
              <p className="text-base text-white/80 leading-relaxed">
                Platform ini membantu ibu memahami gejala pneumonia sejak dini dan melakukan perawatan awal yang tepat.
              </p>
            </div>

            {/* Statistics */}
            <div className="space-y-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-4xl xl:text-5xl font-bold mb-2">725.000</div>
                <p className="text-sm text-white/70 leading-relaxed">
                  anak meninggal akibat pneumonia setiap tahun di seluruh dunia
                </p>
              </div>
              <div>
                <div className="text-4xl xl:text-5xl font-bold mb-2">15%</div>
                <p className="text-sm text-white/70 leading-relaxed">
                  kematian balita di Indonesia disebabkan oleh pneumonia
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="pt-8 border-t border-white/20">
              <blockquote className="text-lg xl:text-xl font-serif italic leading-relaxed">
                "Deteksi dini dapat menyelamatkan nyawa anak."
              </blockquote>
              <p className="text-sm text-white/60 mt-3">
                — WHO, Organisasi Kesehatan Dunia
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL - Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center items-center min-h-screen"
        >
          <div className="max-w-md w-full space-y-6 md:space-y-8">
            
            {/* Logo (Mobile Only) */}
            <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 bg-[#2F5D50] rounded-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>

            {/* Title */}
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#1F2933]">
                Masuk untuk Memulai Edukasi
              </h2>
              <p className="text-sm md:text-base text-[#1F2933]/70 leading-relaxed">
                Gunakan akun Google untuk melanjutkan ke platform edukasi
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <p className="text-sm text-[#E07A5F] font-medium leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 md:h-14 text-sm md:text-base font-medium bg-white hover:bg-[#F4F7F5] hover:-translate-y-[1px] text-[#1F2933] border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#2F5D50]/30 disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:ring-offset-2"
              aria-label="Masuk dengan Google"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#2F5D50] border-t-transparent rounded-full animate-spin" />
                  <span>Menghubungkan...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Masuk dengan Google</span>
                </span>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-[#2F5D50]">
              <Lock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span>Login aman menggunakan Google</span>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2F5D50]/10"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-4 bg-white text-[#1F2933]/50">Informasi</span>
              </div>
            </div>


            {/* Mobile Statistics (Mobile Only) */}
            <div className="lg:hidden p-4 bg-[#2F5D50]/5 rounded-lg border border-[#2F5D50]/10">
              <p className="text-sm text-[#1F2933]/70 leading-relaxed">
                <span className="font-bold text-[#2F5D50]">725.000</span> anak meninggal akibat pneumonia setiap tahun
              </p>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs md:text-sm text-[#1F2933]/50 leading-relaxed text-center">
              Dengan masuk, Anda menyetujui penggunaan data sesuai kebijakan privasi kami untuk keperluan edukasi kesehatan.
            </p>

            {/* Footer */}
            <div className="pt-6 md:pt-8 border-t border-[#2F5D50]/10 text-center">
              <p className="text-xs md:text-sm text-[#1F2933]/60 leading-relaxed">
                © 2026 Pneumonia Care
              </p>
              <p className="text-xs text-[#1F2933]/50 mt-1">
                Program edukasi kesehatan untuk ibu Indonesia
              </p>
              <p className="text-xs text-[#1F2933]/40 mt-2">
                Didukung oleh penelitian kesehatan masyarakat
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
