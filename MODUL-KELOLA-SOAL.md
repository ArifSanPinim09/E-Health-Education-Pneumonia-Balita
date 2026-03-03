# Modul Kelola Soal - E-Health Pneumonia Balita

## 📋 Deskripsi

Modul Kelola Soal adalah fitur admin yang lengkap dan profesional untuk mengelola pertanyaan kuis pre-test dan post-test. Modul ini menyediakan antarmuka yang intuitif dan modern untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada pertanyaan kuis.

## ✨ Fitur Utama

### 1. Dashboard Statistik
- **Total Pertanyaan**: Menampilkan jumlah total pertanyaan yang tersedia
- **Jawaban Benar**: Menghitung pertanyaan dengan jawaban "Benar"
- **Jawaban Salah**: Menghitung pertanyaan dengan jawaban "Salah"
- Visualisasi dengan card yang menarik dan icon yang jelas

### 2. Pencarian dan Filter
- **Pencarian Real-time**: Cari pertanyaan berdasarkan teks
- **Filter Jawaban**: Filter berdasarkan jawaban (Semua/Benar/Salah)
- Hasil filter langsung terlihat tanpa reload halaman

### 3. Tambah Pertanyaan
- Form yang lengkap dengan validasi
- Field yang tersedia:
  - **Pertanyaan**: Textarea untuk teks pertanyaan
  - **Jawaban Benar**: Dropdown (Benar/Salah)
  - **Nomor Urut**: Input number untuk menentukan urutan
- Validasi otomatis untuk mencegah duplikasi nomor urut
- Feedback visual saat berhasil/gagal

### 4. Edit Pertanyaan
- Edit inline dengan form yang sama
- Pre-fill data pertanyaan yang akan diedit
- Validasi untuk mencegah konflik nomor urut
- Tombol batal untuk membatalkan edit

### 5. Hapus Pertanyaan
- Modal konfirmasi sebelum menghapus
- Peringatan bahwa tindakan tidak dapat dibatalkan
- Feedback visual saat berhasil dihapus

### 6. Tampilan Daftar Pertanyaan
- Card design yang modern dan clean
- Badge untuk menunjukkan jawaban (Benar/Salah)
- Nomor urut dengan badge bulat berwarna
- Tombol aksi (Edit/Hapus) yang jelas
- Animasi smooth saat menambah/menghapus pertanyaan

## 🎨 Desain UI/UX

