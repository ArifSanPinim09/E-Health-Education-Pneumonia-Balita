'use client'

import { UseFormReturn } from 'react-hook-form'
import { ProfileSetupInput } from '@/lib/validations/profile-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Baby } from 'lucide-react'

interface ChildInfoFormProps {
  form: UseFormReturn<ProfileSetupInput>
}

export function ChildInfoForm({ form }: ChildInfoFormProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3">
          <Baby className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Data Anak</h2>
          <p className="text-sm text-gray-500">Informasi tentang anak</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="child-name" className="text-sm font-medium text-gray-700">
          Nama Lengkap Anak <span className="text-red-500">*</span>
        </Label>
        <Input
          id="child-name"
          {...register('child.name')}
          placeholder="Masukkan nama lengkap anak"
          className="h-11"
        />
        {errors.child?.name && (
          <p className="text-sm text-red-600">
            {errors.child.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-birth-date" className="text-sm font-medium text-gray-700">
          Tanggal Lahir <span className="text-red-500">*</span>
        </Label>
        <Input
          id="child-birth-date"
          type="date"
          {...register('child.birth_date')}
          className="h-11"
        />
        {errors.child?.birth_date && (
          <p className="text-sm text-red-600">
            {errors.child.birth_date.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-gender" className="text-sm font-medium text-gray-700">
          Jenis Kelamin <span className="text-red-500">*</span>
        </Label>
        <select
          id="child-gender"
          {...register('child.gender')}
          className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
        {errors.child?.gender && (
          <p className="text-sm text-red-600">
            {errors.child.gender.message}
          </p>
        )}
      </div>
    </div>
  )
}
