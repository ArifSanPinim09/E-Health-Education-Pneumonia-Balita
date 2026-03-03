# Panduan Testing Tanpa Menunggu 24 Jam

## Masalah
Untuk testing end-to-end flow, Anda harus menunggu 24 jam antara setiap session. Ini tidak praktis untuk development/testing.

## Solusi
Saya sudah membuat 2 script untuk membantu testing:

### 1. Unlock All Sessions (Bypass Waktu Tunggu)
Script ini akan unlock semua sessions (Day 1-5) sekaligus tanpa perlu menunggu 24 jam.

### 2. Reset User Progress (Test Ulang dari Awal)
Script ini akan menghapus semua progress user sehingga bisa test ulang dari pre-test.

---

## Script 1: Unlock All Sessions

### Kapan Digunakan
- Anda sudah selesai pre-test
- Ingin langsung akses semua sessions tanpa menunggu
- Ingin test sampai post-test dengan cepat

### Cara Menggunakan

```bash
npx tsx scripts/unlock-all-sessions-testing.ts <email_user>
```

**Contoh:**
```bash
npx tsx scripts/unlock-all-sessions-testing.ts projectakhirsatu@gmail.com
```

### Output yang Diharapkan
```
🔍 Mencari user dengan email: projectakhirsatu@gmail.com
✅ User ditemukan: 85ebc689-ddc2-4737-b37d-363aec55f229
✅ Pre-test sudah selesai dengan score: 18

📊 Status sessions saat ini:
  Day 1: ✅ Completed at 2024-01-15T10:00:00.000Z

🔓 Unlocking semua sessions...
✅ Semua sessions berhasil di-unlock!

📋 Sessions yang tersedia:
  ✅ Day 1 - Unlocked sekarang
  ✅ Day 2 - Unlocked sekarang
  ✅ Day 3 - Unlocked sekarang
  ✅ Day 4 - Unlocked sekarang
  ✅ Day 5 - Unlocked sekarang

💡 Sekarang Anda bisa:
  1. Akses semua sessions (Day 1-5) tanpa menunggu
  2. Complete sessions dengan klik tombol "Selesai"
  3. Setelah Day 5 selesai, post-test akan tersedia
  4. Selesaikan post-test untuk melihat hasil akhir
```

### Setelah Menjalankan Script
1. Refresh halaman dashboard
2. Semua sessions (Day 1-5) seharusnya sudah unlocked
3. Klik "Mulai" pada session mana saja
4. Baca konten dan klik "Selesai"
5. Ulangi untuk semua sessions
6. Setelah Day 5 selesai, post-test akan tersedia

---

## Script 2: Reset User Progress

### Kapan Digunakan
- Ingin test ulang dari awal
- Ada bug dan perlu test flow lengkap lagi
- Ingin reset semua progress untuk user tertentu

### Cara Menggunakan

**Step 1: Cek progress saat ini (tanpa menghapus)**
```bash
npx tsx scripts/reset-user-progress.ts <email_user>
```

**Step 2: Benar-benar reset (dengan konfirmasi)**
```bash
npx tsx scripts/reset-user-progress.ts <email_user> --confirm
```

**Contoh:**
```bash
# Cek dulu
npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com

# Kalau yakin, reset dengan --confirm
npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com --confirm
```

### Output yang Diharapkan

**Tanpa --confirm (hanya preview):**
```
🔍 Mencari user dengan email: projectakhirsatu@gmail.com
✅ User ditemukan: 85ebc689-ddc2-4737-b37d-363aec55f229

📊 Progress saat ini:
  Pre-test: ✅ Score 18
  Sessions: 5 sessions
    Day 1: ✅ Completed
    Day 2: ✅ Completed
    Day 3: ⏳ In Progress
    Day 4: ⏳ In Progress
    Day 5: ⏳ In Progress
  Post-test: ❌ Belum

⚠️  PERINGATAN: Ini akan menghapus SEMUA progress user!
   - Test submissions (pre & post)
   - Session progress (Day 1-5)

💡 Untuk melanjutkan, jalankan script dengan flag --confirm:
   npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com --confirm

❌ Reset dibatalkan (tidak ada flag --confirm)
```

