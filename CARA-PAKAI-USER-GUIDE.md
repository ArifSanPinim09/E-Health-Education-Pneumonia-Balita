# 🎯 Cara Pakai Interactive User Guide

## Untuk Developer

### 1. Testing User Guide

#### Reset Guide (Lihat Lagi)
Buka browser console dan jalankan:
```javascript
localStorage.removeItem('guide_seen')
```
Lalu refresh halaman.

#### Manual Trigger
Tambahkan button di mana saja:
```tsx
import { startUserGuide } from '@/lib/userGuide'

<button onClick={() => startUserGuide()}>
  Lihat Panduan
</button>
```

Atau gunakan komponen yang sudah dibuat:
```tsx
import { UserGuideButton } from '@/components/dashboard/UserGuideButton'

<UserGuideButton />
```

---

### 2. Menambah Step Baru

Edit `lib/userGuide.ts`:

```typescript
steps: [
  // ... existing steps
  {
    element: '#element-id-baru',
    popover: {
      title: 'Judul Step',
      description: 'Penjelasan step ini',
      side: "bottom", // top, bottom, left, right
      align: 'start'  // start, center, end
    }
  }
]
```

Tambahkan ID di element yang ingin di-highlight:
```tsx
<div id="element-id-baru">
  {/* Content */}
</div>
```

---

### 3. Customize Styling

Edit `styles/driver-custom.css`:

```css
/* Ubah warna primary */
.driver-popover-next-btn {
  background: #2F5D50; /* Ganti dengan warna lain */
}

/* Ubah border radius */
.driver-popover {
  border-radius: 12px; /* Ganti sesuai keinginan */
}
```

---

### 4. Ubah Teks Button

Edit `lib/userGuide.ts`:

```typescript
const driverObj = driver({
  nextBtnText: 'Lanjut',      // Ubah teks button next
  prevBtnText: 'Kembali',     // Ubah teks button previous
  doneBtnText: 'Selesai',     // Ubah teks button done
  progressText: '{{current}} dari {{total}}' // Format progress
})
```

---

## Untuk User (Ibu-ibu)

### Kapan User Guide Muncul?
User guide akan muncul otomatis saat:
- ✅ Pertama kali masuk dashboard setelah login
- ✅ Belum pernah melihat panduan sebelumnya

### Cara Melihat Panduan Lagi
1. Klik tombol "Lihat Panduan Lagi" (jika sudah ditambahkan di profile/settings)
2. Atau minta developer untuk reset guide

### Navigasi User Guide
- **Lanjut** → Ke step berikutnya
- **Kembali** → Ke step sebelumnya
- **X (Close)** → Tutup panduan
- **Selesai** → Selesai dan tutup panduan

---

## FAQ

### Q: User guide tidak muncul?
**A:** Kemungkinan sudah pernah dilihat. Reset dengan:
```javascript
localStorage.removeItem('guide_seen')
```

### Q: Bagaimana cara skip guide?
**A:** Klik tombol X di pojok kanan atas popover.

### Q: Apakah guide bisa dilihat lagi?
**A:** Ya, dengan klik tombol "Lihat Panduan Lagi" atau reset localStorage.

### Q: Guide muncul terus setiap refresh?
**A:** Tidak, guide hanya muncul sekali. Jika muncul terus, berarti localStorage tidak tersimpan (mungkin browser mode incognito).

### Q: Bagaimana cara disable guide?
**A:** Hapus atau comment code ini di `app/(user)/dashboard/page.tsx`:
```typescript
// useEffect(() => {
//   if (!loading && profile && progress && shouldShowGuide()) {
//     const timer = setTimeout(() => {
//       startUserGuide()
//     }, 800)
//     return () => clearTimeout(timer)
//   }
// }, [loading, profile, progress])
```

---

## Tips & Best Practices

### 1. Jangan Terlalu Banyak Step
- Ideal: 5-7 steps
- Maksimal: 10 steps
- Terlalu banyak step akan membuat user bosan

### 2. Gunakan Bahasa yang Sederhana
- ✅ "Klik tombol ini untuk mulai"
- ❌ "Inisiasi proses pembelajaran dengan mengklik tombol aksi"

### 3. Highlight Element yang Penting
- ✅ Button utama (Pre-Test, Post-Test)
- ✅ Progress indicator
- ✅ Chatbot
- ❌ Footer, copyright, dll

### 4. Test di Berbagai Device
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

### 5. Delay yang Cukup
```typescript
setTimeout(() => {
  startUserGuide()
}, 800) // 800ms cukup untuk render UI
```

---

## Contoh Implementasi di Page Lain

### Di Profile Page
```tsx
import { UserGuideButton } from '@/components/dashboard/UserGuideButton'

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      
      {/* Tambahkan button */}
      <UserGuideButton />
    </div>
  )
}
```

### Di Settings Page
```tsx
import { startUserGuide, resetGuide } from '@/lib/userGuide'

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      
      <button onClick={() => startUserGuide()}>
        Lihat Panduan Dashboard
      </button>
      
      <button onClick={() => resetGuide()}>
        Reset Panduan (untuk testing)
      </button>
    </div>
  )
}
```

---

## Monitoring & Analytics

Jika ingin track user behavior, tambahkan analytics:

```typescript
const driverObj = driver({
  // ... config
  onNextClick: () => {
    // Track: user klik next
    console.log('User clicked next')
  },
  onPrevClick: () => {
    // Track: user klik previous
    console.log('User clicked previous')
  },
  onCloseClick: () => {
    // Track: user close guide
    console.log('User closed guide')
  },
  onDestroyStarted: () => {
    // Track: guide selesai
    console.log('Guide completed')
    localStorage.setItem('guide_seen', 'true')
  }
})
```

---

**Happy Coding! 🚀**
