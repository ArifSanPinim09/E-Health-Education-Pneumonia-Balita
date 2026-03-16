# ✅ Fitur Quiz Interaktif - Latihan Hitung Napas

## Status: SELESAI

Fitur quiz interaktif telah ditambahkan untuk Sesi 4 (Praktik Mandiri).

---

## 🎯 Fitur Baru

### Quiz Input Component
Komponen interaktif yang memungkinkan ibu untuk:
1. Menonton video latihan
2. Menginput jawaban (angka)
3. Mendapatkan feedback langsung (benar/salah)
4. Mencoba lagi jika jawaban salah

---

## 📝 Cara Kerja

### Flow Pengguna:

1. **Tonton Video**
   - Ibu menonton video latihan menghitung frekuensi napas
   - Video menampilkan anak yang sedang bernapas

2. **Input Jawaban**
   - Pertanyaan muncul di bawah video: "Berapa frekuensi napas anak dalam 1 menit?"
   - Ibu menginput angka (contoh: 65)
   - Klik tombol "Periksa Jawaban"

3. **Feedback Otomatis**
   - **Jika Benar (65):**
     - ✅ Tampil pesan: "Jawaban Benar!"
     - Feedback: "Benar! Frekuensi napas anak adalah 65x/menit. Ini menunjukkan napas cepat yang merupakan tanda pneumonia."
     - Tampil jawaban yang benar
   
   - **Jika Salah (bukan 65):**
     - ❌ Tampil pesan: "Jawaban Kurang Tepat"
     - Feedback: "Jawaban kurang tepat. Coba hitung kembali dengan lebih teliti. Perhatikan setiap gerakan naik-turun dada anak."
     - Tampil jawaban yang diinput ibu
     - Tombol "Coba Lagi" untuk reset

---

## 🎨 Tampilan UI

### Input Form:
```
┌─────────────────────────────────────────┐
│ 📋 Pertanyaan Latihan                   │
│                                         │
│ Berapa frekuensi napas anak dalam      │
│ 1 menit?                                │
│                                         │
│ ┌──────────────────┐  ┌──────────────┐ │
│ │ [Input] x/menit  │  │ Periksa      │ │
│ └──────────────────┘  │ Jawaban      │ │
│                       └──────────────┘ │
└─────────────────────────────────────────┘
```

### Feedback Benar:
```
┌─────────────────────────────────────────┐
│ ✅ Jawaban Benar!                       │
│                                         │
│ Benar! Frekuensi napas anak adalah     │
│ 65x/menit. Ini menunjukkan napas cepat │
│ yang merupakan tanda pneumonia.        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Jawaban Benar: 65 x/menit           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Feedback Salah:
```
┌─────────────────────────────────────────┐
│ ❌ Jawaban Kurang Tepat                 │
│                                         │
│ Jawaban kurang tepat. Coba hitung      │
│ kembali dengan lebih teliti.           │
│                                         │
│ Jawaban Anda: 60 x/menit               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │        Coba Lagi                    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 💻 Implementasi Teknis

### 1. Interface Baru di session-content.ts:
```typescript
export interface ContentSection {
  type: 'quiz';
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
```

### 2. Komponen QuizInput.tsx:
- State management untuk jawaban user
- Validasi jawaban
- Animasi feedback dengan Framer Motion
- Responsive design (mobile & desktop)

### 3. Update di Sesi 4:
```typescript
{
  type: 'quiz',
  content: 'Latihan Menghitung Frekuensi Napas',
  quizData: {
    question: 'Berapa frekuensi napas anak dalam 1 menit?',
    correctAnswer: 65,
    unit: 'x/menit',
    feedback: {
      correct: 'Benar! Frekuensi napas anak adalah 65x/menit...',
      incorrect: 'Jawaban kurang tepat. Coba hitung kembali...'
    }
  }
}
```

---

## ✨ Fitur Komponen:

1. **Input Validation**
   - Hanya menerima angka
   - Min: 0, Max: 200
   - Required field

2. **Feedback Visual**
   - Warna hijau untuk jawaban benar
   - Warna merah untuk jawaban salah
   - Icon yang sesuai (✅ atau ❌)

3. **Animasi Smooth**
   - Fade in/out
   - Scale animation
   - Smooth transitions

4. **Responsive Design**
   - Mobile-friendly
   - Flexbox layout
   - Touch-friendly buttons

5. **User Experience**
   - Clear instructions
   - Helpful feedback
   - Option to retry
   - Shows user's answer when wrong

---

## 🎓 Manfaat Edukatif:

1. **Active Learning**
   - Ibu aktif berpartisipasi
   - Bukan hanya menonton

2. **Immediate Feedback**
   - Tahu langsung benar/salah
   - Penjelasan yang jelas

3. **Reinforcement**
   - Bisa mencoba lagi jika salah
   - Belajar dari kesalahan

4. **Practical Skill**
   - Melatih kemampuan menghitung napas
   - Skill yang bisa diterapkan langsung

---

## 📊 Validasi:

- ✅ TypeScript: No errors
- ✅ Component renders correctly
- ✅ Input validation works
- ✅ Feedback displays properly
- ✅ Retry functionality works
- ✅ Responsive on all devices

---

Fitur quiz interaktif membuat pembelajaran lebih engaging dan efektif! 🎉
