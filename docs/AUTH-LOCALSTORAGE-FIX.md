# Authentication LocalStorage Fix

## Problem
Users were being redirected to `/login` when accessing protected pages (pre-test, post-test, results) even after successful authentication.

## Root Cause
The application had a mismatch in authentication storage:
- **Backend**: Token stored in httpOnly cookie (`auth-token`)
- **Frontend**: Pages looking for token in localStorage (`auth_token`)

This caused:
1. User logs in → Token saved to cookie ✅
2. User navigates to `/pre-test` → Page looks for token in localStorage ❌
3. Token not found in localStorage → Redirect to `/login` ❌

## Solution

### Removed localStorage Dependency
Since we're using httpOnly cookies for security (prevents XSS attacks), we removed all localStorage token checks from client-side pages.

**Why httpOnly cookies are better:**
- Cannot be accessed by JavaScript (XSS protection)
- Automatically sent with every request
- Managed by the browser
- More secure than localStorage

### Files Modified

**1. app/(user)/pre-test/page.tsx**
```typescript
// BEFORE
const token = localStorage.getItem('auth_token')
if (!token) {
  router.push('/login')
  return
}
const response = await fetch('/api/admin/questions', {
  headers: { Authorization: `Bearer ${token}` }
})

// AFTER
const response = await fetch('/api/admin/questions')
// Cookie is automatically sent with request
```

**2. app/(user)/post-test/page.tsx**
- Same fix as pre-test
- Removed localStorage checks
- Removed Authorization header

**3. app/(user)/results/page.tsx**
- Same fix as pre-test
- Removed localStorage checks
- Removed Authorization header

### How It Works Now

1. **Login Flow:**
   ```
   User enters OTP → API verifies → Creates JWT token → Saves to httpOnly cookie
   ```

2. **Protected Page Access:**
   ```
   User navigates to /pre-test
   → Middleware checks cookie
   → If valid: Allow access
   → If invalid: Redirect to /login
   ```

3. **API Calls:**
   ```
   fetch('/api/test/submit-pre', { method: 'POST', body: ... })
   → Cookie automatically sent
   → API extracts user ID from cookie
   → Processes request
   ```

### Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Login with OTP
       ▼
┌─────────────────┐
│  /api/auth/     │
│  verify-otp     │
└────────┬────────┘
         │
         │ 2. Set httpOnly cookie
         ▼
┌─────────────────┐
│   Set-Cookie:   │
│   auth-token=   │
│   JWT_TOKEN     │
└────────┬────────┘
         │
         │ 3. Navigate to /pre-test
         ▼
┌─────────────────┐
│   Middleware    │
│   Checks Cookie │
└────────┬────────┘
         │
         │ 4. Cookie valid?
         ├─ Yes → Allow
         └─ No  → Redirect /login
```

### Security Benefits

1. **XSS Protection**: JavaScript cannot access httpOnly cookies
2. **CSRF Protection**: SameSite=Lax prevents cross-site requests
3. **Automatic Management**: Browser handles cookie lifecycle
4. **No Manual Token Handling**: Reduces risk of token leakage

### Testing

1. Clear all cookies and localStorage
2. Login with OTP
3. Complete profile setup
4. Navigate to dashboard
5. Click "Mulai Pre-Test"
6. **Expected**: Pre-test page loads with questions
7. **Previous Bug**: Redirected to login

### Verification

Check browser DevTools:
```
Application → Cookies → localhost:3000
Should see: auth-token (httpOnly, SameSite=Lax)

Application → Local Storage → localhost:3000
Should NOT see: auth_token
```

### API Routes That Use Cookie Auth

All these routes now rely on cookies (no Authorization header needed):
- `/api/admin/questions` (GET)
- `/api/test/submit-pre` (POST)
- `/api/test/submit-post` (POST)
- `/api/progress/get` (GET)
- `/api/profile/get` (GET)
- `/api/session/complete` (POST)
- `/api/session/check-unlock` (GET)

### Related Files

- `app/(user)/pre-test/page.tsx` - Removed localStorage checks
- `app/(user)/post-test/page.tsx` - Removed localStorage checks
- `app/(user)/results/page.tsx` - Removed localStorage checks
- `middleware.ts` - Handles cookie-based auth
- `lib/auth/jwt.ts` - Centralized JWT helpers
- `app/api/auth/verify-otp/route.ts` - Sets httpOnly cookie

### Future Improvements

1. Add token refresh mechanism
2. Implement sliding session expiration
3. Add "Remember Me" option (longer expiry)
4. Consider using Supabase Auth sessions
5. Add logout functionality to clear cookie

## Status

✅ Fixed - Users can now access protected pages after authentication
✅ More secure - Using httpOnly cookies instead of localStorage
✅ Simpler code - No manual token management in client components
