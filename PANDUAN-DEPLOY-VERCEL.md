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

### 7. Update Google OAuth Redirect
- Buka Google Cloud Console
- Pilih project OAuth Anda
- Tambahkan Authorized redirect URIs:
  ```
  https://nama-project.vercel.app/api/auth/callback/google
  ```

### 8. Update Supabase Auth Settings
- Buka Supabase Dashboard → Authentication → URL Configuration
- Tambahkan di "Redirect URLs":
  ```
  https://nama-project.vercel.app/api/auth/callback/google
  https://nama-project.vercel.app/dashboard
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

### 6. Update Google OAuth Redirect
- Tambahkan redirect URI baru:
  ```
  https://belajar-anak.com/api/auth/callback/google
  ```

### 7. Update Supabase Auth Settings
- Tambahkan redirect URLs baru:
  ```
  https://belajar-anak.com/api/auth/callback/google
  https://belajar-anak.com/dashboard
  ```

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
2. **OAuth Error:** Pastikan redirect URIs sudah benar di Google Console
3. **Database Error:** Cek Supabase connection dan RLS policies
4. **404 Error:** Pastikan routing Next.js sudah benar

---

## Checklist Deploy

- [ ] Code sudah di push ke Git
- [ ] Environment variables sudah lengkap
- [ ] Project berhasil di-import ke Vercel
- [ ] Build berhasil tanpa error
- [ ] NEXTAUTH_URL sudah di-update
- [ ] Google OAuth redirect sudah di-update
- [ ] Supabase redirect URLs sudah di-update
- [ ] Testing login dan fitur utama
- [ ] (Opsional) Domain custom sudah terhubung
- [ ] SSL certificate aktif (otomatis dari Vercel)

Selamat! Aplikasi Anda sudah live! 🚀
