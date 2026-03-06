'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Baby, MapPin, Phone, Briefcase, Calendar, Heart, LogOut } from 'lucide-react'
import Link from 'next/link'
import { UserNavbar } from '@/components/user/UserNavbar'

interface ProfileData {
  mother: {
    name: string
    age: number
    religion: string
    occupation: string
    address: string
    phone: string
  }
  child: {
    name: string
    birth_date: string
    gender: string
    age: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile/get')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          if (response.status === 404) {
            router.push('/profile-setup')
            return
          }
          throw new Error('Gagal memuat profil')
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = async () => {
    if (loggingOut) return

    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?')
    if (!confirmed) return

    setLoggingOut(true)

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#2F5D50]/20 border-t-[#2F5D50] mx-auto mb-4"></div>
          </div>
          <p className="text-[#1F2933]/70 text-sm">Memuat profil...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-14 h-14 bg-[#E07A5F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <p className="text-[#E07A5F] text-sm mb-4">{error || 'Gagal memuat profil'}</p>
          <button
            onClick={() => window.location.reload()}
            className="h-11 px-6 bg-[#2F5D50] text-white text-sm font-medium rounded-lg hover:bg-[#274E43] transition-colors"
          >
            Coba Lagi
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Navbar */}
      <UserNavbar userName={profile.mother.name} />
      
      <div className="min-h-screen bg-[#F4F7F5] pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#2F5D50]/80 font-medium mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1F2933] mb-2">
            Profil Saya
          </h1>
          <p className="text-sm sm:text-base text-[#1F2933]/60">
            Informasi lengkap data ibu dan anak
          </p>
        </motion.div>

        {/* Mother Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-[#2F5D50]/10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F5D50]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933]">Data Ibu</h2>
              <p className="text-xs sm:text-sm text-[#1F2933]/60">Informasi pribadi ibu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <User className="w-4 h-4" />
                <span>Nama Lengkap</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.mother.name}
              </p>
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Calendar className="w-4 h-4" />
                <span>Usia</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.mother.age} tahun
              </p>
            </div>

            {/* Religion */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Heart className="w-4 h-4" />
                <span>Agama</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.mother.religion}
              </p>
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Briefcase className="w-4 h-4" />
                <span>Pekerjaan</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.mother.occupation}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Phone className="w-4 h-4" />
                <span>Nomor Telepon</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.mother.phone}
              </p>
            </div>

            {/* Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <MapPin className="w-4 h-4" />
                <span>Alamat</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6 leading-relaxed">
                {profile.mother.address}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Child Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-[#2F5D50]/10 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-[#2F5D50]/10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E07A5F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-[#E07A5F]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1F2933]">Data Anak</h2>
              <p className="text-xs sm:text-sm text-[#1F2933]/60">Informasi anak balita</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Baby className="w-4 h-4" />
                <span>Nama Lengkap</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.child.name}
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <User className="w-4 h-4" />
                <span>Jenis Kelamin</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>

            {/* Birth Date */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Calendar className="w-4 h-4" />
                <span>Tanggal Lahir</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {formatDate(profile.child.birth_date)}
              </p>
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2933]/60">
                <Calendar className="w-4 h-4" />
                <span>Usia</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#1F2933] pl-6">
                {profile.child.age} bulan
              </p>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full h-11 sm:h-12 bg-[#E07A5F] hover:bg-[#E07A5F]/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Keluar...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </>
            )}
          </button>
        </motion.div>
        </div>
      </div>
    </>
  )
}
