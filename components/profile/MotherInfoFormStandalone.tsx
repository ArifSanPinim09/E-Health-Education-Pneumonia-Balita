'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

interface MotherData {
  name: string
  age: number
  religion: string
  occupation: string
  address: string
  phone: string
}

interface MotherInfoFormStandaloneProps {
  initialData?: MotherData | null
  onSubmit: (data: MotherData) => void
}

export function MotherInfoFormStandalone({ initialData, onSubmit }: MotherInfoFormStandaloneProps) {
  const [formData, setFormData] = useState<MotherData>(
    initialData || {
      name: '',
      age: 0,
      religion: '',
      occupation: '',
      address: '',
      phone: '',
    }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof MotherData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MotherData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi'
    }
    if (!formData.age || formData.age < 15 || formData.age > 100) {
      newErrors.age = 'Usia harus antara 15-100 tahun'
    }
    if (!formData.religion.trim()) {
      newErrors.religion = 'Agama harus diisi'
    }
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Pekerjaan harus diisi'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat harus diisi'
    }
    if (!formData.phone.trim() || !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Nomor telepon harus 10-15 digit'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof MotherData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mother-name">Nama Ibu *</Label>
        <Input
          id="mother-name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Masukkan nama lengkap"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-age">Usia *</Label>
        <Input
          id="mother-age"
          type="number"
          value={formData.age || ''}
          onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
          placeholder="Masukkan usia"
          className={errors.age ? 'border-red-500' : ''}
        />
        {errors.age && (
          <p className="text-sm text-red-600">{errors.age}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-religion">Agama *</Label>
        <Input
          id="mother-religion"
          value={formData.religion}
          onChange={(e) => handleChange('religion', e.target.value)}
          placeholder="Masukkan agama"
          className={errors.religion ? 'border-red-500' : ''}
        />
        {errors.religion && (
          <p className="text-sm text-red-600">{errors.religion}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-occupation">Pekerjaan *</Label>
        <Input
          id="mother-occupation"
          value={formData.occupation}
          onChange={(e) => handleChange('occupation', e.target.value)}
          placeholder="Masukkan pekerjaan"
          className={errors.occupation ? 'border-red-500' : ''}
        />
        {errors.occupation && (
          <p className="text-sm text-red-600">{errors.occupation}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-address">Alamat *</Label>
        <Input
          id="mother-address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Masukkan alamat lengkap"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother-phone">Nomor Telepon *</Label>
        <Input
          id="mother-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
          placeholder="Contoh: 081234567890"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full h-12 text-base">
          Lanjutkan
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  )
}
