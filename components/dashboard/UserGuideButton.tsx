'use client'

import { HelpCircle } from 'lucide-react'
import { startUserGuide } from '@/lib/userGuide'

export function UserGuideButton() {
  return (
    <button
      onClick={() => startUserGuide()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2F5D50] bg-[#2F5D50]/5 hover:bg-[#2F5D50]/10 rounded-lg transition-all"
    >
      <HelpCircle className="w-4 h-4" />
      Lihat Panduan Lagi
    </button>
  )
}
