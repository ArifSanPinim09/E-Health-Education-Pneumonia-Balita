# Panduan Auto Unlock All Sessions

## Overview

Fitur ini memungkinkan Anda untuk mengontrol apakah semua sessions (Day 1-5) otomatis ter-unlock saat user menyelesaikan pre-test, atau mengikuti flow normal (unlock per hari).

## Use Case

### Mode Auto Unlock (Untuk FGD/Demo/Testing)
- Semua user baru yang selesai pre-test langsung bisa akses Day 1-5
- Tidak perlu menunggu 24 jam antar sessions
- Cocok untuk:
  - Focus Group Discussion (FGD) dengan pihak puskesmas
  - Demo ke stakeholder
  - Testing fitur
  - UAT (User Acceptance Testing)

### Mode Normal (Production)
- User yang selesai pre-test hanya unlock Day 1
- Sessions berikutnya unlock otomatis setiap 24 jam
- Ini adalah flow production yang seharusnya

## Cara Menggunakan

### 1. Cek Status Saat Ini

```bash
npx tsx scripts/toggle-auto-unlock.ts status
```

### 2. Aktifkan Auto Unlock (Untuk FGD/Testing)

```bash
npx tsx scripts/toggle-auto-unlock.ts enable
```

Setelah command ini:
- ✅ Semua user BARU yang daftar dan selesai pre-test akan langsung unlock Day 1-5
- ⚠️ User yang sudah terdaftar sebelumnya tidak terpengaruh
- ⚠️ Restart development server atau redeploy agar perubahan berlaku

### 3. Nonaktifkan Auto Unlock (Kembali ke Flow Normal)

```bash
npx tsx scripts/toggle-auto-unlock.ts disable
```

Setelah command ini:
- ✅ Kembali ke flow normal (unlock per hari)
- ✅ User baru hanya unlock Day 1 setelah pre-test
- ⚠️ Restart development server atau redeploy agar perubahan berlaku

## Workflow untuk FGD

### Sebelum FGD (Minggu Depan)

```bash
# 1. Aktifkan auto unlock
npx tsx scripts/toggle-auto-unlock.ts enable

# 2. Restart development server
# Ctrl+C untuk stop, lalu npm run dev lagi

# 3. Verifikasi status
npx tsx scripts/toggle-auto-unlock.ts status
```

### Saat FGD
- Peserta FGD bisa daftar/login seperti biasa
- Setelah selesai pre-test, mereka langsung bisa akses semua Day 1-5
- Tidak perlu menunggu 24 jam

### Setelah FGD (Kembali ke Normal)

```bash
# 1. Nonaktifkan auto unlock
npx tsx scripts/toggle-auto-unlock.ts disable

# 2. Restart development server atau redeploy
# Ctrl+C untuk stop, lalu npm run dev lagi

# 3. Verifikasi status
npx tsx scripts/toggle-auto-unlock.ts status
```

## Technical Details

### Environment Variable
```env
# Di file .env.local
AUTO_UNLOCK_ALL_SESSIONS=true   # Enable auto unlock
AUTO_UNLOCK_ALL_SESSIONS=false  # Disable (flow normal)
```

### File yang Dimodifikasi
1. `lib/utils/session-unlock.ts` - Helper functions untuk unlock sessions
2. `app/api/test/submit-pre/route.ts` - API yang dipanggil saat submit pre-test
3. `scripts/toggle-auto-unlock.ts` - Script untuk toggle feature flag
4. `.env.local.example` - Template environment variables

### Behavior

#### Saat AUTO_UNLOCK_ALL_SESSIONS=true
```typescript
// User selesai pre-test
// ↓
// Insert ke session_progress:
// - Day 1: unlocked_at = now
// - Day 2: unlocked_at = now
// - Day 3: unlocked_at = now
// - Day 4: unlocked_at = now
// - Day 5: unlocked_at = now
```

#### Saat AUTO_UNLOCK_ALL_SESSIONS=false
```typescript
// User selesai pre-test
// ↓
// Insert ke session_progress:
// - Day 1: unlocked_at = now
// (Day 2-5 akan unlock otomatis setiap 24 jam via cron/logic lain)
```

## Catatan Penting

1. **Restart Required**: Setelah toggle, HARUS restart server atau redeploy
2. **User Baru Only**: Perubahan hanya berlaku untuk user yang daftar SETELAH toggle
3. **User Lama**: User yang sudah terdaftar tidak terpengaruh
4. **Production**: Jangan lupa disable setelah FGD selesai
5. **Vercel Deploy**: Jika deploy di Vercel, set environment variable di dashboard Vercel juga

## Troubleshooting

### Script tidak jalan
```bash
# Pastikan tsx terinstall
npm install -D tsx

# Atau gunakan ts-node
npx ts-node scripts/toggle-auto-unlock.ts status
```

### Perubahan tidak berlaku
```bash
# 1. Cek file .env.local
cat .env.local | grep AUTO_UNLOCK_ALL_SESSIONS

# 2. Restart server
# Ctrl+C lalu npm run dev

# 3. Verifikasi di code
# Cek console log saat user submit pre-test
```

### User lama ingin unlock semua sessions
```bash
# Gunakan script yang sudah ada
npx tsx scripts/unlock-all-sessions-testing.ts user@example.com
```

## Support

Jika ada pertanyaan atau masalah, hubungi developer atau cek dokumentasi di:
- `scripts/toggle-auto-unlock.ts` - Source code script
- `lib/utils/session-unlock.ts` - Helper functions
- `app/api/test/submit-pre/route.ts` - API implementation
