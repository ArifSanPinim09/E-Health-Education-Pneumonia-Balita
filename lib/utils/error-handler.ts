import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE_ERROR',
  NETWORK = 'NETWORK_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

// Indonesian error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_EMAIL: 'Format email tidak valid',
  INVALID_CREDENTIALS: 'Email atau password salah',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  TOKEN_EXPIRED: 'Sesi Anda telah berakhir, silakan login kembali',
  TOKEN_INVALID: 'Token tidak valid',
  
  // Profile errors
  PROFILE_EXISTS: 'Profil sudah ada',
  PROFILE_NOT_FOUND: 'Profil tidak ditemukan',
  INVALID_AGE: 'Umur tidak valid',
  INVALID_BIRTH_DATE: 'Tanggal lahir tidak valid',
  
  // Test errors
  TEST_ALREADY_TAKEN: 'Tes sudah pernah diambil',
  INVALID_ANSWERS: 'Jawaban tidak valid',
  INCOMPLETE_ANSWERS: 'Harap jawab semua pertanyaan',
  PRE_TEST_REQUIRED: 'Harap selesaikan pre-test terlebih dahulu',
  
  // Session errors
  SESSION_LOCKED: 'Sesi masih terkunci',
  SESSION_NOT_FOUND: 'Sesi tidak ditemukan',
  INVALID_SESSION_DAY: 'Nomor hari sesi tidak valid',
  PREVIOUS_SESSION_INCOMPLETE: 'Harap selesaikan sesi sebelumnya',
  
  // Admin errors
  ADMIN_ONLY: 'Akses khusus admin',
  QUESTION_NOT_FOUND: 'Pertanyaan tidak ditemukan',
  
  // Network errors
  NETWORK_ERROR: 'Koneksi gagal, silakan coba lagi',
  TIMEOUT: 'Permintaan timeout, silakan coba lagi',
  
  // Database errors
  DATABASE_ERROR: 'Terjadi kesalahan database',
  DUPLICATE_ENTRY: 'Data sudah ada',
  
  // Generic errors
  INTERNAL_ERROR: 'Terjadi kesalahan sistem',
  INVALID_REQUEST: 'Permintaan tidak valid',
  MISSING_FIELDS: 'Data tidak lengkap',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
};

// Custom error class
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Format Zod validation errors to Indonesian
export function formatZodError(error: ZodError<any>): string[] {
  return error.issues.map((err) => {
    const field = err.path.join('.');
    return err.message;
  });
}

// Handle API errors and return appropriate response
export function handleApiError(error: unknown): NextResponse {
  // Log error for debugging
  console.error('[API Error]', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = formatZodError(error);
    return NextResponse.json(
      {
        success: false,
        error: errors[0] || ERROR_MESSAGES.INVALID_REQUEST,
        errors: errors,
        type: ErrorType.VALIDATION,
      },
      { status: 400 }
    );
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        type: error.type,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any;
    
    // Handle specific Supabase error codes
    switch (supabaseError.code) {
      case '23505': // Unique violation
        return NextResponse.json(
          {
            success: false,
            error: ERROR_MESSAGES.DUPLICATE_ENTRY,
            type: ErrorType.DATABASE,
          },
          { status: 409 }
        );
      case '23503': // Foreign key violation
        return NextResponse.json(
          {
            success: false,
            error: ERROR_MESSAGES.INVALID_REQUEST,
            type: ErrorType.DATABASE,
          },
          { status: 400 }
        );
      case 'PGRST116': // Not found
        return NextResponse.json(
          {
            success: false,
            error: ERROR_MESSAGES.PROFILE_NOT_FOUND,
            type: ErrorType.NOT_FOUND,
          },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            error: ERROR_MESSAGES.DATABASE_ERROR,
            type: ErrorType.DATABASE,
          },
          { status: 500 }
        );
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
        type: ErrorType.NETWORK,
      },
      { status: 503 }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        type: ErrorType.INTERNAL,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      success: false,
      error: ERROR_MESSAGES.UNKNOWN_ERROR,
      type: ErrorType.INTERNAL,
    },
    { status: 500 }
  );
}

// Retry logic for network requests
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on validation or authentication errors
      if (error instanceof AppError) {
        if (
          error.type === ErrorType.VALIDATION ||
          error.type === ErrorType.AUTHENTICATION ||
          error.type === ErrorType.AUTHORIZATION
        ) {
          throw error;
        }
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

// Validate request body
export async function validateRequest<T>(
  request: Request,
  schema: any
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw new AppError(
      ErrorType.VALIDATION,
      ERROR_MESSAGES.INVALID_REQUEST,
      400
    );
  }
}
