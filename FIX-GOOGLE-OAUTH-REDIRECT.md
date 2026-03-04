# Fix Error: redirect_uri_mismatch

## Penyebab Error
Google OAuth menolak karena redirect URI yang dikirim aplikasi tidak terdaftar di Google Cloud Console.

## Solusi Step-by-Step

### 1. Cek Callback URL di Supabase
- Buka Supabase Dashboard: https://supabase.com/dashboard
- Pilih project Anda
- Klik **Authentication** → **Providers**
- Scroll ke **Google** (pastikan sudah enabled)
- Copy **Callback URL** yang tertera (tidak bisa diedit):
  ```
  https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
  ```

### 2. Update Google Cloud Console
- Buka Google Cloud Console: https://console.cloud.google.com
- Pilih project OAuth Anda
- Klik **APIs & Services** → **Credentials**
- Klik OAuth 2.0 Client ID yang Anda gunakan
- Di bagian **Authorized redirect URIs**, pastikan ada:
  ```
  https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
  ```
- Jika belum ada, klik **+ ADD URI** dan paste URL di atas
- Klik **SAVE**

### 3. Tunggu Beberapa Menit
- Perubahan di Google Cloud Console butuh waktu 5-10 menit untuk aktif
- Jangan langsung test, tunggu dulu

### 4. Clear Browser Cache
- Tekan `Ctrl + Shift + Delete` (Windows/Linux) atau `Cmd + Shift + Delete` (Mac)
- Pilih "Cookies and other site data"
- Clear cache
- Atau gunakan Incognito/Private mode untuk testing

### 5. Test Login Lagi
- Buka aplikasi Anda
- Klik "Login with Google"
- Seharusnya sudah berhasil

## Checklist Troubleshooting

- [ ] Callback URL di Supabase sudah dicopy dengan benar
- [ ] Callback URL sudah ditambahkan di Google Cloud Console
- [ ] Tidak ada typo atau spasi di URL
- [ ] Sudah klik SAVE di Google Cloud Console
- [ ] Sudah tunggu 5-10 menit
- [ ] Browser cache sudah di-clear
- [ ] Client ID dan Client Secret di Supabase sudah benar

## Jika Masih Error

### Cek URL yang Dikirim
1. Buka browser Developer Tools (F12)
2. Klik tab **Network**
3. Klik "Login with Google"
4. Cari request ke Google OAuth
5. Lihat parameter `redirect_uri` di URL
6. Pastikan sama persis dengan yang di Google Cloud Console

### Kemungkinan Masalah Lain

**A. Salah Client ID/Secret:**
- Pastikan Client ID dan Secret di Supabase sesuai dengan yang di Google Cloud Console
- Jangan sampai tertukar dengan Client ID untuk platform lain (Android/iOS)

**B. OAuth Consent Screen Belum Publish:**
- Buka Google Cloud Console → OAuth consent screen
- Jika status "Testing", tambahkan email Anda sebagai Test user
- Atau publish ke Production (butuh verifikasi jika minta scope sensitif)

**C. Multiple Client IDs:**
- Jika punya beberapa Client ID, pastikan pakai yang benar
- Cek Client ID di Supabase cocok dengan Client ID yang redirect URI-nya sudah diupdate

## Format URL yang Benar

✅ **BENAR:**
```
https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
```

❌ **SALAH:**
```
https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback/
http://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback
https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/callback?code=xxx
```

Perhatikan:
- Harus HTTPS (bukan HTTP)
- Tidak ada trailing slash (/)
- Tidak ada query parameter

## Screenshot Referensi

### Di Supabase:
```
Authentication → Providers → Google
┌─────────────────────────────────────────────────────┐
│ Callback URL (for OAuth)                            │
│ https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/  │
│ callback                                             │
│ [Copy button]                                        │
└─────────────────────────────────────────────────────┘
```

### Di Google Cloud Console:
```
Authorized redirect URIs
┌─────────────────────────────────────────────────────┐
│ https://mkizabmccfkznmxrmuht.supabase.co/auth/v1/  │
│ callback                                        [X]  │
└─────────────────────────────────────────────────────┘
[+ ADD URI]
```

Setelah fix ini, login dengan Google seharusnya sudah berfungsi! 🚀
