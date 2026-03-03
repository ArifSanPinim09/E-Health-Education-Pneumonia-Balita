# Solusi Akhir: PKCE Error - Client-Side OAuth Callback

## Masalah Root Cause

**Cookies tidak ter-forward dari client ke server saat OAuth callback!**

Dari log: `🍪 Cookies in callback: []`

Ini terjadi karena:
1. User klik login di browser (client-side)
2. Supabase client menyimpan PKCE verifier di cookies/localStorage
3. Browser redirect ke Google OAuth
4. Google redirect kembali ke `/auth/callback` (server-side route)
5. **Server tidak bisa akses cookies/localStorage dari browser!**
6. PKCE verifier not found → Error

## Solusi: Client-Side Callback Handling

Alih-alih handle OAuth callback di server (route.ts), kita handle di client (page.tsx). Ini memastikan PKCE verifier yang disimpan di browser bisa diakses saat exchange code.

### Arsitektur Baru

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Click login
       ▼
┌─────────────────────┐
│  /login (client)    │
│  - signInWithOAuth  │
│  - Save PKCE        │
└──────┬──────────────┘
       │ 2. Redirect to Google
       ▼
┌─────────────────────┐
│   Google OAuth      │
└──────┬──────────────┘
       │ 3. Redirect back with code
       ▼
┌──────────────────────────┐
│  /auth/callback (CLIENT) │ ← KEY CHANGE!
│  - exchangeCodeForSession│
│  - Access PKCE from      │
│    browser storage       │
└──────┬───────────────────┘
       │ 4. Call API to create JWT
       ▼
┌─────────────────────────┐
│  /api/auth/create-token │
│  - Verify user          │
│  - Check profile        │
│  - Create JWT           │
│  - Set cookie           │
└──────┬──────────────────┘
       │ 5. Redirect to app
       ▼
┌─────────────────────┐
│  /profile-setup or  │
│  /dashboard         │
└─────────────────────┘
```

### 1. Client-Side Callback Page (`app/auth/callback/page.tsx`)

```typescript
'use client'

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      
      // Exchange code for session (PKCE verifier from browser storage)
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      // Call API to create JWT and check profile
      const response = await fetch('/api/auth/create-token', {
        method: 'POST',
        body: JSON.stringify({
          userId: data.session.user.id,
          email: data.session.user.email,
        }),
      })
      
      const result = await response.json()
      router.push(result.redirectTo) // /profile-setup or /dashboard
    }
    
    handleCallback()
  }, [])
}
```

**Keuntungan:**
- ✅ PKCE verifier accessible dari browser storage
- ✅ No cookies forwarding issues
- ✅ Cleaner separation of concerns
- ✅ Better error handling di client

### 2. Update API Create Token (`app/api/auth/create-token/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  const { userId, email } = await request.json()
  
  // Verify user exists
  const supabase = createAdminClient()
  const { data: user } = await supabase.auth.admin.getUserById(userId)
  
  // Check if profile exists
  const { data: motherProfile } = await supabase
    .from('mother_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  const redirectTo = !motherProfile ? '/profile-setup' : '/dashboard'
  
  // Create JWT token
  const token = await createUserToken(userId, email)
  
  // Set cookie and return redirect URL
  const response = NextResponse.json({ success: true, token, redirectTo })
  response.cookies.set('auth-token', token, { httpOnly: true, ... })
  
  return response
}
```

### 3. Simplified Login Page (`app/(auth)/login/page.tsx`)

```typescript
const handleGoogleLogin = async () => {
  const supabase = createClient()
  
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
```

**Tidak perlu:**
- ❌ Custom cookie handlers
- ❌ Manual PKCE management
- ❌ signOut() before login
- ❌ Complex middleware session refresh

### 4. Simplified Supabase Clients

**Client (`lib/supabase/client.ts`):**
```typescript
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server (`lib/supabase/server.ts`):**
```typescript
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

## Flow Lengkap

1. **User klik "Masuk dengan Google"**
   - Client: `signInWithOAuth()` → PKCE verifier saved in browser

2. **Redirect ke Google OAuth**
   - Browser navigates to Google

3. **Google redirect kembali**
   - URL: `/auth/callback?code=...`
   - Loads client-side page (page.tsx, NOT route.ts)

4. **Client-side callback handling**
   - `exchangeCodeForSession(code)` → Uses PKCE from browser ✅
   - Session obtained successfully

5. **Call API to create JWT**
   - POST `/api/auth/create-token`
   - Server verifies user and checks profile
   - Returns JWT token and redirect URL

6. **Redirect to app**
   - `/profile-setup` (if no profile)
   - `/dashboard` (if profile exists)

## Kenapa Solusi Ini Bekerja?

1. **Browser Storage Access**: Client-side callback bisa akses PKCE verifier dari localStorage/cookies browser
2. **No Cookie Forwarding**: Tidak perlu forward cookies dari client ke server
3. **Separation of Concerns**: OAuth handling di client, JWT creation di server
4. **Standard Flow**: Mengikuti OAuth 2.0 PKCE flow dengan benar

## Testing

```bash
# Test flow:
1. Buka /login
2. Klik "Masuk dengan Google"
3. Selesaikan OAuth di Google
4. ✅ Callback handled di client-side
5. ✅ PKCE verifier found
6. ✅ Session created
7. ✅ JWT token created
8. ✅ Redirect ke /profile-setup atau /dashboard
9. ✅ Login berhasil SEKALI SAJA!
```

## Perbandingan

### Sebelum (Server-Side Callback)
```
Browser → Google → Server Callback
                    ↓
                    ❌ No PKCE verifier
                    ❌ Cookies not forwarded
                    ❌ Error!
```

### Sesudah (Client-Side Callback)
```
Browser → Google → Client Callback
                    ↓
                    ✅ PKCE verifier accessible
                    ✅ Session created
                    ✅ Success!
```

## Kesimpulan

Masalah PKCE diselesaikan dengan mengubah OAuth callback dari server-side (route.ts) ke client-side (page.tsx). Ini memastikan PKCE verifier yang disimpan di browser bisa diakses saat exchange code untuk session.

**Hasil: Login sekali langsung berhasil! 🎉**

## File Changes

- ✅ Created: `app/auth/callback/page.tsx` (client-side callback)
- ✅ Updated: `app/api/auth/create-token/route.ts` (return redirectTo)
- ✅ Backup: `app/auth/callback/route.ts.backup` (old server-side callback)
- ✅ Simplified: `lib/supabase/client.ts` (no custom config)
- ✅ Updated: `lib/supabase/server.ts` (use getAll/setAll)
- ✅ Updated: `middleware.ts` (session refresh)
