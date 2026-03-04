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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-sm text-gray-500">E-Health Pneumonia</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
