# Penambahan Video Tutorial - Sesi 4 (Praktik Mandiri)

## Ringkasan

Telah ditambahkan 2 video tutorial interaktif pada Sesi 4 (Praktik Mandiri) untuk membantu ibu belajar mendeteksi pneumonia pada balita.

## Video yang Ditambahkan

### 1. Video Tutorial Hitung Napas
- **Judul**: Tutorial Menghitung Frekuensi Napas
- **URL**: https://youtu.be/wlSbzDARbUc
- **Deskripsi**: Video tutorial menghitung frekuensi napas per menit pada balita
- **Tujuan**: Mengajarkan ibu cara menghitung napas balita dengan benar

### 2. Video Tutorial Cek Retraksi
- **Judul**: Panduan Visual Deteksi Tarikan Dinding Dada
- **URL**: https://youtu.be/V5d1DxKDUHA
- **Deskripsi**: Panduan visual untuk melihat tarikan dinding dada ke dalam (retraksi)
- **Tujuan**: Mengajarkan ibu cara mendeteksi retraksi sebagai tanda pneumonia

## Struktur Sesi 4

```
Sesi 4: Praktik Mandiri
├── Latihan Interaktif (Intro)
├── Hitung Napas
│   ├── Penjelasan
│   └── 🎥 Video Tutorial Hitung Napas
├── Cek Retraksi
│   ├── Penjelasan
│   └── 🎥 Video Tutorial Cek Retraksi
├── Highlight (Catatan Interaktif)
└── Tip (Penutup)
```

## Implementasi Teknis

### File yang Dimodifikasi
- `lib/constants/session-content.ts`

### Perubahan
1. Menambahkan video "Hitung Napas" setelah penjelasan tentang menghitung frekuensi napas
2. Menambahkan video "Cek Retraksi" setelah penjelasan tentang deteksi retraksi
3. Menghapus video placeholder yang tidak valid

### Format Data
```typescript
{
  type: 'video',
  content: 'Video Tutorial Hitung Napas',
  media_url: 'https://youtu.be/wlSbzDARbUc',
  alt: 'Tutorial menghitung frekuensi napas pada balita'
}
```

## Manfaat

✅ Pembelajaran lebih interaktif dan praktis
✅ Ibu dapat melihat langsung cara menghitung napas
✅ Ibu dapat melihat contoh visual retraksi
✅ Meningkatkan pemahaman praktik deteksi dini pneumonia
✅ Konten lebih lengkap dan edukatif

## Testing

✅ Build berhasil tanpa error
✅ Tidak ada diagnostik TypeScript
✅ Video dapat diembed dengan benar (YouTube)
✅ Layout responsif di berbagai ukuran layar

## Catatan

- Video menggunakan YouTube embed yang sudah dioptimasi di `MediaEmbed.tsx`
- Video akan otomatis dikonversi ke format embed URL
- Loading state dan error handling sudah ditangani dengan baik
