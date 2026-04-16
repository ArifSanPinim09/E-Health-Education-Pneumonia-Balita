'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface UserMenuProps {
  userName: string
}

export function UserMenu({ userName }: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (loggingOut) return

    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?')
    if (!confirmed) return

    setLoggingOut(true)
    setIsOpen(false)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Gagal logout')
      }

      // Redirect to landing page
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      alert('Gagal logout. Silakan coba lagi.')
      setLoggingOut(false)
    }
  }

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white border border-[#2F5D50]/10 rounded-lg hover:bg-[#F4F7F5] transition-colors"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2F5D50] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-xs sm:text-sm">
            {getInitials(userName)}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium text-[#1F2933] max-w-[120px] truncate">
          {userName}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-[#1F2933]/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#2F5D50]/10 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-[#2F5D50]/10">
              <p className="text-sm font-medium text-[#1F2933] truncate">
                {userName}
              </p>
              <p className="text-xs text-[#1F2933]/60 mt-0.5">
                Pengguna Program
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1F2933] hover:bg-[#F4F7F5] transition-colors"
              >
                <User className="w-4 h-4 text-[#2F5D50]" />
                <span>Lihat Profil</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E07A5F] hover:bg-[#E07A5F]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}
