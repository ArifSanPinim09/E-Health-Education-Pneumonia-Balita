# Admin Setup Guide

## Cara Membuat Akun Admin

### Langkah 1: Generate Password Hash

Jalankan command berikut dengan password yang Anda inginkan:

```bash
npx tsx scripts/generate-admin-hash.ts <password-anda>
```

**Contoh:**
```bash
npx tsx scripts/generate-admin-hash.ts admin123
```

**Output:**
```
Generated bcrypt hash:
$2b$10$5E3PA5M19H5DilQE.mmqxOVhW9dODiMFejbfrhfyX2joRDVTCMEV.

Add this to your .env.local file:
ADMIN_PASSWORD_HASH=$2b$10$5E3PA5M19H5DilQE.mmqxOVhW9dODiMFejbfrhfyX2joRDVTCMEV.
```

### Langkah 2: Update .env.local

Tambahkan atau update baris berikut di file `.env.local`:

```env
# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$5E3PA5M19H5DilQE.mmqxOVhW9dODiMFejbfrhfyX2joRDVTCMEV.
```

**Ganti:**
- `admin@example.com` dengan email admin yang Anda inginkan
- Hash dengan hasil dari langkah 1

### Langkah 3: Seed Admin ke Database

Jalankan script untuk membuat admin user di database:

```bash
npx tsx scripts/seed-admin.ts
```

**Output yang diharapkan:**
```
Seeding admin user...
✓ Admin user created successfully
Email: admin@example.com
ID: uuid-here
```

**Jika admin sudah ada:**
```
Admin user with email admin@example.com already exists
```

### Langkah 4: Login sebagai Admin

1. Buka browser dan navigasi ke: `http://localhost:3000/admin-login`
2. Masukkan:
   - **Email**: Email yang Anda set di `.env.local`
   - **Password**: Password yang Anda gunakan di langkah 1 (bukan hash!)
3. Klik "Masuk"
4. Anda akan diarahkan ke Admin Panel

## Troubleshooting

### Error: Missing Supabase credentials

```
Error: Missing Supabase credentials in .env.local
```

**Solusi:** Pastikan `.env.local` memiliki:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Error: Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH

```
Error: Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH in .env.local
```

**Solusi:** Jalankan langkah 1 dan 2 di atas.

### Error: Email atau password salah saat login

**Kemungkinan penyebab:**
1. Password yang dimasukkan salah (gunakan password asli, bukan hash)
2. Admin belum di-seed ke database (jalankan langkah 3)
3. Email tidak cocok dengan yang ada di database

**Cara cek:**
```bash
# Cek admin di database via Supabase Dashboard
# Table: admin_users
# Atau jalankan ulang seed script
npx tsx scripts/seed-admin.ts
```

## Contoh Lengkap

### 1. Generate hash untuk password "SecureAdmin123"

```bash
npx tsx scripts/generate-admin-hash.ts SecureAdmin123
```

### 2. Update .env.local

```env
ADMIN_EMAIL=researcher@university.edu
ADMIN_PASSWORD_HASH=$2b$10$abcdefghijklmnopqrstuvwxyz1234567890
```

### 3. Seed ke database

```bash
npx tsx scripts/seed-admin.ts
```

### 4. Login

- URL: `http://localhost:3000/admin-login`
- Email: `researcher@university.edu`
- Password: `SecureAdmin123`

## Keamanan

### Best Practices:

1. **Gunakan password yang kuat:**
   - Minimal 12 karakter
   - Kombinasi huruf besar, kecil, angka, dan simbol
   - Contoh: `MySecure@Admin2024!`

2. **Jangan commit .env.local:**
   - File ini sudah ada di `.gitignore`
   - Jangan pernah push ke Git

3. **Ganti password default:**
   - Jika menggunakan password contoh, segera ganti
   - Generate hash baru dan update database

4. **Simpan credentials dengan aman:**
   - Gunakan password manager
   - Jangan share via email/chat

## Update Password Admin

Jika ingin mengganti password admin:

### 1. Generate hash baru

```bash
npx tsx scripts/generate-admin-hash.ts PasswordBaru123
```

### 2. Update di database

Buka Supabase Dashboard → Table Editor → admin_users → Edit row → Update `password_hash`

Atau via SQL:

```sql
UPDATE admin_users 
SET password_hash = '$2b$10$NEW_HASH_HERE'
WHERE email = 'admin@example.com';
```

## Multiple Admin Users

Untuk membuat admin tambahan:

### 1. Generate hash untuk admin baru

```bash
npx tsx scripts/generate-admin-hash.ts Password456
```

### 2. Insert manual via Supabase Dashboard

Table: `admin_users`

Columns:
- `email`: `admin2@example.com`
- `password_hash`: `$2b$10$...` (dari langkah 1)

Atau via SQL:

```sql
INSERT INTO admin_users (email, password_hash)
VALUES ('admin2@example.com', '$2b$10$...');
```

## Admin Panel Features

Setelah login, admin dapat:

1. **Dashboard** - Lihat statistik:
   - Total users
   - Completed pre-tests
   - Completed post-tests
   - Average scores

2. **Manage Questions** - CRUD quiz questions:
   - Create new questions
   - Edit existing questions
   - Delete questions
   - Reorder questions

3. **View Respondents** - Lihat data user:
   - Profile information
   - Test scores
   - Session progress
   - Search and filter

4. **Export Data** - Download data:
   - Export to Excel (.xlsx)
   - All respondent data
   - Test results
   - Session completion

## Related Files

- `scripts/generate-admin-hash.ts` - Generate password hash
- `scripts/seed-admin.ts` - Seed admin to database
- `app/api/auth/admin-login/route.ts` - Admin login API
- `app/(auth)/admin-login/page.tsx` - Admin login page
- `middleware.ts` - Admin route protection

## Status

✅ Admin system fully implemented
✅ Password hashing with bcrypt
✅ Secure authentication
✅ Protected admin routes

---

**Created:** March 2, 2026
**Last Updated:** March 2, 2026
