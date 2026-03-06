'use client'

import { UseFormReturn } from 'react-hook-form'
import { ProfileSetupInput } from '@/lib/validations/profile-schema'
import { User } from 'lucide-react'

interface MotherInfoFormProps {
  form: UseFormReturn<ProfileSetupInput>
}

const RELIGIONS = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu',
  'Lainnya'
]

const OCCUPATIONS = [
  'Ibu Rumah Tangga',
  'Pegawai Swasta',
  'Pegawai Negeri',
  'Wiraswasta',
  'Guru',
  'Perawat',
  'Dokter',
  'Petani',
  'Pedagang',
  'Buruh',
  'Lainnya'
]

export function MotherInfoForm({ form }: MotherInfoFormProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-[#2F5D50]/10">
        <div className="w-12 h-12 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
          <User className="w-6 h-6 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-serif text-[#1F2933]">Data Ibu</h2>
          <p className="text-sm text-[#6B7280]">Informasi tentang ibu</p>
        </div>
      </div>
      
      {/* Nama Lengkap */}
      <div className="space-y-2">
        <label htmlFor="mother-name" className="block text-sm font-medium text-[#1F2933]">
          Nama Lengkap <span className="text-[#E07A5F]">*</span>
        </label>
        <input
          id="mother-name"
          type="text"
          {...register('mother.name')}
          placeholder="Masukkan nama lengkap"
          className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
        />
        {errors.mother?.name && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.mother.name.message}
          </p>
        )}
      </div>

      {/* Usia & Agama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="mother-age" className="block text-sm font-medium text-[#1F2933]">
            Usia <span className="text-[#E07A5F]">*</span>
          </label>
          <input
            id="mother-age"
            type="number"
            inputMode="numeric"
            {...register('mother.age', { valueAsNumber: true })}
            placeholder="Contoh: 30"
            className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
          />
          {errors.mother?.age && (
            <p className="text-sm text-[#E07A5F] font-medium">
              {errors.mother.age.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="mother-religion" className="block text-sm font-medium text-[#1F2933]">
            Agama <span className="text-[#E07A5F]">*</span>
          </label>
          <select
            id="mother-religion"
            {...register('mother.religion')}
            className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
          >
            <option value="">Pilih agama</option>
            {RELIGIONS.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
          {errors.mother?.religion && (
            <p className="text-sm text-[#E07A5F] font-medium">
              {errors.mother.religion.message}
            </p>
          )}
        </div>
      </div>

      {/* Pekerjaan */}
      <div className="space-y-2">
        <label htmlFor="mother-occupation" className="block text-sm font-medium text-[#1F2933]">
          Pekerjaan <span className="text-[#E07A5F]">*</span>
        </label>
        <select
          id="mother-occupation"
          {...register('mother.occupation')}
          className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
        >
          <option value="">Pilih pekerjaan</option>
          {OCCUPATIONS.map((occupation) => (
            <option key={occupation} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>
        {errors.mother?.occupation && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.mother.occupation.message}
          </p>
        )}
      </div>

      {/* Alamat */}
      <div className="space-y-2">
        <label htmlFor="mother-address" className="block text-sm font-medium text-[#1F2933]">
          Alamat Lengkap <span className="text-[#E07A5F]">*</span>
        </label>
        <input
          id="mother-address"
          type="text"
          {...register('mother.address')}
          placeholder="Masukkan alamat lengkap"
          className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
        />
        {errors.mother?.address && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.mother.address.message}
          </p>
        )}
      </div>

      {/* Nomor Telepon */}
      <div className="space-y-2">
        <label htmlFor="mother-phone" className="block text-sm font-medium text-[#1F2933]">
          Nomor Telepon <span className="text-[#E07A5F]">*</span>
        </label>
        <input
          id="mother-phone"
          type="tel"
          inputMode="tel"
          {...register('mother.phone')}
          placeholder="Contoh: 081234567890"
          className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
        />
        {errors.mother?.phone && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.mother.phone.message}
          </p>
        )}
      </div>
    </div>
  )
}
