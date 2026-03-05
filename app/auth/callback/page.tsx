'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

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
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-8 sm:p-10 max-w-md w-full text-center border border-[#E07A5F]/20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-[#E07A5F]/10 rounded-lg"
          >
            <XCircle className="w-8 h-8 text-[#E07A5F]" strokeWidth={2} />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-2xl font-serif text-[#1F2933] mb-3"
          >
            Autentikasi Gagal
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-[#1F2933]/70 mb-6 leading-relaxed"
          >
            {error}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm text-[#1F2933]/60"
          >
            <div className="w-2 h-2 bg-[#2F5D50] rounded-full animate-pulse"></div>
            <span>Mengalihkan ke halaman login...</span>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-8 sm:p-10 max-w-md w-full border border-[#2F5D50]/10"
      >
        <div className="flex flex-col items-center">
          {/* Loading Animation */}
          <div className="relative w-20 h-20 mb-8">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 border-4 border-[#2F5D50]/20 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 border-4 border-[#2F5D50]/40 rounded-full"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            
            {/* Inner spinning ring */}
            <motion.div
              className="absolute inset-4 border-4 border-[#2F5D50] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle className="w-8 h-8 text-[#2F5D50]" strokeWidth={2} />
              </motion.div>
            </div>
          </div>

          {/* Text */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-2xl font-serif text-[#1F2933] mb-3"
          >
            Memproses Login
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-[#1F2933]/70 text-center mb-8 leading-relaxed"
          >
            Mohon tunggu sebentar, kami sedang memverifikasi akun Anda
          </motion.p>

          {/* Animated Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-[#2F5D50] rounded-full"
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
