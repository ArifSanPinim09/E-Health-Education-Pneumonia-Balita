'use client';

// Error messages for client-side
export const CLIENT_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Koneksi gagal, silakan coba lagi',
  TIMEOUT: 'Permintaan timeout, silakan coba lagi',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  FORM_VALIDATION: 'Harap periksa kembali form Anda',
};

// Handle client-side errors
export function handleClientError(error: unknown): string {
  console.error('[Client Error]', error);

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return CLIENT_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Handle API response errors
  if (error && typeof error === 'object' && 'error' in error) {
    return (error as any).error || CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message || CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  return CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR;
}

// Show error message (can be integrated with your toast library)
export function showError(error: unknown): string {
  const message = handleClientError(error);
  // You can integrate with your toast library here
  // For now, just return the message
  return message;
}

// Retry fetch with exponential backoff
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Retry on server errors (5xx)
      if (response.status >= 500 && i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on timeout or abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(CLIENT_ERROR_MESSAGES.TIMEOUT);
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError || new Error(CLIENT_ERROR_MESSAGES.NETWORK_ERROR);
}

// API client with error handling
export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetchWithRetry(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
