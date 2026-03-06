'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, FileText } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Edukasi Berbasis Bukti',
    description: 'Program dikembangkan berdasarkan penelitian kesehatan dan panduan medis terkini dari WHO dan Kementerian Kesehatan RI. Bukan asumsi, tapi fakta ilmiah yang dapat dipertanggungjawabkan.'
  },
  {
    icon: Brain,
    title: 'Materi Mudah Dipahami',
    description: 'Disajikan dengan bahasa sederhana dan ilustrasi edukatif yang dirancang khusus untuk ibu. Setiap konsep dijelaskan secara bertahap dengan pendekatan yang humanis dan mudah diingat.'
  },
  {
    icon: FileText,
    title: 'Hasil Terukur',
    description: 'Pre-test dan post-test membantu Anda melihat peningkatan pemahaman secara objektif. Evaluasi berbasis data untuk memastikan pembelajaran yang efektif dan bermakna.'
  }
];

export function BenefitsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="benefits" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[#F4F7F5]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="space-y-8 sm:space-y-12 lg:space-y-16"
        >
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1F2933]">
              Kenapa Edukasi Penting
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#1F2933]/70 font-light">
              Pengetahuan yang tepat dapat menyelamatkan nyawa
            </p>
          </div>

          {/* Alternating Content Layout */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F5D50]" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2 flex-1">
                      <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#1F2933]">
                        {benefit.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-[#1F2933]/70 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                  {index < benefits.length - 1 && (
                    <div className="h-px bg-[#2F5D50]/10 mt-4 sm:mt-6 lg:mt-8"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
