import { z } from 'zod';

// Mother profile validation schema
export const motherProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama ibu harus minimal 2 karakter')
    .max(255, 'Nama ibu terlalu panjang')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi'),
  age: z
    .number({
      message: 'Umur ibu wajib diisi',
    })
    .int('Umur harus berupa bilangan bulat')
    .min(15, 'Umur ibu minimal 15 tahun')
    .max(100, 'Umur ibu maksimal 100 tahun'),
  religion: z
    .string()
    .min(1, 'Agama wajib diisi')
    .max(100, 'Agama terlalu panjang'),
  occupation: z
    .string()
    .min(1, 'Pekerjaan wajib diisi')
    .max(255, 'Pekerjaan terlalu panjang'),
  address: z
    .string()
    .min(10, 'Alamat harus minimal 10 karakter')
    .max(500, 'Alamat terlalu panjang'),
  phone: z
    .string()
    .min(10, 'Nomor telepon harus minimal 10 digit')
    .max(20, 'Nomor telepon terlalu panjang')
    .regex(/^[0-9+\-\s()]+$/, 'Format nomor telepon tidak valid'),
});

// Child profile validation schema
export const childProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama anak harus minimal 2 karakter')
    .max(255, 'Nama anak terlalu panjang')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi'),
  birth_date: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, 'Tanggal lahir harus di masa lalu')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const ageInYears = (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return ageInYears <= 5;
    }, 'Anak harus berusia maksimal 5 tahun (balita)'),
  gender: z
    .enum(['male', 'female'], {
      message: 'Jenis kelamin wajib diisi',
    }),
});

// Combined profile validation schema
export const profileSchema = z.object({
  mother: motherProfileSchema,
  child: childProfileSchema,
});

// Alias for profile setup page (same as profileSchema)
export const profileSetupSchema = profileSchema;

// Type exports
export type MotherProfileInput = z.infer<typeof motherProfileSchema>;
export type ChildProfileInput = z.infer<typeof childProfileSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileSetupInput = ProfileInput; // Alias for profile setup
