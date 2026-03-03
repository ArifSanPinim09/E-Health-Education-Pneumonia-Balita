// Session content data for 5-day pneumonia education program
// All content in Indonesian language

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video';
  content: string | string[];
  media_url?: string;
  alt?: string;
}

export interface SessionContent {
  day: number;
  title: string;
  sections: ContentSection[];
}

export const sessionContents: SessionContent[] = [
  // Day 1: Pneumonia Basics
  {
    day: 1,
    title: 'Dasar-Dasar Pneumonia',
    sections: [
      {
        type: 'heading',
        content: 'Apa itu Pneumonia?'
      },
      {
        type: 'paragraph',
        content: 'Pneumonia adalah infeksi yang menyebabkan peradangan pada kantung udara (alveoli) di salah satu atau kedua paru-paru. Pada balita, pneumonia merupakan salah satu penyebab kematian tertinggi yang sebenarnya dapat dicegah dan diobati.'
      },
      {
        type: 'image',
        content: 'Ilustrasi ibu dan anak',
        media_url: 'images/gambar-ibu.png',
        alt: 'Ibu merawat anak dengan pneumonia'
      },
      {
        type: 'heading',
        content: 'Anatomi Paru-Paru'
      },
      {
        type: 'paragraph',
        content: 'Paru-paru adalah organ pernapasan utama yang berfungsi untuk pertukaran oksigen dan karbon dioksida. Ketika pneumonia terjadi, kantung udara terisi cairan atau nanah, sehingga mengganggu proses pernapasan normal.'
      },
      {
        type: 'image',
        content: 'Anatomi paru-paru',
        media_url: 'images/gambar-paru.png',
        alt: 'Diagram anatomi paru-paru'
      },
      {
        type: 'heading',
        content: 'Penyebab Pneumonia'
      },
      {
        type: 'paragraph',
        content: 'Pneumonia dapat disebabkan oleh berbagai mikroorganisme, termasuk bakteri, virus, dan jamur. Pada balita, penyebab paling umum adalah:'
      },
      {
        type: 'list',
        content: [
          'Bakteri: Streptococcus pneumoniae (paling umum)',
          'Virus: RSV (Respiratory Syncytial Virus), virus influenza',
          'Jamur: Lebih jarang terjadi, biasanya pada anak dengan sistem imun lemah'
        ]
      },
      {
        type: 'image',
        content: 'Virus dan bakteri penyebab pneumonia',
        media_url: 'images/virus-bakteri.png',
        alt: 'Ilustrasi virus dan bakteri'
      },
      {
        type: 'heading',
        content: 'Faktor Risiko'
      },
      {
        type: 'paragraph',
        content: 'Beberapa faktor yang meningkatkan risiko pneumonia pada balita:'
      },
      {
        type: 'list',
        content: [
          'Usia di bawah 2 tahun',
          'Sistem kekebalan tubuh yang lemah',
          'Malnutrisi atau gizi buruk',
          'Paparan asap rokok',
          'Polusi udara',
          'Riwayat penyakit paru-paru',
          'Tidak mendapat ASI eksklusif',
          'Kepadatan hunian rumah'
        ]
      }
    ]
  },
  // Day 2: Recognizing Symptoms
  {
    day: 2,
    title: 'Mengenali Gejala Pneumonia',
    sections: [
      {
        type: 'heading',
        content: 'Tanda dan Gejala Utama'
      },
      {
        type: 'paragraph',
        content: 'Mengenali gejala pneumonia sejak dini sangat penting untuk penanganan yang tepat. Berikut adalah tanda-tanda yang harus diwaspadai:'
      },
      {
        type: 'list',
        content: [
          'Batuk yang terus-menerus',
          'Demam tinggi (di atas 38°C)',
          'Napas cepat atau sesak napas',
          'Tarikan dinding dada ke dalam (retraksi)',
          'Suara napas tambahan (mengi/wheezing)',
          'Nafsu makan menurun',
          'Rewel atau lemas',
          'Bibir atau kuku kebiruan (sianosis)'
        ]
      },
      {
        type: 'image',
        content: 'Tanda dan gejala pneumonia',
        media_url: 'images/tanda-gejala.png',
        alt: 'Ilustrasi tanda dan gejala pneumonia pada balita'
      },
      {
        type: 'heading',
        content: 'Cara Mengukur Suhu Tubuh'
      },
      {
        type: 'paragraph',
        content: 'Demam adalah salah satu gejala utama pneumonia. Pelajari cara mengukur suhu tubuh anak dengan benar:'
      },
      {
        type: 'video',
        content: 'Tutorial mengukur suhu tubuh',
        media_url: 'https://youtu.be/8kr4ZfdXPgk',
        alt: 'Video cara mengukur suhu tubuh balita'
      },
      {
        type: 'heading',
        content: 'Cara Menghitung Napas'
      },
      {
        type: 'paragraph',
        content: 'Napas cepat adalah tanda bahaya pneumonia. Berikut kriteria napas cepat berdasarkan usia:'
      },
      {
        type: 'list',
        content: [
          'Usia < 2 bulan: ≥ 60 kali per menit',
          'Usia 2-11 bulan: ≥ 50 kali per menit',
          'Usia 1-5 tahun: ≥ 40 kali per menit'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial menghitung napas',
        media_url: 'https://youtu.be/wlSbzDARbUc',
        alt: 'Video cara menghitung frekuensi napas balita'
      },
      {
        type: 'heading',
        content: 'Mengenali Suara Napas Tambahan'
      },
      {
        type: 'paragraph',
        content: 'Suara napas tambahan seperti mengi (wheezing) atau ronki dapat terdengar saat anak bernapas. Ini menandakan adanya sumbatan atau cairan di saluran napas.'
      },
      {
        type: 'video',
        content: 'Mengenali suara napas tambahan',
        media_url: 'https://youtu.be/Xn9UBmgpCdA',
        alt: 'Video mengenali suara napas tambahan'
      },
      {
        type: 'heading',
        content: 'Retraksi Dinding Dada'
      },
      {
        type: 'paragraph',
        content: 'Retraksi adalah tarikan dinding dada ke dalam saat anak bernapas. Ini menunjukkan anak kesulitan bernapas dan memerlukan penanganan segera.'
      },
      {
        type: 'video',
        content: 'Mengenali retraksi dinding dada',
        media_url: 'https://youtu.be/V5d1DxKDUHA',
        alt: 'Video mengenali retraksi dinding dada'
      },
      {
        type: 'heading',
        content: 'Saturasi Oksigen'
      },
      {
        type: 'paragraph',
        content: 'Saturasi oksigen mengukur kadar oksigen dalam darah. Nilai normal adalah 95-100%. Jika di bawah 92%, anak memerlukan oksigen tambahan.'
      },
      {
        type: 'video',
        content: 'Cara mengukur saturasi oksigen',
        media_url: 'https://youtu.be/ze6QPbZh7SU',
        alt: 'Video cara mengukur saturasi oksigen dengan pulse oximeter'
      }
    ]
  },
  // Day 3: Treatment & Complications
  {
    day: 3,
    title: 'Pengobatan dan Komplikasi',
    sections: [
      {
        type: 'heading',
        content: 'Pengobatan Pneumonia'
      },
      {
        type: 'paragraph',
        content: 'Pengobatan pneumonia tergantung pada penyebab dan tingkat keparahannya. Penanganan yang tepat dan cepat sangat penting untuk kesembuhan anak.'
      },
      {
        type: 'image',
        content: 'Penatalaksanaan pneumonia',
        media_url: 'images/penatalaksanaan.png',
        alt: 'Diagram penatalaksanaan pneumonia'
      },
      {
        type: 'heading',
        content: 'Antibiotik'
      },
      {
        type: 'paragraph',
        content: 'Jika pneumonia disebabkan oleh bakteri, dokter akan meresepkan antibiotik. Penting untuk:'
      },
      {
        type: 'list',
        content: [
          'Memberikan antibiotik sesuai dosis dan jadwal yang ditentukan',
          'Tidak menghentikan antibiotik meskipun anak sudah terlihat membaik',
          'Menghabiskan seluruh antibiotik yang diresepkan',
          'Tidak memberikan antibiotik tanpa resep dokter'
        ]
      },
      {
        type: 'video',
        content: 'Cara memberikan obat yang benar',
        media_url: 'https://youtu.be/mrW0wCaHO-g',
        alt: 'Video cara memberikan obat pada balita'
      },
      {
        type: 'heading',
        content: 'Terapi Oksigen'
      },
      {
        type: 'paragraph',
        content: 'Anak dengan saturasi oksigen rendah memerlukan terapi oksigen. Ini dapat diberikan melalui:'
      },
      {
        type: 'list',
        content: [
          'Nasal kanul (selang hidung)',
          'Masker oksigen',
          'Head box (untuk bayi)'
        ]
      },
      {
        type: 'heading',
        content: 'Terapi Inhalasi'
      },
      {
        type: 'paragraph',
        content: 'Terapi inhalasi membantu membuka saluran napas dan mengencerkan dahak. Dapat dilakukan dengan inhaler atau nebulizer.'
      },
      {
        type: 'video',
        content: 'Cara menggunakan inhaler',
        media_url: 'https://youtu.be/8f0aGb7iKA8',
        alt: 'Video cara menggunakan inhaler pada balita'
      },
      {
        type: 'video',
        content: 'Cara menggunakan nebulizer',
        media_url: 'https://youtu.be/akn3K0qCYaA',
        alt: 'Video cara menggunakan nebulizer'
      },
      {
        type: 'heading',
        content: 'Komplikasi Pneumonia'
      },
      {
        type: 'paragraph',
        content: 'Jika tidak ditangani dengan baik, pneumonia dapat menyebabkan komplikasi serius:'
      },
      {
        type: 'list',
        content: [
          'Efusi pleura (cairan di sekitar paru-paru)',
          'Empiema (nanah di rongga pleura)',
          'Abses paru',
          'Sepsis (infeksi menyebar ke seluruh tubuh)',
          'Gagal napas',
          'Kematian'
        ]
      },
      {
        type: 'heading',
        content: 'Tanda Bahaya yang Memerlukan Penanganan Segera'
      },
      {
        type: 'paragraph',
        content: 'Segera bawa anak ke rumah sakit jika mengalami:'
      },
      {
        type: 'list',
        content: [
          'Kesulitan bernapas yang berat',
          'Bibir atau wajah membiru',
          'Tidak bisa minum atau menyusu',
          'Kejang',
          'Kesadaran menurun atau sangat lemas',
          'Demam sangat tinggi yang tidak turun',
          'Muntah terus-menerus'
        ]
      }
    ]
  },
  // Day 4: Home Practice
  {
    day: 4,
    title: 'Perawatan di Rumah',
    sections: [
      {
        type: 'heading',
        content: 'Perawatan Suportif di Rumah'
      },
      {
        type: 'paragraph',
        content: 'Selain pengobatan medis, perawatan di rumah sangat penting untuk mempercepat kesembuhan anak. Berikut adalah hal-hal yang dapat Ibu lakukan:'
      },
      {
        type: 'heading',
        content: 'Pemberian Cairan yang Cukup'
      },
      {
        type: 'paragraph',
        content: 'Anak dengan pneumonia memerlukan cairan lebih banyak untuk mencegah dehidrasi dan membantu mengencerkan dahak.'
      },
      {
        type: 'list',
        content: [
          'Berikan ASI lebih sering untuk bayi',
          'Tawarkan air putih, sup, atau jus buah untuk anak yang lebih besar',
          'Berikan sedikit-sedikit tapi sering jika anak sulit minum',
          'Perhatikan tanda dehidrasi: mulut kering, jarang buang air kecil, mata cekung'
        ]
      },
      {
        type: 'heading',
        content: 'Nutrisi yang Baik'
      },
      {
        type: 'paragraph',
        content: 'Nutrisi yang baik membantu sistem kekebalan tubuh melawan infeksi:'
      },
      {
        type: 'list',
        content: [
          'Berikan makanan bergizi tinggi protein',
          'Sajikan dalam porsi kecil tapi sering',
          'Pilih makanan yang mudah ditelan',
          'Tambahkan buah dan sayuran untuk vitamin',
          'Lanjutkan pemberian ASI'
        ]
      },
      {
        type: 'heading',
        content: 'Kompres Hangat (Tepid Sponge)'
      },
      {
        type: 'paragraph',
        content: 'Jika anak demam, kompres hangat dapat membantu menurunkan suhu tubuh dengan aman.'
      },
      {
        type: 'video',
        content: 'Cara melakukan tepid sponge',
        media_url: 'https://youtu.be/gYkH3fqWcGc',
        alt: 'Video cara melakukan kompres hangat pada balita'
      },
      {
        type: 'heading',
        content: 'Fisioterapi Dada'
      },
      {
        type: 'paragraph',
        content: 'Fisioterapi dada membantu mengeluarkan dahak dari paru-paru. Teknik ini dapat dilakukan di rumah dengan bimbingan tenaga kesehatan.'
      },
      {
        type: 'video',
        content: 'Cara melakukan fisioterapi dada',
        media_url: 'https://youtu.be/sx5PljkutwI',
        alt: 'Video cara melakukan fisioterapi dada pada balita'
      },
      {
        type: 'heading',
        content: 'Posisi Tidur yang Baik'
      },
      {
        type: 'paragraph',
        content: 'Posisi tidur yang tepat membantu anak bernapas lebih mudah:'
      },
      {
        type: 'list',
        content: [
          'Tinggikan kepala dengan bantal (untuk anak di atas 1 tahun)',
          'Posisi semi-duduk dapat membantu pernapasan',
          'Hindari posisi tengkurap',
          'Ganti posisi tidur secara berkala'
        ]
      },
      {
        type: 'heading',
        content: 'Lingkungan yang Sehat'
      },
      {
        type: 'paragraph',
        content: 'Ciptakan lingkungan yang mendukung kesembuhan:'
      },
      {
        type: 'list',
        content: [
          'Jaga kebersihan rumah',
          'Pastikan ventilasi udara baik',
          'Hindari paparan asap rokok',
          'Jaga suhu ruangan nyaman (tidak terlalu dingin)',
          'Cuci tangan sebelum merawat anak',
          'Pisahkan dari anggota keluarga yang sakit'
        ]
      },
      {
        type: 'heading',
        content: 'Pemantauan di Rumah'
      },
      {
        type: 'paragraph',
        content: 'Pantau kondisi anak secara teratur dan catat:'
      },
      {
        type: 'list',
        content: [
          'Suhu tubuh (3-4 kali sehari)',
          'Frekuensi napas',
          'Nafsu makan dan minum',
          'Aktivitas dan tingkat kesadaran',
          'Warna kulit dan bibir'
        ]
      }
    ]
  },
  // Day 5: Evaluation
  {
    day: 5,
    title: 'Evaluasi dan Pencegahan',
    sections: [
      {
        type: 'heading',
        content: 'Evaluasi Kesembuhan'
      },
      {
        type: 'paragraph',
        content: 'Anak dianggap sembuh dari pneumonia jika:'
      },
      {
        type: 'list',
        content: [
          'Demam sudah turun selama minimal 3 hari',
          'Frekuensi napas kembali normal',
          'Tidak ada tarikan dinding dada',
          'Nafsu makan membaik',
          'Anak lebih aktif dan ceria',
          'Batuk berkurang (meskipun mungkin masih ada sedikit)'
        ]
      },
      {
        type: 'heading',
        content: 'Kontrol ke Dokter'
      },
      {
        type: 'paragraph',
        content: 'Penting untuk kontrol ke dokter sesuai jadwal yang ditentukan:'
      },
      {
        type: 'list',
        content: [
          'Kontrol pertama: 2-3 hari setelah mulai pengobatan',
          'Kontrol kedua: Setelah antibiotik habis',
          'Kontrol lanjutan jika masih ada keluhan',
          'Foto rontgen ulang jika diperlukan'
        ]
      },
      {
        type: 'heading',
        content: 'Pencegahan Pneumonia'
      },
      {
        type: 'paragraph',
        content: 'Pencegahan lebih baik daripada pengobatan. Berikut cara mencegah pneumonia pada balita:'
      },
      {
        type: 'heading',
        content: '1. Imunisasi Lengkap'
      },
      {
        type: 'list',
        content: [
          'Imunisasi DPT (melindungi dari pertusis)',
          'Imunisasi campak',
          'Imunisasi Hib (Haemophilus influenzae type b)',
          'Imunisasi PCV (Pneumococcal Conjugate Vaccine)',
          'Imunisasi influenza (setiap tahun)'
        ]
      },
      {
        type: 'heading',
        content: '2. ASI Eksklusif'
      },
      {
        type: 'paragraph',
        content: 'ASI eksklusif selama 6 bulan pertama dan dilanjutkan hingga 2 tahun memberikan perlindungan terbaik terhadap infeksi, termasuk pneumonia.'
      },
      {
        type: 'heading',
        content: '3. Nutrisi yang Baik'
      },
      {
        type: 'list',
        content: [
          'Berikan makanan bergizi seimbang',
          'Cukupi kebutuhan protein, vitamin, dan mineral',
          'Hindari malnutrisi',
          'Berikan suplemen vitamin D jika diperlukan'
        ]
      },
      {
        type: 'heading',
        content: '4. Lingkungan Sehat'
      },
      {
        type: 'list',
        content: [
          'Hindari paparan asap rokok',
          'Jaga kebersihan rumah',
          'Pastikan ventilasi udara baik',
          'Kurangi polusi udara dalam rumah',
          'Hindari kepadatan hunian'
        ]
      },
      {
        type: 'heading',
        content: '5. Kebersihan Diri'
      },
      {
        type: 'list',
        content: [
          'Cuci tangan dengan sabun secara teratur',
          'Ajarkan etika batuk dan bersin',
          'Hindari kontak dengan orang sakit',
          'Jaga kebersihan mainan dan peralatan anak'
        ]
      },
      {
        type: 'heading',
        content: 'Kapan Harus ke Dokter'
      },
      {
        type: 'paragraph',
        content: 'Segera konsultasi ke dokter jika anak menunjukkan gejala:'
      },
      {
        type: 'list',
        content: [
          'Batuk disertai demam lebih dari 3 hari',
          'Napas cepat atau sesak',
          'Kesulitan makan atau minum',
          'Rewel atau sangat lemas',
          'Warna kulit atau bibir kebiruan'
        ]
      },
      {
        type: 'heading',
        content: 'Pesan Penutup'
      },
      {
        type: 'paragraph',
        content: 'Pneumonia adalah penyakit serius namun dapat dicegah dan diobati. Dengan pengetahuan yang tepat, Ibu dapat melindungi anak dari pneumonia dan memberikan perawatan terbaik jika anak sakit. Jangan ragu untuk berkonsultasi dengan tenaga kesehatan jika ada kekhawatiran tentang kesehatan anak.'
      },
      {
        type: 'paragraph',
        content: 'Selamat! Anda telah menyelesaikan program pembelajaran 5 hari tentang pneumonia balita. Semoga ilmu yang didapat bermanfaat untuk kesehatan anak Anda.'
      }
    ]
  }
];
