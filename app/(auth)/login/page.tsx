'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Masuk ke Akun
            </h1>
            <p className="text-gray-600">
              Gunakan akun Google untuk melanjutkan
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">
                {error}
              </p>
            </motion.div>
          )}

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Menghubungkan...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
              </span>
            )}
          </Button>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">Pertama kali di sini?</span> Tidak perlu mendaftar. 
                  Cukup masuk dengan Google dan kami akan membuat profil untuk Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="mt-6 text-xs text-center text-gray-500 leading-relaxed">
            Dengan masuk, Anda menyetujui penggunaan data sesuai kebijakan privasi kami.
          </p>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          © 2026 Pneumonia Care. Program edukasi kesehatan untuk ibu Indonesia.
        </p>
      </div>
    </div>
  )
}
