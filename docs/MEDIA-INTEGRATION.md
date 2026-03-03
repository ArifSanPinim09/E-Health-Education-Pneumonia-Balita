# Media Asset Integration

Dokumentasi lengkap tentang integrasi media assets (gambar dan video) dalam aplikasi E-Health Pneumonia Balita.

## Daftar Isi

1. [Overview](#overview)
2. [Arsitektur](#arsitektur)
3. [Komponen](#komponen)
4. [Penggunaan](#penggunaan)
5. [Fitur](#fitur)
6. [Mobile Optimization](#mobile-optimization)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Overview

Sistem media integration menyediakan cara yang optimal untuk menampilkan gambar dan video edukatif dalam konten pembelajaran. Sistem ini menggunakan:

- **Supabase Storage** untuk penyimpanan media
- **Next.js Image** untuk optimasi gambar
- **Custom Video Player** dengan kontrol lengkap
- **Responsive Design** untuk semua ukuran layar
- **Loading States** dan error handling

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                  Session Content                         │
│              (session-content.ts)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              ContentRenderer.tsx                         │
│         (Parse dan render sections)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               MediaEmbed.tsx                             │
│    ┌──────────────────┬──────────────────┐             │
│    │                  │                  │             │
│    ▼                  ▼                  ▼             │
│  Image             Video            Error              │
│  Component         Player           Handler            │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Storage                            │
│         (media-assets bucket)                            │
│    ┌──────────────────┬──────────────────┐             │
│    │                  │                  │             │
│    ▼                  ▼                  ▼             │
│  images/           videos/           CDN               │
└─────────────────────────────────────────────────────────┘
```

## Komponen

### 1. MediaEmbed Component

**Lokasi:** `components/session/MediaEmbed.tsx`

Komponen utama untuk menampilkan media (gambar atau video).

**Props:**
```typescript
interface MediaEmbedProps {
  type: 'image' | 'video';
  mediaUrl: string;  // Path relatif dari bucket (e.g., 'images/gambar-ibu.png')
  alt: string;       // Deskripsi untuk accessibility
}
```

**Fitur:**
- ✅ Loading indicators
- ✅ Error handling dengan pesan user-friendly
- ✅ Optimasi gambar otomatis (Next.js Image)
- ✅ Custom video controls
- ✅ Mobile-friendly
- ✅ Accessibility compliant

### 2. ContentRenderer Component

**Lokasi:** `components/session/ContentRenderer.tsx`

Komponen untuk mem-parsing dan merender konten session.

**Props:**
```typescript
interface ContentRendererProps {
  sections: ContentSection[];
}
```

**Supported Section Types:**
- `heading` - Judul section
- `paragraph` - Paragraf teks
- `list` - Daftar bullet points
- `image` - Gambar edukatif
- `video` - Video tutorial

## Penggunaan

### Menambahkan Gambar ke Konten

```typescript
{
  type: 'image',
  content: 'Deskripsi gambar',
  media_url: 'images/gambar-ibu.png',
  alt: 'Ibu merawat anak dengan pneumonia'
}
```

### Menambahkan Video ke Konten

```typescript
{
  type: 'video',
  content: 'Deskripsi video',
  media_url: 'videos/video-suhu.mp4',
  alt: 'Tutorial mengukur suhu tubuh balita'
}
```

### Contoh Lengkap dalam Session Content

```typescript
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
      content: 'Pneumonia adalah infeksi yang menyebabkan peradangan...'
    },
    {
      type: 'image',
      content: 'Ilustrasi ibu dan anak',
      media_url: 'images/gambar-ibu.png',
      alt: 'Ibu merawat anak dengan pneumonia'
    },
    {
      type: 'video',
      content: 'Tutorial mengukur suhu',
      media_url: 'videos/video-suhu.mp4',
      alt: 'Video cara mengukur suhu tubuh balita'
    }
  ]
}
```

## Fitur

### Image Features

1. **Optimasi Otomatis**
   - WebP format dengan fallback
   - Lazy loading
   - Responsive images
   - Cache 30 hari

2. **Loading State**
   - Spinner animasi saat loading
   - Smooth transition saat loaded

3. **Error Handling**
   - Pesan error user-friendly
   - Instruksi untuk user

### Video Features

1. **Custom Controls**
   - Play/Pause button
   - Volume control dengan slider
   - Mute/Unmute button
   - Fullscreen button
   - Play button overlay saat paused

2. **Mobile Optimization**
   - `playsInline` untuk iOS
   - Touch-friendly controls
   - Simplified controls di mobile
   - Responsive button sizes

3. **Performance**
   - Preload metadata only
   - Lazy loading
   - Streaming dari Supabase CDN

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## Mobile Optimization

### Responsive Breakpoints

```css
/* Mobile First (375px+) */
- Base styles untuk mobile
- Touch-friendly buttons (44x44px minimum)
- Simplified video controls

/* Tablet (640px+) */
- Larger text
- Full video controls dengan volume slider
- Better spacing

/* Desktop (1024px+) */
- Maximum width 4xl
- Hover effects
- Enhanced controls
```

### Mobile-Specific Features

1. **Video Controls**
   - Simplified controls di mobile (< 640px)
   - Volume slider hidden, hanya mute button
   - Larger touch targets
   - `touch-manipulation` CSS untuk better touch response

2. **Images**
   - Responsive sizing
   - Optimized loading
   - Touch-friendly

3. **Layout**
   - Padding adjustment untuk mobile
   - Responsive text sizes
   - Proper spacing

## Testing

### Unit Tests

**Lokasi:** `__tests__/components/session/MediaEmbed.test.tsx`

**Test Coverage:**
- ✅ Image rendering
- ✅ Video rendering
- ✅ Loading states
- ✅ Error handling
- ✅ URL construction
- ✅ Mobile attributes (playsInline, preload)
- ✅ Video controls
- ✅ Accessibility

**Menjalankan Tests:**
```bash
# Run all tests
npm test

# Run media tests only
npm test -- __tests__/components/session/MediaEmbed.test.tsx

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Manual Testing Checklist

**Desktop:**
- [ ] Gambar load dengan benar
- [ ] Video playback berfungsi
- [ ] Volume control berfungsi
- [ ] Fullscreen berfungsi
- [ ] Loading indicators muncul
- [ ] Error messages muncul saat file tidak ada

**Mobile:**
- [ ] Gambar responsive
- [ ] Video playback inline (tidak fullscreen otomatis)
- [ ] Touch controls responsive
- [ ] Simplified controls muncul
- [ ] Play button overlay berfungsi
- [ ] Mute button berfungsi

**Accessibility:**
- [ ] Screen reader dapat membaca alt text
- [ ] Keyboard navigation berfungsi
- [ ] ARIA labels ada
- [ ] Focus indicators visible

## Troubleshooting

### Gambar Tidak Muncul

**Kemungkinan Penyebab:**
1. File belum diupload ke Supabase Storage
2. URL Supabase salah di environment variables
3. Bucket tidak public
4. Path file salah

**Solusi:**
```bash
# 1. Cek environment variables
cat .env.local | grep SUPABASE_URL

# 2. Cek file di Supabase Dashboard
# Storage > media-assets > images/

# 3. Test URL langsung di browser
https://your-project.supabase.co/storage/v1/object/public/media-assets/images/gambar-ibu.png

# 4. Cek console browser untuk error
```

### Video Tidak Bisa Diputar

**Kemungkinan Penyebab:**
1. Format video tidak supported
2. Codec tidak compatible
3. File size terlalu besar
4. Browser tidak support

**Solusi:**
```bash
# Konversi ke format compatible
ffmpeg -i input.mov -vcodec h264 -acodec aac -b:v 1M output.mp4

# Cek format video
ffprobe video.mp4

# Compress video
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1M -maxrate 1M -bufsize 2M output.mp4
```

### Loading Sangat Lambat

**Solusi:**
1. Compress images:
```bash
# Gunakan TinyPNG atau ImageOptim
# Target: < 500KB per image
```

2. Compress videos:
```bash
# Target: 1-2 Mbps bitrate
ffmpeg -i input.mp4 -b:v 1M output.mp4
```

3. Enable CDN caching di Supabase

### Video Tidak Inline di iOS

**Solusi:**
- Pastikan attribute `playsInline` ada di video element
- Sudah implemented di MediaEmbed component

### Controls Tidak Responsive di Mobile

**Solusi:**
- Pastikan `touch-manipulation` CSS ada
- Minimum touch target 44x44px
- Sudah implemented di MediaEmbed component

## Best Practices

### Untuk Developer

1. **Selalu gunakan MediaEmbed component**
   ```typescript
   // ✅ Good
   <MediaEmbed type="image" mediaUrl="images/test.png" alt="Test" />
   
   // ❌ Bad
   <img src="..." />
   ```

2. **Provide descriptive alt text**
   ```typescript
   // ✅ Good
   alt="Ibu merawat anak dengan pneumonia"
   
   // ❌ Bad
   alt="Image"
   ```

3. **Use correct media paths**
   ```typescript
   // ✅ Good
   media_url: 'images/gambar-ibu.png'
   
   // ❌ Bad
   media_url: '/images/gambar-ibu.png'
   media_url: 'gambar-ibu.png'
   ```

### Untuk Content Creator

1. **Image Guidelines**
   - Format: PNG atau JPEG
   - Size: < 500KB
   - Dimensions: 800x600px optimal
   - Compress sebelum upload

2. **Video Guidelines**
   - Format: MP4 (H.264 codec)
   - Bitrate: 1-2 Mbps
   - Resolution: 720p atau 1080p
   - Duration: < 5 menit per video
   - Size: < 50MB

3. **Naming Convention**
   - Lowercase
   - Hyphen-separated
   - Descriptive
   - Example: `video-mengukur-suhu.mp4`

## Referensi

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Web Video Best Practices](https://web.dev/fast/#optimize-your-videos)
- [Mobile Video Playback](https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari)
- [WCAG Media Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html)
