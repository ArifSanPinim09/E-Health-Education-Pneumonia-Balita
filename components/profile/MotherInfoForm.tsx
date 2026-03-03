'use client'

import { UseFormReturn } from 'react-hook-form'
import { ProfileSetupInput } from '@/lib/validations/profile-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 rounded-xl p-3">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Data Ibu</h2>
          <p className="text-sm text-gray-500">Informasi tentang ibu</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mother-name" className="text-sm font-medium text-gray-700">
          Nama Lengkap <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mother-name"
          {...register('mother.name')}
          placeholder="Masukkan nama lengkap"
          className="h-11"
        />
        {errors.mother?.name && (
          <p className="text-sm text-red-600">
            {errors.mother.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mother-age" className="text-sm font-medium text-gray-700">
            Usia <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mother-age"
            type="number"
            {...register('mother.age', { valueAsNumber: true })}
            placeholder="Contoh: 30"
            className="h-11"
          />
          {errors.mother?.age && (
            <p className="text-sm text-red-600">
              {errors.mother.age.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother-religion" className="text-sm font-medium text-gray-700">
            Agama <span className="text-red-500">*</span>
          </Label>
          <select
            id="mother-religion"
            {...register('mother.religion')}
            className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih agama</option>
            {RELIGIONS.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
          {errors.mother?.religion && (
            <p className="text-sm text-red-600">
              {errors.mother.religion.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-occupation" className="text-sm font-medium text-gray-700">
          Pekerjaan <span className="text-red-500">*</span>
        </Label>
        <select
          id="mother-occupation"
          {...register('mother.occupation')}
          className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Pilih pekerjaan</option>
          {OCCUPATIONS.map((occupation) => (
            <option key={occupation} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>
        {errors.mother?.occupation && (
          <p className="text-sm text-red-600">
            {errors.mother.occupation.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-address" className="text-sm font-medium text-gray-700">
          Alamat Lengkap <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mother-address"
          {...register('mother.address')}
          placeholder="Masukkan alamat lengkap"
          className="h-11"
        />
        {errors.mother?.address && (
          <p className="text-sm text-red-600">
            {errors.mother.address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-phone" className="text-sm font-medium text-gray-700">
          Nomor Telepon <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mother-phone"
          type="tel"
          {...register('mother.phone')}
          placeholder="Contoh: 081234567890"
          className="h-11"
        />
        {errors.mother?.phone && (
          <p className="text-sm text-red-600">
            {errors.mother.phone.message}
          </p>
        )}
      </div>
    </div>
  )
}
