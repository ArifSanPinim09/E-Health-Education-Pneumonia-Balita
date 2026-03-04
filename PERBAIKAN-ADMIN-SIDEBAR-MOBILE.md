# Perbaikan Sidebar Admin di Mobile

## Masalah
Pada tampilan mobile, ketika tombol hamburger diklik:
- Layar menjadi hitam (overlay muncul)
- Ketika overlay hitam diklik, sidebar muncul sebentar lalu hilang
- Perilaku tidak konsisten dan membingungkan pengguna

## Penyebab
1. **Overlay duplikat**: Ada dua overlay yang dibuat di tempat berbeda
   - Satu di `AdminSidebar.tsx` (z-index: 30)
   - Satu lagi di setiap halaman admin (z-index: 40)
2. **Konflik z-index**: Overlay dan sidebar memiliki z-index yang tidak konsisten
3. **Urutan render**: Overlay di halaman muncul sebelum sidebar, menyebabkan sidebar tertutup

## Solusi yang Diterapkan

### 1. Menghapus Overlay Duplikat
- Menghapus overlay dari semua halaman admin (dashboard, respondents, questions)
- Menyimpan hanya satu overlay di `AdminSidebar.tsx`

### 2. Memperbaiki Z-Index Hierarchy
```
z-40: Overlay (background hitam)
z-50: Sidebar & Tombol hamburger
```

### 3. Menambahkan Tombol Close di Sidebar
- Tombol X di pojok kanan atas sidebar (hanya tampil di mobile)
- Memudahkan pengguna menutup sidebar tanpa harus klik overlay

### 4. Auto-close Setelah Navigasi
- Sidebar otomatis tertutup setelah user klik menu item
- Meningkatkan UX di perangkat mobile

## File yang Diubah

1. **components/admin/AdminSidebar.tsx**
   - Memindahkan overlay ke atas sidebar
   - Mengubah z-index sidebar dari 40 ke 50
   - Menambahkan tombol close
   - Menambahkan onClick handler pada menu items

2. **app/(admin)/admin/dashboard/page.tsx**
   - Menghapus overlay duplikat
   - Mengubah z-index tombol hamburger dari 30 ke 50

3. **app/(admin)/admin/respondents/page.tsx**
   - Menghapus overlay duplikat
   - Mengubah z-index tombol hamburger dari 30 ke 50

4. **app/(admin)/admin/questions/page.tsx**
   - Menghapus overlay duplikat
   - Mengubah z-index tombol hamburger ke 50

## Hasil
✅ Sidebar berfungsi dengan baik di mobile
✅ Overlay muncul dengan benar di belakang sidebar
✅ Klik overlay menutup sidebar dengan smooth
✅ Tombol close memberikan opsi alternatif untuk menutup
✅ Navigasi lebih intuitif dan responsif
