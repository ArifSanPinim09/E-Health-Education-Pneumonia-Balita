'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
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
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white/80 backdrop-blur-md shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">P</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-gray-900">
                Pneumonia Care
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="#how-it-works" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Cara Kerja
              </Link>
              <Link 
                href="#benefits" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Manfaat
              </Link>
              <Link 
                href="#statistics" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Statistik
              </Link>
              
              {!loading && (
                user ? (
                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="#how-it-works"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cara Kerja
                </Link>
                <Link
                  href="#benefits"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manfaat
                </Link>
                <Link
                  href="#statistics"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Statistik
                </Link>
                {!loading && (
                  user ? (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2.5 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2.5 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* AI Chat Button - Fixed Bottom Right */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center group"
        title="Tanya AI tentang Pneumonia"
      >
        <MessageCircle size={24} />
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tanya AI tentang Pneumonia
        </span>
      </motion.button>
    </>
  );
}
