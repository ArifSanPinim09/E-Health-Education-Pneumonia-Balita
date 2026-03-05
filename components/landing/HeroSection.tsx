'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 pt-32 pb-24 bg-[#F4F7F5]">
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Editorial Typography Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight text-[#1F2933]">
            Pneumonia adalah penyebab kematian anak nomor satu yang dapat{' '}
            <span className="text-[#E07A5F]">dicegah</span>.
          </h1>

          <p className="text-lg sm:text-xl text-[#1F2933]/70 leading-relaxed max-w-xl font-light">
            Program pembelajaran 5 hari berbasis penelitian untuk membantu ibu memahami, 
            mengenali, dan menangani pneumonia pada balita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#2F5D50]/90 transition-all"
            >
              Mulai Belajar Sekarang
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#2F5D50] text-[#2F5D50] font-medium rounded-lg hover:bg-[#2F5D50]/5 transition-all"
            >
              Lihat Program
            </a>
          </div>

          <div className="pt-6 text-sm text-[#1F2933]/60">
            <span className="font-medium">725.000</span> anak meninggal setiap tahun — 
            <span className="font-medium"> 85%</span> dapat dicegah dengan edukasi tepat
          </div>
        </motion.div>

        {/* Full Height Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[500px] lg:h-[600px]"
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm">
            <img
              src="/media/images/anak-demam.png.png"
              alt="Dokumentasi kesehatan anak"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
