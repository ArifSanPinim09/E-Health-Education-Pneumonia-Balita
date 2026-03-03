# Authentication System Documentation

## Overview

The E-Health Education Pneumonia Balita application implements a dual authentication system:
- **User Authentication**: OTP-based email authentication with 30-day tokens
- **Admin Authentication**: Email + password authentication with 7-day tokens

## Architecture

### Token Types

1. **User Token** (30-day expiry)
   - Stored in `auth-token` cookie
   - Contains: `userId`, `email`, `type: 'user'`
   - Used for accessing user routes: `/dashboard`, `/pre-test`, `/post-test`, `/session/*`, `/results`

2. **Admin Token** (7-day expiry)
   - Stored in `admin-token` cookie
   - Contains: `adminId`, `email`, `type: 'admin'`
   - Used for accessing admin routes: `/admin/*`

### Security Features

- **Rate Limiting**: 3 OTP attempts per hour per email
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **JWT Signing**: Tokens signed with HS256 algorithm
- **Secure Cookies**: Cookies marked as secure in production
- **SameSite Protection**: Cookies use `lax` SameSite policy

## API Endpoints

### User Authentication

#### Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Kode OTP telah dikirim ke email Anda",
  "email": "user@example.com"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "uuid",
  "requires_profile_setup": true
}
```

### Admin Authentication

#### Admin Login
```
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin_id": "uuid"
}
```

### Logout

#### Logout (User or Admin)
```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Berhasil logout"
}
```

## Middleware Protection

The `middleware.ts` file automatically protects routes:

- **Public Routes**: `/`, `/login`, `/admin-login`, `/auth/*`
- **User Protected Routes**: `/dashboard`, `/pre-test`, `/post-test`, `/session/*`, `/results`, `/profile-setup`
- **Admin Protected Routes**: `/admin/*`

Unauthenticated requests to protected routes are automatically redirected to the appropriate login page.

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```bash
# JWT Secret (minimum 32 characters)
JWT_SECRET=your-jwt-secret-key-change-in-production-min-32-chars

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=bcrypt-hashed-password
```

### 2. Generate Admin Password Hash

```bash
npm run generate:hash <your-password>
```

This will output a bcrypt hash. Copy it to `ADMIN_PASSWORD_HASH` in `.env.local`.

### 3. Seed Admin User

```bash
npm run seed:admin
```

This creates the admin user in the database using the credentials from `.env.local`.

## Usage in API Routes

### Verify User Token

```typescript
import { verifyUserToken } from '@/lib/auth/verify-token'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const payload = await verifyUserToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  const userId = payload.userId
  // Use userId to fetch user data
}
```

### Verify Admin Token

```typescript
import { verifyAdminToken } from '@/lib/auth/verify-token'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const payload = await verifyAdminToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  const adminId = payload.adminId
  // Use adminId to verify admin access
}
```

## Error Messages (Indonesian)

All error messages are in Indonesian:

- `"Email harus diisi"` - Email is required
- `"Format email tidak valid"` - Invalid email format
- `"Kode OTP salah atau kadaluarsa"` - OTP code is wrong or expired
- `"Email atau password salah"` - Email or password is incorrect
- `"Koneksi gagal, silakan coba lagi"` - Connection failed, please try again
- `"Terlalu banyak percobaan. Silakan coba lagi dalam X menit"` - Too many attempts, try again in X minutes

## Rate Limiting

The OTP endpoint implements rate limiting:
- Maximum 3 attempts per hour per email
- Counter resets after 1 hour
- Returns 429 status code when limit exceeded

**Note**: In production, replace the in-memory rate limit store with Redis or a similar persistent store.

## Security Considerations

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters) in production
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Rotation**: Consider implementing token refresh mechanism for long-lived sessions
4. **Rate Limiting**: Implement persistent rate limiting with Redis in production
5. **Password Policy**: Enforce strong password requirements for admin users
6. **Audit Logging**: Log all authentication attempts for security monitoring

## Testing

### Test User OTP Flow

1. Send OTP: `POST /api/auth/send-otp` with email
2. Check email for OTP code
3. Verify OTP: `POST /api/auth/verify-otp` with email and token
4. Check that `auth-token` cookie is set
5. Access protected route to verify authentication

### Test Admin Login Flow

1. Ensure admin user exists in database
2. Login: `POST /api/auth/admin-login` with email and password
3. Check that `admin-token` cookie is set
4. Access admin route to verify authentication

### Test Middleware Protection

1. Try accessing `/dashboard` without token → should redirect to `/login`
2. Try accessing `/admin` without token → should redirect to `/admin-login`
3. Try accessing `/admin` with user token → should redirect to `/admin-login`
4. Try accessing `/dashboard` with admin token → should redirect to `/login`