### Warna dan Tema
- **Primary**: Blue (#2563EB) - untuk tombol utama dan highlight
- **Success**: Green (#10B981) - untuk jawaban benar
- **Danger**: Red (#EF4444) - untuk jawaban salah dan hapus
- **Background**: Gradient dari blue-50 ke green-50

### Animasi
- Fade in/out untuk alert messages
- Slide animation untuk form create/edit
- Smooth transition untuk hover effects
- Loading spinner yang konsisten

### Responsiveness
- Mobile-first design
- Sidebar collapsible di mobile
- Grid layout yang adaptif
- Touch-friendly button sizes

## 🔧 Struktur File

```
app/(admin)/admin/questions/
└── page.tsx                          # Halaman utama kelola soal

components/admin/
└── QuestionManager.tsx               # Komponen utama management

app/api/admin/questions/
├── route.ts                          # GET & POST endpoints
└── [id]/
    └── route.ts                      # PUT & DELETE endpoints
```

## 📡 API Endpoints

### GET /api/admin/questions
Mengambil semua pertanyaan kuis yang diurutkan berdasarkan nomor urut.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_text": "Pertanyaan...",
      "correct_answer": true,
      "order_number": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/admin/questions
Membuat pertanyaan baru.

**Request Body:**
```json
{
  "question_text": "Pertanyaan baru...",
  "correct_answer": true,
  "order_number": 24
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_text": "Pertanyaan baru...",
    "correct_answer": true,
    "order_number": 24
  }
}
```

### PUT /api/admin/questions/[id]
Memperbarui pertanyaan yang ada.

**Request Body:**
```json
{
  "question_text": "Pertanyaan yang diupdate...",
  "correct_answer": false,
  "order_number": 24
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "question_text": "Pertanyaan yang diupdate...",
    "correct_answer": false,
    "order_number": 24
  }
}
```

### DELETE /api/admin/questions/[id]
Menghapus pertanyaan.

**Response:**
```json
{
  "success": true,
  "message": "Pertanyaan berhasil dihapus"
}
```

## 🔐 Keamanan

### Autentikasi
- Semua endpoint dilindungi dengan admin token verification
- Token disimpan di cookie dengan httpOnly flag
- Automatic redirect ke login jika token tidak valid

### Validasi
- Server-side validation untuk semua input
- Type checking untuk boolean values
- Unique constraint untuk nomor urut
- XSS protection dengan proper escaping

### Authorization
- Hanya admin yang dapat mengakses endpoint
- Token type verification (admin vs user)
- Service role client untuk bypass RLS

## 📊 Database Schema

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  order_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_order ON quiz_questions(order_number);
```

## 🚀 Cara Menggunakan

### Akses Modul
1. Login sebagai admin di `/admin-login`
2. Klik menu "Kelola Soal" di sidebar
3. Atau akses langsung ke `/admin/questions`

### Menambah Pertanyaan
1. Klik tombol "Tambah Pertanyaan"
2. Isi form:
   - Ketik pertanyaan di textarea
   - Pilih jawaban benar (Benar/Salah)
   - Tentukan nomor urut
3. Klik "Tambah Pertanyaan"
4. Pertanyaan akan muncul di daftar

### Mengedit Pertanyaan
1. Klik tombol "Edit" (icon pensil) pada pertanyaan
2. Form edit akan muncul dengan data pre-filled
3. Ubah data yang diperlukan
4. Klik "Simpan Perubahan"
5. Atau klik "Batal" untuk membatalkan

### Menghapus Pertanyaan
1. Klik tombol "Hapus" (icon tempat sampah) pada pertanyaan
2. Modal konfirmasi akan muncul
3. Klik "Hapus Pertanyaan" untuk konfirmasi
4. Atau klik "Batal" untuk membatalkan

### Mencari Pertanyaan
1. Ketik kata kunci di search box
2. Hasil akan difilter secara real-time
3. Gunakan dropdown filter untuk filter berdasarkan jawaban

## 💡 Tips Penggunaan

### Best Practices
1. **Nomor Urut**: Gunakan nomor urut yang berurutan (1, 2, 3, ...) untuk kemudahan
2. **Pertanyaan Jelas**: Tulis pertanyaan yang jelas dan mudah dipahami
3. **Review**: Selalu review pertanyaan sebelum menyimpan
4. **Backup**: Lakukan export data secara berkala

### Troubleshooting
- **Nomor urut sudah digunakan**: Pilih nomor urut yang berbeda
- **Gagal menyimpan**: Periksa koneksi internet dan coba lagi
- **Data tidak muncul**: Refresh halaman atau logout dan login kembali

## 🎯 Fitur Mendatang (Roadmap)

- [ ] Bulk import pertanyaan dari Excel
- [ ] Bulk delete dengan checkbox
- [ ] Drag & drop untuk reorder pertanyaan
- [ ] Preview pertanyaan sebelum menyimpan
- [ ] History perubahan pertanyaan
- [ ] Kategori pertanyaan
- [ ] Tingkat kesulitan pertanyaan
- [ ] Media attachment (gambar/video) untuk pertanyaan

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ CRUD operations lengkap
- ✅ Search dan filter
- ✅ Statistik dashboard
- ✅ Responsive design
- ✅ Animasi smooth
- ✅ Error handling
- ✅ Success notifications
- ✅ Modal konfirmasi hapus
- ✅ Cookie-based authentication
- ✅ Admin client dengan service role

## 🤝 Kontribusi

Modul ini dikembangkan sebagai bagian dari sistem E-Health Education Pneumonia Balita. Untuk pertanyaan atau saran perbaikan, silakan hubungi tim development.

---

**Dibuat dengan ❤️ untuk meningkatkan pengetahuan ibu tentang pneumonia balita**
