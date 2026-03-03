# RLS Policy Fix untuk Test Submissions

## Masalah
Error saat submit pre-test/post-test:
```
new row violates row-level security policy for table "test_submissions"
```

## Penyebab
Meskipun kita menggunakan `createAdminClient()` dengan service role key, RLS policies masih memblokir insert operations.

## Solusi yang Diterapkan

### 1. Menggunakan Admin Client dengan Type Assertion
File yang diupdate:
- `app/api/test/submit-pre/route.ts`
- `app/api/test/submit-post/route.ts`

Perubahan:
```typescript
// Sebelum
const { error } = await supabase
  .from('test_submissions')
  .insert({...})

// Sesudah
const { error } = await supabase
  .from('test_submissions')
  .insert({...} as any)
```

Type assertion `as any` diperlukan karena TypeScript types untuk insert mungkin tidak sesuai dengan schema aktual.

### 2. Verifikasi Service Role Key
Pastikan `.env.local` memiliki:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Service role key ini memiliki akses penuh dan bypass RLS.

## Jika Masalah Masih Terjadi

### Opsi 1: Disable RLS untuk test_submissions (Sementara)
Jalankan di Supabase SQL Editor:
```sql
ALTER TABLE test_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress DISABLE ROW LEVEL SECURITY;
```

⚠️ **PERINGATAN**: Ini menghilangkan keamanan RLS. Hanya untuk development/testing.

### Opsi 2: Buat RLS Policy yang Mengizinkan Service Role
Jalankan di Supabase SQL Editor:
```sql
-- Policy untuk test_submissions
CREATE POLICY "Service role can insert test submissions"
ON test_submissions
FOR INSERT
TO service_role
USING (true)
WITH CHECK (true);

-- Policy untuk session_progress
CREATE POLICY "Service role can insert session progress"
ON session_progress
FOR INSERT
TO service_role
USING (true)
WITH CHECK (true);
```

### Opsi 3: Buat Policy Berdasarkan User ID
Jika ingin tetap menggunakan RLS dengan keamanan:
```sql
-- Policy untuk authenticated users
CREATE POLICY "Users can insert their own test submissions"
ON test_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session progress"
ON session_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

⚠️ **CATATAN**: Opsi 3 tidak akan bekerja dengan custom JWT kita karena kita tidak menggunakan Supabase Auth. Gunakan Opsi 1 atau 2.

## Cara Mengecek RLS Policies

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Klik "Database" di sidebar
4. Klik "Tables"
5. Pilih table `test_submissions`
6. Klik tab "Policies"
7. Lihat policies yang aktif

## Rekomendasi untuk Production

Untuk production, gunakan salah satu dari:

1. **Service Role dengan Admin Client** (Current approach)
   - ✅ Aman karena kita verify JWT token dulu
   - ✅ Tidak perlu RLS policies
   - ✅ Lebih simple

2. **RLS dengan Supabase Auth**
   - Ganti custom JWT dengan Supabase Auth
   - Gunakan `supabase.auth.signInWithOtp()`
   - RLS policies akan bekerja otomatis

## Testing

Setelah apply fix, test dengan:
1. Login sebagai user
2. Klik "Mulai Pre-Test"
3. Jawab semua pertanyaan
4. Klik "Submit"
5. Seharusnya berhasil dan redirect ke dashboard

Jika masih error, cek:
- Console browser untuk error messages
- Terminal server untuk error logs
- Supabase Dashboard > Logs untuk database errors
