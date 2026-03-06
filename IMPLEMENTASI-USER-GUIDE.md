# 📚 Implementasi Interactive User Guide

## ✅ Status: Selesai Diimplementasikan

Interactive User Guide telah berhasil diimplementasikan menggunakan **Driver.js** untuk membantu ibu-ibu memahami alur pembelajaran saat pertama kali masuk dashboard.

---

## 🎯 Tujuan User Guide

Membantu pengguna memahami:
- ✅ Alur pembelajaran program
- ✅ Cara memulai program (Pre-Test)
- ✅ Cara melihat progress
- ✅ Kapan melakukan test
- ✅ Cara menggunakan chatbot bantuan

---

## 📦 Package yang Digunakan

### Driver.js
**Kenapa Driver.js?**
- ✅ Ringan dan cepat
- ✅ Mudah diintegrasikan dengan Next.js
- ✅ Tooltip modern dan clean
- ✅ Highlight element yang smooth
- ✅ UX yang sesuai dengan desain minimalis aplikasi

**Instalasi:**
```bash
npm install driver.js
```

---

## 🎨 File yang Dibuat/Dimodifikasi

### 1. **lib/userGuide.ts** (Baru)
Logic utama untuk user guide:
- `startUserGuide()` - Memulai interactive guide
- `shouldShowGuide()` - Cek apakah user sudah pernah lihat guide
- `resetGuide()` - Reset guide (untuk testing)

### 2. **styles/driver-custom.css** (Baru)
Custom styling untuk Driver.js agar sesuai dengan tema aplikasi:
- Warna: `#2F5D50` (hijau utama)
- Border radius: `12px` (rounded)
- Shadow: Soft shadow sesuai desain

### 3. **components/dashboard/UserGuideButton.tsx** (Baru)
Tombol untuk melihat panduan lagi (bisa ditambahkan di profile/settings)

### 4. **app/(user)/dashboard/page.tsx** (Dimodifikasi)
- Import user guide functions
- Tambah ID pada elemen-elemen penting
- Trigger guide saat first-time user

### 5. **components/chat/GeminiChatBot.tsx** (Dimodifikasi)
- Tambah ID `chatbot` pada floating button

---

## 🎬 Alur User Guide (7 Steps)

### Step 1: Welcome
**Highlight:** Greeting Card  
**Pesan:**
> Selamat datang di Program Edukasi Pneumonia Balita. Program ini akan membantu Anda memahami cara mengenali, mencegah, dan menangani pneumonia pada balita. Mari kita mulai perjalanan belajar Anda.

### Step 2: Progress Program
**Highlight:** Overview Cards  
**Pesan:**
> Di bagian ini Anda dapat melihat progress pembelajaran Anda. Progress akan meningkat setiap kali Anda menyelesaikan sesi belajar dan test.

### Step 3: Alur Pembelajaran
**Highlight:** Progress Card  
**Pesan:**
> Ini adalah alur pembelajaran Anda. Anda akan melalui Pre-Test, 5 sesi pembelajaran, dan Post-Test. Setiap tahap akan terbuka secara bertahap.

### Step 4: Mulai Pre-Test
**Highlight:** Button Mulai Pre-Test  
**Pesan:**
> Langkah pertama adalah mengerjakan Pre-Test. Pre-Test bertujuan untuk mengetahui seberapa jauh pengetahuan awal Anda tentang pneumonia balita. Anda harus menyelesaikan Pre-Test sebelum membuka sesi belajar.

### Step 5: Sesi Bertahap
**Highlight:** Session Unlock Indicator  
**Pesan:**
> Sesi pembelajaran akan terbuka secara bertahap. Hal ini bertujuan agar Anda dapat memahami materi secara lebih efektif dan tidak terburu-buru.

### Step 6: Chatbot Bantuan
**Highlight:** Gemini Chatbot Button  
**Pesan:**
> Jika Anda memiliki pertanyaan tentang pneumonia balita, Anda dapat bertanya langsung kepada chatbot di sini. Chatbot siap membantu Anda 24/7.

---

## 🔧 Cara Kerja

### 1. First-Time User Detection
```typescript
// Cek localStorage
if (!localStorage.getItem('guide_seen')) {
  startUserGuide()
}
```

### 2. Auto-Trigger di Dashboard
```typescript
useEffect(() => {
  if (!loading && profile && progress && shouldShowGuide()) {
    // Delay 800ms agar UI ter-render sempurna
    const timer = setTimeout(() => {
      startUserGuide()
    }, 800)
    return () => clearTimeout(timer)
  }
}, [loading, profile, progress])
```

