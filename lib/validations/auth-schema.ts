import { z } from 'zod';

// Admin login validation schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password harus minimal 8 karakter')
    .max(100, 'Password terlalu panjang'),
});

// Test submission validation schema
export const testSubmissionSchema = z.object({
  answers: z
    .array(z.boolean())
    .length(23, 'Harus menjawab semua 23 pertanyaan'),
});

// Session completion validation schema
export const sessionCompletionSchema = z.object({
  day: z
    .number()
    .int('Nomor hari harus berupa bilangan bulat')
    .min(1, 'Nomor hari minimal 1')
    .max(5, 'Nomor hari maksimal 5'),
});

// Type exports
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type TestSubmissionInput = z.infer<typeof testSubmissionSchema>;
export type SessionCompletionInput = z.infer<typeof sessionCompletionSchema>;
