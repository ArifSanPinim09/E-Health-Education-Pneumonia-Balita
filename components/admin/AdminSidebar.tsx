'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin-login')
  }

  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: BarChart3,
      label: 'Dashboard',
    },
    {
      href: '/admin/respondents',
      icon: Users,
      label: 'Data Responden',
    },
    {
      href: '/admin/questions',
      icon: ClipboardList,
      label: 'Kelola Soal',
    },
  ]

  return (
    <>
      {/* Overlay for mobile - appears behind sidebar */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar - Always visible on desktop */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300 border-r border-[#2F5D50]/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-[#2F5D50]/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2933] mb-1">Admin Panel</h1>
            <p className="text-xs sm:text-sm text-[#1F2933]/60">E-Health Pneumonia</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2 hover:bg-[#F4F7F5] rounded-lg transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5 text-[#1F2933]/70" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all min-h-[48px] ${
                  isActive
                    ? 'bg-[#2F5D50] text-white shadow-sm'
                    : 'text-[#1F2933]/70 hover:bg-[#F4F7F5] hover:text-[#1F2933]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2F5D50]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-[#E07A5F]/10 text-[#E07A5F] rounded-lg text-sm font-medium hover:bg-[#E07A5F]/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
