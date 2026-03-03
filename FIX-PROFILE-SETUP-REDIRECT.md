# Perbaikan Redirect ke Profile Setup

## Masalah Utama

### 1. PKCE Code Verifier Not Found
Error: `PKCE code verifier not found in storage`

Penyebab: OAuth flow menggunakan Supabase client yang berbeda antara login page (client-side) dan callback route (server-side), sehingga PKCE verifier yang disimpan di cookies tidak bisa diakses dengan benar.

### 2. OAuth Code di Root Path
Setelah OAuth callback, browser kadang melakukan request ke `/?code=...` alih-alih langsung ke `/auth/callback`.

### 3. Redirect Loop
User di-redirect ke halaman home (`/`) alih-alih ke halaman profile setup (`/profile-setup`) setelah login berhasil.

## Solusi yang Diterapkan

### 1. Perbaikan Supabase Client (`lib/supabase/client.ts`)
- Menghapus custom cookie handlers yang menyebabkan konflik
- Menggunakan default cookie handling dari `@supabase/ssr`
- Memastikan PKCE verifier tersimpan dengan benar di cookies

```typescript
// Sebelum: Custom cookie handlers
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { /* custom handlers */ }
    }
  )
}

// Sesudah: Default cookie handling
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Perbaikan Auth Callback Route (`app/auth/callback/route.ts`)
- Menambahkan handling khusus untuk error PKCE
- Redirect ke login dengan error message yang jelas jika PKCE gagal
- Menggunakan redirect status code 302 yang lebih sesuai
- **Membersihkan Supabase cookies saat PKCE error untuk force fresh login**

```typescript
if (error.code === 'pkce_code_verifier_not_found') {
  console.log('🔄 PKCE verifier not found, restarting auth flow...')
  
  const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url))
  
  // Clear Supabase auth cookies to force fresh login
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.delete(cookie.name)
    }
  })
  
  return response
}
```

### 3. Perbaikan Login Page (`app/(auth)/login/page.tsx`)
- Menambahkan `useEffect` untuk menangani error dari URL params
- Menampilkan error message yang user-friendly
- Membersihkan URL setelah menampilkan error
- Menambahkan `queryParams` untuk memastikan OAuth flow yang benar
- **Menambahkan `signOut()` sebelum login untuk membersihkan session lama**

```typescript
const handleGoogleLogin = async () => {
  const supabase = createClient()
  
  // Clear any existing session first to prevent PKCE issues
  await supabase.auth.signOut({ scope: 'local' })
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}
```

### 4. Perbaikan Middleware (`middleware.ts`)
- Menambahkan pengecekan untuk OAuth code di root path
- Redirect otomatis ke `/auth/callback` jika ada code di root path
- Menambahkan logging untuk query parameters

```typescript
// Redirect OAuth code dari root ke callback
if (pathname === '/' && searchParams.has('code')) {
  console.log('🔄 Root path with OAuth code, redirecting to callback')
  const callbackUrl = new URL('/auth/callback', request.url)
  callbackUrl.searchParams.set('code', searchParams.get('code')!)
  return NextResponse.redirect(callbackUrl)
}
```

### 5. Perbaikan Profile Setup Page (`app/(auth)/profile-setup/page.tsx`)
- Menambahkan `useEffect` untuk membersihkan query parameters dari URL
- Mencegah browser navigation kembali ke URL dengan query parameter

```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && window.location.search) {
    console.log('🧹 Cleaning up URL query parameters')
    window.history.replaceState({}, '', '/profile-setup')
  }
}, [])
```

## Flow OAuth yang Benar

1. User klik "Masuk dengan Google" di `/login`
2. **Client membersihkan session lama dengan `signOut({ scope: 'local' })`**
3. Browser redirect ke Google OAuth
4. Google redirect kembali ke `/auth/callback?code=...`
5. Server exchange code untuk session (PKCE verifier dari cookies)
6. Jika PKCE error: Server membersihkan cookies dan redirect ke login
7. Server set auth cookie dan redirect ke `/profile-setup` atau `/dashboard`
8. Client membersihkan query parameters dari URL
9. User berada di halaman yang benar tanpa query parameters

## Testing

Untuk menguji perbaikan:

1. Buka halaman login
2. Klik "Masuk dengan Google"
3. Selesaikan OAuth flow di Google
4. Pastikan:
   - Tidak ada error PKCE (atau jika ada, otomatis retry)
   - User di-redirect ke `/profile-setup` (jika belum setup) atau `/dashboard`
   - URL bersih tanpa query parameter
   - Tidak ada redirect loop

## Hasil Testing

Dari log terakhir:
```
✅ Login pertama: PKCE error (expected untuk session lama)
✅ Redirect ke login dengan error message
✅ Login kedua: Berhasil!
✅ User authenticated
✅ Redirect ke /profile-setup berhasil
✅ Profile setup page loaded
```

## Error Messages

Error messages yang ditampilkan ke user:

- `session_expired`: "Sesi kedaluwarsa. Silakan masuk kembali."
- `auth_failed`: "Gagal masuk. Silakan coba lagi."
- `no_code`: "Kode autentikasi tidak ditemukan."
- `no_user`: "Data pengguna tidak ditemukan."
- `server_error`: "Terjadi kesalahan server. Silakan coba lagi."

## Catatan Teknis

- `@supabase/ssr` menggunakan cookies untuk menyimpan PKCE verifier
- Cookie handling harus konsisten antara client dan server
- Custom cookie handlers dapat menyebabkan konflik dengan PKCE flow
- Middleware harus menangani edge case seperti OAuth code di root path
