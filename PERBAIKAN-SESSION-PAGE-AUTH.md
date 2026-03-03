# Perbaikan Authentication di Session Page

## Masalah
Ketika mengakses halaman session (misalnya `/session/1`), user di-redirect ke halaman login meskipun sudah terautentikasi. Log menunjukkan:
```
✅ Auth verified for: /session/1 User: 85ebc689-ddc2-4737-b37d-363aec55f229
GET /session/1 200 in 63ms
🔒 Middleware checking: /login
✅ Public route, allowing: /login
GET /login 200 in 118ms
```

## Penyebab
Halaman `app/(user)/session/[day]/page.tsx` menggunakan `supabase.auth.getUser()` yang mencari Supabase Auth session di localStorage/cookies Supabase. Padahal aplikasi kita menggunakan custom JWT authentication yang disimpan di cookie `auth-token`.

Code yang bermasalah:
```typescript
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  router.push('/login');  // ❌ Selalu redirect karena tidak ada Supabase Auth session
  return;
}
```

## Solusi yang Diterapkan

### 1. Ganti Supabase Auth dengan API Call
Mengubah `checkSessionAccess()` function untuk menggunakan API endpoint yang sudah support cookie authentication:

**Sebelum:**
```typescript
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  router.push('/login');
  return;
}

const { data: session, error: sessionError } = await supabase
  .from('session_progress')
  .select('*')
  .eq('user_id', user.id)
  .eq('day', day)
  .maybeSingle();
```

**Sesudah:**
```typescript
const response = await fetch(`/api/session/check-unlock?day=${day}`);

if (!response.ok) {
  if (response.status === 401) {
    router.push('/login');
    return;
  }
  // Handle other errors
}

const result = await response.json();
const sessionData = result.data;
```

### 2. Hapus Import yang Tidak Digunakan
Menghapus `import { createClient } from '@/lib/supabase/client'` karena tidak lagi digunakan.

### 3. Update Logic untuk Match API Response
API `/api/session/check-unlock` mengembalikan:
```typescript
{
  success: true,
  data: {
    unlocked: boolean,
    unlock_time: string,
    remaining_ms: number,
    completed: boolean,
    completed_at: string | null
  }
}
```

Frontend sekarang menggunakan `sessionData.unlocked` untuk cek apakah session sudah unlock, bukan membandingkan timestamp secara manual.

## File yang Diubah
- ✅ `app/(user)/session/[day]/page.tsx`

## API Endpoint yang Digunakan
- ✅ `GET /api/session/check-unlock?day={day}` - Sudah menggunakan cookie authentication

## Testing

1. **Login sebagai user**
   ```
   Email: projectakhirsatu@gmail.com
   OTP: (dari email)
   ```

2. **Pastikan pre-test sudah selesai**
   - Pre-test harus diselesaikan dulu untuk unlock Day 1

3. **Akses session page**
   - Klik "Mulai" pada Day 1 di dashboard
   - Atau langsung akses `/session/1`

4. **Expected Result:**
   - ✅ Halaman session terbuka tanpa redirect ke login
   - ✅ Konten session ditampilkan
   - ✅ Tombol "Selesai" muncul setelah scroll 80%

5. **Cek di browser console:**
   - Tidak ada error
   - Tidak ada redirect loop

## Pola Authentication yang Konsisten

Semua halaman user sekarang menggunakan pola yang sama:

### ❌ JANGAN (Old Pattern)
```typescript
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### ✅ LAKUKAN (New Pattern)
```typescript
// Option 1: Fetch dari API yang sudah support cookie auth
const response = await fetch('/api/endpoint');
if (!response.ok) {
  if (response.status === 401) {
    router.push('/login');
  }
}

// Option 2: Biarkan middleware handle auth, langsung fetch data
const response = await fetch('/api/endpoint');
const data = await response.json();
```

## Halaman yang Sudah Diperbaiki
- ✅ `app/(user)/pre-test/page.tsx` - Tidak cek localStorage
- ✅ `app/(user)/post-test/page.tsx` - Tidak cek localStorage
- ✅ `app/(user)/results/page.tsx` - Tidak cek localStorage
- ✅ `app/(user)/session/[day]/page.tsx` - Tidak pakai supabase.auth.getUser()
- ✅ `app/(user)/dashboard/page.tsx` - (perlu dicek jika ada masalah)

## Status
✅ Perbaikan selesai
⏳ Menunggu user testing
