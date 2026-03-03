'use client'

import { useRouter } from 'next/navigation'
import { AdminLoginForm } from '@/components/auth/AdminLoginForm'

export default function AdminLoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Masukkan kredensial admin untuk mengakses panel
            </p>
          </div>

          <AdminLoginForm onSuccess={handleSuccess} />

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Kembali ke login pengguna
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
