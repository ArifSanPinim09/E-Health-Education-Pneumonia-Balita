# Checkpoint 7: Manual Testing Checklist

## Prerequisites
- [ ] Development server is running (`npm run dev`)
- [ ] Supabase project is configured and accessible
- [ ] Database migrations have been applied
- [ ] Admin user has been seeded

## Test 1: User OTP Login Flow

### Steps:
1. [ ] Navigate to http://localhost:3000
2. [ ] Click "Masuk" or login button on landing page
3. [ ] Enter a valid email address
4. [ ] Click "Kirim Kode OTP"
5. [ ] Check Supabase Auth logs or email inbox for OTP code
6. [ ] Enter the 6-digit OTP code
7. [ ] Click "Verifikasi"

### Expected Results:
- [ ] OTP is sent successfully (check Supabase dashboard)
- [ ] Success message appears after sending OTP
- [ ] OTP input field appears
- [ ] After verification, user is redirected to profile setup (first time) or dashboard (returning user)
- [ ] Token is stored in browser (check cookies/localStorage)

### Actual Results:
```
[Record your observations here]
```

---

## Test 2: Profile Setup for New Users

### Steps:
1. [ ] After successful OTP login (first time user)
2. [ ] Verify redirect to `/profile-setup`
3. [ ] Fill in Mother Information:
   - [ ] Name: "Ibu Test"
   - [ ] Age: 30
   - [ ] Religion: "Islam"
   - [ ] Occupation: "Ibu Rumah Tangga"
   - [ ] Address: "Jl. Test No. 123"
   - [ ] Phone: "081234567890"
4. [ ] Fill in Child Information:
   - [ ] Name: "Anak Test"
   - [ ] Birth Date: Select a date (e.g., 2 years ago)
   - [ ] Gender: Select "Laki-laki" or "Perempuan"
5. [ ] Click "Simpan Profil"

### Expected Results:
- [ ] Form validation works (required fields show errors if empty)
- [ ] Age is calculated automatically from birth date
- [ ] Profile is saved to database
- [ ] User is redirected to dashboard after successful save
- [ ] Profile data appears in Supabase database tables (mother_profiles, child_profiles)

### Actual Results:
```
[Record your observations here]
```

---

## Test 3: Admin Login Flow

