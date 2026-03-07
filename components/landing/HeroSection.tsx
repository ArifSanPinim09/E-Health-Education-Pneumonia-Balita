'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 bg-[#F4F7F5]">
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Editorial Typography Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-[#1F2933]">
            Pneumonia adalah penyebab kematian anak nomor satu yang dapat{' '}
            <span className="text-[#E07A5F]">dicegah</span>.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#1F2933]/70 leading-relaxed max-w-xl font-light">
            Program pembelajaran 5 hari berbasis penelitian untuk membantu ibu memahami, 
            mengenali, dan menangani pneumonia pada balita.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-[#2F5D50] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#274E43] transition-all"
            >
              Mulai Belajar Sekarang
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-[#2F5D50] text-[#2F5D50] text-sm sm:text-base font-medium rounded-lg hover:bg-[#2F5D50]/5 transition-all"
            >
              Lihat Program
            </a>
          </div>

          <div className="pt-4 sm:pt-6 text-xs sm:text-sm text-[#1F2933]/60">
            <span className="font-medium">725.000</span> anak meninggal setiap tahun — 
            <span className="font-medium"> 85%</span> dapat dicegah dengan edukasi tepat
          </div>
        </motion.div>

        {/* Full Height Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px]"
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm">
            <img
              src="/media/images/anak-demam.webp"
              alt="Dokumentasi kesehatan anak"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
