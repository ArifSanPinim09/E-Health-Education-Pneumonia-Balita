'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        
        // Check if there's already a valid session
        const { data: existingSession } = await supabase.auth.getSession()
        if (existingSession.session) {
          // Call API to create JWT token and check profile
          const response = await fetch('/api/auth/create-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: existingSession.session.user.id,
              email: existingSession.session.user.email,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            router.push(result.redirectTo)
            return
          }
        }
        
        // Get the code from URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        
        if (!code) {
          router.push('/login?error=no_code')
          return
        }
        
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          throw exchangeError
        }

        if (!data.session) {
          throw new Error('No session returned')
        }

        // Call API to create JWT token and check profile
        const response = await fetch('/api/auth/create-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.session.user.id,
            email: data.session.user.email,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create token')
        }

        const result = await response.json()
        router.push(result.redirectTo)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
        setTimeout(() => {
          router.push('/login?error=auth_failed')
        }, 2000)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Autentikasi Gagal</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Mengalihkan ke halaman login...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Modern Loading Animation */}
        <div className="flex flex-col items-center">
          {/* Animated Circles */}
          <div className="relative w-24 h-24 mb-6">
            <motion.div
              className="absolute inset-0 border-4 border-blue-200 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-blue-400 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-4 border-4 border-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Memproses Login
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-center mb-6"
          >
            Mohon tunggu sebentar, kami sedang memverifikasi akun Anda
          </motion.p>

          {/* Animated Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