**Dengan --confirm (benar-benar reset):**
```
🗑️  Menghapus progress...
  ✅ Test submissions dihapus
  ✅ Session progress dihapus

✅ Progress berhasil di-reset!

💡 Sekarang Anda bisa:
  1. Login ke aplikasi
  2. Mulai dari pre-test lagi
  3. Test full flow dari awal
```

---

## Flow Testing Lengkap

### Skenario 1: Test Cepat Sampai Post-Test

1. **Login dan selesaikan pre-test**
   ```
   - Login dengan OTP
   - Isi profile setup
   - Kerjakan pre-test (23 soal)
   - Submit pre-test
   ```

2. **Unlock semua sessions**
   ```bash
   npx tsx scripts/unlock-all-sessions-testing.ts projectakhirsatu@gmail.com
   ```

3. **Complete semua sessions**
   ```
   - Refresh dashboard
   - Klik "Mulai" pada Day 1
   - Scroll ke bawah
   - Klik "Selesai"
   - Ulangi untuk Day 2, 3, 4, 5
   ```

4. **Kerjakan post-test**
   ```
   - Setelah Day 5 selesai, post-test akan muncul
   - Klik "Mulai Post-Test"
   - Kerjakan 23 soal
   - Submit post-test
   ```

5. **Lihat hasil**
   ```
   - Redirect ke halaman results
   - Lihat perbandingan pre-test vs post-test
   - Lihat confetti animation
   ```

**Total waktu: ~15-20 menit** (tanpa menunggu 24 jam x 5 hari = 5 hari!)

### Skenario 2: Test Ulang dari Awal

1. **Reset progress**
   ```bash
   npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com --confirm
   ```

2. **Refresh aplikasi**
   ```
   - Refresh browser
   - Dashboard akan kosong (no progress)
   ```

3. **Mulai dari pre-test lagi**
   ```
   - Ikuti Skenario 1 dari awal
   ```

---

## Troubleshooting

### Error: User tidak ditemukan
```
❌ User tidak ditemukan
```

**Solusi:**
- Pastikan email benar
- Cek di Supabase Dashboard → Table Editor → users
- Pastikan user sudah terdaftar

### Error: Pre-test belum diselesaikan
```
⚠️  Pre-test belum diselesaikan
💡 Silakan selesaikan pre-test dulu di aplikasi
```

**Solusi:**
- Login ke aplikasi
- Selesaikan pre-test dulu
- Baru jalankan unlock script

### Sessions tidak muncul setelah unlock
**Solusi:**
- Refresh halaman dashboard (Ctrl+R atau Cmd+R)
- Clear browser cache
- Logout dan login lagi

### Post-test tidak muncul setelah Day 5 selesai
**Solusi:**
- Pastikan Day 5 benar-benar completed (ada checkmark ✓)
- Refresh dashboard
- Cek di Supabase → session_progress → pastikan day=5 completed=true

---

## Catatan Penting

### ⚠️ Hanya untuk Development/Testing
Scripts ini **HANYA** untuk development dan testing. Jangan gunakan di production!

### 🔒 Di Production
Di production, sessions akan unlock otomatis setiap 24 jam sesuai logic di:
- `app/api/session/complete/route.ts` - Unlock next session setelah complete
- `app/api/test/submit-pre/route.ts` - Unlock Day 1 setelah pre-test

### 🗄️ Database
Scripts ini langsung memodifikasi database menggunakan service role key. Pastikan:
- `.env.local` memiliki `SUPABASE_SERVICE_ROLE_KEY`
- Backup database sebelum testing jika perlu

### 👥 Multiple Users
Anda bisa unlock sessions untuk multiple users:
```bash
npx tsx scripts/unlock-all-sessions-testing.ts user1@example.com
npx tsx scripts/unlock-all-sessions-testing.ts user2@example.com
npx tsx scripts/unlock-all-sessions-testing.ts user3@example.com
```

---

## Quick Reference

```bash
# Unlock semua sessions untuk testing cepat
npx tsx scripts/unlock-all-sessions-testing.ts <email>

# Cek progress user (tanpa menghapus)
npx tsx scripts/reset-user-progress.ts <email>

# Reset progress user (dengan konfirmasi)
npx tsx scripts/reset-user-progress.ts <email> --confirm
```

---

## Status
✅ Scripts sudah dibuat dan siap digunakan
⏳ Menunggu user testing
