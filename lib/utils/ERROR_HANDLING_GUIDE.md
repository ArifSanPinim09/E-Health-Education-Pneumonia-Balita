# Error Handling Guide

## Overview

This application uses a centralized error handling system with Indonesian error messages, validation schemas, and retry logic for network requests.

## Components

### 1. Validation Schemas (`lib/validations/`)

Zod schemas for validating request data with Indonesian error messages.

#### Profile Schema (`profile-schema.ts`)
- `motherProfileSchema`: Validates mother profile data
- `childProfileSchema`: Validates child profile data
- `profileSchema`: Combined validation for both

#### Auth Schema (`auth-schema.ts`)
- `emailSchema`: Validates email format
- `otpSchema`: Validates OTP input (6 digits)
- `adminLoginSchema`: Validates admin credentials
- `testSubmissionSchema`: Validates test answers (23 boolean values)
- `sessionCompletionSchema`: Validates session day number (1-5)

### 2. Server-Side Error Handler (`lib/utils/error-handler.ts`)

#### Error Types
```typescript
enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE_ERROR',
  NETWORK = 'NETWORK_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}
```

#### Key Functions

**`handleApiError(error: unknown): NextResponse`**
- Centralized error handler for API routes
- Automatically formats Zod validation errors
- Handles Supabase database errors
- Returns appropriate HTTP status codes
- Logs errors for debugging

**`validateRequest<T>(request: Request, schema: any): Promise<T>`**
- Validates request body against Zod schema
- Throws validation errors with Indonesian messages
- Usage:
```typescript
const { email } = await validateRequest(request, emailSchema)
```

**`retryRequest<T>(fn: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>`**
- Retries failed requests with exponential backoff
- Skips retry for validation/auth errors
- Default: 3 retries with 1s initial delay

**`AppError` Class**
- Custom error class for throwing specific errors
- Usage:
```typescript
throw new AppError(
  ErrorType.AUTHENTICATION,
  ERROR_MESSAGES.INVALID_OTP,
  401
)
```

### 3. Client-Side Error Handler (`lib/utils/client-error-handler.ts`)

#### Key Functions

**`handleClientError(error: unknown): string`**
- Extracts error message from various error types
- Returns Indonesian error messages

**`showErrorToast(error: unknown)`**
- Displays error message as toast notification
- Usage:
```typescript
try {
  await apiCall()
} catch (error) {
  showErrorToast(error)
}
```

**`showSuccessToast(message: string)`**
- Displays success message as toast

**`fetchWithRetry(url: string, options?: RequestInit, maxRetries?: number): Promise<Response>`**
- Fetch with automatic retry on server errors (5xx)
- 30-second timeout
- Exponential backoff

**`apiClient<T>(url: string, options?: RequestInit): Promise<T>`**
- Wrapper for fetch with error handling and retry logic
- Automatically parses JSON responses
- Usage:
```typescript
const data = await apiClient<ResponseType>('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ ... })
})
```

## Usage Examples

### API Route with Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, validateRequest, AppError, ErrorType, ERROR_MESSAGES } from '@/lib/utils/error-handler'
import { emailSchema } from '@/lib/validations/auth-schema'

export async function POST(request: NextRequest) {
  try {
    // Validate request
    const { email } = await validateRequest(request, emailSchema)
    
    // Your logic here
    const result = await someOperation(email)
    
    // Check conditions and throw custom errors
    if (!result) {
      throw new AppError(
        ErrorType.NOT_FOUND,
        ERROR_MESSAGES.PROFILE_NOT_FOUND,
        404
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Client-Side API Call

```typescript
'use client'

import { apiClient, showErrorToast, showSuccessToast } from '@/lib/utils/client-error-handler'

async function submitForm(data: FormData) {
  try {
    const response = await apiClient('/api/profile/create', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    showSuccessToast('Profil berhasil dibuat')
    return response
  } catch (error) {
    showErrorToast(error)
    throw error
  }
}
```

### Form Validation

```typescript
import { profileSchema } from '@/lib/validations/profile-schema'

function validateProfileForm(data: unknown) {
  try {
    const validated = profileSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(e => e.message)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validasi gagal'] }
  }
}
```

## Error Messages

All error messages are in Indonesian and defined in `ERROR_MESSAGES` constant:

### Authentication Errors
- `INVALID_EMAIL`: Format email tidak valid
- `INVALID_OTP`: Kode OTP salah atau kadaluarsa
- `OTP_EXPIRED`: Kode OTP telah kadaluarsa
- `INVALID_CREDENTIALS`: Email atau password salah
- `UNAUTHORIZED`: Anda tidak memiliki akses
- `TOKEN_EXPIRED`: Sesi Anda telah berakhir, silakan login kembali
- `TOKEN_INVALID`: Token tidak valid

### Profile Errors
- `PROFILE_EXISTS`: Profil sudah ada
- `PROFILE_NOT_FOUND`: Profil tidak ditemukan
- `INVALID_AGE`: Umur tidak valid
- `INVALID_BIRTH_DATE`: Tanggal lahir tidak valid

### Test Errors
- `TEST_ALREADY_TAKEN`: Tes sudah pernah diambil
- `INVALID_ANSWERS`: Jawaban tidak valid
- `INCOMPLETE_ANSWERS`: Harap jawab semua pertanyaan
- `PRE_TEST_REQUIRED`: Harap selesaikan pre-test terlebih dahulu

### Session Errors
- `SESSION_LOCKED`: Sesi masih terkunci
- `SESSION_NOT_FOUND`: Sesi tidak ditemukan
- `INVALID_SESSION_DAY`: Nomor hari sesi tidak valid
- `PREVIOUS_SESSION_INCOMPLETE`: Harap selesaikan sesi sebelumnya

### Network Errors
- `NETWORK_ERROR`: Koneksi gagal, silakan coba lagi
- `TIMEOUT`: Permintaan timeout, silakan coba lagi

### Database Errors
- `DATABASE_ERROR`: Terjadi kesalahan database
- `DUPLICATE_ENTRY`: Data sudah ada

## Best Practices

1. **Always use `handleApiError` in API routes**
   - Wrap all route handlers in try-catch
   - Return `handleApiError(error)` in catch block

2. **Validate all inputs with Zod schemas**
   - Use `validateRequest` for API routes
   - Use schema.parse() for client-side validation

3. **Use custom AppError for business logic errors**
   - Throw AppError with appropriate ErrorType
   - Use predefined ERROR_MESSAGES

4. **Use retry logic for network requests**
   - Use `retryRequest` on server
   - Use `fetchWithRetry` or `apiClient` on client

5. **Show user-friendly error messages**
   - Use `showErrorToast` for client-side errors
   - All messages are in Indonesian

6. **Log errors for debugging**
   - Server errors are automatically logged by `handleApiError`
   - Add context with console.error before throwing

## Testing Error Handling

### Test Validation Errors
```typescript
// Should return 400 with validation error
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({ email: 'invalid-email' })
})
// Expected: { success: false, error: 'Format email tidak valid', type: 'VALIDATION_ERROR' }
```

### Test Authentication Errors
```typescript
// Should return 401 with auth error
const response = await fetch('/api/profile/get', {
  headers: { Authorization: 'Bearer invalid-token' }
})
// Expected: { success: false, error: 'Token tidak valid', type: 'AUTHENTICATION_ERROR' }
```

### Test Network Retry
```typescript
// Should retry 3 times on network failure
const result = await retryRequest(async () => {
  return await fetch('https://api.example.com/data')
})
```
