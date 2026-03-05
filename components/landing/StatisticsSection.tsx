'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function StatisticsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="statistics" className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-20"
        >
          {/* Big Number Layout - WHO Style */}
          <div className="space-y-4">
            <div className="text-7xl sm:text-8xl font-bold text-[#2F5D50] leading-none">
              725.000
            </div>
            <div className="text-2xl sm:text-3xl text-[#1F2933] font-light max-w-2xl">
              Anak meninggal akibat pneumonia setiap tahun
            </div>
            <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
          </div>

          <div className="space-y-4">
            <div className="text-7xl sm:text-8xl font-bold text-[#E07A5F] leading-none">
              14%
            </div>
            <div className="text-2xl sm:text-3xl text-[#1F2933] font-light max-w-2xl">
              Dari seluruh kematian anak di bawah 5 tahun
            </div>
            <div className="h-px bg-[#E07A5F]/20 max-w-md"></div>
          </div>

          <div className="space-y-4">
            <div className="text-7xl sm:text-8xl font-bold text-[#2F5D50] leading-none">
              2.5 juta
            </div>
            <div className="text-2xl sm:text-3xl text-[#1F2933] font-light max-w-2xl">
              Kasus pneumonia pada balita di Indonesia per tahun
            </div>
            <div className="h-px bg-[#2F5D50]/20 max-w-md"></div>
          </div>

          <div className="space-y-4">
            <div className="text-7xl sm:text-8xl font-bold text-[#E07A5F] leading-none">
              85%
            </div>
            <div className="text-2xl sm:text-3xl text-[#1F2933] font-light max-w-2xl">
              Dapat dicegah dengan edukasi dan penanganan tepat
            </div>
          </div>

          {/* Source Attribution */}
          <div className="pt-12 text-sm text-[#1F2933]/50 space-y-1">
            <p>Sumber: WHO, UNICEF, Kementerian Kesehatan RI (2025)</p>
            <p className="italic">Data berbasis penelitian kesehatan terkini</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
