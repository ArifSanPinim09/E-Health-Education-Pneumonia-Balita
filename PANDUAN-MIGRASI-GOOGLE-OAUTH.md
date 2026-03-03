# Panduan Migrasi dari Email OTP ke Google OAuth

## Status: ✅ Siap Diimplementasikan

Dokumen ini menjelaskan langkah-langkah untuk mengubah sistem autentikasi dari Email OTP ke Google OAuth.

## Perubahan yang Sudah Dilakukan

### 1. File Baru
- ✅ `app/auth/callback/route.ts` - Server-side OAuth callback handler dengan PKCE support
- ✅ `app/api/auth/create-token/route.ts` - API untuk membuat JWT token setelah OAuth berhasil

### 2. File yang Dimodifikasi
- ✅ `app/(auth)/login/page.tsx` - UI login sekarang menggunakan tombol "Masuk dengan Google"
- ✅ `lib/supabase/client.ts` - Konfigurasi cookie storage untuk PKCE
- ✅ `middleware.ts` - Menambahkan `/auth/callback` sebagai public route

### 3. File yang Tidak Digunakan Lagi (Opsional untuk Dihapus)
- `app/api/auth/send-otp/route.ts` - Tidak diperlukan lagi
- `app/api/auth/verify-otp/route.ts` - Tidak diperlukan lagi
- `components/auth/OTPForm.tsx` - Tidak diperlukan lagi

## Langkah Implementasi

### Langkah 1: Konfigurasi Google Cloud Console (5 menit)

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google+ API
4. Buat OAuth 2.0 Client ID:
   - Pergi ke **APIs & Services** → **Credentials**
   - Klik **Create Credentials** → **OAuth client ID**
   - Pilih **Web application**
   - Tambahkan **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Tambahkan **Authorized redirect URIs**:
     ```
     https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
     (Untuk production, tambahkan juga: `https://your-domain.com/auth/callback`)
   - Simpan **Client ID** dan **Client Secret**

### Langkah 2: Konfigurasi Supabase (3 menit)

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Authentication** → **Providers**
4. Cari **Google** dan aktifkan
5. Masukkan:
   - **Client ID** dari Google Cloud Console
   - **Client Secret** dari Google Cloud Console
6. Klik **Save**

### Langkah 3: Testing (5 menit)

1. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

2. Buka `http://localhost:3000/login`

3. Klik tombol **Masuk dengan Google**

4. Login dengan akun Google Anda

5. Verifikasi redirect:
   - Jika pertama kali → harus ke `/profile-setup`
   - Jika sudah ada profil → harus ke `/dashboard`

### Langkah 4: Cleanup (Opsional)

Jika Google OAuth sudah berjalan dengan baik, Anda bisa menghapus file OTP yang tidak digunakan:

```bash
# Hapus API routes OTP
rm app/api/auth/send-otp/route.ts
rm app/api/auth/verify-otp/route.ts

# Hapus komponen OTP
rm components/auth/OTPForm.tsx

# Hapus dokumentasi OTP lama
rm PERBAIKAN-OTP-*.md
rm PANDUAN-PERBAIKAN-OTP.md
rm QUICK-FIX-OTP.md
```

## Keuntungan Google OAuth

### ✅ Untuk User
- Login lebih cepat (1 klik)
- Tidak perlu menunggu email OTP
- Tidak perlu mengingat password
- Lebih familiar (sudah terbiasa dengan Google)

### ✅ Untuk Developer
- Tidak perlu maintain email template
- Tidak perlu handle rate limiting OTP
- Tidak perlu debugging masalah email delivery
- Lebih sedikit kode untuk dimaintain

### ✅ Untuk Sistem
- Lebih aman (OAuth 2.0 standard)
- Mengurangi beban email server
- Mengurangi kompleksitas autentikasi

## Alur Autentikasi Baru

```
User → Klik "Masuk dengan Google"
     → Supabase client menyimpan PKCE code verifier di cookies
     → Redirect ke Google OAuth
     → User login di Google
     → Google redirect ke Supabase
     → Supabase redirect ke /auth/callback dengan code
     → Server callback handler:
        - Baca PKCE verifier dari cookies (via @supabase/ssr)
        - Exchange code untuk session
        - Buat JWT token
        - Cek profil di database
        - Set cookie auth-token
        - Redirect ke /profile-setup atau /dashboard
```

## Kenapa Menggunakan @supabase/ssr?

`@supabase/ssr` dirancang khusus untuk Next.js App Router dan menyimpan PKCE code verifier di cookies yang bisa diakses baik dari client maupun server. Ini memungkinkan OAuth flow bekerja dengan sempurna tanpa error "PKCE code verifier not found".

## Rollback Plan

Jika ada masalah dengan Google OAuth, Anda bisa rollback dengan:

```bash
git checkout HEAD~1 app/(auth)/login/page.tsx
git checkout HEAD~1 app/api/auth/callback/route.ts
```

Atau restore dari backup file OTP yang lama.

## Migrasi Data User

**PENTING:** User yang sudah terdaftar dengan email OTP akan tetap bisa login dengan Google OAuth jika menggunakan email Google yang sama. Supabase akan mencocokkan berdasarkan email.

Tidak perlu migrasi data khusus karena:
- User ID di Supabase tetap sama
- Profil di `mother_profiles` dan `child_profiles` tetap terhubung dengan `user_id`
- JWT token system tetap sama

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solusi:** Pastikan redirect URI di Google Cloud Console sama persis dengan yang di Supabase.

### Error: "Invalid OAuth callback"
**Solusi:** Pastikan Supabase Google provider sudah diaktifkan dan Client ID/Secret sudah benar.

### User tidak redirect setelah login
**Solusi:** Cek console browser untuk error. Pastikan callback route berjalan dengan baik.

### Cookie tidak ter-set
**Solusi:** Pastikan `NEXT_PUBLIC_APP_URL` di `.env.local` sesuai dengan domain yang digunakan.

## Kontak Support

Jika ada masalah, cek:
1. Supabase Dashboard → Logs → Auth Logs
2. Browser Console untuk error JavaScript
3. Network tab untuk melihat request/response

## Checklist Implementasi

- [ ] Buat OAuth Client ID di Google Cloud Console
- [ ] Aktifkan Google provider di Supabase
- [ ] Masukkan Client ID dan Secret ke Supabase
- [ ] Test login dengan Google
- [ ] Test redirect ke profile-setup (user baru)
- [ ] Test redirect ke dashboard (user existing)
- [ ] Test logout
- [ ] Hapus file OTP yang tidak digunakan (opsional)
- [ ] Update dokumentasi project

## Estimasi Waktu Total: 15-20 menit

Selamat! Sistem autentikasi Anda sekarang lebih modern dan user-friendly! 🎉
