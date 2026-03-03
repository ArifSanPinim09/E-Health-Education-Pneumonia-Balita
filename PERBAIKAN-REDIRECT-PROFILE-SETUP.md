# Perbaikan Masalah Redirect ke Login Setelah Verifikasi OTP

## 🔴 Masalah yang Terjadi

Setelah berhasil verifikasi OTP:
1. User diarahkan ke `/profile-setup` ✅
2. Tapi kemudian langsung di-redirect kembali ke `/login` ❌
3. User harus login ulang

### Log yang Terlihat:
```
✅ OTP verified successfully
POST /api/auth/verify-otp 200
GET /profile-setup 200
GET /login 200  ← Redirect tidak diinginkan
GET /login 200
GET /login 200
```

## 🔍 Penyebab Masalah

Ada 2 masalah yang terjadi:

### 1. Race Condition pada Cookie
Setelah verify OTP berhasil:
- API route set cookie `auth-token` di response
- `router.push('/profile-setup')` dipanggil langsung
- Cookie belum sempat ter-set di browser
- Halaman profile-setup di-load tanpa cookie
- Middleware mengecek cookie → tidak ada → redirect ke `/login`

### 2. Duplikasi Pengecekan Auth
Di `app/(auth)/profile-setup/page.tsx`, ada `useEffect` yang mengecek cookie secara manual:
```typescript
useEffect(() => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='))
    ?.split('=')[1]

  if (!token) {
    router.push('/login')  // ← Ini menyebabkan redirect loop
  }
}, [router])
```

Padahal middleware sudah menghandle proteksi route, jadi pengecekan ini redundant dan menyebabkan masalah.

## ✅ Solusi yang Diterapkan

### 1. Hapus Manual Token Check di Profile Setup Page

**File**: `app/(auth)/profile-setup/page.tsx`

**Sebelum:**
```typescript
useEffect(() => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='))
    ?.split('=')[1]

  if (!token) {
    router.push('/login')
  }
}, [router])
```

**Sesudah:**
```typescript
// Middleware already handles authentication check
// No need to manually check token here
```

**Alasan**: Middleware sudah melindungi route `/profile-setup`, jadi tidak perlu pengecekan manual yang bisa menyebabkan race condition.

### 2. Tambahkan Delay Setelah Verify OTP

**File**: `app/(auth)/login/page.tsx`

**Sebelum:**
```typescript
const handleOTPSuccess = (requiresProfileSetup: boolean) => {
  if (requiresProfileSetup) {
    router.push('/profile-setup')
  } else {
    router.push('/dashboard')
  }
}
```

**Sesudah:**
```typescript
const handleOTPSuccess = async (requiresProfileSetup: boolean) => {
  // Wait a bit to ensure cookie is set
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (requiresProfileSetup) {
    router.push('/profile-setup')
  } else {
    router.push('/dashboard')
  }
}
```

**Alasan**: Memberikan waktu 100ms untuk memastikan cookie sudah ter-set di browser sebelum redirect.

## 🧪 Testing

### Test Manual

1. **Buka aplikasi**: http://localhost:3000
2. **Klik "Masuk"**
3. **Masukkan email**
4. **Klik "Kirim Kode OTP"**
5. **Cek email dan salin kode OTP**
6. **Masukkan kode OTP**
7. **Klik "Verifikasi"**
8. **✅ Harus langsung masuk ke halaman Profile Setup**
9. **❌ TIDAK boleh redirect ke login**

### Expected Flow

```
1. User masukkan email
2. Kirim OTP → Email diterima
3. User masukkan OTP
4. Verify OTP → Success
5. Set cookie auth-token
6. Wait 100ms
7. Redirect ke /profile-setup
8. Middleware check cookie → Valid
9. Profile setup page loaded ✅
```

### Log yang Diharapkan

```
✅ OTP sent successfully to: user@example.com
POST /api/auth/send-otp 200

✅ OTP verified successfully for: user@example.com
👤 User ID: xxx-xxx-xxx
POST /api/auth/verify-otp 200

GET /profile-setup 200  ← Berhasil load
```

**TIDAK ADA** redirect ke `/login` lagi!

## 📋 Checklist Verifikasi

- [ ] Hapus `useEffect` token check di profile-setup page
- [ ] Tambahkan delay 100ms setelah verify OTP
- [ ] Test login dengan email baru
- [ ] Verifikasi langsung masuk ke profile-setup
- [ ] Tidak ada redirect ke login
- [ ] Isi form profile setup berhasil
- [ ] Redirect ke dashboard setelah save profile

## 🐛 Troubleshooting

### Masih Redirect ke Login?

**Cek 1: Cookie ter-set dengan benar?**
1. Buka DevTools (F12)
2. Tab "Application" → "Cookies"
3. Cek apakah ada cookie `auth-token`
4. Jika tidak ada, cek response dari `/api/auth/verify-otp`

**Cek 2: Middleware berjalan dengan benar?**
1. Cek file `middleware.ts`
2. Pastikan `/profile-setup` ada di `userProtectedRoutes`
3. Pastikan JWT_SECRET sama dengan yang di `.env.local`

**Cek 3: Token valid?**
1. Copy token dari cookie
2. Decode di https://jwt.io
3. Cek payload: harus ada `userId`, `email`, `type: 'user'`

### Cookie Tidak Ter-set?

**Solusi:**
1. Cek response header dari `/api/auth/verify-otp`
2. Harus ada `Set-Cookie: auth-token=...`
3. Jika tidak ada, cek kode di `app/api/auth/verify-otp/route.ts`

### Masih Ada Race Condition?

**Solusi:**
1. Tingkatkan delay dari 100ms ke 200ms atau 500ms
2. Atau gunakan `window.location.href` instead of `router.push()`
3. Atau reload page setelah set cookie

## 📝 Catatan Penting

- Middleware sudah melindungi semua protected routes
- Tidak perlu manual token check di setiap page
- Cookie harus ter-set sebelum redirect
- Delay 100ms cukup untuk kebanyakan kasus
- Jika masih ada masalah, tingkatkan delay

## 🎯 Hasil yang Diharapkan

Setelah perbaikan:
- ✅ Verify OTP berhasil
- ✅ Langsung masuk ke profile-setup
- ✅ Tidak ada redirect ke login
- ✅ Form profile setup bisa diisi
- ✅ Save profile berhasil
- ✅ Redirect ke dashboard

## 📚 File yang Dimodifikasi

1. `app/(auth)/profile-setup/page.tsx` - Hapus manual token check
2. `app/(auth)/login/page.tsx` - Tambahkan delay setelah verify OTP

---

**Terakhir diupdate**: 2 Maret 2026
