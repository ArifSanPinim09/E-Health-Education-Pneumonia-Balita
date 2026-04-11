# Quick Start: Auto Unlock Sessions untuk FGD

## TL;DR - Untuk FGD Minggu Depan

### 1️⃣ Sebelum FGD (Aktifkan Auto Unlock)

```bash
# Aktifkan auto unlock
npx tsx scripts/toggle-auto-unlock.ts enable

# Restart development server
# Tekan Ctrl+C untuk stop, lalu:
npm run dev
```

✅ Sekarang semua user baru yang daftar akan langsung unlock Day 1-5 setelah pre-test!

### 2️⃣ Saat FGD Berlangsung

- Peserta FGD bisa daftar/login seperti biasa
- Setelah selesai pre-test → langsung bisa akses semua materi Day 1-5
- Tidak perlu menunggu 24 jam

### 3️⃣ Setelah FGD Selesai (Kembali ke Normal)

```bash
# Nonaktifkan auto unlock
npx tsx scripts/toggle-auto-unlock.ts disable

# Restart development server
# Tekan Ctrl+C untuk stop, lalu:
npm run dev
```

✅ Kembali ke flow normal (unlock per hari)

---

## Command Reference

```bash
# Cek status saat ini
npx tsx scripts/toggle-auto-unlock.ts status

# Aktifkan auto unlock (untuk FGD/testing)
npx tsx scripts/toggle-auto-unlock.ts enable

# Nonaktifkan auto unlock (kembali ke normal)
npx tsx scripts/toggle-auto-unlock.ts disable
```

---

## Catatan Penting

⚠️ **Restart Required**: Setelah enable/disable, HARUS restart server

⚠️ **User Baru Only**: Perubahan hanya berlaku untuk user yang daftar SETELAH toggle

⚠️ **Jangan Lupa Disable**: Setelah FGD selesai, jangan lupa disable agar kembali ke flow normal

---

## Troubleshooting

### Script tidak jalan?

```bash
# Install tsx jika belum ada
npm install -D tsx

# Atau gunakan ts-node
npx ts-node scripts/toggle-auto-unlock.ts status
```

### Perubahan tidak berlaku?

1. Pastikan sudah restart server (Ctrl+C lalu npm run dev)
2. Cek file .env.local: `cat .env.local | grep AUTO_UNLOCK_ALL_SESSIONS`
3. Coba logout dan login ulang di browser

### User lama ingin unlock semua sessions?

```bash
# Gunakan script khusus untuk unlock user tertentu
npx tsx scripts/unlock-all-sessions-testing.ts user@example.com
```

---

## Dokumentasi Lengkap

Untuk penjelasan detail, lihat: `PANDUAN-AUTO-UNLOCK-SESSIONS.md`
