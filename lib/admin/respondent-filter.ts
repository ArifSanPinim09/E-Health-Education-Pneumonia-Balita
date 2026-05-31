/**
 * Logika filter & pencarian responden yang dipakai bersama oleh:
 *  - /api/admin/respondents (tabel di halaman admin)
 *  - /api/admin/export (export Excel biasa)
 *  - /api/admin/export-master (export Master Data)
 *
 * Tujuannya: hasil export SELALU sama dengan apa yang sedang difilter
 * pada halaman http://localhost:3000/admin/respondents
 */

export type RespondentStatus = 'completed' | 'in-progress' | 'not-started'

/** Tentukan status responden berdasarkan progres test & sesi. */
export function computeRespondentStatus(opts: {
  hasPre: boolean
  hasPost: boolean
  sessionsCompleted: number
}): RespondentStatus {
  if (opts.hasPost) return 'completed'
  if (opts.hasPre || opts.sessionsCompleted > 0) return 'in-progress'
  return 'not-started'
}

/** Field minimum yang dibutuhkan untuk memfilter sebuah responden. */
export interface RespondentFilterFields {
  motherName: string
  childName: string
  email: string
  hasPre: boolean
  hasPost: boolean
  sessionsCompleted: number
}

/**
 * Terapkan pencarian (search) dan filter status pada daftar item.
 * Generic: item apa pun boleh, asalkan memenuhi RespondentFilterFields.
 */
export function filterRespondentItems<T extends RespondentFilterFields>(
  items: T[],
  search: string,
  filter: string
): T[] {
  let result = items

  // Pencarian: nama ibu / nama anak / email (case-insensitive substring)
  const trimmed = (search || '').trim().toLowerCase()
  if (trimmed) {
    result = result.filter(
      (r) =>
        r.motherName.toLowerCase().includes(trimmed) ||
        r.childName.toLowerCase().includes(trimmed) ||
        r.email.toLowerCase().includes(trimmed)
    )
  }

  // Filter status: all | completed | in-progress | not-started
  if (filter && filter !== 'all') {
    result = result.filter(
      (r) =>
        computeRespondentStatus({
          hasPre: r.hasPre,
          hasPost: r.hasPost,
          sessionsCompleted: r.sessionsCompleted,
        }) === filter
    )
  }

  return result
}