### Steps:
1. [ ] Navigate to http://localhost:3000/admin-login
2. [ ] Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123` (or as configured)
3. [ ] Click "Masuk"

### Expected Results:
- [ ] Admin login page loads correctly
- [ ] Form validation works
- [ ] Invalid credentials show error message
- [ ] Valid credentials redirect to admin panel/dashboard
- [ ] Admin token is stored
- [ ] Admin has access to admin-only routes

### Actual Results:
```
[Record your observations here]
```

---

## Test 4: Middleware Protection

### Test 4a: Unauthenticated Access to User Routes
1. [ ] Open incognito/private browser window
2. [ ] Try to access these URLs directly:
   - [ ] http://localhost:3000/profile-setup
   - [ ] http://localhost:3000/dashboard
   - [ ] http://localhost:3000/pre-test
   - [ ] http://localhost:3000/post-test

### Expected Results:
- [ ] All routes redirect to `/login`
- [ ] No protected content is visible
- [ ] Appropriate error/redirect message appears

### Test 4b: Unauthenticated Access to Admin Routes
1. [ ] Open incognito/private browser window
2. [ ] Try to access these URLs directly:
   - [ ] http://localhost:3000/admin/dashboard
   - [ ] http://localhost:3000/admin/respondents
   - [ ] http://localhost:3000/admin/questions

### Expected Results:
- [ ] All routes redirect to `/admin-login`
- [ ] No admin content is visible

### Test 4c: User Token Cannot Access Admin Routes
1. [ ] Login as regular user (OTP flow)
2. [ ] Try to access admin routes

### Expected Results:
- [ ] User is blocked from admin routes
- [ ] Redirected to appropriate page

### Test 4d: Admin Token Cannot Access User Routes
1. [ ] Login as admin
2. [ ] Try to access user routes (dashboard, pre-test, etc.)

### Expected Results:
- [ ] Admin is blocked from user routes or redirected appropriately

### Actual Results:
```
[Record your observations here]
```

---

## Test 5: Token Persistence and Expiry

### Steps:
1. [ ] Login as user
2. [ ] Close browser
3. [ ] Reopen browser and navigate to dashboard
4. [ ] Verify user is still logged in (within 30 days)

### Expected Results:
- [ ] User remains logged in
- [ ] Token is persisted correctly
- [ ] No re-authentication required

### Actual Results:
```
[Record your observations here]
```

---

## Test 6: Error Handling

### Test 6a: Invalid Email Format
1. [ ] Enter invalid email: "notanemail"
2. [ ] Try to send OTP

### Expected Results:
- [ ] Error message: "Format email tidak valid"

### Test 6b: Invalid OTP Code
1. [ ] Enter wrong OTP: "000000"
2. [ ] Try to verify

### Expected Results:
- [ ] Error message: "Kode OTP salah atau kadaluarsa"

### Test 6c: Network Error Simulation
1. [ ] Disconnect internet
2. [ ] Try to submit form

### Expected Results:
- [ ] Error message: "Koneksi gagal, silakan coba lagi"

### Actual Results:
```
[Record your observations here]
```

---

## Test 7: Database Verification

### Steps:
1. [ ] Login to Supabase dashboard
2. [ ] Check `auth.users` table for test user
3. [ ] Check `mother_profiles` table for profile data
4. [ ] Check `child_profiles` table for child data
5. [ ] Check `session_progress` table for Day 1 unlock (after pre-test)

### Expected Results:
- [ ] User exists in auth.users
- [ ] Profile data is correctly stored
- [ ] Child age is calculated correctly (years, months, days)
- [ ] Assessment date is set to current date
- [ ] Foreign key relationships are correct

### Actual Results:
```
[Record your observations here]
```

---

## Test 8: Returning User Flow

### Steps:
1. [ ] Login with email that already has profile
2. [ ] Verify OTP

### Expected Results:
- [ ] User skips profile setup
- [ ] Redirected directly to dashboard
- [ ] Profile data is loaded correctly

### Actual Results:
```
[Record your observations here]
```

---

## Test 9: Mobile Responsiveness

### Steps:
1. [ ] Open DevTools and set viewport to 375px width
2. [ ] Test all pages:
   - [ ] Landing page
   - [ ] Login page
   - [ ] Admin login page
   - [ ] Profile setup page

### Expected Results:
- [ ] All pages are readable and functional
- [ ] No horizontal scrolling
- [ ] Touch targets are at least 44x44px
- [ ] Forms are easy to fill on mobile

### Actual Results:
```
[Record your observations here]
```

---

## Test 10: API Endpoints Direct Testing

### Using curl or Postman:

#### Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

#### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

#### Create Profile (with token)
```bash
curl -X POST http://localhost:3000/api/profile/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "mother": {
      "name": "Ibu Test",
      "age": 30,
      "religion": "Islam",
      "occupation": "Ibu Rumah Tangga",
      "address": "Jl. Test",
      "phone": "081234567890"
    },
    "child": {
      "name": "Anak Test",
      "birth_date": "2022-01-01",
      "gender": "male"
    }
  }'
```

### Expected Results:
- [ ] All endpoints return appropriate responses
- [ ] Error handling works correctly
- [ ] Authentication is enforced where required

### Actual Results:
```
[Record your observations here]
```

---

## Summary

### Issues Found:
```
[List any issues discovered during testing]
```

### Recommendations:
```
[List any improvements or fixes needed]
```

### Sign-off:
- [ ] All critical flows work end-to-end
- [ ] Authentication is secure and functional
- [ ] Profile setup works correctly
- [ ] Middleware protection is effective
- [ ] Ready to proceed to next tasks

**Tested by:** _______________
**Date:** _______________
**Status:** [ ] PASS [ ] FAIL [ ] NEEDS REVIEW
