'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/dashboard/UserMenu'
import { startUserGuide } from '@/lib/userGuide'

interface UserNavbarProps {
  userName: string
}

export function UserNavbar({ userName }: UserNavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    if (loggingOut) return

    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?')
    if (!confirmed) return

    setLoggingOut(true)
    setIsMobileMenuOpen(false)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Gagal logout')
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      alert('Gagal logout. Silakan coba lagi.')
      setLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#2F5D50]/10"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#2F5D50] tracking-tight">
              Pneumonia Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-[#2F5D50] hover:text-[#2F5D50]/80 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/results" 
              className="text-sm font-medium text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors"
            >
              Hasil
            </Link>
            
            <button
              onClick={() => startUserGuide()}
              className="flex items-center gap-2 text-sm font-medium text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Panduan
            </button>
            
            <UserMenu userName={userName} />
          </div>

          {/* Mobile: Hamburger Only */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F2933] hover:bg-[#F4F7F5] transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#2F5D50]/10"
          >
            <div className="px-4 py-4 space-y-3">
              {/* User Info Section */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F4F7F5] rounded-lg">
                <div className="w-10 h-10 bg-[#2F5D50] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(userName)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2933] truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-[#1F2933]/60">
                    Pengguna Program
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <Link
                href="/dashboard"
                className="block px-4 py-2.5 text-sm text-[#2F5D50] bg-[#2F5D50]/5 font-medium rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/results"
                className="block px-4 py-2.5 text-sm text-[#1F2933]/70 hover:text-[#2F5D50] hover:bg-[#F4F7F5] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hasil
              </Link>

              {/* Divider */}
              <div className="border-t border-[#2F5D50]/10 my-2"></div>

              {/* Guide Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  startUserGuide()
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1F2933] hover:bg-[#F4F7F5] rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#2F5D50]" />
                <span>Lihat Panduan</span>
              </button>

              {/* Profile Link */}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1F2933] hover:bg-[#F4F7F5] rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-[#2F5D50]" />
                <span>Lihat Profil</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E07A5F] hover:bg-[#E07A5F]/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E07A5F] border-t-transparent"></div>
                    <span>Keluar...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
