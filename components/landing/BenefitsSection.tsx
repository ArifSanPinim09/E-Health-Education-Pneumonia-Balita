'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, Users, Video, FileText, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Perlindungan Optimal',
    description: 'Pelajari cara melindungi balita Anda dari pneumonia dengan pengetahuan yang tepat dan terpercaya.'
  },
  {
    icon: Brain,
    title: 'Mudah Dipahami',
    description: 'Materi disajikan dengan bahasa sederhana, ilustrasi menarik, dan video edukatif yang mudah diikuti.'
  },
  {
    icon: Video,
    title: 'Video Interaktif',
    description: 'Tonton video demonstrasi praktis tentang cara mengenali gejala dan merawat balita dengan pneumonia.'
  },
  {
    icon: FileText,
    title: 'Pre & Post Test',
    description: 'Ukur peningkatan pengetahuan Anda dengan tes sebelum dan sesudah program pembelajaran.'
  },
  {
    icon: Users,
    title: 'Berbasis Penelitian',
    description: 'Program dikembangkan berdasarkan penelitian kesehatan dan panduan medis terkini.'
  },
  {
    icon: TrendingUp,
    title: 'Hasil Terukur',
    description: 'Lihat progress pembelajaran Anda dan tingkat pemahaman yang meningkat setiap harinya.'
  }
];

export function BenefitsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1
    }
  };

  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Program Ini?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Program edukasi kesehatan yang komprehensif dan mudah diakses untuk semua ibu di Indonesia.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 h-full hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid sm:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-700 font-medium">Gratis</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">5 Hari</div>
            <div className="text-gray-700 font-medium">Program Lengkap</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-700 font-medium">Akses Fleksibel</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
