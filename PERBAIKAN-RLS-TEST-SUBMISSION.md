# Perbaikan RLS Error pada Test Submission

## Masalah
Ketika submit pre-test, muncul error:
```
Error storing test submission: {
  code: '42501',
  message: 'new row violates row-level security policy for table "test_submissions"'
}
```

## Penyebab
Row Level Security (RLS) di Supabase memblokir insert operations meskipun kita sudah menggunakan service role key.

## Perbaikan yang Sudah Dilakukan

### 1. Update API Routes
✅ File yang diupdate:
- `app/api/test/submit-pre/route.ts`
- `app/api/test/submit-post/route.ts`

Perubahan: Menambahkan type assertion `as any` pada insert operations untuk bypass TypeScript type checking yang terlalu strict.

### 2. Dokumentasi
✅ Dibuat file dokumentasi:
- `docs/APPLY-RLS-FIX.md` - Penjelasan lengkap tentang masalah dan solusi

### 3. SQL Scripts
✅ Dibuat 2 script SQL untuk dipilih:

**Opsi A (Recommended untuk Development):**
- `scripts/disable-rls.sql` - Disable RLS sepenuhnya

**Opsi B (Recommended untuk Production):**
- `scripts/create-service-role-policies.sql` - Buat RLS policies untuk service role

## Langkah Selanjutnya (PENTING!)

Anda harus menjalankan salah satu script SQL di Supabase:

### Cara Menjalankan Script SQL:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New query"

3. **Pilih dan Jalankan Salah Satu Script:**

   **OPSI A - Disable RLS (Paling Simple untuk Development):**
   ```sql
   -- Copy paste isi file scripts/disable-rls.sql
   ALTER TABLE test_submissions DISABLE ROW LEVEL SECURITY;
   ALTER TABLE session_progress DISABLE ROW LEVEL SECURITY;
   ```
   
   **OPSI B - Buat Service Role Policies (Lebih Aman):**
   ```sql
   -- Copy paste isi file scripts/create-service-role-policies.sql
   -- (Script lengkap ada di file tersebut)
   ```

4. **Klik "Run" atau tekan Ctrl+Enter**

5. **Verifikasi hasilnya**
   - Seharusnya muncul "Success" message
   - Tidak ada error

## Testing Setelah Apply Fix

1. Restart development server:
   ```bash
   # Tekan Ctrl+C untuk stop server
   npm run dev
   ```

2. Test flow lengkap:
   - Login sebagai user
   - Klik "Mulai Pre-Test"
   - Jawab semua 23 pertanyaan
   - Klik "Submit"
   - ✅ Seharusnya berhasil dan redirect ke dashboard
   - ✅ Day 1 session seharusnya unlocked

3. Cek di Supabase Dashboard:
   - Buka "Table Editor"
   - Pilih table `test_submissions`
   - Seharusnya ada row baru dengan test_type = 'pre'
   - Pilih table `session_progress`
   - Seharusnya ada row baru dengan day = 1

## Troubleshooting

Jika masih error setelah apply SQL script:

1. **Cek apakah script berhasil dijalankan:**
   ```sql
   SELECT 
     tablename,
     rowsecurity as rls_enabled
   FROM pg_tables
   WHERE tablename IN ('test_submissions', 'session_progress');
   ```
   - Jika pakai Opsi A: `rls_enabled` harus `false`
   - Jika pakai Opsi B: `rls_enabled` harus `true`

2. **Cek policies yang aktif (jika pakai Opsi B):**
   ```sql
   SELECT 
     tablename,
     policyname,
     roles
   FROM pg_policies
   WHERE tablename IN ('test_submissions', 'session_progress');
   ```
   - Seharusnya ada policies dengan roles = `{service_role}`

3. **Cek service role key di .env.local:**
   - Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada dan benar
   - Restart server setelah update .env.local

## Rekomendasi

Untuk development/testing: **Gunakan Opsi A** (disable RLS)
- Lebih simple
- Tidak perlu manage policies
- Cukup untuk testing

Untuk production: **Gunakan Opsi B** (service role policies)
- Lebih aman
- RLS tetap aktif
- Service role tetap bisa bypass dengan policies yang benar

## Status
- ✅ Kode sudah diperbaiki
- ⏳ Menunggu user menjalankan SQL script
- ⏳ Testing setelah SQL script dijalankan
