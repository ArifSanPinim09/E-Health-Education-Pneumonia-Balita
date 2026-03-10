// Session content data for 5-day pneumonia education program
// All content in Indonesian language

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video' | 'highlight' | 'stats' | 'warning' | 'tip';
  content: string | string[];
  media_url?: string;
  alt?: string;
  subtitle?: string;
  stats?: { label: string; value: string; }[];
}

export interface SessionContent {
  day: number;
  title: string;
  subtitle: string;
  estimatedTime: string;
  sections: ContentSection[];
}

export const sessionContents: SessionContent[] = [
  // Day 1: Latar belakang, Pengertian, Anatomi, Penyebab, Faktor Risiko
  {
    day: 1,
    title: 'Latar Belakang, Pengertian, Anatomi Sistem Pernapasan, Penyebab, dan Faktor Risiko',
    subtitle: 'Memahami dasar-dasar pneumonia pada balita',
    estimatedTime: '15 menit',
    sections: [
      {
        type: 'heading',
        content: 'Latar Belakang'
      },
      {
        type: 'paragraph',
        content: 'Pneumonia adalah penyakit infeksi pada kantong udara (alveoli) di paru-paru. Penyakit ini merupakan penyebab kematian nomor satu pada balita di dunia, merenggut sekitar 739.000 jiwa pada tahun 2023, dan mayoritas menyerang usia 2–59 bulan.'
      },
      {
        type: 'stats',
        content: 'Situasi di Indonesia dan Jawa Barat',
        stats: [
          { label: 'Nasional', value: '166.702 kasus (2022)' },
          { label: 'Jawa Barat', value: '45% kasus (2023)' },
          { label: 'Kota Tasikmalaya', value: 'Urutan ke-11 (53,6%)' }
        ]
      },
      {
        type: 'warning',
        content: 'Deteksi dini dan perawatan yang tepat sangat penting untuk menurunkan angka kesakitan dan kematian.'
      },
      {
        type: 'image',
        content: 'Ilustrasi pneumonia pada balita',
        media_url: 'public/media/images/gambar1.png',
        alt: 'Ilustrasi ibu merawat anak dengan pneumonia'
      },
      {
        type: 'heading',
        content: 'Pengertian Pneumonia & Bronkopneumonia'
      },
      {
        type: 'highlight',
        content: 'Pneumonia adalah infeksi sistem pernapasan bawah. Bronkopneumonia secara spesifik adalah radang pada saluran bronkial dan alveoli (bagian terkecil paru-paru).'
      },
      {
        type: 'image',
        content: 'Diagram pneumonia dan bronkopneumonia',
        media_url: 'public/media/images/gambar2.png',
        alt: 'Perbedaan pneumonia dan bronkopneumonia'
      },
      {
        type: 'heading',
        content: 'Anatomi Sistem Pernapasan'
      },
      {
        type: 'paragraph',
        content: 'Sistem pernapasan balita dirancang untuk pertukaran gas yang efisien — dari hidung hingga alveoli, setiap bagian memiliki peran penting dalam menjaga oksigenasi tubuh.'
      },
      {
        type: 'heading',
        content: 'Saluran Napas Atas',
        subtitle: 'Penyaring dan Pengkondisi Udara'
      },
      {
        type: 'paragraph',
        content: 'Saluran pernapasan atas terdiri dari: Hidung, faring, dan laring menyaring, menghangatkan, dan melembabkan udara sebelum masuk lebih dalam.'
      },
      {
        type: 'heading',
        content: 'Saluran Napas Bawah',
        subtitle: 'Jalur Menuju Pertukaran Gas'
      },
      {
        type: 'paragraph',
        content: 'Trakea bercabang menjadi bronkus kanan dan kiri, lalu ke bronkiolus hingga alveoli sebagai tempat pertukaran gas.'
      },
      {
        type: 'heading',
        content: 'Paru-paru Balita',
        subtitle: 'Organ Utama Pernapasan'
      },
      {
        type: 'paragraph',
        content: 'Lobus kanan (3 lobus) dan lobus kiri (2 lobus), dilapisi pleura licin untuk memudahkan gerakan saat bernapas.'
      },
      {
        type: 'heading',
        content: 'Mekanisme Pernapasan',
        subtitle: 'Proses Aktif Bernapas'
      },
      {
        type: 'paragraph',
        content: 'Diafragma dan otot dada bekerja aktif mengembang dan mengempis paru-paru yang elastis secara ritmis.'
      },
      {
        type: 'image',
        content: 'Anatomi sistem pernapasan balita',
        media_url: 'public/media/images/gambar3.png',
        alt: 'Diagram lengkap sistem pernapasan balita'
      },
      {
        type: 'image',
        content: 'Perbandingan paru-paru normal vs pneumonia',
        media_url: 'public/media/images/gambar4.png',
        alt: 'Perbedaan paru-paru balita normal vs pneumonia'
      },
      {
        type: 'video',
        content: 'Video Animasi Materi Sesi 1',
        media_url: 'https://youtu.be/f8vT9-eWpP8',
        alt: 'Video animasi tentang pneumonia balita'
      },
      {
        type: 'heading',
        content: 'Penyebab'
      },
      {
        type: 'paragraph',
        content: 'Penyebab pneumonia paling banyak dikarenakan oleh:'
      },
      {
        type: 'list',
        content: [
          'Virus seperti Haemophillus influenza',
          'Bakteri yaitu staphylococcus aureus, serta streptococcus pneumonia, Pseudomonas aeruginosa, Klebsiella pneumoniae, Escherichia coli Proteus',
          'Kuman atipik chlamydia dan mikoplasma'
        ]
      },
      {
        type: 'image',
        content: 'Mikroorganisme penyebab pneumonia',
        media_url: 'public/media/images/gambar5.png',
        alt: 'Berbagai jenis virus dan bakteri penyebab pneumonia'
      },
      {
        type: 'heading',
        content: 'Faktor Risiko Kejadian Pneumonia'
      },
      {
        type: 'heading',
        content: '1. Faktor Risiko "Pasti" (Terbukti Secara Ilmiah)',
        subtitle: 'Risiko Tinggi yang Sudah Terbukti'
      },
      {
        type: 'list',
        content: [
          'Kondisi Bayi: Berat Badan Lahir Rendah (BBLR < 2,5 kg) dan Gizi Buruk (stunting/wasting)',
          'Pola Asuh: Kurang ASI eksklusif (berhenti sebelum 4 bulan) dan imunisasi tidak lengkap (terutama campak)',
          'Lingkungan: Polusi udara dalam ruangan (asap bahan bakar memasak) dan kepadatan hunian (lebih dari 7 orang serumah)',
          'Kesehatan Medis: Adanya infeksi HIV'
        ]
      },
      {
        type: 'heading',
        content: '2. Faktor Risiko "Mungkin Sekali"',
        subtitle: 'Risiko Sedang yang Perlu Diwaspadai'
      },
      {
        type: 'list',
        content: [
          'Lingkungan & Sosial: Perokok pasif di rumah dan rendahnya tingkat pendidikan ibu mengenai pneumonia',
          'Biologis: Jenis kelamin laki-laki, kelahiran prematur (< 37 minggu), dan anemia (Hb < 11 mg/dl)',
          'Nutrisi Spesifik: Kekurangan Vitamin D dan kekurangan zat besi (Zinc)'
        ]
      },
      {
        type: 'heading',
        content: '3. Faktor Risiko "Mungkin"',
        subtitle: 'Risiko Rendah yang Tetap Perlu Diperhatikan'
      },
      {
        type: 'list',
        content: [
          'Riwayat & Jarak Lahir: Jarak kelahiran terlalu dekat (< 24 bulan), urutan kelahiran (anak ke-4 atau lebih), dan riwayat pernah menderita pneumonia sebelumnya',
          'Lainnya: Penggunaan tempat penitipan anak (day care) dan defisiensi Vitamin A'
        ]
      },
      {
        type: 'heading',
        content: '4. Faktor Risiko Menurut Kemenkes RI',
        subtitle: 'Perspektif Kebijakan Kesehatan Nasional'
      },
      {
        type: 'list',
        content: [
          'Sosial Ekonomi & Budaya: Mempengaruhi gaya hidup dan kemampuan akses gizi',
          'Perilaku Pencarian Pengobatan: Kecepatan keluarga dalam membawa anak ke fasilitas kesehatan (care seeking behavior)',
          'Kualitas Pelayanan: Kesiapan petugas kesehatan dalam memberikan penanganan'
        ]
      },
      {
        type: 'image',
        content: 'Infografis faktor risiko pneumonia',
        media_url: 'public/media/images/gambar6.png',
        alt: 'Diagram faktor risiko pneumonia pada balita'
      },
      {
        type: 'video',
        content: 'Video Animasi Penyebab & Risiko',
        media_url: 'https://youtu.be/5WTJz4Ejpng',
        alt: 'Video animasi tentang penyebab dan faktor risiko pneumonia'
      }
    ]
  },

  // Day 2: Tanda & Gejala, Klasifikasi, Perjalanan Penyakit
  {
    day: 2,
    title: 'Tanda & Gejala, Klasifikasi Pneumonia, dan Perjalanan Penyakit',
    subtitle: 'Mengenali gejala dan memahami tingkat keparahan pneumonia',
    estimatedTime: '15 menit',
    sections: [
      {
        type: 'heading',
        content: 'Tanda dan Gejala'
      },
      {
        type: 'paragraph',
        content: 'Secara umum, pneumonia sering kali diawali dengan gejala Infeksi Saluran Pernapasan Atas (ISPA) yang kemudian berkembang menjadi kondisi yang lebih serius.'
      },
      {
        type: 'heading',
        content: '1. Gejala Umum (Kunci Utama)',
        subtitle: 'Tanda yang Paling Sering Muncul'
      },
      {
        type: 'list',
        content: [
          'Gangguan Pernapasan: Napas cepat (takipnea), tarikan dinding dada ke dalam (retraksi), dan napas cuping hidung',
          'Suara Napas Tambahan: Terdengar suara crackles (seperti rontgen), wheezing (mengi), atau suara napas yang menurun',
          'Kondisi Tubuh: Demam tinggi, menggigil, batuk (kering atau berdahak), serta nyeri pada dada, perut, atau leher',
          'Perubahan Perilaku: Anak tampak lemas (letargi), gelisah, sulit minum/menyusu, hingga warna kulit membiru (sianosis) karena kurang oksigen'
        ]
      },
      {
        type: 'heading',
        content: '2. Tanda Bahaya yang Perlu Diwaspadai',
        subtitle: 'Deteksi Dini untuk Orang Tua'
      },
      {
        type: 'highlight',
        content: 'Penelitian menunjukkan bahwa hampir 60% kasus pneumonia pada anak ditandai dengan dua hal utama yang bisa dilihat langsung oleh orang tua:'
      },
      {
        type: 'list',
        content: [
          'Napas Cepat: Frekuensi napas yang melebihi batas normal sesuai usia',
          'Tarikan Dinding Dada: Dada tampak mencekung ke dalam saat anak menarik napas'
        ]
      },
      {
        type: 'warning',
        content: 'Catatan Penting: Deteksi dini pada tanda-tanda di atas sangat krusial karena pneumonia dapat berkembang cepat menjadi kondisi berat (toksemia) jika tidak segera ditangani.'
      },
      {
        type: 'image',
        content: 'Tanda dan gejala pneumonia pada balita',
        media_url: 'public/media/images/gambar7.png',
        alt: 'Ilustrasi tanda dan gejala pneumonia'
      },
      {
        type: 'heading',
        content: 'Klasifikasi Pneumonia'
      },
      {
        type: 'list',
        content: [
          'Pneumonia Berat: Ditandai dengan tarikan dinding dada ke dalam atau saturasi oksigen < 92%',
          'Pneumonia: Ditandai dengan napas cepat (Usia 2-<12 bulan: ≥50x/menit; Usia 12 bulan-<5 tahun: ≥40x/menit)',
          'Batuk Bukan Pneumonia: Hanya batuk pilek biasa tanpa napas cepat atau tarikan dinding dada'
        ]
      },
      {
        type: 'image',
        content: 'Klasifikasi pneumonia berdasarkan tingkat keparahan',
        media_url: 'public/media/images/gambar8.png',
        alt: 'Diagram klasifikasi pneumonia'
      },
      {
        type: 'heading',
        content: 'Perjalanan Penyakit Pneumonia Balita'
      },
      {
        type: 'image',
        content: 'Alur perjalanan penyakit pneumonia',
        media_url: 'public/media/images/gambar9.png',
        alt: 'Flowchart perjalanan penyakit pneumonia pada balita'
      },
      {
        type: 'heading',
        content: 'Komplikasi'
      },
      {
        type: 'heading',
        content: '1. Masalah pada Paru-Paru',
        subtitle: 'Komplikasi Lokal di Organ Pernapasan'
      },
      {
        type: 'list',
        content: [
          'Cairan atau Nanah di Paru (Efusi Pleura & Empiema): Adanya penumpukan cairan atau nanah di selaput paru. Tandanya biasanya si Kecil tetap demam tinggi meski sudah diobati dan terlihat sesak',
          'Paru-Paru Berlubang atau Rusak: Infeksi yang parah bisa membuat jaringan paru-paru luka, berlubang, atau bahkan kempis sehingga fungsi napas terganggu',
          'Paru-Paru Bocor (Pneumotoraks): Adanya udara yang terjebak di luar paru-paru yang membuat paru-paru tertekan'
        ]
      },
      {
        type: 'heading',
        content: '2. Masalah yang Menyebar ke Seluruh Tubuh',
        subtitle: 'Komplikasi Sistemik'
      },
      {
        type: 'list',
        content: [
          'Infeksi Darah (Sepsis): Kuman dari paru-paru masuk ke aliran darah dan menyebar ke seluruh tubuh. Ini sangat berbahaya karena bisa memicu syok (tekanan darah turun drastis)',
          'Gagal Organ: Jika infeksi sudah terlalu berat, organ tubuh lain seperti ginjal atau jantung bisa ikut terganggu fungsinya'
        ]
      },
      {
        type: 'heading',
        content: '3. Tanda Khusus yang Perlu Diperhatikan (Menurut WHO)',
        subtitle: 'Panduan Internasional'
      },
      {
        type: 'list',
        content: [
          'Infeksi Kulit Bernanah: Jika pneumonia disertai bintik-bintik bernanah di kulit, ini bisa jadi tanda pneumonia jenis stafilokokus yang cukup agresif',
          'Sesak Napas Berat: Segera bawa ke RS jika si Kecil terlihat sangat kesulitan bernapas (napas cuping hidung atau dada tampak mencekung ke dalam)'
        ]
      },
      {
        type: 'image',
        content: 'Komplikasi pneumonia pada balita',
        media_url: 'public/media/images/gambar10.png',
        alt: 'Ilustrasi berbagai komplikasi pneumonia'
      },
      {
        type: 'video',
        content: 'Video Animasi Tanda & Gejala, Klasifikasi, dan Perjalanan Penyakit',
        media_url: 'https://youtu.be/RDH5Iy_7cYo',
        alt: 'Video animasi tentang tanda gejala dan klasifikasi pneumonia'
      }
    ]
  },
  // Day 3: Pemeriksaan, Penatalaksanaan, Deteksi Dini, Perawatan
  {
    day: 3,
    title: 'Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, Perawatan Pencegahan',
    subtitle: 'Diagnosis, pengobatan, dan perawatan pneumonia pada balita',
    estimatedTime: '20 menit',
    sections: [
      {
        type: 'heading',
        content: 'Pemeriksaan Laboratorium'
      },
      {
        type: 'heading',
        content: 'Cek Darah Lengkap',
        subtitle: 'Mendeteksi Infeksi Bakteri'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Melihat jumlah sel darah putih. Jika tinggi, tandanya ada infeksi bakteri yang sedang menyerang tubuh.'
      },
      {
        type: 'heading',
        content: 'Cek Penanda Radang (CRP/LED)',
        subtitle: 'Mengukur Tingkat Peradangan'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Mengetahui seberapa parah peradangan atau "luka" yang ada di paru-paru si Kecil.'
      },
      {
        type: 'heading',
        content: 'Cek Dahak (Sputum)',
        subtitle: 'Identifikasi Jenis Kuman'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Mencari tahu jenis kuman penyebabnya agar dokter bisa memberikan jenis antibiotik yang paling pas.'
      },
      {
        type: 'heading',
        content: 'Cek Oksigen Darah (Gas Darah)',
        subtitle: 'Evaluasi Fungsi Pernapasan'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Dilakukan jika si Kecil sesak hebat, untuk memastikan apakah oksigen dalam darahnya masih cukup atau butuh bantuan alat napas.'
      },
      {
        type: 'heading',
        content: 'Biakan Darah (Kultur)',
        subtitle: 'Deteksi Penyebaran Infeksi'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: memastikan apakah kuman sudah menyebar dari paru-paru ke aliran darah (mencegah infeksi berat).'
      },
      {
        type: 'image',
        content: 'Pemeriksaan laboratorium untuk pneumonia',
        media_url: 'public/media/images/gambar11.png',
        alt: 'Ilustrasi berbagai pemeriksaan laboratorium'
      },
      {
        type: 'heading',
        content: 'Penatalaksanaan'
      },
      {
        type: 'heading',
        content: '1. Kapan Harus Dirawat di Rumah Sakit?',
        subtitle: 'Kriteria Rawat Inap'
      },
      {
        type: 'list',
        content: [
          'Jika anak terlihat sangat sesak napas atau kekurangan oksigen',
          'Jika anak lemas atau sulit minum dan sulit menelan obat'
        ]
      },
      {
        type: 'heading',
        content: '2. Perawatan Pendukung di Rumah/RS',
        subtitle: 'Terapi Suportif'
      },
      {
        type: 'list',
        content: [
          'Cairan & Nutrisi: Pastikan anak tidak dehidrasi/ kekurangan cairan dan tetap makan agar kuat melawan kuman',
          'Bantuan Napas: Pemberian oksigen atau bantuan mengeluarkan dahak agar jalan napas lega'
        ]
      },
      {
        type: 'heading',
        content: '3. Pemberian Antibiotik yang Tepat',
        subtitle: 'Terapi Definitif'
      },
      {
        type: 'list',
        content: [
          'Sesuai Umur: Jenis dan dosis antibiotik dibedakan antara bayi baru lahir, balita, hingga anak sekolah',
          'Harus Tuntas: Obat biasanya diberikan selama 10–14 hari. Jangan berhenti sebelum waktunya, meski anak sudah tidak demam (minimal bebas demam 3 hari baru boleh evaluasi berhenti)'
        ]
      },
      {
        type: 'heading',
        content: '4. Pengobatan Khusus',
        subtitle: 'Terapi Spesifik'
      },
      {
        type: 'paragraph',
        content: 'Dokter akan memilih jenis obat yang paling kuat berdasarkan jenis kuman penyebabnya (misalnya untuk kuman Stafilokokus atau M. pneumonia).'
      },
      {
        type: 'tip',
        content: 'Penting untuk Ibu: Kunci kesembuhan adalah disiplin dosis dan menjaga asupan cairan si Kecil.'
      },
      {
        type: 'image',
        content: 'Penatalaksanaan pneumonia pada balita',
        media_url: 'public/media/images/gambar12.png',
        alt: 'Flowchart penatalaksanaan pneumonia'
      },
      {
        type: 'heading',
        content: 'Deteksi Dini'
      },
      {
        type: 'highlight',
        content: 'Cara Cepat Deteksi Pneumonia (Paru-Paru Basah) di Rumah'
      },
      {
        type: 'paragraph',
        content: 'Ibu, ingatlah rumus "Lihat, Dengar, Pantau" jika si Kecil sedang batuk atau pilek:'
      },
      {
        type: 'heading',
        content: '1. LIHAT: Hitung Kecepatan Napas',
        subtitle: 'Observasi Visual'
      },
      {
        type: 'paragraph',
        content: 'Buka baju si Kecil dan lihat dadanya saat ia tenang/tidur. Ia disebut napas cepat jika dalam 1 menit:'
      },
      {
        type: 'list',
        content: [
          'Usia < 2 bulan: 60 kali atau lebih',
          'Usia 2-12 bulan: 50 kali atau lebih',
          'Usia 1-5 tahun: 40 kali atau lebih'
        ]
      },
      {
        type: 'warning',
        content: 'Waspada: Jika dada bagian bawah mencekung ke dalam setiap kali anak menarik napas.'
      },
      {
        type: 'heading',
        content: '2. DENGAR: Suara Napas',
        subtitle: 'Evaluasi Auditori'
      },
      {
        type: 'paragraph',
        content: 'Dengarkan saat si Kecil bernapas:'
      },
      {
        type: 'list',
        content: [
          'Apakah ada suara "ngrok-ngrok" atau bunyi mengi (seperti siulan)?',
          'Apakah anak bernapas sambil merintih atau terlihat sangat kecapekan untuk bernapas?'
        ]
      },
      {
        type: 'heading',
        content: '3. PANTAU: Kondisi Tubuh',
        subtitle: 'Monitoring Umum'
      },
      {
        type: 'paragraph',
        content: 'Segera bawa ke dokter jika:'
      },
      {
        type: 'list',
        content: [
          'Demam tinggi yang tidak turun-turun',
          'Malas minum/menyusu (karena capek bernapas)',
          'Bibir atau kuku mulai membiru (Ini tanda bahaya darurat!)'
        ]
      },
      {
        type: 'warning',
        content: 'Intinya: Jika anak batuk disertai napas cepat atau dada mencekung, jangan tunggu besok. Segera bawa ke Puskesmas atau Rumah Sakit terdekat.'
      },
      {
        type: 'image',
        content: 'Panduan deteksi dini pneumonia di rumah',
        media_url: 'public/media/images/gambar13.png',
        alt: 'Infografis cara deteksi dini pneumonia'
      },
      {
        type: 'heading',
        content: 'Perawatan Balita'
      },
      {
        type: 'paragraph',
        content: 'Ibu bisa menjadi "dokter pertama" bagi si Kecil dengan melakukan tiga langkah utama berikut:'
      },
      {
        type: 'heading',
        content: 'Pengukuran Frekuensi Napas',
        subtitle: 'Monitoring Vital Sign'
      },
      {
        type: 'paragraph',
        content: 'Dihitung selama 1 menit saat anak tenang. Amati pergerakan dada/perut dan tanda napas cepat sesuai kriteria usia.'
      },
      {
        type: 'heading',
        content: 'Pengukuran Saturasi Oksigen',
        subtitle: 'Evaluasi Oksigenasi'
      },
      {
        type: 'paragraph',
        content: 'Menggunakan oksimetri pada ibu jari anak untuk menilai kadar oksigen arteri (Normal: 95-100%).'
      },
      {
        type: 'heading',
        content: 'Penanganan Demam (Water Tepid Sponge)',
        subtitle: 'Terapi Non-Farmakologi'
      },
      {
        type: 'paragraph',
        content: 'Teknik kompres air hangat untuk menurunkan suhu tubuh.'
      },
      {
        type: 'list',
        content: [
          'Persiapan: Baskom air hangat, waslap, termometer, dan handuk',
          'Prosedur: Ukur suhu awal, buka pakaian, lapisi tempat tidur dengan perlak, lalu letakkan waslap basah di ketiak dan lipatan paha selama 3-5 menit'
        ]
      },
      {
        type: 'heading',
        content: 'Inhalasi Aromaterapi Peppermint Oil',
        subtitle: 'Terapi Komplementer'
      },
      {
        type: 'paragraph',
        content: 'Tindakan non-farmakologi untuk mengatasi bersihan jalan napas yang tidak efektif.'
      },
      {
        type: 'list',
        content: [
          'Manfaat: Mengurangi sesak napas (dispnea), mengurangi peradangan, melegakan saluran napas, dan memberikan relaksasi',
          'Cara: Gunakan diffuser (50ml air + 4-5 tetes minyak) dengan jarak 10-15 cm dari anak selama 10-15 menit'
        ]
      },
      {
        type: 'heading',
        content: 'Fisioterapi Dada',
        subtitle: 'Terapi Fisik'
      },
      {
        type: 'paragraph',
        content: 'Bertujuan membantu mengeluarkan dahak dan mengoptimalkan fungsi paru.'
      },
      {
        type: 'paragraph',
        content: 'Teknik: Lakukan perkusi (ketukan dengan tangan ditangkupkan) selama 3-5 menit, dilanjutkan dengan vibrasi (getaran dengan posisi tangan rata) pada area paru yang mengalami penumpukan dahak.'
      },
      {
        type: 'heading',
        content: 'Nutrisi dan Pengobatan',
        subtitle: 'Dukungan Gizi dan Medis'
      },
      {
        type: 'list',
        content: [
          'Nutrisi: Berikan ASI eksklusif hingga 6 bulan karena mengandung zat anti-infeksi. Untuk balita di atas 6 bulan, berikan diet Tinggi Energi Tinggi Protein (TETP) dengan tekstur lunak (Buah, Susu, Telur, Ikan, Kacang-kacangan)',
          'Catatan Diet: Kurangi karbohidrat untuk meminimalkan produksi CO2. Madu dapat diberikan untuk mengurangi batuk',
          'Antibiotik: Harus diberikan sesuai dosis, tepat waktu (misal setiap 8 jam untuk jadwal 3x sehari), dan wajib dihabiskan untuk membunuh bakteri sepenuhnya'
        ]
      },
      {
        type: 'tip',
        content: 'Tips Penting: Selalu catat hasil hitung napas dan suhu tubuh si Kecil di buku kecil agar mudah dilaporkan saat berkonsultasi dengan bidan atau dokter.'
      },
      {
        type: 'image',
        content: 'Panduan perawatan balita dengan pneumonia',
        media_url: 'public/media/images/gambar14.png',
        alt: 'Ilustrasi berbagai teknik perawatan balita'
      },
      {
        type: 'heading',
        content: 'Manajemen Psikologis bagi Ibu: Hipnosis 5 Jari',
        subtitle: 'Dukungan Mental untuk Orang Tua'
      },
      {
        type: 'paragraph',
        content: 'Digunakan untuk menurunkan kecemasan pada anak/orang tua dengan menautkan ibu jari ke jari lainnya sambil membayangkan hal positif (tubuh sehat, orang tersayang, kesuksesan, dan tempat yang menyenangkan).'
      },
      {
        type: 'image',
        content: 'Teknik hipnosis 5 jari',
        media_url: 'public/media/images/gambar15.png',
        alt: 'Ilustrasi teknik hipnosis 5 jari untuk mengurangi kecemasan'
      },
      {
        type: 'video',
        content: 'Video Animasi Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, Perawatan',
        media_url: 'https://youtu.be/aC-QrKGVFoI',
        alt: 'Video animasi tentang pemeriksaan dan penatalaksanaan pneumonia'
      },
      {
        type: 'video',
        content: 'Video Hipnosis 5 Jari',
        media_url: 'https://youtu.be/5HCFGIjXLqY',
        alt: 'Video tutorial hipnosis 5 jari untuk mengurangi kecemasan'
      }
    ]
  },

  // Day 4: Praktik Mandiri
  {
    day: 4,
    title: 'Praktik Mandiri',
    subtitle: 'Latihan interaktif mengenali tanda pneumonia',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'Latihan Interaktif'
      },
      {
        type: 'paragraph',
        content: 'Pada sesi ini, Ibu akan belajar mempraktikkan cara mendeteksi pneumonia melalui video tutorial interaktif.'
      },
      {
        type: 'heading',
        content: 'Hitung Napas',
        subtitle: 'Tutorial Menghitung Frekuensi Napas'
      },
      {
        type: 'paragraph',
        content: 'Video tutorial menghitung frekuensi napas per menit. Ibu akan diminta menjawab dari video yang ditayangkan.'
      },
      {
        type: 'heading',
        content: 'Cek Retraksi',
        subtitle: 'Panduan Visual Deteksi Tarikan Dinding Dada'
      },
      {
        type: 'paragraph',
        content: 'Panduan visual untuk melihat apakah ada tarikan dinding dada ke dalam (retraksi). Ibu akan diminta menjawab dari video yang ditayangkan.'
      },
      {
        type: 'highlight',
        content: 'Sesi ini bersifat interaktif. Silakan tonton video dengan seksama dan jawab pertanyaan yang muncul untuk menguji pemahaman Ibu.'
      },
      {
        type: 'video',
        content: 'Video Tutorial Praktik Mandiri',
        media_url: 'https://youtu.be/VIDEO_PRAKTIK_MANDIRI',
        alt: 'Video tutorial praktik mandiri deteksi pneumonia'
      },
      {
        type: 'tip',
        content: 'Pastikan Ibu memahami setiap langkah dalam video sebelum melanjutkan ke sesi berikutnya.'
      }
    ]
  },

  // Day 5: Review Materi
  {
    day: 5,
    title: 'Review Seluruh Materi',
    subtitle: 'Rangkuman pembelajaran pneumonia balita hari 1-4',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'Review Materi Hari 1-4'
      },
      {
        type: 'paragraph',
        content: 'Pada sesi terakhir ini, mari kita review kembali seluruh materi yang telah dipelajari dari hari 1 hingga hari 4.'
      },
      {
        type: 'heading',
        content: 'Rangkuman Pembelajaran',
        subtitle: 'Poin-Poin Penting yang Telah Dipelajari'
      },
      {
        type: 'list',
        content: [
          'Hari 1: Latar belakang, pengertian, anatomi sistem pernapasan, penyebab, dan faktor risiko pneumonia',
          'Hari 2: Tanda & gejala, klasifikasi pneumonia, dan perjalanan penyakit',
          'Hari 3: Pemeriksaan diagnostik, penatalaksanaan, deteksi dini, dan perawatan pencegahan',
          'Hari 4: Praktik mandiri mengenali tanda pneumonia melalui latihan interaktif'
        ]
      },
      {
        type: 'highlight',
        content: 'Setelah menyelesaikan review ini, Ibu akan dapat mengakses Post-Test untuk menguji pemahaman keseluruhan materi.'
      },
      {
        type: 'video',
        content: 'Video Review Materi Pneumonia Balita',
        media_url: 'https://youtu.be/Eh6EpZlw7u4',
        alt: 'Video animasi review lengkap materi pneumonia balita'
      },
      {
        type: 'tip',
        content: 'Akses: Tombol Post-Test akan muncul jika semua sesi sebelumnya sudah ditandai "Selesai".'
      }
    ]
  }
];