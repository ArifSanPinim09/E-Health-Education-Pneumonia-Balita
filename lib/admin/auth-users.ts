import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

/**
 * Ambil SELURUH user dari Supabase Auth dengan menelusuri semua halaman.
 *
 * PENTING: `supabase.auth.admin.listUsers()` bersifat paginated dan secara
 * default hanya mengembalikan 50 user (halaman pertama). Jika dipanggil tanpa
 * menelusuri halaman berikutnya, user ke-51 dan seterusnya akan hilang —
 * sehingga email & tanggal daftar mereka tampak kosong di hasil export.
 *
 * Helper ini mengulang sampai halaman habis agar semua user terkumpul.
 */
export async function fetchAllAuthUsers(
  supabase: SupabaseClient,
  perPage = 1000
): Promise<User[]> {
  const allUsers: User[] = []
  let page = 1

  // Batas aman agar tidak pernah jadi infinite loop
  const MAX_PAGES = 1000

  while (page <= MAX_PAGES) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })

    if (error) {
      throw error
    }

    const users = data?.users ?? []
    allUsers.push(...users)

    // Jika halaman ini mengembalikan kurang dari perPage, berarti sudah habis
    if (users.length < perPage) {
      break
    }

    page++
  }

  return allUsers
}
