'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/dashboard/UserMenu'

interface UserNavbarProps {
  userName: string
}

export function UserNavbar({ userName }: UserNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#2F5D50]/10"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2F5D50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">P</span>
            </div>
            <span className="font-medium text-base sm:text-lg text-[#1F2933]">
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
            
            <UserMenu userName={userName} />
          </div>

          {/* Mobile: User Menu + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <UserMenu userName={userName} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F2933] hover:bg-[#F4F7F5] transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#2F5D50]/10"
          >
            <div className="px-4 py-4 space-y-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
