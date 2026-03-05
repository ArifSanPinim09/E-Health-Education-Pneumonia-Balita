'use client'

import { UseFormReturn } from 'react-hook-form'
import { ProfileSetupInput } from '@/lib/validations/profile-schema'
import { Baby } from 'lucide-react'

interface ChildInfoFormProps {
  form: UseFormReturn<ProfileSetupInput>
}

export function ChildInfoForm({ form }: ChildInfoFormProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-[#2F5D50]/10">
        <div className="w-12 h-12 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
          <Baby className="w-6 h-6 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-medium text-[#1F2933]">Data Anak</h2>
          <p className="text-sm text-[#1F2933]/60">Informasi tentang anak</p>
        </div>
      </div>
      
      {/* Nama Lengkap Anak */}
      <div className="space-y-2">
        <label htmlFor="child-name" className="block text-sm font-medium text-[#1F2933]">
          Nama Lengkap Anak <span className="text-[#E07A5F]">*</span>
        </label>
        <input
          id="child-name"
          {...register('child.name')}
          placeholder="Masukkan nama lengkap anak"
          className="w-full h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all"
        />
        {errors.child?.name && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.child.name.message}
          </p>
        )}
      </div>

      {/* Tanggal Lahir */}
      <div className="space-y-2">
        <label htmlFor="child-birth-date" className="block text-sm font-medium text-[#1F2933]">
          Tanggal Lahir <span className="text-[#E07A5F]">*</span>
        </label>
        <input
          id="child-birth-date"
          type="date"
          {...register('child.birth_date')}
          className="w-full h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all"
        />
        {errors.child?.birth_date && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.child.birth_date.message}
          </p>
        )}
      </div>

      {/* Jenis Kelamin */}
      <div className="space-y-2">
        <label htmlFor="child-gender" className="block text-sm font-medium text-[#1F2933]">
          Jenis Kelamin <span className="text-[#E07A5F]">*</span>
        </label>
        <select
          id="child-gender"
          {...register('child.gender')}
          className="w-full h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
        {errors.child?.gender && (
          <p className="text-sm text-[#E07A5F] font-medium">
            {errors.child.gender.message}
          </p>
        )}
      </div>
    </div>
  )
}
