'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const timeline = [
  {
    phase: '01',
    title: 'Memahami Dasar',
    description: 'Pelajari apa itu pneumonia, penyebab utama, dan bagaimana penyakit ini menyerang sistem pernapasan balita. Memahami dasar adalah langkah pertama pencegahan.'
  },
  {
    phase: '02',
    title: 'Mengenali Gejala',
    description: 'Kenali tanda-tanda awal pneumonia: napas cepat, sesak napas, demam tinggi, dan batuk. Deteksi dini dapat menyelamatkan nyawa anak Anda.'
  },
  {
    phase: '03',
    title: 'Perawatan Rumah',
    description: 'Pelajari cara merawat balita dengan pneumonia di rumah: pemberian cairan, posisi tidur yang tepat, dan kapan harus segera ke fasilitas kesehatan.'
  },
  {
    phase: '04',
    title: 'Evaluasi',
    description: 'Uji pemahaman Anda melalui post-test dan lihat peningkatan pengetahuan yang telah Anda capai selama program berlangsung.'
  }
];

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="program" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white">
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
              Program 5 Hari
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#1F2933]/70 font-light">
              Pembelajaran terstruktur dengan pendekatan bertahap
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative space-y-6 sm:space-y-8 lg:space-y-12 pl-6 sm:pl-8 border-l-2 border-[#2F5D50]/20">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative space-y-2 sm:space-y-3"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[29px] sm:-left-[37px] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2F5D50] border-3 sm:border-4 border-white"></div>
                
                {/* Phase Number */}
                <div className="text-xs sm:text-sm font-medium text-[#2F5D50] tracking-wider">
                  {item.phase} — {item.title}
                </div>
                
                {/* Description */}
                <p className="text-xs sm:text-sm lg:text-base text-[#1F2933]/70 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Program Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="pt-4 sm:pt-6 lg:pt-8 space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#1F2933]/60"
          >
            <p>
              Setiap sesi terbuka setelah 24 jam dari sesi sebelumnya, memberikan waktu 
              untuk memahami dan mempraktikkan materi dengan baik.
            </p>
            <p className="italic">
              Akses fleksibel dari smartphone Anda, kapan saja dan di mana saja.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
