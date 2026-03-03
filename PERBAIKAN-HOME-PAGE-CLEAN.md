# Perbaikan Halaman Home - Desain Clean & Minimal

## Perubahan yang Dilakukan

### 1. Navbar Transparan Baru
- Navbar transparan yang berubah menjadi solid saat di-scroll
- Menampilkan button "Login" jika belum login
- Menampilkan button "Dashboard" jika sudah login
- Responsive untuk mobile dengan hamburger menu
- Logo dan navigasi yang clean

### 2. Hero Section
- Desain lebih clean tanpa banyak gradient
- Menggunakan gambar anak demam dari `/media/images/anak-demam.png.png`
- Layout 2 kolom dengan teks di kiri dan gambar di kanan
- Animasi smooth dan minimal
- Background gradient sederhana (blue-50 to white)

### 3. Section "Cara Kerja"
- Background abu-abu muda (gray-50)
- Card putih dengan shadow minimal
- Icon solid blue tanpa gradient
- Spacing yang lebih rapi
- Informasi 4 hari program yang jelas

### 4. Section "Manfaat"
- Background putih bersih
- Card dengan border dan shadow minimal
- Icon blue solid
- Trust indicators dengan background blue-50

### 5. Section Statistik Pneumonia (BARU)
- Data faktual tentang pneumonia pada balita:
  - 740.180 anak meninggal per tahun (WHO)
  - 15% dari kematian anak di bawah 5 tahun (UNICEF)
  - 2-3 juta kasus di Indonesia per tahun (Kemenkes)
  - 80% dapat dicegah dengan edukasi
- Card dengan icon berwarna sesuai tingkat urgensi
- CTA untuk mulai belajar

### 6. CTA Section
- Background blue solid tanpa gradient kompleks
- Desain lebih clean dan fokus
- Footer dengan copyright

### 7. Tombol AI Chat (Pojok Kanan Bawah)
- Fixed button di pojok kanan bawah
- Icon MessageCircle
- Tooltip "Tanya AI tentang Pneumonia"
- Siap untuk implementasi fitur chat AI

## Fitur Utama

✅ Navbar transparan dengan deteksi scroll
✅ Deteksi status login user (tampilkan Login/Dashboard)
✅ Gambar anak demam di hero section
✅ Data statistik pneumonia yang informatif
✅ Desain minimal tanpa gradient berlebihan
✅ Animasi smooth dengan framer-motion
✅ Responsive untuk semua ukuran layar
✅ Tombol AI chat di pojok kanan atas (siap implementasi)

## File yang Dibuat/Diubah

1. `components/landing/Navbar.tsx` - BARU
2. `components/landing/HeroSection.tsx` - DIPERBARUI
3. `components/landing/HowItWorksSection.tsx` - DIPERBARUI
4. `components/landing/BenefitsSection.tsx` - DIPERBARUI
5. `components/landing/StatisticsSection.tsx` - BARU
6. `components/landing/CTASection.tsx` - DIPERBARUI
7. `app/page.tsx` - DIPERBARUI

## Cara Menggunakan

Halaman home sudah siap digunakan. Untuk implementasi fitur AI chat, tambahkan handler onClick pada tombol AI chat di `Navbar.tsx`.

## Catatan

- Gambar menggunakan path: `/media/images/anak-demam.png.png`
- Data statistik berdasarkan sumber WHO, UNICEF, dan Kemenkes RI
- Desain mengikuti prinsip clean design dengan minimal gradient
- Semua animasi menggunakan framer-motion untuk performa optimal
