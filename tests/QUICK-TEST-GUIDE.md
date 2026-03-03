# Quick Test Guide - Checkpoint 7

## 🚀 5-Minute Quick Test

### Setup (One-time)
```bash
# 1. Generate admin hash
npm run generate:hash admin123
# Copy hash to .env.local as ADMIN_PASSWORD_HASH

# 2. Seed admin
npm run seed:admin

# 3. Start server
npm run dev
```

### Test User Flow (2 minutes)
1. Go to http://localhost:3000
2. Click "Masuk" button
3. Enter: `test@example.com`
4. Click "Kirim Kode OTP"
5. Check Supabase dashboard > Auth > Logs for OTP
6. Enter OTP code
7. Fill profile form:
   - Mother: Ibu Test, 30, Islam, Ibu Rumah Tangga, Jl. Test, 081234567890
   - Child: Anak Test, 2022-01-01, Laki-laki
8. Click "Simpan Profil"
9. ✅ Should redirect to dashboard

### Test Admin Flow (1 minute)
1. Go to http://localhost:3000/admin-login
2. Email: `admin@example.com`
3. Password: `admin123`
4. Click "Masuk"
5. ✅ Should login successfully

### Test Security (1 minute)
1. Open incognito window
2. Try: http://localhost:3000/profile-setup
3. ✅ Should redirect to login
4. Try: http://localhost:3000/admin/dashboard
5. ✅ Should redirect to admin login

### Run Automated Tests (1 minute)
```bash
./tests/checkpoint-7-test.sh
```
✅ All tests should pass

## 📋 Checklist

- [ ] User OTP login works
- [ ] Profile setup saves data
- [ ] Admin login works
- [ ] Protected routes redirect
- [ ] Automated tests pass

## 🐛 Quick Troubleshooting

**OTP not working?**
→ Check Supabase dashboard > Auth > Logs

**Admin login fails?**
→ Run `npm run seed:admin` again

**Redirects not working?**
→ Clear cookies and try again

**Database errors?**
→ Check if migrations are applied in Supabase

## ✅ Success = All 5 checkboxes checked!

## 📚 Full Documentation

- Detailed tests: `tests/checkpoint-7-manual-tests.md`
- Setup guide: `tests/CHECKPOINT-7-SETUP.md`
- Summary: `docs/CHECKPOINT-7-SUMMARY.md`
