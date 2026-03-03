'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

interface ChildData {
  name: string
  birth_date: string
  gender: 'male' | 'female'
}

interface ChildInfoFormStandaloneProps {
  initialData?: ChildData | null
  onSubmit: (data: ChildData) => void
  onBack?: () => void
}

export function ChildInfoFormStandalone({ initialData, onSubmit, onBack }: ChildInfoFormStandaloneProps) {
  const [formData, setFormData] = useState<ChildData>(
    initialData || {
      name: '',
      birth_date: '',
      gender: 'male',
    }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ChildData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChildData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama anak harus diisi'
    }
    if (!formData.birth_date) {
      newErrors.birth_date = 'Tanggal lahir harus diisi'
    } else {
      const birthDate = new Date(formData.birth_date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age > 5 || age < 0) {
        newErrors.birth_date = 'Usia anak harus 0-5 tahun (balita)'
      }
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

  const handleChange = (field: keyof ChildData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="child-name">Nama Anak *</Label>
        <Input
          id="child-name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Masukkan nama lengkap anak"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="child-birth-date">Tanggal Lahir *</Label>
        <Input
          id="child-birth-date"
          type="date"
          value={formData.birth_date}
          onChange={(e) => handleChange('birth_date', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={errors.birth_date ? 'border-red-500' : ''}
        />
        {errors.birth_date && (
          <p className="text-sm text-red-600">{errors.birth_date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Jenis Kelamin *</Label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">Laki-laki</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">Perempuan</span>
          </label>
        </div>
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
