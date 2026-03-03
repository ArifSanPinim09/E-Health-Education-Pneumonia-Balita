# Supabase Storage Setup Guide

Panduan lengkap untuk mengatur Supabase Storage dan mengunggah media assets untuk aplikasi E-Health Pneumonia Balita.

## Daftar Isi

1. [Persiapan](#persiapan)
2. [Setup Bucket via Dashboard](#setup-bucket-via-dashboard)
3. [Setup Bucket via Script](#setup-bucket-via-script)
4. [Upload Media Assets](#upload-media-assets)
5. [Verifikasi](#verifikasi)
6. [Troubleshooting](#troubleshooting)

## Persiapan

### File Media yang Dibutuhkan

Pastikan Anda memiliki semua file media berikut:

**Images (6 files):**
- `gambar-ibu.png` - Ilustrasi ibu dan anak
- `gambar-paru.png` - Gambar paru-paru
- `anatomi-paru.png` - Diagram anatomi paru-paru
- `virus-bakteri.png` - Ilustrasi virus dan bakteri
- `tanda-gejala.png` - Ilustrasi tanda dan gejala
- `penatalaksanaan.png` - Diagram penatalaksanaan

**Videos (10 files):**
- `video-suhu.mp4` - Tutorial mengukur suhu tubuh
- `video-hitung-napas.mp4` - Tutorial menghitung napas
- `video-napas-tambahan.mp4` - Mengenali suara napas tambahan
- `video-retraksi.mp4` - Mengenali retraksi dinding dada
- `video-saturasi.mp4` - Cara mengukur saturasi oksigen
- `video-inhalasi.mp4` - Cara menggunakan inhaler
- `video-nebulizer.mp4` - Cara menggunakan nebulizer
- `video-obat.mp4` - Cara memberikan obat
- `video-tepid-sponge.mp4` - Cara melakukan kompres hangat
- `video-fisioterapi.mp4` - Cara melakukan fisioterapi dada

### Environment Variables

Pastikan file `.env.local` sudah dikonfigurasi:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Setup Bucket via Dashboard

### Langkah 1: Buka Supabase Dashboard

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Navigasi ke **Storage** di sidebar kiri

### Langkah 2: Buat Bucket

1. Klik tombol **New bucket**
2. Isi form dengan detail berikut:
   - **Name**: `media-assets`
   - **Public bucket**: ✅ Centang (Enable)
   - **File size limit**: `52428800` (50MB)
   - **Allowed MIME types**: `image/png, image/jpeg, image/jpg, image/webp, video/mp4`
3. Klik **Create bucket**

### Langkah 3: Konfigurasi CORS (Opsional)

Jika mengalami masalah CORS, tambahkan konfigurasi berikut:

1. Buka **Settings** > **API**
2. Scroll ke bagian **CORS**
3. Tambahkan domain aplikasi Anda (misalnya: `http://localhost:3000`, `https://your-domain.com`)

### Langkah 4: Buat Folder Structure

1. Buka bucket `media-assets`
2. Klik **Upload** > **Create folder**
3. Buat folder `images`
4. Buat folder `videos`

## Setup Bucket via Script

Alternatif lebih cepat menggunakan script otomatis:

```bash
# Install dependencies jika belum
npm install

# Jalankan script setup
npx tsx scripts/setup-supabase-storage.ts
```

Script akan:
- ✅ Membuat bucket `media-assets` dengan konfigurasi yang tepat
- ✅ Mengatur public access
- ✅ Mengkonfigurasi file size limit dan MIME types
- ✅ Membuat struktur folder

## Upload Media Assets

### Metode 1: Via Supabase Dashboard (Manual)

1. Buka bucket `media-assets` di Supabase Dashboard
2. Navigasi ke folder `images`
3. Klik **Upload** > **Upload files**
4. Pilih semua 6 file gambar
5. Klik **Upload**
6. Ulangi untuk folder `videos` dengan 10 file video

### Metode 2: Via Upload Script (Otomatis)

**Persiapan:**

1. Buat struktur folder lokal:
```bash
mkdir -p public/media/images
mkdir -p public/media/videos
```

2. Pindahkan semua file media ke folder yang sesuai:
   - Images → `public/media/images/`
   - Videos → `public/media/videos/`

**Upload:**

```bash
# Jalankan script upload
npx tsx scripts/upload-media-assets.ts
```

Script akan:
- ✅ Membaca file dari `public/media/`
- ✅ Upload ke Supabase Storage
- ✅ Skip file yang sudah ada
- ✅ Menampilkan progress dan summary

### Metode 3: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Upload files
supabase storage cp public/media/images/* supabase://media-assets/images/
supabase storage cp public/media/videos/* supabase://media-assets/videos/
```

## Verifikasi

### 1. Cek via Dashboard

1. Buka Supabase Dashboard > Storage > `media-assets`
2. Verifikasi folder `images` berisi 6 file
3. Verifikasi folder `videos` berisi 10 file
4. Klik salah satu file untuk preview

### 2. Cek via Browser

Buka URL berikut di browser (ganti `your-project` dengan project ID Anda):

**Images:**
```
https://your-project.supabase.co/storage/v1/object/public/media-assets/images/gambar-ibu.png
```

**Videos:**
```
https://your-project.supabase.co/storage/v1/object/public/media-assets/videos/video-suhu.mp4
```

Jika file muncul, setup berhasil! ✅

### 3. Cek via Aplikasi

1. Jalankan aplikasi: `npm run dev`
2. Login dan buka salah satu session
3. Verifikasi gambar dan video muncul dengan benar
4. Test video playback controls

## Troubleshooting

### Error: "Bucket already exists"

**Solusi:** Bucket sudah dibuat sebelumnya. Lanjutkan ke langkah upload.

### Error: "File size too large"

**Solusi:** 
- Kompres video dengan ffmpeg:
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1M output.mp4
```
- Atau tingkatkan file size limit di bucket settings

### Error: "CORS policy blocked"

**Solusi:**
1. Buka Supabase Dashboard > Settings > API
2. Tambahkan domain aplikasi ke CORS allowed origins
3. Restart aplikasi

### Error: "Storage API not responding"

**Solusi:**
1. Cek koneksi internet
2. Verifikasi environment variables
3. Cek status Supabase: https://status.supabase.com

### Images tidak muncul di aplikasi

**Solusi:**
1. Cek console browser untuk error
2. Verifikasi URL di `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```
3. Pastikan bucket `media-assets` bersifat public
4. Clear browser cache dan reload

### Video tidak bisa diputar

**Solusi:**
1. Verifikasi format video adalah MP4 (H.264 codec)
2. Konversi jika perlu:
```bash
ffmpeg -i input.mov -vcodec h264 -acodec aac output.mp4
```
3. Cek browser console untuk error
4. Test di browser berbeda

## Maintenance

### Mengganti File

1. Via Dashboard: Upload file baru dengan nama sama (akan overwrite)
2. Via Script: Hapus file lama dulu, lalu upload baru

### Backup Media Assets

```bash
# Download semua files
supabase storage cp supabase://media-assets/images/* ./backup/images/
supabase storage cp supabase://media-assets/videos/* ./backup/videos/
```

### Monitoring Storage Usage

1. Buka Supabase Dashboard > Settings > Usage
2. Cek **Storage** usage
3. Free tier: 1GB storage
4. Upgrade jika mendekati limit

## Best Practices

1. ✅ Kompres images sebelum upload (gunakan TinyPNG atau ImageOptim)
2. ✅ Kompres videos dengan bitrate 1-2 Mbps untuk web
3. ✅ Gunakan nama file yang deskriptif dan konsisten
4. ✅ Backup media assets secara berkala
5. ✅ Monitor storage usage
6. ✅ Test media loading di berbagai device dan koneksi

## Referensi

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Video Compression Guide](https://trac.ffmpeg.org/wiki/Encode/H.264)
