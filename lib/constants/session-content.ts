// Session content data for 5-day pneumonia education program
// All content in Indonesian language

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video' | 'highlight' | 'stats' | 'warning' | 'tip' | 'audio';
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
  // SESI 1: Latar belakang, Pengertian, Anatomi Sistem Pernapasan, Penyebab, dan Faktor Risiko
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
        content: 'Pneumonia adalah penyakit infeksi akut yang menyerang sistem pernapasan bagian bawah di alveoli pada balita, terutama yang berusia 29 hari – 11 bulan. Pneumonia dan diare menyebabkan 29% balita meninggal dan 2 juta anak meninggal setiap tahunnya. Penyakit ini merupakan penyebab kematian nomor satu pada balita di dunia, merenggut sekitar 739.000 jiwa pada tahun 2023, dan mayoritas menyerang usia 2–59 bulan.'
      },
      {
        type: 'heading',
        content: 'Situasi di Indonesia dan Jawa Barat'
      },
      {
        type: 'paragraph',
        content: 'Nasional: Menjadi penyebab utama kematian balita dengan 166.702 kasus pada 2022. Angka kematian pada bayi tiga kali lebih tinggi dibandingkan dengan kelompok usia 1–4 tahun.'
      },
      {
        type: 'paragraph',
        content: 'Jawa Barat: Mengalami tren kenaikan kasus dari 44,90% (2022) menjadi 45% (2023).'
      },
      {
        type: 'paragraph',
        content: 'Kota Tasikmalaya: Berada di urutan ke-11 di Jawa Barat (53,6% kasus)'
      },
      {
        type: 'paragraph',
        content: 'Deteksi dini dan perawatan yang tepat sangat penting untuk menurunkan angka kesakitan dan kematian.'
      },
      {
        type: 'image',
        content: 'Ilustrasi pneumonia pada balita',
        media_url: '/media/images/gambar1.png',
        alt: 'Statistik dan data pneumonia pada balita di Indonesia'
      },
      {
        type: 'heading',
        content: 'Pengertian Pneumonia & Bronkopneumonia'
      },
      {
        type: 'heading',
        content: 'Pengertian:'
      },
      {
        type: 'paragraph',
        content: 'Pneumonia merupakan penyakit infeksi akut pada paru-paru yang menyerang alveoli (kantong udara kecil) tempat yang sangat penting dimana terjadi pertukaran oksigen dan karbondioksida di dalam tubuh. Infeksi yang terjadi bisa pada satu atau kedua paru, yang akan mengganggu fungsi pernapasan, menyebabkan sesak napas terutama pada balita yang berusia lebih muda, 29 hari – 11 bulan (National Heart Lung and Blood Institute, 2023).'
      },
      {
        type: 'paragraph',
        content: 'Bronkopneumonia adalah salah satu jenis peradangan paru yang menyebakan terjadinya infeksi dan reaksi peradangan pada area bronkus (saluran udara) dan alveoli (kantong udara)'
      },
      {
        type: 'image',
        content: 'Diagram pneumonia dan bronkopneumonia',
        media_url: '/media/images/gambar2.png',
        alt: 'Perbedaan pneumonia dan bronkopneumonia'
      },
      {
        type: 'heading',
        content: 'ANATOMI SISTEM PERNAPASAN'
      },
      {
        type: 'heading',
        content: 'Saluran Napas Atas (Pintu Masuk dan penyaring udara)'
      },
      {
        type: 'paragraph',
        content: 'Terdiri dari: hidung, tenggorokan (faring), kotak suara (laring) yang bekerja sebagai filter udara, yaitu menyaring debu, menghangatkan, dan melembabkan udara sebelum udara yang dihirup masuk ke paru-paru balita.'
      },
      {
        type: 'heading',
        content: 'Saluran Napas Bawah (Pipa udara)'
      },
      {
        type: 'paragraph',
        content: 'Mulai dari tenggorokan, yaitu trakea bercabang menjadi bronkus kanan dan kiri, lalu ke bronkiolus hingga alveoli (kantong udara) sebagai tempat pertukaran gas. Alveoli itulah tempat terjadi pertukaran gas oksigen dan karbondioksida sehingga anak mempunya enekgi untuk beraktivitas.'
      },
      {
        type: 'heading',
        content: 'Paru-paru Balita'
      },
      {
        type: 'paragraph',
        content: 'Paru-paru balita terdiri atas dua bagian besar, yaitu paru-paru kanan yang mempunyai 3 bagian dan paru-paru kiri yang mempunyai 3 bagian. Terdapat selaput tipis yang membungkus kedua bagian paru, yang disebut dengan pleura, yang berfungsi agar paru-paru bisa mengembang dan mengempis dengan nyaman.'
      },
      {
        type: 'heading',
        content: 'Mekanisme Pernapasan'
      },
      {
        type: 'paragraph',
        content: 'Otot dada dan diafragma (pembatas antara paru dan perut) bekerja secara aktif dalam menarik dan mengeluarkan napas secara teratur. "Jika otot dada anak terlihat bekerja terlalu keras hingga tampak adanya tarikan dinding dada ke dalam, itu adalah tanda bahaya bahwa si kecil sedang kesulitan bernapas."'
      },
      {
        type: 'image',
        content: 'Anatomi sistem pernapasan balita',
        media_url: '/media/images/gambar3.png',
        alt: 'Diagram lengkap sistem pernapasan balita'
      },
      {
        type: 'heading',
        content: 'Perbedaan paru-paru balita Normal VS Paru-paru balita pneumonia'
      },
      {
        type: 'heading',
        content: 'Paru-paru balita normal'
      },
      {
        type: 'paragraph',
        content: 'Kondisi alveoli (kantong udara) paru-paru sangat bersih dan lentur. Ketika anak bernapas, udara masuk dengan lancar tanpa hambatan melalui saluran pernapasan. Kantong udara terisi penuh dengan udara sehingga proses pertukaran gas terjadi dengan baik, sehingga tubuh dapat mengambil oksigen untuk disalurkan ke seluruh tubuh balita.'
      },
      {
        type: 'paragraph',
        content: 'Hasilnya: balita bisa bernapas dengan baik, pergerakan dada teratur saat bernapas, dan tidak menunjukkan kelelahan saat anak bernapas.'
      },
      {
        type: 'heading',
        content: 'Paru-paru balita pneumonia'
      },
      {
        type: 'paragraph',
        content: 'Paru-paru balita pneumonia menunjukkan adanya kuman (bakteri dan virus) masuk dan menyerang alveoli (kantong udara).'
      },
      {
        type: 'paragraph',
        content: 'Infeksi yang terjadi mengakibatkan peradangan pada saluran pernapasan dan produksi dahak yang berlebih sehingga jalan udara menyempit. Alveoli (kantong udara) yang seharusnya terisi udara menjadi terisi cairan atau nanah akibat proses infeksi. Sehingga berdampak pada gangguan pertukaran gas, dampaknya oksigen sulit untuk masuk ke dalam darah, dan tubuh menjadi kekurangan oksigen.'
      },
      {
        type: 'paragraph',
        content: 'Hasinya: Balita susah dalam bernapas, pergerakan dada tidak teratur, dan menunjukkan anak sesak napas'
      },
      {
        type: 'image',
        content: 'Perbandingan paru-paru normal vs pneumonia',
        media_url: '/media/images/gambar4.png',
        alt: 'Perbedaan paru-paru balita normal vs pneumonia'
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
        media_url: '/media/images/gambar5.png',
        alt: 'Berbagai jenis virus dan bakteri penyebab pneumonia'
      },
      {
        type: 'image',
        content: 'Mikroorganisme penyebab pneumonia (lanjutan)',
        media_url: '/media/images/gambar6.png',
        alt: 'Berbagai jenis virus dan bakteri penyebab pneumonia'
      },
      {
        type: 'heading',
        content: 'Faktor Resiko kejadian Pneumonia'
      },
      {
        type: 'heading',
        content: '1. Faktor Risiko "Pasti" (Terbukti Secara Ilmiah)'
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
        content: '2. Faktor Risiko "Mungkin Sekali"'
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
        content: '3. Faktor Risiko "Mungkin"'
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
        content: '4. Faktor Risiko Menurut Kemenkes RI'
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

  // SESI 2: Tanda & Gejala, Klasifikasi Pneumonia, dan Perjalanan Penyakit
  {
    day: 2,
    title: 'Tanda & Gejala, Klasifikasi Pneumonia, dan Perjalanan Penyakit',
    subtitle: 'Mengenali gejala dan memahami tingkat keparahan pneumonia',
    estimatedTime: '15 menit',
    sections: [
      {
        type: 'heading',
        content: 'TANDA DAN GEJALA'
      },
      {
        type: 'paragraph',
        content: 'Secara umum, pneumonia sering kali diawali dengan gejala Infeksi Saluran Pernapasan Atas (ISPA) yang kemudian berkembang menjadi kondisi yang lebih serius.'
      },
      {
        type: 'heading',
        content: '1. Gejala Umum (Kunci Utama)'
      },
      {
        type: 'paragraph',
        content: 'Tanda yang paling sering muncul adalah:'
      },
      {
        type: 'list',
        content: [
          'Gangguan Pernapasan: Napas cepat (takipnea), tarikan dinding dada ke dalam (retraksi), dan napas cuping hidung',
          'Suara Napas Tambahan: Terdengar suara crackles, wheezing (mengi), atau suara napas yang menurun',
          'Kondisi Tubuh: Demam tinggi dengan suhu > 37,5 °C, menggigil, batuk (kering atau berdahak), serta nyeri pada dada, perut, atau leher',
          'Perubahan Perilaku: Anak tampak lemas (letargi), gelisah, sulit minum/menyusu, hingga warna kulit membiru (sianosis) karena kurang oksigen'
        ]
      },
      {
        type: 'heading',
        content: '3. Tanda Bahaya yang Perlu Diwaspadai'
      },
      {
        type: 'paragraph',
        content: 'Penelitian menunjukkan bahwa hampir 60% kasus pneumonia pada anak ditandai dengan dua hal utama yang bisa dilihat langsung oleh orang tua:'
      },
      {
        type: 'list',
        content: [
          'Napas Cepat: Frekuensi napas yang melebihi batas normal sesuai usia, yaitu untuk usia 2 – <12 bulan: ≥ 50x/menit; usia 12 bulan – <5 tahun: ≥ 40x/menit',
          'Tarikan Dinding Dada: Dada tampak mencekung ke dalam saat anak menarik napas'
        ]
      },
      {
        type: 'paragraph',
        content: 'Catatan Penting: Deteksi dini pada tanda-tanda di atas sangat krusial karena pneumonia dapat berkembang cepat menjadi kondisi berat (toksemia) jika tidak segera ditangani.'
      },
      {
        type: 'image',
        content: 'Tanda dan gejala pneumonia pada balita',
        media_url: '/media/images/gambar8.png',
        alt: 'Ilustrasi tanda dan gejala pneumonia'
      },
      {
        type: 'heading',
        content: 'Klasifikasi Pneumonia'
      },
      {
        type: 'list',
        content: [
          'Pneumonia berat: ditandai dengan tarikan dinding dada ke dalam atau saturasi oksigen < 92%',
          'Pneumonia: Ditandai dengan napas cepat (Usia 2–<12 bulan: ≥50x/menit; Usia 12 bulan–<5 tahun: ≥40x/menit)',
          'Batuk Bukan Pneumonia: Hanya batuk pilek biasa tanpa napas cepat atau tarikan dinding dada'
        ]
      },
      {
        type: 'image',
        content: 'Klasifikasi pneumonia berdasarkan tingkat keparahan',
        media_url: '/media/images/gambar9.png',
        alt: 'Diagram klasifikasi pneumonia'
      },
      {
        type: 'heading',
        content: 'Perjalanan Penyakit Pneumonia Balita'
      },
      {
        type: 'heading',
        content: 'Tahap ke-1 & 2 (Pintu Masuk Kuman)'
      },
      {
        type: 'paragraph',
        content: 'Tahap pertama diawali dengan masuknya kuman (bakteri dan virus) ke saluran pernapasan balita. Kuman tersebut masuk lewat udara atau percikan ludah saat orang sakit batuk.'
      },
      {
        type: 'paragraph',
        content: 'Anak bisa mengalami pneumonia karena adanya penularan penyakit, hal tersebut disebabkan karena adanya faktor yang memudahkan kuman masuk diantaranya asap rokok, gizi anak yang kurang, atau pemberian imunisasi yang tidak lengkap'
      },
      {
        type: 'paragraph',
        content: 'Selain itu, sistem pertahanan tubuh balita dan saluran napas anak yang belum sempurna mengakibatkan kuman tersebut bisa masuk ke paru-paru bagian bawah, yaitu di kantong udara (alveoli).'
      },
      {
        type: 'heading',
        content: 'Tahap 3 & 4 ( Pertahanan di Paru-paru)'
      },
      {
        type: 'paragraph',
        content: 'Kuman yang masuk ke paru-paru bagian dalam, yaitu kantong udara (alveoli), akan memperbanyak diri/berkembang biak. Namun, tubuh anak melakukan perlawanan dengan mengaktifkan sistem imun (pertahanan tubuh) untuk menyerang kuman. Sehingga menyebabkan terjadinya peradangan atau perlukaan pada jaringan paru.'
      },
      {
        type: 'heading',
        content: 'Tahap 5 & 6 (Penumpukan cairan/ nanah)'
      },
      {
        type: 'paragraph',
        content: 'Proses peradangan yang terjadi menghasilkan nanah/lendir. Kantong udara (alveoli) yang seharusnya secara normal berisi udara bersih sekarang terisi penuh dengan lendir atau nanah, sehingga oksigen sulit masuk ke dalam darah dan udara kotor (karbondioksida) sulit untuk keluar.'
      },
      {
        type: 'heading',
        content: 'Tahap 7 (Gejala yang ditemukan)'
      },
      {
        type: 'paragraph',
        content: 'Tahap ini menunjukkan oksigen di dalam tubuh berkurang, di mana akan muncul gejala pada anak berupa demam tinggi, anak lemas, gelisah, dan tidak mau menyusu. Selain itu muncul batuk berdahak atau kering, ada suara napas tambahan karena penumpukan lendir di jalan napas seperti wheezing, ronkhi, pernapasan anak cepat, ada tarikan dinding dada kedalam, dan terdapat pernapasan cuping hidung yaitu hidung anak kembang kempis karena berusa keras untuk mendapatkan oksigen'
      },
      {
        type: 'heading',
        content: 'Tahap kritis (Toksemia)'
      },
      {
        type: 'paragraph',
        content: 'Apabila tanda dan gejala gangguan pernapasan pada balita tidak segera ditangani, maka kondisi anak menjadi sangat parah. Kondisi tersebut akan mengakibatkan infeksi yang terjadi menyebar ke seluruh tubuh (sepsis), sehingga mengakibatkan gagal napas yang akan mengancam nyawa.'
      },
      {
        type: 'heading',
        content: 'Komplikasi'
      },
      {
        type: 'image',
        content: 'Alur perjalanan penyakit pneumonia',
        media_url: '/media/images/gambar10.png',
        alt: 'Flowchart perjalanan penyakit pneumonia pada balita'
      },
      {
        type: 'heading',
        content: '1. Masalah pada Paru-Paru'
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
        content: '2. Masalah yang Menyebar ke Seluruh Tubuh'
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
        content: '3. Tanda Khusus yang Perlu Diperhatikan (Menurut WHO)'
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

  // SESI 3: Pemeriksaan diagnostik, Penatalaksanaan, Deteksi dini, perawatan Pencegahan
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
        content: 'Cek Darah Lengkap:'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Melihat jumlah sel darah putih. Jika nilai sel darah putih (leukosit) tinggi, tandanya ada infeksi bakteri yang sedang menyerang tubuh.'
      },
      {
        type: 'heading',
        content: 'Cek Penanda Radang (CRP/LED):'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Mengetahui seberapa parah peradangan atau "luka" yang ada di paru-paru si Kecil.'
      },
      {
        type: 'heading',
        content: 'Cek Dahak (Sputum):'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Mencari tahu jenis kuman penyebabnya agar dokter bisa memberikan jenis antibiotik yang paling sesuai dengan jenis kuman.'
      },
      {
        type: 'heading',
        content: 'Cek Oksigen Darah (Gas Darah):'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: Dilakukan jika si Kecil sesak berat, untuk memastikan apakah oksigen dalam darahnya masih cukup atau membutuhkan bantuan alat bantu napas.'
      },
      {
        type: 'heading',
        content: 'Biakan Darah (Kultur):'
      },
      {
        type: 'paragraph',
        content: 'Tujuannya: memastikan apakah kuman sudah menyebar dari paru-paru ke aliran darah yang bertujuan untuk mencegah infeksi berat.'
      },
      {
        type: 'image',
        content: 'Pemeriksaan laboratorium untuk pneumonia',
        media_url: '/media/images/gambar12.png',
        alt: 'Ilustrasi berbagai pemeriksaan laboratorium'
      },
      {
        type: 'heading',
        content: 'Penatalaksanaan'
      },
      {
        type: 'heading',
        content: '1. Kapan harus dirawat di rumah sakit?'
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
        content: '2. Perawatan Pendukung di Rumah/RS'
      },
      {
        type: 'list',
        content: [
          'Cairan & Nutrisi: Pastikan anak tidak dehidrasi/kekurangan cairan dan tetap makan agar kuat melawan kuman',
          'Bantuan Napas: Pemberian oksigen atau bantuan mengeluarkan dahak agar jalan napas lega'
        ]
      },
      {
        type: 'heading',
        content: '3. Pemberian Antibiotik yang Tepat'
      },
      {
        type: 'list',
        content: [
          'Sesuai umur: Jenis dan dosis antibiotik dibedakan antara bayi baru lahir, balita, dan anak sekolah',
          'Harus Tuntas: Obat biasanya diberikan selama 10–14 hari. Jangan berhenti sebelum waktunya, meskipun anak sudah tidak demam (minimal bebas demam 3 hari baru boleh evaluasi berhenti)'
        ]
      },
      {
        type: 'heading',
        content: '4. Pengobatan Khusus'
      },
      {
        type: 'paragraph',
        content: 'Dokter akan memilih jenis obat yang paling efektif berdasarkan jenis kuman penyebabnya (misalnya untuk kuman stafilokokus atau M. pneumoniae).'
      },
      {
        type: 'paragraph',
        content: 'Penting untuk Ibu: Kunci kesembuhan adalah disiplin dosis dan menjaga asupan cairan si Kecil. Apabila batuk > 2 minggu, lakukan pemeriksaan untuk Tuberculosis (TBC)'
      },
      {
        type: 'image',
        content: 'Penatalaksanaan pneumonia pada balita',
        media_url: '/media/images/gambar13.png',
        alt: 'Flowchart penatalaksanaan pneumonia'
      },
      {
        type: 'heading',
        content: 'Deteksi Dini'
      },
      {
        type: 'heading',
        content: 'Cara Cepat Deteksi Pneumonia (Paru-Paru Basah) di Rumah'
      },
      {
        type: 'paragraph',
        content: 'Ibu, ingatlah rumus "Lihat, Dengar, Pantau" jika si Kecil sedang batuk atau pilek:'
      },
      {
        type: 'heading',
        content: '1. LIHAT: Hitung Kecepatan Napas (Pengukuran frekuensi napas)'
      },
      {
        type: 'paragraph',
        content: 'Buka baju si Kecil dan lihat dadanya saat ia tenang/tidur. Balita disebut napas cepat jika dalam 1 menit:'
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
        type: 'heading',
        content: 'Prosedur:'
      },
      {
        type: 'list',
        content: [
          'Menghitung pernafasan anak selama 1 menit dengan menggunakan arloji saat anak dalam keadaan tenang dan diam',
          'Mengamati pergerakan nafas bagian dada atau perut',
          'Melihat dan menunjukkan adanya tarikan dinding dada bagian bawah',
          'Mendengar adanya bunyi nafas "grok-grok"'
        ]
      },
      {
        type: 'video',
        content: 'Video Tutorial Hitung Napas',
        media_url: 'https://www.youtube.com/watch?v=wlSbzDARbUc',
        alt: 'Tutorial menghitung frekuensi napas pada balita'
      },
      {
        type: 'heading',
        content: 'LIHAT : Tarikan dinding dada kedalam'
      },
      {
        type: 'paragraph',
        content: 'Waspada: Jika dada bagian bawah mencekung ke dalam setiap kali anak menarik napas.'
      },
      {
        type: 'video',
        content: 'Video Tutorial Tarikan Dinding Dada',
        media_url: 'https://youtu.be/V5d1DxKDUHA',
        alt: 'Panduan visual deteksi tarikan dinding dada pada balita'
      },
      {
        type: 'heading',
        content: '3. DENGAR: Suara napas tambahan'
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
        type: 'video',
        content: 'Video Suara Napas Tambahan',
        media_url: 'https://youtu.be/Xn9UBmgpCdA',
        alt: 'Tutorial mendengarkan suara napas tambahan pada balita'
      },
      {
        type: 'heading',
        content: '4. Pantau: Kondisi suhu tubuh'
      },
      {
        type: 'paragraph',
        content: 'Demam tinggi yang tidak turun-turun .'
      },
      {
        type: 'paragraph',
        content: 'Pastikan suhu tubuh anak menggunakan termometer dengan langkah sebagai berikut'
      },
      {
        type: 'list',
        content: [
          'Nyalakan thermometer dan pastikan bertulisan "LO" pada thermometer',
          'Keringkan bagian ketiak anak hingga dapat dipastikan tidak mempengaruhi hasil pemeriksaan',
          'Letakan ujung termometer pada ketiak anak',
          'Diamkan hingga berbunyi "beep" dan lihat hasil pemeriksaan',
          'Nilai Normal suhu tubuh (36,5 oC – 37, 5 oC)',
          'Demam jika suhu > 37, 5 oC'
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
        content: 'Video Tutorial Mengukur Suhu Tubuh',
        media_url: 'https://youtu.be/8kr4ZfdXPgk',
        alt: 'Tutorial mengukur suhu tubuh balita dengan termometer'
      },
      {
        type: 'heading',
        content: 'Pantau: Nilai Saturasi Oksigen'
      },
      {
        type: 'paragraph',
        content: 'Menilai kadar oksigen didalam pembuluh darah arteri'
      },
      {
        type: 'paragraph',
        content: 'Nilai Normal saturasi oksigen 95-100%, Pneumonia Berat apabila nilai Saturasi oksigen Adalah < 92%.'
      },
      {
        type: 'paragraph',
        content: 'Meletakkkan oksimetri pada ibujari anak dan lihat hasil pengukuran'
      },
      {
        type: 'video',
        content: 'Video Tutorial Saturasi Oksigen',
        media_url: 'https://youtu.be/ze6QPbZh7SU',
        alt: 'Tutorial mengukur saturasi oksigen dengan oksimetri'
      },
      {
        type: 'paragraph',
        content: 'Intinya: Jika anak batuk disertai napas cepat atau dada mencekung, jangan tunggu besok. Segera bawa ke Puskesmas atau Rumah Sakit terdekat.'
      },
      {
        type: 'image',
        content: 'Panduan deteksi dini pneumonia',
        media_url: '/media/images/gambar15.png',
        alt: 'Infografis panduan deteksi dini pneumonia'
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
        content: 'Penanganan Demam (Water Tepid Sponge)'
      },
      {
        type: 'paragraph',
        content: 'Teknik kompres air hangat untuk menurunkan suhu tubuh.'
      },
      {
        type: 'paragraph',
        content: 'Persiapan: Baskom air hangat, waslap, termometer, dan handuk.'
      },
      {
        type: 'paragraph',
        content: 'Prosedur: Ukur suhu awal, buka pakaian, lapisi tempat tidur dengan perlak, lalu letakkan waslap basah di ketiak dan lipatan paha selama 3-5 menit.'
      },
      {
        type: 'video',
        content: 'Video Tutorial Kompres Air Hangat',
        media_url: 'https://youtu.be/gYkH3fqWcGc',
        alt: 'Tutorial teknik kompres air hangat untuk menurunkan demam'
      },
      {
        type: 'heading',
        content: 'Inhalasi Aromaterapi Peppermint Oil'
      },
      {
        type: 'paragraph',
        content: 'Tindakan nonfarmakologis untuk mengatasi bersihan jalan napas yang tidak efektif.'
      },
      {
        type: 'paragraph',
        content: 'Manfaat: Mengurangi sesak napas (dispnea), mengurangi peradangan, melegakan saluran napas, dan memberikan relaksasi.'
      },
      {
        type: 'paragraph',
        content: 'Cara: Gunakan diffuser (50 ml air + 4-5 tetes minyak) dengan jarak 10-15 cm dari anak selama 10-15 menit.'
      },
      {
        type: 'video',
        content: 'Video Tutorial Inhalasi Aromaterapi',
        media_url: 'https://youtu.be/8f0aGb7iKA8',
        alt: 'Tutorial inhalasi aromaterapi peppermint oil'
      },
      {
        type: 'heading',
        content: 'Fisioterapi Dada'
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
        type: 'video',
        content: 'Video Tutorial Fisioterapi Dada',
        media_url: 'https://youtu.be/sx5PljkutwI',
        alt: 'Tutorial fisioterapi dada untuk mengeluarkan dahak'
      },
      {
        type: 'heading',
        content: 'Nutrisi dan Pengobatan'
      },
      {
        type: 'paragraph',
        content: 'Nutrisi: Berikan ASI eksklusif hingga 6 bulan karena mengandung zat anti-infeksi. Untuk balita di atas 6 bulan, berikan diet tinggi energi tinggi protein (TETP) dengan tekstur lunak (Buah, susu, telur, ikan, kacang-kacangan).'
      },
      {
        type: 'paragraph',
        content: 'Catatan Diet: Kurangi karbohidrat untuk meminimalkan produksi CO2. Madu dapat diberikan untuk mengurangi batuk.'
      },
      {
        type: 'paragraph',
        content: 'Antibiotik: Harus diberikan sesuai dosis, tepat waktu (misalnya setiap 8 jam untuk jadwal 3x sehari), dan wajib dihabiskan untuk membunuh bakteri sepenuhnya.'
      },
      {
        type: 'list',
        content: [
          'Memberikan obat antibiotik sesuai dengan dosis yang ditentukan misalnya 2,5 ml, 5 ml, atau 10 ml',
          'Memberikan obat tepat waktu sesuai jadwal misalnya 3x dalam 24 jam berarti setiap 8 jam obat diberikan',
          'Contoh: pemberian ke-1 : jam 06.00, pemberian ke-2 : jam 14.00, pemberian ke-3 : jam 22.00',
          'Antibiotik harus diberikan sampai habis untuk membunuh bakteri'
        ]
      },
      {
        type: 'video',
        content: 'Video Tutorial Pemberian Obat',
        media_url: 'https://youtu.be/mrW0wCaHO-g',
        alt: 'Tutorial cara memberikan obat antibiotik pada balita'
      },
      {
        type: 'paragraph',
        content: 'Tips Penting: Selalu catat hasil hitung napas dan suhu tubuh si Kecil di buku kecil agar mudah dilaporkan saat berkonsultasi dengan bidan atau dokter.'
      },
      {
        type: 'image',
        content: 'Panduan perawatan balita dengan pneumonia',
        media_url: '/media/images/gambar16.png',
        alt: 'Ilustrasi berbagai teknik perawatan balita'
      },
      {
        type: 'heading',
        content: 'Manajemen Psikologis bagi ibu: Hipnosis 5 Jari'
      },
      {
        type: 'paragraph',
        content: 'Digunakan untuk menurunkan kecemasan pada anak/orang tua dengan menautkan ibu jari ke jari lainnya sambil membayangkan hal positif (tubuh sehat, orang tersayang, kesuksesan, dan tempat yang menyenangkan).'
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
        content: 'Video Animasi Pemeriksaan Diagnostik, Penatalaksanaan, Deteksi Dini, Perawatan',
        media_url: 'https://youtu.be/aC-QrKGVFoI',
        alt: 'Video animasi tentang pemeriksaan dan penatalaksanaan pneumonia'
      },
      {
        type: 'video',
        content: 'Video Hipnosis 5 Jari',
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

  // SESI 4: PRAKTIK MANDIRI
  {
    day: 4,
    title: 'Praktik Mandiri',
    subtitle: 'Latihan interaktif mengenali tanda pneumonia',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'PRAKTIK MANDIRI'
      },
      {
        type: 'heading',
        content: 'Latihan Interaktif:'
      },
      {
        type: 'heading',
        content: 'Hitung Napas:'
      },
      {
        type: 'paragraph',
        content: 'Video tutorial menghitung frekuensi napas per menit. Ibu akan diminta menjawab dari video yang ditayangkan. "Berapa jumlah frekuensi napas anak tersebut dalam 1 menit?" -> jawaban nya adalah 65/menit.'
      },
      {
        type: 'video',
        content: 'Video latihan menghitung frekuensi nafas',
        media_url: 'https://youtu.be/0ujj7aJLZqI',
        alt: 'Video latihan menghitung frekuensi napas - Jawaban: 65x/menit'
      },
      {
        type: 'video',
        content: 'Video hasil menghitung frekuensi nafas',
        media_url: 'https://youtu.be/gCwgaVa6B98',
        alt: 'Video hasil dan pembahasan menghitung frekuensi napas'
      },
      {
        type: 'heading',
        content: 'Cek Retraksi:'
      },
      {
        type: 'paragraph',
        content: 'Panduan visual untuk melihat apakah ada tarikan dinding dada ke dalam (retraksi).'
      },
      {
        type: 'video',
        content: 'Video melihat retaksi dinding dada',
        media_url: 'https://youtu.be/49_rVCBIMpQ',
        alt: 'Video praktik melihat retraksi dinding dada'
      }
    ]
  },

  // SESI 5: Review seluruh materi dari hari 1-4
  {
    day: 5,
    title: 'Review Seluruh Materi',
    subtitle: 'Rangkuman pembelajaran pneumonia balita hari 1-4',
    estimatedTime: '10 menit',
    sections: [
      {
        type: 'heading',
        content: 'Materi: Review seluruh materi dari hari 1-4'
      },
      {
        type: 'paragraph',
        content: 'Pada sesi terakhir ini, mari kita review kembali seluruh materi yang telah dipelajari dari hari 1 hingga hari 4.'
      },
      {
        type: 'video',
        content: 'Video Review Materi Pneumonia Balita',
        media_url: 'https://youtu.be/Eh6EpZlw7u4',
        alt: 'Video review lengkap materi pneumonia balita dari sesi 1-4'
      },
      {
        type: 'paragraph',
        content: 'Akses: Tombol Post-Test akan muncul jika semua sesi sebelumnya sudah ditandai "Selesai".'
      }
    ]
  }
];
