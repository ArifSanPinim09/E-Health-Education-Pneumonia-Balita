# Authentication Cookie Fix

## Problem
Users were being redirected to `/login` when clicking "Mulai Pre-Test" even after successful OTP verification and profile setup.

## Root Cause
The issue was caused by:
1. Cookie not being properly set or read by middleware
2. Inconsistent JWT secret usage across different files
3. Redirect happening too quickly before cookie was fully set

## Solution

### 1. Centralized JWT Helper (`lib/auth/jwt.ts`)
Created a centralized JWT helper to ensure consistent token creation and verification:

```typescript
// lib/auth/jwt.ts
import { SignJWT, jwtVerify } from 'jose'

export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface TokenPayload {
  userId: string
  email: string
  type: 'user' | 'admin'
  role?: 'admin'
  iat?: number
  exp?: number
}

export async function createUserToken(userId: string, email: string): Promise<string>
export async function createAdminToken(adminId: string, email: string): Promise<string>
export async function verifyToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }>
```

### 2. Updated Files

**middleware.ts**
- Now imports `verifyToken` from centralized helper
- Added detailed logging for debugging
- Shows all cookies and verification status

**app/api/auth/verify-otp/route.ts**
- Now imports `createUserToken` from centralized helper
- Added cookie configuration logging
- Ensures consistent token payload structure

**app/api/auth/admin-login/route.ts**
- Now imports `createAdminToken` from centralized helper
- Consistent with user token creation

**app/(auth)/login/page.tsx**
- Increased delay from 100ms to 500ms before redirect
- Added `router.refresh()` to force middleware re-check

### 3. Token Payload Structure

**User Token:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "type": "user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Admin Token:**
```json
{
  "userId": "uuid",
  "email": "admin@example.com",
  "type": "admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 4. Cookie Configuration

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60, // 30 days for user
  path: '/',
}
```

## Debugging

### Check Logs
When accessing protected routes, you should see:
```
🍪 All cookies: ['auth-token']
🔍 Verifying token for: /pre-test
✅ Auth verified for: /pre-test User: uuid
```

If you see:
```
❌ No auth token found for: /pre-test
```
The cookie is not being set or sent.

If you see:
```
❌ Invalid token for: /pre-test
```
The JWT_SECRET might be different or token is malformed.

If you see:
```
❌ Wrong token type for: /pre-test Type: undefined
```
The token payload structure is incorrect.

### Verify Cookie in Browser
1. Open DevTools → Application → Cookies
2. Check for `auth-token` cookie
3. Verify it has:
   - Path: `/`
   - HttpOnly: ✓
   - SameSite: Lax
   - Expires: 30 days from now

### Test Token Manually
```bash
# In browser console after login
document.cookie.split(';').find(c => c.includes('auth-token'))
```

## Environment Variables

Ensure `.env.local` has:
```env
JWT_SECRET=your-jwt-secret-key-change-in-production-min-32-chars
```

**Important:** JWT_SECRET must be at least 32 characters for HS256 algorithm.

## Testing

1. Clear all cookies
2. Login with OTP
3. Complete profile setup
4. Navigate to dashboard
5. Click "Mulai Pre-Test"
6. Should stay on `/pre-test` page (not redirect to `/login`)

## Future Improvements

1. Add token refresh mechanism
2. Implement sliding session expiration
3. Add CSRF protection
4. Consider using Supabase Auth sessions instead of custom JWT
5. Add rate limiting for token verification

## Related Files

- `lib/auth/jwt.ts` - Centralized JWT helper
- `middleware.ts` - Route protection
- `app/api/auth/verify-otp/route.ts` - User authentication
- `app/api/auth/admin-login/route.ts` - Admin authentication
- `app/(auth)/login/page.tsx` - Login page with redirect logic

## Status

✅ Fixed - Users can now access protected routes after authentication
