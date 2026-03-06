'use client'

import { motion } from 'framer-motion'
import { User, Lightbulb, Info } from 'lucide-react'
import Link from 'next/link'

interface ChildProfileProps {
  childName: string
  childAge: string
}

export function ChildProfileCard({ childName, childAge }: ChildProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 flex items-center justify-center">
          <User className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">Profil Anak</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="text-sm text-[#1F2933]/60 mb-1">Nama Anak</div>
          <div className="text-base font-medium text-[#1F2933]">{childName}</div>
        </div>
        <div>
          <div className="text-sm text-[#1F2933]/60 mb-1">Usia</div>
          <div className="text-base font-medium text-[#1F2933]">{childAge}</div>
        </div>
      </div>

      <Link href="/profile">
        <button className="w-full py-2.5 px-4 border-2 border-[#2F5D50] text-[#2F5D50] rounded-xl font-medium hover:bg-[#2F5D50] hover:text-white transition-all text-sm">
          Lihat Profil
        </button>
      </Link>
    </motion.div>
  )
}

interface TipsCardProps {
  tip: string
}

export function TipsCard({ tip }: TipsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-[#E07A5F]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">Tips Hari Ini</h3>
      </div>

      <p className="text-sm text-[#1F2933]/70 leading-relaxed">
        {tip}
      </p>
    </motion.div>
  )
}

interface InfoCardProps {
  title: string
  content: string
}

export function InfoCard({ title, content }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 }}
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2F5D50]/10 flex items-center justify-center">
          <Info className="w-5 h-5 text-[#2F5D50]" strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-[#1F2933]">{title}</h3>
      </div>

      <p className="text-sm text-[#1F2933]/70 leading-relaxed">
        {content}
      </p>
    </motion.div>
  )
}
