# Panduan Auto Unlock di Vercel

## 🚀 Cara Aktifkan/Nonaktifkan di Vercel

### Metode 1: Via Vercel Dashboard (RECOMMENDED)

#### 1️⃣ Aktifkan Auto Unlock (Untuk FGD)

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda (e-health-education-pneumonia-balita)
3. Klik tab **Settings**
4. Klik **Environment Variables** di sidebar kiri
5. Cari variable `AUTO_UNLOCK_ALL_SESSIONS`
   - Jika belum ada, klik **Add New**
   - Jika sudah ada, klik **Edit**

6. Set value:
   ```
   Key: AUTO_UNLOCK_ALL_SESSIONS
   Value: true
   ```

7. Pilih environment: **Production**, **Preview**, dan **Development** (centang semua)

8. Klik **Save**

9. **PENTING**: Redeploy project agar perubahan berlaku
   - Klik tab **Deployments**
   - Klik titik tiga (...) di deployment terakhir
   - Klik **Redeploy**
   - Atau push commit baru ke GitHub

#### 2️⃣ Nonaktifkan Auto Unlock (Kembali ke Normal)

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Klik tab **Settings** → **Environment Variables**
4. Cari `AUTO_UNLOCK_ALL_SESSIONS`
5. Klik **Edit**
6. Ubah value menjadi:
   ```
   Value: false
   ```
7. Klik **Save**
8. **Redeploy** project

---

### Metode 2: Via Vercel CLI (Alternatif)

#### Install Vercel CLI (jika belum):
```bash
npm i -g vercel
```

#### Login:
```bash
vercel login
```

#### Set Environment Variable:

**Aktifkan Auto Unlock:**
```bash
vercel env add AUTO_UNLOCK_ALL_SESSIONS production
# Ketik: true
# Tekan Enter
```

**Nonaktifkan Auto Unlock:**
```bash
vercel env rm AUTO_UNLOCK_ALL_SESSIONS production
vercel env add AUTO_UNLOCK_ALL_SESSIONS production
# Ketik: false
# Tekan Enter
```

#### Redeploy:
```bash
vercel --prod
```

---

### Metode 3: Via Git Push (Paling Mudah)

#### 1️⃣ Set di Vercel Dashboard Sekali Saja

Tambahkan environment variable `AUTO_UNLOCK_ALL_SESSIONS` di Vercel Dashboard (lihat Metode 1).

#### 2️⃣ Toggle via Script + Git Push

**Aktifkan Auto Unlock:**
```bash
# Di local
npx tsx scripts/toggle-auto-unlock.ts enable

# Commit dan push
git add .env.local
git commit -m "Enable auto unlock for FGD"
git push
```

**⚠️ CATATAN**: Metode ini TIDAK RECOMMENDED karena `.env.local` tidak di-commit ke Git (ada di `.gitignore`). Gunakan Metode 1 atau 2.

---

## 🔍 Cara Cek Status di Vercel

### Via Vercel Dashboard:
1. Buka project → **Settings** → **Environment Variables**
2. Cari `AUTO_UNLOCK_ALL_SESSIONS`
3. Lihat valuenya: `true` (enabled) atau `false` (disabled)

### Via Vercel CLI:
```bash
vercel env ls
```

### Via Application Log:
1. Buka project → **Deployments** → Pilih deployment terakhir
2. Klik **View Function Logs**
3. Saat ada user submit pre-test, akan muncul log:
   - Jika enabled: `🔓 AUTO_UNLOCK_ALL_SESSIONS enabled - unlocking all sessions`
   - Jika disabled: `🔒 AUTO_UNLOCK_ALL_SESSIONS disabled - unlocking Day 1 only`

---

## 📋 Workflow untuk FGD di Vercel

### Sebelum FGD (Minggu Depan):

1. **Set Environment Variable di Vercel Dashboard**
   ```
   AUTO_UNLOCK_ALL_SESSIONS = true
   ```

2. **Redeploy Project**
   - Via Dashboard: Deployments → Redeploy
   - Via CLI: `vercel --prod`
   - Via Git: Push commit baru

3. **Verifikasi**
   - Buka aplikasi di browser
   - Daftar dengan email baru
   - Selesaikan pre-test
   - Cek apakah Day 1-5 langsung unlock

### Saat FGD:
- Peserta bisa daftar/login seperti biasa
- Setelah pre-test → langsung akses semua Day 1-5
- Tidak perlu menunggu 24 jam

### Setelah FGD Selesai:

1. **Ubah Environment Variable di Vercel Dashboard**
   ```
   AUTO_UNLOCK_ALL_SESSIONS = false
   ```

2. **Redeploy Project**

3. **Verifikasi**
   - User baru hanya unlock Day 1 setelah pre-test
   - Kembali ke flow normal

---

## ⚠️ Catatan Penting untuk Vercel

1. **Redeploy Required**: Setelah ubah environment variable, HARUS redeploy
2. **Propagation Time**: Perubahan bisa butuh 1-2 menit untuk berlaku
3. **Cache**: Jika perubahan belum berlaku, clear cache browser atau gunakan incognito
4. **User Baru Only**: Perubahan hanya berlaku untuk user yang daftar SETELAH redeploy
5. **Multiple Environments**: Set untuk Production, Preview, dan Development

---

## 🆘 Troubleshooting

### Perubahan tidak berlaku setelah redeploy?

1. **Cek Environment Variable di Vercel Dashboard**
   ```
   Settings → Environment Variables → AUTO_UNLOCK_ALL_SESSIONS
   ```

2. **Cek Function Logs**
   ```
   Deployments → Latest → View Function Logs
   ```
   Cari log saat user submit pre-test

3. **Clear Cache**
   - Clear browser cache
   - Atau gunakan incognito mode
   - Atau tambahkan `?v=2` di URL

4. **Force Redeploy**
   ```bash
   # Via CLI
   vercel --prod --force
   
   # Atau via Dashboard
   Deployments → Redeploy (centang "Use existing Build Cache" OFF)
   ```

### User lama ingin unlock semua sessions?

Gunakan script dari local (connect ke Supabase production):
```bash
npx tsx scripts/unlock-all-sessions-testing.ts user@example.com
```

Pastikan `.env.local` berisi credentials production Supabase.

---

## 📚 Referensi

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- Panduan Lengkap: `PANDUAN-AUTO-UNLOCK-SESSIONS.md`
- Quick Start: `QUICK-START-AUTO-UNLOCK.md`

---

## 🎯 Quick Reference

```bash
# Cek status (local)
npx tsx scripts/toggle-auto-unlock.ts status

# Unlock user tertentu (local → production DB)
npx tsx scripts/unlock-all-sessions-testing.ts user@example.com

# Vercel CLI - List env vars
vercel env ls

# Vercel CLI - Redeploy
vercel --prod
```

**Status Saat Ini (Local)**: AUTO_UNLOCK_ALL_SESSIONS=true
**Action Required**: Set di Vercel Dashboard untuk production
