'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { QuestionManager } from '@/components/admin/QuestionManager'

export default function AdminQuestionsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-[#2F5D50]/10 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden min-h-[48px] min-w-[48px] p-2 rounded-lg hover:bg-[#F4F7F5] fixed top-4 right-4 z-50 bg-white shadow-lg border border-[#2F5D50]/10"
                >
                  <svg
                    className="w-6 h-6 text-[#1F2933]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1F2933]">
                    Kelola Pertanyaan Kuis
                  </h1>
                  <p className="text-xs sm:text-sm text-[#1F2933]/70 mt-1">
                    Manajemen pertanyaan untuk pre-test dan post-test
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuestionManager />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
