'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Clock, CheckCircle, Award } from 'lucide-react';

const steps = [
  {
    icon: BookOpen,
    day: 'Hari 1-2',
    title: 'Memahami Dasar',
    description: 'Pelajari apa itu pneumonia, penyebab, dan cara penularannya pada balita.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Clock,
    day: 'Hari 3',
    title: 'Mengenali Gejala',
    description: 'Kenali tanda-tanda pneumonia dan kapan harus segera ke dokter.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: CheckCircle,
    day: 'Hari 4',
    title: 'Penanganan & Perawatan',
    description: 'Pelajari cara merawat balita dengan pneumonia di rumah dengan tepat.',
    color: 'from-blue-600 to-green-500'
  },
  {
    icon: Award,
    day: 'Hari 5',
    title: 'Evaluasi & Sertifikat',
    description: 'Uji pemahaman Anda dan dapatkan hasil pembelajaran yang terukur.',
    color: 'from-green-600 to-blue-500'
  }
];

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bagaimana Program Ini Bekerja?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Program pembelajaran terstruktur selama 5 hari dengan materi yang mudah dipahami 
            dan dapat diakses kapan saja dari smartphone Anda.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Day badge */}
                  <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                    {step.day}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                    {index + 1}
                  </div>
                </div>

                {/* Connector line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 bg-blue-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📱 Belajar dengan Fleksibel
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Setiap sesi terbuka setelah 24 jam dari sesi sebelumnya, memberikan Anda waktu 
            untuk memahami dan mempraktikkan materi dengan baik. Akses kapan saja dari smartphone Anda!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
