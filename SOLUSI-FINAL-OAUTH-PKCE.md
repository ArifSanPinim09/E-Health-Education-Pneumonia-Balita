# Solusi Final: OAuth PKCE Error - Login Sekali Langsung Berhasil

## Masalah Awal
User harus login 2 kali karena PKCE code verifier tidak ditemukan pada attempt pertama.

## Root Cause
PKCE (Proof Key for Code Exchange) verifier disimpan di cookies oleh Supabase client saat initiate OAuth flow. Namun, cookies ini tidak ter-refresh dengan benar antara client-side dan server-side, menyebabkan:

1. Login page (client) membuat PKCE verifier dan simpan di cookies
2. Google redirect ke callback route (server)
3. Server tidak bisa akses PKCE verifier dari cookies
4. Error: "PKCE code verifier not found in storage"
5. User harus login lagi

## Solusi: Middleware Session Refresh

Kunci solusinya adalah menambahkan Supabase session refresh di middleware, sehingga cookies selalu sinkron antara client dan server.

### 1. Update Middleware (`middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Update Supabase session in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if exists - INI YANG PENTING!
  await supabase.auth.getSession()

  // ... rest of middleware logic
  return response // Return response object, bukan NextResponse.next()
}
```

**Penjelasan:**
- Middleware membuat Supabase client dengan cookie handlers yang sinkron
- `getSession()` akan refresh session dan update cookies
- Cookies di-set di both request dan response untuk memastikan sinkronisasi
- Return `response` object yang sudah di-update, bukan `NextResponse.next()`

### 2. Simplify Login Page (`app/(auth)/login/page.tsx`)

```typescript
const handleGoogleLogin = async () => {
  const supabase = createClient()
  
  // Tidak perlu signOut() atau custom config
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      skipBrowserRedirect: false,
    },
  })
}
```

**Penjelasan:**
- Hapus `signOut()` yang justru menghapus PKCE verifier
- Hapus custom `queryParams` yang tidak diperlukan
- Biarkan Supabase handle OAuth flow secara default

### 3. Simplify Callback Route (`app/auth/callback/route.ts`)

```typescript
if (error.code === 'pkce_code_verifier_not_found') {
  console.log('🔄 PKCE verifier not found, restarting auth flow...')
  return NextResponse.redirect(new URL('/login?error=session_expired', request.url))
}
```

**Penjelasan:**
- Tidak perlu manual clear cookies
- Middleware akan handle session refresh
- Jika masih error, redirect ke login untuk retry

### 4. Simplify Supabase Client (`lib/supabase/client.ts`)

```typescript
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Penjelasan:**
- Tidak perlu custom cookie handlers
- Biarkan `@supabase/ssr` handle cookies secara default
- Ini memastikan PKCE verifier tersimpan dengan benar

## Flow OAuth yang Benar (Setelah Fix)

```
1. User klik "Masuk dengan Google" di /login
   ↓
2. Supabase client membuat PKCE verifier dan simpan di cookies
   ↓
3. Browser redirect ke Google OAuth
   ↓
4. Google redirect ke /auth/callback?code=...
   ↓
5. Middleware intercept request:
   - Buat Supabase server client dengan cookie handlers
   - Call getSession() untuk refresh session
   - Update cookies di request dan response
   ↓
6. Callback route exchange code untuk session:
   - PKCE verifier sudah tersedia di cookies (thanks to middleware!)
   - Exchange berhasil
   ↓
7. Set auth cookie dan redirect ke /profile-setup
   ↓
8. User berhasil login SEKALI SAJA! ✅
```

## Kenapa Solusi Ini Bekerja?

1. **Middleware Session Refresh**: Middleware memanggil `getSession()` pada setiap request, memastikan Supabase session dan cookies selalu up-to-date.

2. **Cookie Synchronization**: Cookie handlers di middleware memastikan cookies di-set di both request dan response, sehingga tersedia untuk route handlers.

3. **No Manual Cookie Management**: Tidak perlu manual clear atau set cookies, biarkan `@supabase/ssr` handle semuanya.

4. **Consistent Client/Server**: Menggunakan `@supabase/ssr` di both client dan server dengan default config memastikan konsistensi.

## Testing

```bash
# Test flow:
1. Buka /login
2. Klik "Masuk dengan Google"
3. Selesaikan OAuth di Google
4. ✅ Langsung berhasil login tanpa retry!
5. ✅ Redirect ke /profile-setup
6. ✅ Tidak ada PKCE error
```

## Referensi

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [PKCE Flow](https://oauth.net/2/pkce/)

## Kesimpulan

Masalah PKCE error diselesaikan dengan menambahkan session refresh di middleware. Ini memastikan cookies Supabase selalu sinkron antara client dan server, sehingga PKCE verifier tersedia saat callback route membutuhkannya.

**Hasil: Login sekali langsung berhasil! 🎉**
