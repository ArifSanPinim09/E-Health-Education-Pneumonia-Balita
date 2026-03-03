'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, AlertTriangle, Heart } from 'lucide-react';

const statistics = [
  {
    icon: AlertTriangle,
    value: '725.000',
    label: 'Anak meninggal akibat pneumonia setiap tahun',
    source: 'WHO, 2025',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Users,
    value: '14%',
    label: 'Dari semua kematian anak di bawah 5 tahun',
    source: 'UNICEF, 2025',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    icon: TrendingUp,
    value: '2.5 juta',
    label: 'Kasus pneumonia pada balita di Indonesia per tahun',
    source: 'Kemenkes RI, 2025',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Heart,
    value: '85%',
    label: 'Dapat dicegah dengan edukasi dan penanganan tepat',
    source: 'Penelitian Kesehatan, 2025',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export function StatisticsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="statistics" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fakta Pneumonia pada Balita
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Data terkini 2025 menunjukkan pentingnya edukasi dan pencegahan pneumonia pada balita di Indonesia
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <motion.div 
                  className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </motion.div>
                <motion.div 
                  className={`text-3xl font-bold ${stat.color} mb-2`}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: 'spring' }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-700 font-medium mb-2 leading-snug">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.source}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 bg-blue-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Edukasi adalah Kunci Pencegahan
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Dengan pengetahuan yang tepat, ibu dapat mengenali gejala pneumonia lebih awal 
            dan mengambil tindakan yang tepat untuk melindungi balita mereka.
          </p>
          <motion.a
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Mulai Belajar Sekarang</span>
            <motion.span
              className="relative z-10 ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
