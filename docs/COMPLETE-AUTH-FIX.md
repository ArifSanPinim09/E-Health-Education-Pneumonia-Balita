# Complete Authentication Fix - All Pages

## Summary

Fixed authentication issues across ALL pages and API routes by migrating from Supabase Auth to custom JWT cookie-based authentication.

## Root Cause

The application was using TWO different authentication systems:
1. **Custom JWT** - Stored in httpOnly cookies (`auth-token`)
2. **Supabase Auth** - Expected by `createClient()` and RLS policies

This mismatch caused:
- 401 Unauthorized errors
- RLS policy violations
- Redirects to login page

## Solution

Migrated ALL API routes to use:
1. **Custom JWT from cookies** - For authentication
2. **Admin client** - To bypass RLS (since we don't use Supabase Auth)
3. **getUserFromCookie helper** - Centralized user ID extraction

## Files Fixed

### ✅ Authentication Core
- `lib/auth/jwt.ts` - Centralized JWT helpers
- `lib/auth/get-user-from-cookie.ts` - Helper to get user ID from cookie
- `middleware.ts` - Route protection with cookie verification

### ✅ Test APIs
- `app/api/test/submit-pre/route.ts` - Use cookie + admin client
- `app/api/test/submit-post/route.ts` - Use cookie + admin client
- `app/api/questions/route.ts` - Use cookie + admin client

### ✅ Session APIs
- `app/api/session/complete/route.ts` - Use cookie + admin client
- `app/api/session/check-unlock/route.ts` - Already using cookie

### ✅ Profile APIs
- `app/api/profile/create/route.ts` - Already using cookie
- `app/api/profile/get/route.ts` - Already using cookie

### ✅ Progress API
- `app/api/progress/get/route.ts` - Already using cookie

### ✅ Frontend Pages
- `app/(user)/pre-test/page.tsx` - Removed localStorage, use cookie
- `app/(user)/post-test/page.tsx` - Removed localStorage, use cookie
- `app/(user)/results/page.tsx` - Removed localStorage, use cookie
- `app/(user)/session/[day]/page.tsx` - Already using cookie

## Authentication Flow

### Before (Broken):
```
User Login → Custom JWT in cookie
           ↓
API Route → Tries to use Supabase Auth (doesn't exist)
           ↓
RLS Policy → Checks auth.uid() (null)
           ↓
ERROR: 401 or RLS violation
```

### After (Fixed):
```
User Login → Custom JWT in cookie
           ↓
API Route → Extract user ID from cookie
           ↓
Admin Client → Bypass RLS (we verify user ID ourselves)
           ↓
SUCCESS: Data inserted/retrieved
```

## Why Use Admin Client?

**Question:** Isn't bypassing RLS insecure?

**Answer:** No, because:
1. Middleware verifies JWT token BEFORE request reaches API
2. API extracts and validates user ID from verified token
3. API explicitly filters by user ID in queries
4. Admin client only bypasses RLS, NOT authentication

**Example:**
```typescript
// 1. Middleware already verified token
// 2. Get user ID from verified token
const userId = await getUserFromCookie()

// 3. Use admin client to bypass RLS
const supabase = createAdminClient()

// 4. Explicitly filter by user ID (security enforced in code)
const { data } = await supabase
  .from('test_submissions')
  .insert({ user_id: userId, ... })  // ← User ID from verified token
```

## Testing Checklist

### ✅ User Flow
- [x] Login with OTP
- [x] Profile setup
- [x] Dashboard access
- [x] Pre-test submission
- [x] Session 1-5 access
- [x] Session completion
- [x] 24-hour lock mechanism
- [x] Post-test submission
- [x] Results page

### ✅ API Routes
- [x] `/api/auth/send-otp` - Public
- [x] `/api/auth/verify-otp` - Public, sets cookie
- [x] `/api/profile/create` - Cookie auth
- [x] `/api/profile/get` - Cookie auth
- [x] `/api/questions` - Cookie auth
- [x] `/api/test/submit-pre` - Cookie auth + admin client
- [x] `/api/test/submit-post` - Cookie auth + admin client
- [x] `/api/session/complete` - Cookie auth + admin client
- [x] `/api/session/check-unlock` - Cookie auth
- [x] `/api/progress/get` - Cookie auth

### ✅ Security
- [x] Middleware verifies all protected routes
- [x] Cookies are httpOnly (XSS protection)
- [x] Cookies are SameSite=Lax (CSRF protection)
- [x] User ID extracted from verified JWT
- [x] No localStorage usage (more secure)

## Common Patterns

### Pattern 1: Simple GET with User Data
```typescript
import { getUserFromCookie } from '@/lib/auth/get-user-from-cookie'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const userId = await getUserFromCookie()
  if (!userId) return unauthorized()
  
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('table')
    .select('*')
    .eq('user_id', userId)  // ← Filter by verified user ID
  
  return NextResponse.json({ data })
}
```

### Pattern 2: POST with User Data
```typescript
export async function POST(request: NextRequest) {
  const userId = await getUserFromCookie()
  if (!userId) return unauthorized()
  
  const body = await request.json()
  
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('table')
    .insert({
      user_id: userId,  // ← Use verified user ID
      ...body
    })
  
  return NextResponse.json({ success: !error })
}
```

## Migration Guide

If you need to add a new API route:

### ❌ DON'T DO THIS:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()  // ← Won't work!
  // ...
}
```

### ✅ DO THIS:
```typescript
import { getUserFromCookie } from '@/lib/auth/get-user-from-cookie'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const userId = await getUserFromCookie()  // ← Get from cookie
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const supabase = createAdminClient()  // ← Use admin client
  // ... use userId in queries
}
```

## Troubleshooting

### Issue: 401 Unauthorized
**Cause:** Cookie not being sent or token invalid
**Fix:** Check browser DevTools → Application → Cookies → `auth-token`

### Issue: RLS Policy Violation
**Cause:** Using `createClient()` instead of `createAdminClient()`
**Fix:** Change to `createAdminClient()` and filter by `userId` manually

### Issue: Redirect to Login
**Cause:** Middleware not seeing cookie or token invalid
**Fix:** Check middleware logs for verification errors

## Status

✅ **ALL PAGES FIXED**
✅ **ALL API ROUTES FIXED**
✅ **AUTHENTICATION WORKING END-TO-END**

---

**Last Updated:** March 2, 2026
**Status:** Complete and Production Ready
