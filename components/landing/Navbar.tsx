'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#2F5D50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-medium text-lg text-[#1F2933]">
              Pneumonia Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#program" 
              className="text-sm font-medium text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors"
            >
              Program
            </Link>
            <Link 
              href="#benefits" 
              className="text-sm font-medium text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors"
            >
              Manfaat
            </Link>
            <Link 
              href="#statistics" 
              className="text-sm font-medium text-[#1F2933]/70 hover:text-[#2F5D50] transition-colors"
            >
              Data
            </Link>
            
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-[#2F5D50] text-white text-sm font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-[#2F5D50] text-white text-sm font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-colors"
                >
                  Masuk
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1F2933] hover:bg-[#F4F7F5] transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
            <div className="px-4 py-6 space-y-4">
              <Link
                href="#program"
                className="block px-4 py-2 text-[#1F2933]/70 hover:text-[#2F5D50] hover:bg-[#F4F7F5] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Program
              </Link>
              <Link
                href="#benefits"
                className="block px-4 py-2 text-[#1F2933]/70 hover:text-[#2F5D50] hover:bg-[#F4F7F5] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manfaat
              </Link>
              <Link
                href="#statistics"
                className="block px-4 py-2 text-[#1F2933]/70 hover:text-[#2F5D50] hover:bg-[#F4F7F5] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Data
              </Link>
              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 bg-[#2F5D50] text-white text-center font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3 bg-[#2F5D50] text-white text-center font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
