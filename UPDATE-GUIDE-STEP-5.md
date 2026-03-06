# 📝 Update: Guide Step 5 - Sesi Pembelajaran

## ✅ Perubahan

Guide step ke-5 sekarang mengarah ke **Progress Card** yang menampilkan list lengkap alur pembelajaran (Pre-Test, Session 1-5, Post-Test).

---

## �� Alasan Perubahan

**Before:**
- Step 5 mengarah ke `#session-cards` (completed sessions list)
- Hanya muncul jika ada session yang sudah selesai
- Tidak cocok untuk first-time user

**After:**
- Step 5 mengarah ke `#progress-card` (progress overview)
- Menampilkan semua tahapan pembelajaran
- Cocok untuk first-time user yang belum mulai

---

## 📚 Guide Steps (Updated)

### Step 1: Welcome
**Element:** `#greeting-card`
**Title:** 👋 Selamat Datang
**Description:** Selamat datang di Program Edukasi Pneumonia Balita...

### Step 2: Progress Program
**Element:** `#overview-cards`
**Title:** 📊 Progress Program
**Description:** Di bagian ini Anda dapat melihat progress pembelajaran...

### Step 3: Alur Pembelajaran
**Element:** `#progress-card`
**Title:** 🎯 Alur Pembelajaran
**Description:** Ini adalah alur pembelajaran Anda. Pre-Test → 5 Sesi → Post-Test...

### Step 4: Mulai Pre-Test
**Element:** `#pretest-button`
**Title:** 📝 Mulai Pre-Test
**Description:** Langkah pertama adalah mengerjakan Pre-Test...

### Step 5: Sesi Pembelajaran Bertahap ⭐ (UPDATED)
**Element:** `#progress-card`
**Title:** 📚 Sesi Pembelajaran Bertahap
**Description:** Setelah Pre-Test, Anda akan belajar melalui 5 sesi. Setiap sesi berisi materi penting tentang pneumonia balita. Sesi akan terbuka secara bertahap agar Anda dapat memahami materi dengan lebih efektif.

### Step 6: Chatbot Bantuan
**Element:** `#chatbot`
**Title:** 💬 Chatbot Bantuan
**Description:** Jika Anda memiliki pertanyaan tentang pneumonia balita...

---

## 🎨 Visual Flow

```
Step 3: Progress Card (Overview)
        ↓
Step 4: Pre-Test Button
        ↓
Step 5: Progress Card (Detail Session List) ⭐
        ↓
Step 6: Chatbot
```

**Step 5 sekarang fokus ke list session di progress card:**
- ✅ Pre-Test
- ✅ Session 1
- ✅ Session 2
- ✅ Session 3
- ✅ Session 4
- ✅ Session 5
- ✅ Post-Test

---

## ✨ Benefits

1. **Lebih Jelas:** User melihat semua tahapan pembelajaran
2. **Konsisten:** Menggunakan progress card yang sama (step 3 & 5)
3. **Informative:** Menjelaskan sistem unlock bertahap
4. **First-Time Friendly:** Cocok untuk user yang belum mulai

---

## 🔧 Technical Changes

**File:** `lib/userGuide.ts`

```typescript
// Step 5 - Updated
{
  element: '#progress-card',
  popover: {
    title: '📚 Sesi Pembelajaran Bertahap',
    description: 'Setelah Pre-Test, Anda akan belajar melalui 5 sesi. Setiap sesi berisi materi penting tentang pneumonia balita. Sesi akan terbuka secara bertahap agar Anda dapat memahami materi dengan lebih efektif.',
    side: "left",
    align: 'start'
  }
}
```

**Removed dependency on:** `#session-cards` (yang hanya muncul jika ada completed sessions)

---

## ✅ Status

- Build: Success ✅
- No Errors: ✅
- Tested: ✅
- Production Ready: ✅

---

**Update Date:** 7 Maret 2026  
**Version:** 1.1.1
