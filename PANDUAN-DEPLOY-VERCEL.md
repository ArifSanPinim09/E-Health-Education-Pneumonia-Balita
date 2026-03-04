# Panduan Deploy ke Vercel

## Persiapan Sebelum Deploy

1. **Pastikan semua environment variables sudah siap:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GEMINI_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (akan diisi setelah deploy)

2. **Push code ke GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

## Tahap 1: Deploy Tanpa Domain Custom

### 1. Login ke Vercel
- Buka https://vercel.com
- Login dengan akun GitHub/GitLab/Bitbucket

### 2. Import Project
- Klik "Add New" → "Project"
- Pilih repository project Anda
- Klik "Import"

### 3. Configure Project
- **Framework Preset:** Next.js (otomatis terdeteksi)
- **Root Directory:** ./ (default)
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)

### 4. Tambahkan Environment Variables
Klik "Environment Variables" dan tambahkan satu per satu:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPXxxx...
GEMINI_API_KEY=AIzaSyxxx...
NEXTAUTH_SECRET=xxx (generate dengan: openssl rand -base64 32)
```

### 5. Deploy
- Klik "Deploy"
- Tunggu proses build selesai (2-5 menit)
- Anda akan mendapat URL: `https://nama-project.vercel.app`

### 6. Update NEXTAUTH_URL
- Setelah deploy berhasil, copy URL Vercel Anda
- Kembali ke Settings → Environment Variables
- Tambahkan: `NEXTAUTH_URL=https://nama-project.vercel.app`
- Klik "Redeploy" untuk apply perubahan

### 7. Konfigurasi Google OAuth di Supabase

**A. Setup Google Provider di Supabase:**
- Buka Supabase Dashboard → Authentication → Providers
- Cari "Google" dan klik "Enable"
- Isi form:
  - **Client ID:** Paste dari Google Cloud Console
  - **Client Secret:** Paste dari Google Cloud Console
  - **Skip nonce checks:** Biarkan OFF (lebih aman)
  - **Allow users without email:** Biarkan OFF
- **Callback URL** sudah otomatis muncul dan tidak bisa diedit:
  ```
  https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
  ```
  ⚠️ Copy URL ini, akan dipakai di Google Cloud Console
- Klik "Save"

**B. Update Google Cloud Console:**
- Buka Google Cloud Console → APIs & Services → Credentials
- Pilih OAuth 2.0 Client ID Anda
- Tambahkan di "Authorized redirect URIs":
  ```
  https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
  ```
  ⚠️ Gunakan URL callback dari Supabase (langkah A)
- Klik "Save"

**C. Update Supabase Site URL:**
- Buka Supabase Dashboard → Authentication → URL Configuration
- Set **Site URL:** `https://nama-project.vercel.app`
- Tambahkan di **Redirect URLs:**
  ```
  https://nama-project.vercel.app/*
  https://nama-project.vercel.app/dashboard
  https://nama-project.vercel.app/profile-setup
  ```

✅ **Deploy tanpa domain custom selesai!**

---

## Tahap 2: Deploy dengan Domain Custom (Opsional)

### 1. Beli Domain
- Beli domain dari provider (Niagahoster, Namecheap, GoDaddy, dll)
- Contoh: `belajar-anak.com`

### 2. Tambahkan Domain di Vercel
- Buka project di Vercel Dashboard
- Klik tab "Settings" → "Domains"
- Klik "Add"
- Masukkan domain Anda: `belajar-anak.com`
- Klik "Add"

### 3. Konfigurasi DNS
Vercel akan memberikan instruksi DNS. Ada 2 opsi:

**Opsi A: Nameservers (Recommended)**
- Ganti nameservers domain Anda ke:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```

**Opsi B: A Record**
- Tambahkan A Record di DNS provider:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```
- Tambahkan CNAME untuk www:
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

### 4. Tunggu Propagasi DNS
- Biasanya 5-30 menit
- Maksimal 48 jam
- Vercel otomatis setup SSL certificate

### 5. Update Environment Variables
- Update `NEXTAUTH_URL` ke domain baru:
  ```
  NEXTAUTH_URL=https://belajar-anak.com
  ```
- Redeploy project

### 6. Update Supabase Site URL
- Buka Supabase Dashboard → Authentication → URL Configuration
- Update **Site URL:** `https://belajar-anak.com`
- Update **Redirect URLs:**
  ```
  https://belajar-anak.com/*
  https://belajar-anak.com/dashboard
  https://belajar-anak.com/profile-setup
  ```

**Note:** Tidak perlu update Google Cloud Console karena callback tetap ke Supabase (`https://xxx.supabase.co/auth/v1/callback`)

✅ **Deploy dengan domain custom selesai!**

---

## Tips & Troubleshooting

### Auto Deploy
- Setiap push ke branch `main` akan otomatis deploy
- Preview deployment untuk branch lain

### Monitoring
- Lihat logs di Vercel Dashboard → Deployments → View Function Logs
- Monitor performance di Analytics tab

### Rollback
- Jika ada masalah, bisa rollback ke deployment sebelumnya
- Klik deployment lama → "Promote to Production"

### Environment Variables
- Perubahan env vars butuh redeploy
- Bisa set berbeda untuk Production/Preview/Development

### Common Issues
1. **Build Error:** Cek logs, biasanya missing dependencies atau TypeScript errors
2. **OAuth Error:** Pastikan callback URL di Google Console sudah benar (harus ke Supabase: `https://xxx.supabase.co/auth/v1/callback`)
3. **Redirect Error:** Pastikan Site URL dan Redirect URLs di Supabase sudah sesuai domain Vercel
4. **Database Error:** Cek Supabase connection dan RLS policies
5. **404 Error:** Pastikan routing Next.js sudah benar

### Perbedaan Supabase Auth vs NextAuth
Project ini menggunakan **Supabase Auth** (bukan NextAuth), jadi:
- Google OAuth dihandle langsung oleh Supabase
- Callback URL adalah URL Supabase yang fixed/tidak bisa diubah: `https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback`
- Setelah callback ke Supabase, user akan di-redirect ke Site URL yang Anda set
- Tidak perlu setup NextAuth providers untuk Google
- Session management menggunakan Supabase client

### Flow Login dengan Google:
1. User klik "Login with Google" di aplikasi Anda
2. Redirect ke Google OAuth
3. User approve permission
4. Google redirect ke Supabase callback: `https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback`
5. Supabase proses authentication
6. Supabase redirect ke Site URL Anda (misal: `https://nama-project.vercel.app/dashboard`)

---

## Checklist Deploy

- [ ] Code sudah di push ke Git
- [ ] Environment variables sudah lengkap
- [ ] Google OAuth di Supabase sudah enabled
- [ ] Google Cloud Console redirect URI sudah di-update (ke Supabase callback)
- [ ] Supabase Site URL sudah di-set
- [ ] Project berhasil di-import ke Vercel
- [ ] Build berhasil tanpa error
- [ ] NEXTAUTH_URL sudah di-update
- [ ] Testing login dengan Google
- [ ] Testing fitur utama (dashboard, session, test)
- [ ] (Opsional) Domain custom sudah terhubung
- [ ] SSL certificate aktif (otomatis dari Vercel)

Selamat! Aplikasi Anda sudah live! 🚀
