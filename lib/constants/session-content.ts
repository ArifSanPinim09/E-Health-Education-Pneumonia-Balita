// 📚 Materi Edukasi Pneumonia pada Balita
// Session content data for 5-day pneumonia education program
// All content in Indonesian language

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video' | 'highlight' | 'stats' | 'warning' | 'tip' | 'audio' | 'table' | 'quiz';
  content: string | string[];
  media_url?: string;
  alt?: string;
  subtitle?: string;
  level?: number; // 1 = main heading, 2 = sub-heading, 3 = sub-sub-heading
  stats?: { label: string; value: string; }[];
  tableData?: { headers: string[]; rows: string[][]; };
  quizData?: {
    question: string;
    correctAnswer: number;
    unit?: string;
    feedback?: {
      correct: string;
      incorrect: string;
    };
  };
}

export interface SessionContent {
  day: number;
  title: string;
  subtitle: string;
  estimatedTime: string;
  sections: ContentSection[];
}

export const sessionContents: SessionContent[] = [
  // ==========================================
  // SESI 1: Latar Belakang, Pengertian, Anatomi, Penyebab, dan Faktor Risiko
  // ==========================================
  {
    day: 1,
    title: 'Latar Belakang, Pengertian, Anatomi Sistem Pernapasan, Penyebab, dan Faktor Risiko',
    subtitle: 'Memahami dasar-dasar pneumonia pada balita',
    estimatedTime: '15 menit',
    sections: [
      // --- 1.1 Latar Belakang ---
      {
        type: 'heading',
        content: '1.1 Latar Belakang',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Pneumonia adalah penyakit infeksi akut yang menyerang sistem pernapasan bagian bawah (alveoli) pada balita, terutama usia 29 hari – 11 bulan.'
      },
      {
        type: 'heading',
        content: 'Dampak Global:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Pneumonia dan diare menyebabkan 29% kematian balita dan 2 juta anak meninggal setiap tahun',
          'Penyebab kematian nomor satu pada balita di dunia',
          'Merenggut sekitar 739.000 jiwa pada tahun 2023',
          'Mayoritas menyerang usia 2–59 bulan'
        ]
      },
      {
        type: 'heading',
        content: 'Situasi di Indonesia dan Jawa Barat:',
        level: 3
      },
      {
        type: 'stats',
        content: 'Data Pneumonia di Indonesia',
        stats: [
          { label: 'Nasional', value: '166.702 kasus (2022)' },
          { label: 'Jawa Barat', value: 'Tren naik: 44,90% → 45%' },
          { label: 'Kota Tasikmalaya', value: 'Peringkat ke-11 (53,6%)' }
        ]
      },
      {
        type: 'paragraph',
        content: 'Nasional: 166.702 kasus (2022); kematian bayi 3x lebih tinggi dibanding usia 1–4 tahun'
      },
      {
        type: 'paragraph',
        content: 'Jawa Barat: Tren naik: 44,90% (2022) → 45% (2023)'
      },
      {
        type: 'paragraph',
        content: 'Kota Tasikmalaya: Peringkat ke-11 di Jawa Barat (53,6% kasus)'
      },
      {
        type: 'highlight',
        content: 'Kunci: Deteksi dini dan perawatan yang tepat sangat penting untuk menurunkan angka kesakitan dan kematian.'
      },
      {
        type: 'image',
        content: 'Statistik dan dampak pneumonia pada balita',
        media_url: '/media/images/gambar1.png',
        alt: 'Infografis latar belakang pneumonia pada balita di Indonesia'
      },

      // --- 1.2 Pengertian ---
      {
        type: 'heading',
        content: '1.2 Pengertian',
        level: 2
      },
      {
        type: 'heading',
        content: 'Pneumonia',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Penyakit infeksi akut pada paru-paru yang menyerang alveoli (kantong udara kecil) — tempat pertukaran oksigen dan karbondioksida. Infeksi bisa terjadi pada satu atau kedua paru, menyebabkan sesak napas terutama pada bayi usia 29 hari – 11 bulan (National Heart Lung and Blood Institute, 2023).'
      },
      {
        type: 'heading',
        content: 'Bronkopneumonia',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Salah satu jenis peradangan paru yang menyebabkan infeksi dan reaksi peradangan pada area bronkus (saluran udara) dan alveoli (kantong udara).'
      },
      {
        type: 'image',
        content: 'Diagram pneumonia dan bronkopneumonia',
        media_url: '/media/images/gambar2.png',
        alt: 'Perbedaan pneumonia dan bronkopneumonia'
      },

      // --- 1.3 Anatomi Sistem Pernapasan ---
      {
        type: 'heading',
        content: '1.3 Anatomi Sistem Pernapasan',
        level: 2
      },
      {
        type: 'heading',
        content: 'Saluran Napas Atas (Pintu Masuk & Penyaring Udara)',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Terdiri dari: hidung → faring (tenggorokan) → laring (kotak suara)'
      },
      {
        type: 'list',
        content: [
          'Fungsi: menyaring debu, menghangatkan, dan melembabkan udara sebelum masuk ke paru-paru'
        ]
      },
      {
        type: 'heading',
        content: 'Saluran Napas Bawah (Pipa Udara)',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Trakea → Bronkus kanan & kiri → Bronkiolus → Alveoli'
      },
      {
        type: 'list',
        content: [
          'Alveoli = tempat pertukaran gas O₂ dan CO₂',
          'Oksigen dari alveoli masuk ke darah untuk energi aktivitas anak'
        ]
      },
      {
        type: 'heading',
        content: 'Paru-paru Balita',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Paru kanan: 3 lobus',
          'Paru kiri: 2 lobus',
          'Dibungkus selaput tipis bernama pleura → berfungsi agar paru dapat mengembang dan mengempis dengan nyaman'
        ]
      },
      {
        type: 'heading',
        content: 'Mekanisme Pernapasan',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Otot dada dan diafragma (pembatas paru-paru dan perut) bekerja aktif mengatur keluar-masuk napas.'
      },
      {
        type: 'warning',
        content: 'Tanda Bahaya: Jika otot dada anak terlihat bekerja terlalu keras hingga tampak tarikan dinding dada ke dalam, itu tanda si kecil kesulitan bernapas.'
      },
      {
        type: 'image',
        content: 'Anatomi sistem pernapasan balita',
        media_url: '/media/images/gambar3.png',
        alt: 'Diagram lengkap sistem pernapasan balita'
      },

      // --- 1.4 Perbedaan Paru-paru Normal vs Pneumonia ---
      {
        type: 'heading',
        content: '1.4 Perbedaan Paru-paru Normal vs Pneumonia',
        level: 2
      },
      {
        type: 'heading',
        content: 'Paru-paru Normal',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Kondisi alveoli: Bersih dan lentur',
          'Aliran udara: Lancar tanpa hambatan',
          'Pertukaran gas: Baik — O₂ masuk ke darah lancar',
          'Tampilan anak: Napas teratur, tidak kelelahan'
        ]
      },
      {
        type: 'heading',
        content: 'Paru-paru Pneumonia',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Kondisi alveoli: Terisi cairan/nanah akibat infeksi',
          'Aliran udara: Menyempit karena peradangan & dahak berlebih',
          'Pertukaran gas: Terganggu — O₂ sulit masuk ke darah',
          'Tampilan anak: Sesak napas, pergerakan dada tidak teratur'
        ]
      },
      {
        type: 'image',
        content: 'Perbandingan paru-paru normal vs pneumonia',
        media_url: '/media/images/gambar4.png',
        alt: 'Perbedaan paru-paru balita normal vs pneumonia'
      },
      // --- 1.5 Penyebab Pneumonia ---
      {
        type: 'heading',
        content: '1.5 Penyebab Pneumonia',
        level: 2
      },
      {
        type: 'list',
        content: [
          'Virus: Haemophilus influenzae',
          'Bakteri: Staphylococcus aureus, Streptococcus pneumoniae, Pseudomonas aeruginosa, Klebsiella pneumoniae, Escherichia coli, Proteus',
          'Kuman Atipikal: Chlamydia dan Mycoplasma'
        ]
      },
      {
        type: 'image',
        content: 'Mikroorganisme penyebab pneumonia',
        media_url: '/media/images/gambar5.png',
        alt: 'Berbagai jenis virus dan bakteri penyebab pneumonia'
      },
      {
        type: 'image',
        content: 'Mikroorganisme penyebab pneumonia (lanjutan)',
        media_url: '/media/images/gambar6.png',
        alt: 'Berbagai jenis virus dan bakteri penyebab pneumonia'
      },

      // --- 1.6 Faktor Risiko Pneumonia ---
      {
        type: 'heading',
        content: '1.6 Faktor Risiko Pneumonia',
        level: 2
      },
      {
        type: 'heading',
        content: 'Faktor Risiko "Pasti" (Terbukti Ilmiah)',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Kondisi Bayi: BBLR (< 2,5 kg), gizi buruk (stunting/wasting)',
          'Pola Asuh: Kurang ASI eksklusif (berhenti sebelum 4 bulan), imunisasi tidak lengkap (terutama campak)',
          'Lingkungan: Polusi udara dalam ruangan (asap masak), kepadatan hunian (> 7 orang serumah)',
          'Medis: Infeksi HIV'
        ]
      },
      {
        type: 'heading',
        content: 'Faktor Risiko "Mungkin Sekali"',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Sosial: Perokok pasif di rumah, pendidikan ibu rendah tentang pneumonia',
          'Biologis: Jenis kelamin laki-laki, kelahiran prematur (< 37 minggu), anemia (Hb < 11 mg/dL)',
          'Nutrisi: Defisiensi Vitamin D dan Zinc (zat besi)'
        ]
      },
      {
        type: 'heading',
        content: 'Faktor Risiko "Mungkin"',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Jarak kelahiran terlalu dekat (< 24 bulan)',
          'Urutan kelahiran ke-4 atau lebih',
          'Riwayat pernah menderita pneumonia',
          'Penggunaan tempat penitipan anak (day care)',
          'Defisiensi Vitamin A'
        ]
      },
      {
        type: 'heading',
        content: 'Faktor Risiko Menurut Kemenkes RI',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Sosial Ekonomi & Budaya: Mempengaruhi gaya hidup dan akses gizi',
          'Perilaku Pencarian Pengobatan: Kecepatan keluarga membawa anak ke fasilitas kesehatan (care seeking behavior)',
          'Kualitas Pelayanan: Kesiapan petugas kesehatan dalam penanganan'
        ]
      },
      {
        type: 'image',
        content: 'Infografis faktor risiko pneumonia',
        media_url: '/media/images/gambar7.png',
        alt: 'Diagram faktor risiko pneumonia pada balita'
      },
      {
        type: 'video',
        content: 'Video Animasi Materi Sesi 1',
        media_url: 'https://youtu.be/f8vT9-eWpP8',
        alt: 'Video animasi lengkap tentang latar belakang, pengertian, anatomi, penyebab dan faktor risiko pneumonia'
      },
      {
        type: 'audio',
        content: 'Podcast Materi Sesi 1',
        media_url: '/media/podcats/sesi1.m4a',
        alt: 'Audio penjelasan lengkap materi sesi 1'
      }
    ]
  },

  // ==========================================
  // SESI 2: Tanda & Gejala, Klasifikasi, dan Perjalanan Penyakit
  // ==========================================
  {
    day: 2,
    title: 'Tanda & Gejala, Klasifikasi Pneumonia, dan Perjalanan Penyakit',
    subtitle: 'Mengenali gejala dan memahami tingkat keparahan pneumonia',
    estimatedTime: '15 menit',
    sections: [
      // --- 2.1 Tanda dan Gejala ---
      {
        type: 'heading',
        content: '2.1 Tanda dan Gejala',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Pneumonia umumnya diawali dengan gejala ISPA yang berkembang menjadi kondisi lebih serius.'
      },
      {
        type: 'heading',
        content: 'Gejala Umum (Kunci Utama)',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Gangguan Pernapasan: Napas cepat (takipnea), tarikan dinding dada ke dalam (retraksi), napas cuping hidung',
          'Suara Napas Tambahan: Crackles, wheezing (mengi), suara napas menurun',
          'Kondisi Tubuh: Demam > 37,5°C, menggigil, batuk (kering/berdahak), nyeri dada/perut/leher',
          'Perubahan Perilaku: Lemas (letargi), gelisah, sulit minum/menyusu, sianosis (kulit kebiruan)'
        ]
      },
      {
        type: 'heading',
        content: '⚠️ Tanda Bahaya (Perlu Segera Ditangani)',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Hampir 60% kasus pneumonia pada anak ditandai dua hal yang bisa dilihat langsung orang tua:'
      },
      {
        type: 'list',
        content: [
          'Napas Cepat: Usia 2 – < 12 bulan: ≥ 50x/menit; Usia 12 bulan – < 5 tahun: ≥ 40x/menit',
          'Tarikan Dinding Dada: Dada tampak mencekung ke dalam saat anak menarik napas'
        ]
      },
      {
        type: 'warning',
        content: 'Deteksi dini sangat krusial karena pneumonia dapat berkembang cepat menjadi toksemia jika tidak segera ditangani.'
      },
      {
        type: 'image',
        content: 'Tanda dan gejala pneumonia pada balita',
        media_url: '/media/images/gambar8.png',
        alt: 'Ilustrasi tanda dan gejala pneumonia'
      },
      // --- 2.2 Klasifikasi Pneumonia ---
      {
        type: 'heading',
        content: '2.2 Klasifikasi Pneumonia',
        level: 2
      },
      {
        type: 'list',
        content: [
          'Pneumonia Berat: Tarikan dinding dada ke dalam atau saturasi O₂ < 92%',
          'Pneumonia: Napas cepat (≥ 50x/menit usia 2–<12 bln; ≥ 40x/menit usia 12 bln–<5 thn)',
          'Batuk Bukan Pneumonia: Hanya batuk pilek biasa, tanpa napas cepat atau tarikan dinding dada'
        ]
      },
      {
        type: 'image',
        content: 'Klasifikasi pneumonia berdasarkan tingkat keparahan',
        media_url: '/media/images/gambar9.png',
        alt: 'Diagram klasifikasi pneumonia'
      },

      // --- 2.3 Perjalanan Penyakit Pneumonia ---
      {
        type: 'heading',
        content: '2.3 Perjalanan Penyakit Pneumonia',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Tahap 1-2 → Tahap 3-4 → Tahap 5-6 → Tahap 7 → Tahap Kritis'
      },
      {
        type: 'heading',
        content: 'Tahap 1–2: Pintu Masuk Kuman',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Kuman (bakteri/virus) masuk lewat udara atau percikan ludah saat batuk',
          'Faktor pendukung: asap rokok, gizi kurang, imunisasi tidak lengkap',
          'Sistem pertahanan balita yang belum sempurna membuat kuman mencapai alveoli'
        ]
      },
      {
        type: 'heading',
        content: 'Tahap 3–4: Pertahanan di Paru-paru',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Kuman berkembang biak di alveoli',
          'Tubuh mengaktifkan sistem imun → terjadi peradangan jaringan paru'
        ]
      },
      {
        type: 'heading',
        content: 'Tahap 5–6: Penumpukan Cairan/Nanah',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Peradangan menghasilkan nanah/lendir',
          'Alveoli yang seharusnya berisi udara → terisi lendir/nanah',
          'Oksigen sulit masuk ke darah; CO₂ sulit keluar'
        ]
      },
      {
        type: 'heading',
        content: 'Tahap 7: Gejala Muncul',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Demam tinggi, lemas, gelisah, tidak mau menyusu',
          'Batuk berdahak/kering',
          'Suara napas tambahan (wheezing, ronkhi)',
          'Napas cepat, tarikan dinding dada, napas cuping hidung'
        ]
      },
      {
        type: 'heading',
        content: 'Tahap Kritis: Toksemia',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Infeksi menyebar ke seluruh tubuh (sepsis)',
          'Berujung pada gagal napas yang mengancam jiwa'
        ]
      },
      {
        type: 'image',
        content: 'Alur perjalanan penyakit pneumonia',
        media_url: '/media/images/gambar10.png',
        alt: 'Flowchart perjalanan penyakit pneumonia pada balita'
      },

      // --- 2.4 Komplikasi ---
      {
        type: 'heading',
        content: '2.4 Komplikasi',
        level: 2
      },
      {
        type: 'heading',
        content: 'Masalah pada Paru-paru',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Efusi Pleura & Empiema: Penumpukan cairan/nanah di selaput paru → tetap demam tinggi meski sudah diobati',
          'Kerusakan Paru: Jaringan paru luka, berlubang, atau kempis',
          'Pneumotoraks: Udara terjebak di luar paru → paru-paru tertekan'
        ]
      },
      {
        type: 'heading',
        content: 'Masalah yang Menyebar ke Seluruh Tubuh',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Sepsis: Kuman masuk aliran darah → memicu syok (tekanan darah turun drastis)',
          'Gagal Organ: Ginjal atau jantung bisa terganggu jika infeksi terlalu berat'
        ]
      },
      {
        type: 'heading',
        content: 'Tanda Khusus (WHO)',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Infeksi Kulit Bernanah: Bisa jadi tanda pneumonia stafilokokus yang agresif',
          'Sesak Napas Berat: Segera bawa ke RS jika napas cuping hidung atau dada mencekung'
        ]
      },
      {
        type: 'image',
        content: 'Komplikasi pneumonia pada balita',
        media_url: '/media/images/gambar11.png',
        alt: 'Ilustrasi berbagai komplikasi pneumonia'
      },
      {
        type: 'video',
        content: 'Video Animasi Tanda & Gejala, Klasifikasi, dan Perjalanan Penyakit',
        media_url: 'https://youtu.be/RDH5Iy_7cYo',
        alt: 'Video animasi tentang tanda gejala dan klasifikasi pneumonia'
      },
      {
        type: 'audio',
        content: 'Podcast Materi Sesi 2',
        media_url: '/media/podcats/sesi2.m4a',
        alt: 'Audio penjelasan lengkap materi sesi 2'
      }
    ]
  },

  // ==========================================
  // SESI 3: Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, dan Perawatan
  // ==========================================
  {
    day: 3,
    title: 'Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, Perawatan Pencegahan',
    subtitle: 'Diagnosis, pengobatan, dan perawatan pneumonia pada balita',
    estimatedTime: '20 menit',
    sections: [
      // --- 3.1 Pemeriksaan Laboratorium ---
      {
        type: 'heading',
        content: '3.1 Pemeriksaan Laboratorium',
        level: 2
      },
      {
        type: 'list',
        content: [
          'Cek Darah Lengkap: Melihat leukosit; jika tinggi → tanda infeksi bakteri',
          'CRP/LED (Penanda Radang): Menilai tingkat keparahan peradangan di paru-paru',
          'Cek Dahak (Sputum): Mengidentifikasi jenis kuman → menentukan antibiotik yang tepat',
          'Gas Darah: Dilakukan jika sesak berat → cek kadar oksigen darah',
          'Biakan Darah (Kultur): Memastikan apakah kuman sudah menyebar ke aliran darah'
        ]
      },
      {
        type: 'image',
        content: 'Pemeriksaan laboratorium untuk pneumonia',
        media_url: '/media/images/gambar12.png',
        alt: 'Ilustrasi berbagai pemeriksaan laboratorium'
      },

      // --- 3.2 Penatalaksanaan ---
      {
        type: 'heading',
        content: '3.2 Penatalaksanaan',
        level: 2
      },
      {
        type: 'heading',
        content: 'Indikasi Rawat Inap',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Anak sangat sesak napas atau kekurangan oksigen',
          'Anak lemas, sulit minum, atau sulit menelan obat'
        ]
      },
      {
        type: 'heading',
        content: 'Perawatan Pendukung',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Cairan & Nutrisi: Cegah dehidrasi, pertahankan asupan makan',
          'Bantuan Napas: Pemberian oksigen dan bantu pengeluaran dahak'
        ]
      },
      {
        type: 'heading',
        content: 'Pemberian Antibiotik',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Jenis dan dosis disesuaikan usia (bayi baru lahir, balita, anak sekolah)',
          'Durasi: 10–14 hari — harus dihabiskan',
          'Evaluasi berhenti minimal setelah bebas demam 3 hari'
        ]
      },
      {
        type: 'heading',
        content: 'Pengobatan Khusus',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Dokter memilih obat berdasarkan jenis kuman (misal: stafilokokus atau M. pneumoniae)'
      },
      {
        type: 'tip',
        content: 'Catatan Penting: Jika batuk > 2 minggu, lakukan pemeriksaan untuk TBC.'
      },
      {
        type: 'image',
        content: 'Penatalaksanaan pneumonia pada balita',
        media_url: '/media/images/gambar13.png',
        alt: 'Flowchart penatalaksanaan pneumonia'
      },

      // --- 3.3 Deteksi Dini di Rumah ---
      {
        type: 'heading',
        content: '3.3 Deteksi Dini di Rumah',
        level: 2
      },
      {
        type: 'highlight',
        content: 'Gunakan rumus: "LIHAT – DENGAR – PANTAU" saat anak batuk/pilek'
      },
      {
        type: 'heading',
        content: 'LIHAT 1 — Hitung Frekuensi Napas',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Buka baju anak, amati dada saat tenang/tidur. Hitung dalam 1 menit penuh.'
      },
      {
        type: 'list',
        content: [
          'Usia < 2 bulan: ≥ 60x/menit',
          'Usia 2 – 12 bulan: ≥ 50x/menit',
          'Usia 1 – 5 tahun: ≥ 40x/menit'
        ]
      },
      {
        type: 'heading',
        content: 'Prosedur:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Hitung pernapasan 1 menit menggunakan arloji saat anak tenang',
          'Amati pergerakan dada atau perut',
          'Perhatikan adanya tarikan dinding dada bawah',
          'Dengarkan bunyi napas "grok-grok"'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Hitung Napas',
        media_url: 'https://www.youtube.com/watch?v=wlSbzDARbUc',
        alt: 'Tutorial menghitung frekuensi napas pada balita'
      },
      {
        type: 'heading',
        content: 'LIHAT 2 — Tarikan Dinding Dada',
        level: 3
      },
      {
        type: 'warning',
        content: 'Waspada jika dada bagian bawah mencekung ke dalam saat anak menarik napas.'
      },
      {
        type: 'video',
        content: 'Tutorial Tarikan Dinding Dada',
        media_url: 'https://youtu.be/V5d1DxKDUHA',
        alt: 'Panduan visual deteksi tarikan dinding dada pada balita'
      },
      {
        type: 'heading',
        content: 'DENGAR — Suara Napas Tambahan',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Adakah suara "ngrok-ngrok" atau mengi (seperti siulan)?',
          'Apakah anak merintih atau terlihat sangat kelelahan saat bernapas?'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Suara Napas',
        media_url: 'https://youtu.be/Xn9UBmgpCdA',
        alt: 'Tutorial mendengarkan suara napas tambahan pada balita'
      },
      {
        type: 'heading',
        content: 'PANTAU 1 — Suhu Tubuh',
        level: 3
      },
      {
        type: 'heading',
        content: 'Prosedur Pengukuran Suhu:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Nyalakan termometer, pastikan tertulis "LO"',
          'Keringkan bagian ketiak anak',
          'Letakkan ujung termometer di ketiak',
          'Diamkan hingga berbunyi "beep", baca hasilnya',
          'Normal: 36,5°C – 37,5°C',
          'Demam: > 37,5°C'
        ]
      },
      {
        type: 'image',
        content: 'Panduan deteksi dini pneumonia di rumah',
        media_url: '/media/images/gambar14.png',
        alt: 'Infografis cara deteksi dini pneumonia'
      },
      {
        type: 'video',
        content: 'Tutorial Mengukur Suhu Tubuh',
        media_url: 'https://youtu.be/8kr4ZfdXPgk',
        alt: 'Tutorial mengukur suhu tubuh balita dengan termometer'
      },
      {
        type: 'heading',
        content: 'PANTAU 2 — Saturasi Oksigen',
        level: 3
      },
      {
        type: 'heading',
        content: 'Prosedur:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Pasang oksimetri pada ibu jari anak',
          'Baca hasil pengukuran',
          'Normal: 95–100%',
          'Pneumonia Berat: < 92%'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Saturasi Oksigen',
        media_url: 'https://youtu.be/ze6QPbZh7SU',
        alt: 'Tutorial mengukur saturasi oksigen dengan oksimetri'
      },
      {
        type: 'warning',
        content: 'Tindakan: Jika anak batuk disertai napas cepat atau dada mencekung, segera bawa ke Puskesmas atau Rumah Sakit terdekat. Jangan tunggu besok.'
      },
      {
        type: 'image',
        content: 'Panduan deteksi dini pneumonia',
        media_url: '/media/images/gambar15.png',
        alt: 'Infografis panduan deteksi dini pneumonia'
      },

      // --- 3.4 Perawatan Balita di Rumah ---
      {
        type: 'heading',
        content: '3.4 Perawatan Balita di Rumah',
        level: 2
      },
      {
        type: 'heading',
        content: '1. Penanganan Demam — Water Tepid Sponge (Kompres Air Hangat)',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Alat: Baskom air hangat, waslap, termometer, handuk'
      },
      {
        type: 'heading',
        content: 'Prosedur:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Ukur suhu tubuh awal',
          'Buka pakaian anak, lapisi tempat tidur dengan perlak',
          'Letakkan waslap basah (air hangat) di ketiak dan lipatan paha',
          'Diamkan selama 3–5 menit'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Kompres Air Hangat',
        media_url: 'https://youtu.be/gYkH3fqWcGc',
        alt: 'Tutorial teknik kompres air hangat untuk menurunkan demam'
      },
      {
        type: 'heading',
        content: '2. Inhalasi Aromaterapi Peppermint Oil',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Manfaat: Mengurangi sesak napas, meredakan peradangan, melegakan saluran napas, memberikan relaksasi'
      },
      {
        type: 'heading',
        content: 'Cara Penggunaan:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Gunakan diffuser: 50 ml air + 4–5 tetes minyak peppermint',
          'Jarak dari anak: 10–15 cm',
          'Durasi: 10–15 menit'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Inhalasi Aromaterapi',
        media_url: 'https://youtu.be/8f0aGb7iKA8',
        alt: 'Tutorial inhalasi aromaterapi peppermint oil'
      },
      {
        type: 'heading',
        content: '3. Fisioterapi Dada',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Tujuan: Membantu mengeluarkan dahak dan mengoptimalkan fungsi paru'
      },
      {
        type: 'heading',
        content: 'Teknik:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Perkusi: Ketukan dengan tangan ditangkupkan selama 3–5 menit',
          'Vibrasi: Getaran dengan posisi tangan rata pada area paru yang menumpuk dahak'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Fisioterapi Dada',
        media_url: 'https://youtu.be/sx5PljkutwI',
        alt: 'Tutorial fisioterapi dada untuk mengeluarkan dahak'
      },
      {
        type: 'heading',
        content: '4. Nutrisi dan Pengobatan',
        level: 3
      },
      {
        type: 'heading',
        content: 'Nutrisi:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'ASI eksklusif hingga 6 bulan (mengandung zat anti-infeksi)',
          'Balita > 6 bulan: diet TETP (Tinggi Energi Tinggi Protein), tekstur lunak',
          'Contoh: buah, susu, telur, ikan, kacang-kacangan',
          'Kurangi karbohidrat (meminimalkan produksi CO₂)',
          'Madu dapat diberikan untuk mengurangi batuk'
        ]
      },
      {
        type: 'heading',
        content: 'Pemberian Antibiotik yang Benar:',
        level: 3
      },
      {
        type: 'list',
        content: [
          'Dosis tepat: Sesuai takaran yang ditentukan (misal: 2,5 ml / 5 ml / 10 ml)',
          'Waktu tepat: Contoh 3x sehari = setiap 8 jam (06.00 → 14.00 → 22.00)',
          'Harus dihabiskan: Untuk membunuh bakteri sepenuhnya'
        ]
      },
      {
        type: 'video',
        content: 'Tutorial Pemberian Obat',
        media_url: 'https://youtu.be/mrW0wCaHO-g',
        alt: 'Tutorial cara memberikan obat antibiotik pada balita'
      },
      {
        type: 'tip',
        content: 'Tips: Catat frekuensi napas dan suhu tubuh anak di buku kecil untuk dilaporkan saat konsultasi ke bidan/dokter.'
      },
      {
        type: 'image',
        content: 'Panduan perawatan balita dengan pneumonia',
        media_url: '/media/images/gambar16.png',
        alt: 'Ilustrasi berbagai teknik perawatan balita'
      },

      // --- 3.5 Manajemen Psikologis Ibu ---
      {
        type: 'heading',
        content: '3.5 Manajemen Psikologis Ibu — Hipnosis 5 Jari',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Teknik untuk menurunkan kecemasan orang tua dengan cara:'
      },
      {
        type: 'list',
        content: [
          'Menautkan ibu jari ke jari-jari lainnya secara bergantian',
          'Sambil membayangkan hal-hal positif: Tubuh yang sehat, Orang tersayang, Momen kesuksesan, Tempat yang menyenangkan'
        ]
      },
      {
        type: 'image',
        content: 'Teknik hipnosis 5 jari - Diagram',
        media_url: '/media/images/gambar17.png',
        alt: 'Ilustrasi teknik hipnosis 5 jari untuk mengurangi kecemasan'
      },
      {
        type: 'image',
        content: 'Teknik hipnosis 5 jari - Panduan Lengkap',
        media_url: '/media/images/gambar18.png',
        alt: 'Panduan lengkap teknik hipnosis 5 jari'
      },
      {
        type: 'video',
        content: 'Video 1: Animasi Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, Perawatan',
        media_url: 'https://youtu.be/aC-QrKGVFoI',
        alt: 'Video animasi tentang pemeriksaan dan penatalaksanaan pneumonia'
      },
      {
        type: 'video',
        content: 'Video 2: Hipnosis 5 Jari',
        media_url: 'https://youtu.be/5HCFGIjXLqY',
        alt: 'Video tutorial hipnosis 5 jari untuk mengurangi kecemasan'
      },
      {
        type: 'audio',
        content: 'Podcast Materi Sesi 3',
        media_url: '/media/podcats/sesi3.m4a',
        alt: 'Audio penjelasan lengkap materi sesi 3'
      },
      {
        type: 'audio',
        content: 'Podcast Materi Sesi 3 - Mendalam',
        media_url: '/media/podcats/sesi3 mendalam.m4a',
        alt: 'Audio penjelasan mendalam materi sesi 3'
      }
    ]
  },

  // ==========================================
  // SESI 4: Praktik Mandiri
  // ==========================================
  {
    day: 4,
    title: 'Praktik Mandiri',
    subtitle: 'Latihan interaktif mengenali tanda pneumonia',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'Latihan Interaktif',
        level: 2
      },
      {
        type: 'heading',
        content: 'Latihan Hitung Napas',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Tonton video berikut dengan seksama, kemudian jawab pertanyaan di bawahnya.'
      },
      {
        type: 'video',
        content: 'Video latihan menghitung (Sumber: WHO)',
        media_url: 'https://youtu.be/0ujj7aJLZqI',
        alt: 'Video latihan menghitung frekuensi napas dari WHO'
      },
      {
        type: 'quiz',
        content: 'Latihan Menghitung Frekuensi Napas',
        quizData: {
          question: 'Berapa frekuensi napas anak dalam 1 menit?',
          correctAnswer: 65,
          unit: 'x/menit',
          feedback: {
            correct: 'Benar! Frekuensi napas anak adalah 65x/menit. Ini menunjukkan napas cepat yang merupakan tanda pneumonia.',
            incorrect: 'Jawaban kurang tepat. Coba hitung kembali dengan lebih teliti. Perhatikan setiap gerakan naik-turun dada anak.'
          }
        }
      },
      {
        type: 'video',
        content: 'Video hasil/jawaban',
        media_url: 'https://youtu.be/v5J-ahiHO8g',
        alt: 'Video hasil dan pembahasan menghitung frekuensi napas'
      },
      {
        type: 'heading',
        content: 'Latihan Cek Retraksi Dinding Dada',
        level: 3
      },
      {
        type: 'paragraph',
        content: 'Panduan visual untuk melihat apakah ada tarikan dinding dada ke dalam.'
      },
      {
        type: 'video',
        content: 'Video retraksi dinding dada',
        media_url: 'https://youtu.be/gYOkjtvHQ08',
        alt: 'Video praktik melihat retraksi dinding dada'
      }
    ]
  },

  // ==========================================
  // SESI 5: Review dan Post-Test
  // ==========================================
  {
    day: 5,
    title: 'Review Seluruh Materi',
    subtitle: 'Rangkuman pembelajaran pneumonia balita hari 1-4',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'Review dan Post-Test',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Materi: Review seluruh materi Sesi 1–4 (dalam format video)'
      },
      {
        type: 'video',
        content: 'Video Review Materi Pneumonia Balita',
        media_url: 'https://youtu.be/Eh6EpZlw7u4',
        alt: 'Video review lengkap materi pneumonia balita dari sesi 1-4'
      },
      {
        type: 'highlight',
        content: 'Akses Post-Test: Tombol Post-Test akan muncul setelah semua sesi ditandai "Selesai"'
      }
    ]
  }
];