### 3. Simpan Status "Sudah Lihat"
```typescript
onDestroyStarted: () => {
  localStorage.setItem('guide_seen', 'true')
  driverObj.destroy()
}
```

---

## 🎨 Customization

### Warna & Styling
Semua styling ada di `styles/driver-custom.css`:
- Primary color: `#2F5D50`
- Background: `white`
- Border radius: `12px`
- Shadow: `0 10px 40px rgba(47, 93, 80, 0.15)`

### Teks Button
```typescript
nextBtnText: 'Lanjut',
prevBtnText: 'Kembali',
doneBtnText: 'Selesai',
progressText: '{{current}} dari {{total}}'
```

---

## 🧪 Testing

### 1. Test First-Time User
```typescript
// Di browser console
localStorage.removeItem('guide_seen')
// Refresh halaman
```

### 2. Test Manual Trigger
```typescript
import { startUserGuide } from '@/lib/userGuide'

// Panggil function
startUserGuide()
```

### 3. Reset Guide
```typescript
import { resetGuide } from '@/lib/userGuide'

resetGuide()
```

---

## 📱 Responsive Design

User guide sudah responsive untuk:
- ✅ Desktop (1280px+)
- ✅ Tablet (768px - 1279px)
- ✅ Mobile (< 768px)

Driver.js otomatis menyesuaikan posisi popover berdasarkan ukuran layar.

---

## 🚀 Cara Menambahkan Step Baru

Edit file `lib/userGuide.ts`:

```typescript
steps: [
  // ... existing steps
  {
    element: '#new-element-id',
    popover: {
      title: 'Judul Step',
      description: 'Deskripsi step',
      side: "bottom", // top, bottom, left, right
      align: 'start' // start, center, end
    }
  }
]
```

Jangan lupa tambahkan ID di element:
```tsx
<div id="new-element-id">
  {/* Your content */}
</div>
```

---

## 💡 Fitur Tambahan yang Bisa Ditambahkan

### 1. Learning Path Visual (Seperti Duolingo)
```
Pretest
   ↓
Session 1
   ↓
Session 2
   ↓
Session 3
   ↓
Session 4
   ↓
Session 5
   ↓
Post Test
```

### 2. Badge Rewards
- 🏅 Session 1 Completed
- 📚 Learning Streak
- 🧠 Knowledge Booster

### 3. Progress Celebration
Ketika selesai session:
```
🎉 Hebat! Anda menyelesaikan Session 1
```

### 4. Tombol "Lihat Panduan Lagi"
Sudah dibuat di `components/dashboard/UserGuideButton.tsx`

Cara pakai:
```tsx
import { UserGuideButton } from '@/components/dashboard/UserGuideButton'

<UserGuideButton />
```

---

## 📊 Metrics yang Bisa Ditrack

1. **Guide Completion Rate**
   - Berapa % user yang menyelesaikan guide
   
2. **Skip Rate**
   - Berapa % user yang skip guide
   
3. **Re-watch Rate**
   - Berapa kali user melihat guide lagi

---

## 🐛 Troubleshooting

### Guide tidak muncul?
1. Cek localStorage: `localStorage.getItem('guide_seen')`
2. Clear localStorage: `localStorage.removeItem('guide_seen')`
3. Refresh halaman

### Element tidak ter-highlight?
1. Pastikan ID element sudah benar
2. Pastikan element sudah ter-render (tidak hidden)
3. Cek console untuk error

### Styling tidak sesuai?
1. Pastikan import CSS: `import '@/styles/driver-custom.css'`
2. Cek order CSS import (custom CSS harus setelah driver.css)

---

## 📝 Notes

- User guide hanya muncul sekali saat first-time login
- User bisa melihat lagi dengan klik tombol "Lihat Panduan Lagi"
- Guide otomatis skip jika element tidak ditemukan
- Delay 800ms untuk memastikan UI ter-render sempurna

---

## ✨ Hasil Akhir

User guide yang:
- ✅ Clean dan minimalis
- ✅ Mudah dipahami
- ✅ Sesuai dengan tema aplikasi
- ✅ Responsive di semua device
- ✅ Tidak mengganggu UX
- ✅ Membantu first-time user

---

**Dibuat:** 7 Maret 2026  
**Status:** Production Ready ✅
