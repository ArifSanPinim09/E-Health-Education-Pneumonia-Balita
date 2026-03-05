'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors duration-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg p-8 sm:p-10 border border-[#2F5D50]/10"
        >
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#2F5D50] rounded-lg mb-6"
            >
              <span className="text-white font-bold text-2xl">P</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-3xl font-serif text-[#1F2933] mb-3"
            >
              Masuk ke Akun
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-[#1F2933]/70 leading-relaxed"
            >
              Gunakan akun Google untuk melanjutkan
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg"
            >
              <p className="text-sm text-[#E07A5F] font-medium leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          {/* Google Login Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base font-medium bg-white hover:bg-[#F4F7F5] text-[#1F2933] border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#2F5D50]/30"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-[#2F5D50] border-t-transparent rounded-full animate-spin" />
                <span>Menghubungkan...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Masuk dengan Google</span>
              </span>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2F5D50]/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#1F2933]/50">Informasi</span>
            </div>
          </div>

          {/* Info Box */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="p-4 bg-[#F4F7F5] rounded-lg border border-[#2F5D50]/10"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#1F2933] mb-1">
                  Pertama kali di sini?
                </h3>
                <p className="text-sm text-[#1F2933]/70 leading-relaxed">
                  Tidak perlu mendaftar. Cukup masuk dengan Google dan kami akan membuat profil untuk Anda secara otomatis.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="mt-8 text-xs text-center text-[#1F2933]/50 leading-relaxed"
          >
            Dengan masuk, Anda menyetujui penggunaan data sesuai kebijakan privasi kami untuk keperluan edukasi kesehatan.
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[#1F2933]/60 leading-relaxed">
            © 2026 Pneumonia Care
          </p>
          <p className="text-xs text-[#1F2933]/50 mt-1">
            Program edukasi kesehatan untuk ibu Indonesia
          </p>
        </motion.div>
      </div>
    </div>
  )
}
