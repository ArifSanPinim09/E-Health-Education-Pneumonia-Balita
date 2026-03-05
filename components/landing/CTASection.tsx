'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 px-4 sm:px-6 bg-[#2F5D50]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text Left */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
              Mulai Lindungi Balita Anda Hari Ini
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Program edukasi gratis, berbasis penelitian, dan dapat diakses kapan saja. 
              Bergabunglah dengan ribuan ibu yang telah meningkatkan pengetahuan mereka.
            </p>
          </div>

          {/* CTA Right */}
          <div className="space-y-4">
            <a
              href="/login"
              className="block w-full px-8 py-4 bg-white text-[#2F5D50] font-medium rounded-lg hover:bg-white/95 transition-all text-center"
            >
              Mulai Belajar Sekarang
            </a>
            <a
              href="#program"
              className="block w-full px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all text-center"
            >
              Lihat Program Lengkap
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-20 pt-12 border-t border-white/20 text-center text-white/60 text-sm"
        >
          <p>
            © 2026 E-Health Education Pneumonia Balita
          </p>
          <p className="mt-2">
            Program edukasi kesehatan berbasis penelitian untuk ibu Indonesia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
