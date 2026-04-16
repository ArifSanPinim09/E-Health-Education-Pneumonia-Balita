# Quick Setup: Auto Unlock di Vercel

## 🚀 Langkah Cepat (5 Menit)

### 1️⃣ Buka Vercel Dashboard

1. Buka: https://vercel.com/dashboard
2. Login dengan akun Anda
3. Pilih project: **e-health-education-pneumonia-balita**

### 2️⃣ Tambah Environment Variable

1. Klik tab **Settings** (di atas)
2. Klik **Environment Variables** (sidebar kiri)
3. Klik tombol **Add New** (kanan atas)

4. Isi form:
   ```
   Name: AUTO_UNLOCK_ALL_SESSIONS
   Value: true
   ```

5. Centang semua environment:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. Klik **Save**

### 3️⃣ Redeploy Project

**Cara 1: Via Dashboard (Termudah)**
1. Klik tab **Deployments**
2. Cari deployment terakhir (paling atas)
3. Klik titik tiga (...) di sebelah kanan
4. Klik **Redeploy**
5. Tunggu sampai selesai (biasanya 1-2 menit)

**Cara 2: Via Git Push**
```bash
# Buat perubahan kecil (misalnya update README)
git commit --allow-empty -m "Trigger redeploy for env var"
git push
```

### 4️⃣ Verifikasi

1. Buka aplikasi Anda di browser
2. Daftar dengan email baru (atau gunakan incognito)
3. Selesaikan pre-test
4. Cek apakah Day 1-5 langsung unlock ✅

---

## 🔄 Untuk Kembali ke Normal (Setelah FGD)

### 1️⃣ Edit Environment Variable

1. Buka Vercel Dashboard → Project Anda
2. **Settings** → **Environment Variables**
3. Cari `AUTO_UNLOCK_ALL_SESSIONS`
4. Klik **Edit** (icon pensil)
5. Ubah value menjadi: `false`
6. Klik **Save**

### 2️⃣ Redeploy

Sama seperti langkah 3 di atas (Redeploy via Dashboard atau Git Push)

---

## 📊 Cek Status Saat Ini

### Via Vercel Dashboard:
1. **Settings** → **Environment Variables**
2. Cari `AUTO_UNLOCK_ALL_SESSIONS`
3. Lihat valuenya:
   - `true` = Auto unlock AKTIF (untuk FGD)
   - `false` = Flow normal (unlock per hari)

### Via Application:
1. **Deployments** → Pilih deployment terakhir
2. Klik **View Function Logs**
3. Saat ada user submit pre-test, lihat log:
   - `🔓 AUTO_UNLOCK_ALL_SESSIONS enabled` = AKTIF
   - `🔒 AUTO_UNLOCK_ALL_SESSIONS disabled` = NONAKTIF

---

## ⚠️ Catatan Penting

- ✅ Setelah save environment variable, HARUS redeploy
- ✅ Perubahan butuh 1-2 menit untuk berlaku
- ✅ User baru yang daftar SETELAH redeploy yang terpengaruh
- ✅ User lama tidak terpengaruh (gunakan script unlock manual)

---

## 🆘 Butuh Bantuan?

Lihat dokumentasi lengkap: `PANDUAN-VERCEL-AUTO-UNLOCK.md`
