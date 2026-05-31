import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'
import ExcelJS from 'exceljs'
import { formatDateIndonesian, formatDateTimeIndonesian } from '@/lib/utils/date-formatter'
import { filterRespondentItems } from '@/lib/admin/respondent-filter'
import { fetchAllAuthUsers } from '@/lib/admin/auth-users'

/**
 * Export "Master Data" mengikuti template Excel yang disediakan
 * (docs/MAster Data.xlsx) dengan struktur header bertingkat + border tabel.
 *
 * Memakai ExcelJS (bukan xlsx/SheetJS) karena kita butuh styling:
 * border, merge cell, bold header, alignment, dan format persen.
 *
 *  - No + Tanggal Daftar (tanggal user mendaftar, dari auth.users.created_at)
 *  - Identitas Orang Tua (Nama, Umur, Pendidikan, Pekerjaan, Agama, Suku/Bangsa, Alamat)
 *  - Identitas Anak (Nama, Tgl Lahir, Umur, L/P, Anak Ke, Agama, Status Imunisasi, BB, TB)
 *  - 4 kolom pertanyaan pengalaman/informasi/riwayat/kunjungan
 *  - Pre Test  : soal 1-23 + Jumlah + Persentase + Kategori
 *  - Post Test : soal 1-23 + Jumlah + Persentase + Kategori
 *
 * Kolom yang belum tersedia di database tetap dipertahankan (dibiarkan kosong)
 * sesuai permintaan agar bentuk tabel persis dengan template.
 */

const TOTAL_QUESTIONS = 23

/**
 * Definisi kolom (1-based). Diletakkan di satu tempat agar penambahan kolom
 * (mis. "Umur" anak / "Tanggal Daftar") tidak perlu mengubah angka-angka ajaib
 * di banyak tempat.
 *
 *  - Tanggal Daftar       : 2 (diambil dari auth.users.created_at)
 *  - Identitas Orang Tua  : 3..9
 *  - Identitas Anak       : 10..18 (termasuk kolom "Umur" setelah Tgl Lahir)
 *  - 4 kolom pertanyaan   : 19..22
 *  - Pre Test soal 1-23   : 23..45, lalu Jumlah/Persentase/Kategori
 *  - Post Test soal 1-23  : 49..71, lalu Jumlah/Persentase/Kategori
 */
const COL = {
  no: 1,
  tanggalDaftar: 2,
  // Identitas Orang Tua
  ortuNama: 3,
  ortuUmur: 4,
  ortuPendidikan: 5,
  ortuPekerjaan: 6,
  ortuAgama: 7,
  ortuSuku: 8,
  ortuAlamat: 9,
  // Identitas Anak
  anakNama: 10,
  anakTglLahir: 11,
  anakUmur: 12,
  anakLP: 13,
  anakKe: 14,
  anakAgama: 15,
  anakImunisasi: 16,
  anakBB: 17,
  anakTB: 18,
  // Pertanyaan
  q1: 19,
  q2: 20,
  q3: 21,
  q4: 22,
  // Pre Test
  preStart: 23, // 23..45 (23 soal)
  preJumlah: 46,
  prePersentase: 47,
  preKategori: 48,
  // Post Test
  postStart: 49, // 49..71 (23 soal)
  postJumlah: 72,
  postPersentase: 73,
  postKategori: 74,
} as const

const TOTAL_COLUMNS = 74 // A..BV

// Jumlah baris data kosong tambahan agar tabel terlihat seperti template (bergaris penuh)
const MIN_DATA_ROWS = 30

// Kategori tingkat pengetahuan (standar Arikunto) berdasarkan persentase (0..1)
function getKategori(fraction: number): string {
  if (fraction >= 0.76) return 'Baik'
  if (fraction >= 0.56) return 'Cukup'
  return 'Kurang'
}

// Format umur anak balita menjadi ringkas, mis. "2 th 3 bln" atau "15 hr"
function formatChildAge(
  years?: number | null,
  months?: number | null,
  days?: number | null
): string | null {
  const y = years ?? 0
  const m = months ?? 0
  const d = days ?? 0
  const parts: string[] = []
  if (y > 0) parts.push(`${y} th`)
  if (m > 0) parts.push(`${m} bln`)
  // Tampilkan hari hanya jika umur < 1 bulan (bayi sangat muda)
  if (y === 0 && m === 0) {
    if (d > 0) parts.push(`${d} hr`)
  }
  return parts.length > 0 ? parts.join(' ') : null
}

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { valid, payload } = await verifyToken(token)

    if (!valid || payload?.type !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    // Parameter pencarian & filter (disamakan dengan halaman /admin/respondents)
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    // Ambil profil ibu (urut berdasarkan tanggal daftar, paling lama dulu)
    const { data: motherProfilesRaw, error: motherError } = await supabase
      .from('mother_profiles')
      .select('user_id, name, age, religion, occupation, address, phone, created_at')
      .order('created_at', { ascending: true })

    if (motherError) {
      console.error('Error fetching mother profiles:', motherError)
      throw motherError
    }

    if (!motherProfilesRaw || motherProfilesRaw.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada data untuk diekspor' },
        { status: 404 }
      )
    }

    const allUserIds = motherProfilesRaw.map((p: any) => p.user_id)

    // Profil anak
    const { data: childProfiles, error: childError } = await supabase
      .from('child_profiles')
      .select('user_id, name, birth_date, gender, age_years, age_months, age_days')
      .in('user_id', allUserIds)

    if (childError) {
      console.error('Error fetching child profiles:', childError)
      throw childError
    }

    // Submission test (pre & post) berikut jawaban
    const { data: testSubmissions, error: testError } = await supabase
      .from('test_submissions')
      .select('user_id, test_type, score, answers')
      .in('user_id', allUserIds)

    if (testError) {
      console.error('Error fetching test submissions:', testError)
      throw testError
    }

    // Progres sesi (dibutuhkan untuk menentukan status saat memfilter)
    const { data: sessionProgress, error: sessionError } = await supabase
      .from('session_progress')
      .select('user_id, completed')
      .in('user_id', allUserIds)

    if (sessionError) {
      console.error('Error fetching session progress:', sessionError)
      throw sessionError
    }

    // Email & tanggal daftar user (semua halaman, bukan hanya 50 pertama)
    const allAuthUsers = await fetchAllAuthUsers(supabase)

    // Map untuk pencarian cepat
    const childMap = new Map((childProfiles || []).map((c: any) => [c.user_id, c]))
    const emailMap = new Map(allAuthUsers.map((u) => [u.id, u.email]))
    // Tanggal user mendaftar diambil dari sistem autentikasi (auth.users.created_at)
    const registeredAtMap = new Map(allAuthUsers.map((u) => [u.id, u.created_at]))
    const testMap = new Map<string, { pre?: any; post?: any }>()
    testSubmissions?.forEach((t: any) => {
      if (!testMap.has(t.user_id)) testMap.set(t.user_id, {})
      const entry = testMap.get(t.user_id)!
      if (t.test_type === 'pre') entry.pre = t
      else if (t.test_type === 'post') entry.post = t
    })
    const sessionCountMap = new Map<string, number>()
    sessionProgress?.forEach((s: any) => {
      if (s.completed) {
        sessionCountMap.set(s.user_id, (sessionCountMap.get(s.user_id) || 0) + 1)
      }
    })

    // Terapkan pencarian + filter status agar hasil export = tampilan tabel
    const motherProfiles = filterRespondentItems(
      motherProfilesRaw.map((m: any) => {
        const tests = testMap.get(m.user_id) || {}
        return {
          ...m,
          motherName: m.name || '',
          childName: childMap.get(m.user_id)?.name || '',
          email: emailMap.get(m.user_id) || '',
          hasPre: !!tests.pre,
          hasPost: !!tests.post,
          sessionsCompleted: sessionCountMap.get(m.user_id) || 0,
        }
      }),
      search,
      filter
    )

    if (motherProfiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada data yang cocok dengan filter untuk diekspor' },
        { status: 404 }
      )
    }

    // Kunci jawaban (urut berdasarkan order_number 1..23)
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('correct_answer, order_number')
      .order('order_number', { ascending: true })

    if (questionsError) {
      console.error('Error fetching quiz questions:', questionsError)
      throw questionsError
    }

    // correctAnswers[i] = jawaban benar untuk soal (order_number i+1)
    const correctAnswers: (boolean | undefined)[] = new Array(TOTAL_QUESTIONS).fill(undefined)
    ;(questions || []).forEach((q: any) => {
      const idx = q.order_number - 1
      if (idx >= 0 && idx < TOTAL_QUESTIONS) {
        correctAnswers[idx] = q.correct_answer
      }
    })

    // Helper: bangun 23 sel 1/0 dari jawaban sebuah test
    const buildAnswerCells = (test: any): (number | null)[] => {
      const cells: (number | null)[] = new Array(TOTAL_QUESTIONS).fill(null)
      if (!test || !Array.isArray(test.answers)) return cells
      for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const ans = test.answers[i]
        if (typeof ans !== 'boolean' || typeof correctAnswers[i] !== 'boolean') {
          cells[i] = null
        } else {
          cells[i] = ans === correctAnswers[i] ? 1 : 0
        }
      }
      return cells
    }

    // ---- Bangun workbook ----
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'E-Health Pneumonia Balita'
    workbook.created = new Date()
    const ws = workbook.addWorksheet('Master Data', {
      views: [{ state: 'frozen', xSplit: 1, ySplit: 6 }],
    })

    // Judul
    ws.getCell('A2').value = 'Master Data'
    ws.getCell('A2').font = { bold: true, size: 14 }
    ws.getCell('A3').value = '1. Kelompok Intervensi'
    ws.getCell('A3').font = { bold: true, size: 12 }

    const HEADER_TOP = 5
    const HEADER_SUB = 6
    const DATA_START = 7

    // ---- Header atas (baris 5) ----
    const top: Record<number, string> = {
      [COL.no]: 'No',
      [COL.tanggalDaftar]: 'Tanggal Daftar',
      [COL.ortuNama]: 'Identitas Orang Tua',
      [COL.anakNama]: 'Identitas Anak',
      [COL.q1]: '1. Pengalaman Merawat balita dgn Pneumonia',
      [COL.q2]: '2. Informasi Mengenai Pneumonia',
      [COL.q3]: '3. Riwayat Dirawat dengan Pneumonia',
      [COL.q4]: '4. Kunjungan ke PKM dgn Pneumonia',
      [COL.preStart]: 'Pre Test',
      [COL.preJumlah]: 'Jumlah',
      [COL.prePersentase]: 'Persentase',
      [COL.preKategori]: 'Kategori',
      [COL.postStart]: 'Post Test',
      [COL.postJumlah]: 'Jumlah',
      [COL.postPersentase]: 'Persentase',
      [COL.postKategori]: 'Kategori',
    }
    Object.entries(top).forEach(([col, val]) => {
      ws.getCell(HEADER_TOP, Number(col)).value = val
    })

    // ---- Sub header (baris 6) ----
    const sub: Record<number, string | number> = {
      [COL.ortuNama]: 'Nama',
      [COL.ortuUmur]: 'Umur (Th)',
      [COL.ortuPendidikan]: 'Pendidikan',
      [COL.ortuPekerjaan]: 'Pekerjaan',
      [COL.ortuAgama]: 'Agama',
      [COL.ortuSuku]: 'Suku/Bangsa',
      [COL.ortuAlamat]: 'Alamat',
      [COL.anakNama]: 'Nama',
      [COL.anakTglLahir]: 'Tgl Lahir',
      [COL.anakUmur]: 'Umur',
      [COL.anakLP]: 'L/P',
      [COL.anakKe]: 'Anak Ke',
      [COL.anakAgama]: 'Agama',
      [COL.anakImunisasi]: 'Status Imunisasi',
      [COL.anakBB]: 'BB',
      [COL.anakTB]: 'TB',
    }
    Object.entries(sub).forEach(([col, val]) => {
      ws.getCell(HEADER_SUB, Number(col)).value = val
    })
    // Nomor soal pre test & post test
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      ws.getCell(HEADER_SUB, COL.preStart + i).value = i + 1
      ws.getCell(HEADER_SUB, COL.postStart + i).value = i + 1
    }

    // ---- Merge header bertingkat ----
    ws.mergeCells(HEADER_TOP, COL.no, HEADER_SUB, COL.no) // No
    ws.mergeCells(HEADER_TOP, COL.tanggalDaftar, HEADER_SUB, COL.tanggalDaftar) // Tanggal Daftar
    ws.mergeCells(HEADER_TOP, COL.ortuNama, HEADER_TOP, COL.ortuAlamat) // Identitas Orang Tua
    ws.mergeCells(HEADER_TOP, COL.anakNama, HEADER_TOP, COL.anakTB) // Identitas Anak
    ws.mergeCells(HEADER_TOP, COL.q1, HEADER_SUB, COL.q1) // Pengalaman
    ws.mergeCells(HEADER_TOP, COL.q2, HEADER_SUB, COL.q2) // Informasi
    ws.mergeCells(HEADER_TOP, COL.q3, HEADER_SUB, COL.q3) // Riwayat
    ws.mergeCells(HEADER_TOP, COL.q4, HEADER_SUB, COL.q4) // Kunjungan
    ws.mergeCells(HEADER_TOP, COL.preStart, HEADER_TOP, COL.preStart + TOTAL_QUESTIONS - 1) // Pre Test
    ws.mergeCells(HEADER_TOP, COL.preJumlah, HEADER_SUB, COL.preJumlah) // Jumlah (pre)
    ws.mergeCells(HEADER_TOP, COL.prePersentase, HEADER_SUB, COL.prePersentase) // Persentase (pre)
    ws.mergeCells(HEADER_TOP, COL.preKategori, HEADER_SUB, COL.preKategori) // Kategori (pre)
    ws.mergeCells(HEADER_TOP, COL.postStart, HEADER_TOP, COL.postStart + TOTAL_QUESTIONS - 1) // Post Test
    ws.mergeCells(HEADER_TOP, COL.postJumlah, HEADER_SUB, COL.postJumlah) // Jumlah (post)
    ws.mergeCells(HEADER_TOP, COL.postPersentase, HEADER_SUB, COL.postPersentase) // Persentase (post)
    ws.mergeCells(HEADER_TOP, COL.postKategori, HEADER_SUB, COL.postKategori) // Kategori (post)

    // Style header (baris 5 & 6)
    for (let r = HEADER_TOP; r <= HEADER_SUB; r++) {
      for (let c = 1; c <= TOTAL_COLUMNS; c++) {
        const cell = ws.getCell(r, c)
        cell.font = { bold: true, size: 9 }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        cell.border = thinBorder
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEDF2EF' },
        }
      }
    }

    // ---- Baris data ----
    const dataRowCount = Math.max(motherProfiles.length, MIN_DATA_ROWS)

    for (let r = 0; r < dataRowCount; r++) {
      const excelRow = DATA_START + r
      const mother: any = motherProfiles[r]
      const rowValues: (string | number | null)[] = new Array(TOTAL_COLUMNS).fill(null)

      // Nomor urut selalu ada
      rowValues[0] = r + 1

      if (mother) {
        const child: any = childMap.get(mother.user_id)
        const tests = testMap.get(mother.user_id) || {}

        // Tanggal user mendaftar (dari sistem autentikasi)
        const registeredAt = registeredAtMap.get(mother.user_id)
        rowValues[COL.tanggalDaftar - 1] = registeredAt
          ? formatDateTimeIndonesian(registeredAt)
          : null

        // Identitas Orang Tua
        rowValues[COL.ortuNama - 1] = mother.name ?? null
        rowValues[COL.ortuUmur - 1] = mother.age ?? null
        rowValues[COL.ortuPendidikan - 1] = null // Pendidikan (belum ada di database)
        rowValues[COL.ortuPekerjaan - 1] = mother.occupation ?? null
        rowValues[COL.ortuAgama - 1] = mother.religion ?? null
        rowValues[COL.ortuSuku - 1] = null // Suku/Bangsa (belum ada di database)
        rowValues[COL.ortuAlamat - 1] = mother.address ?? null

        // Identitas Anak
        rowValues[COL.anakNama - 1] = child?.name ?? null
        rowValues[COL.anakTglLahir - 1] = child?.birth_date
          ? formatDateIndonesian(child.birth_date)
          : null
        rowValues[COL.anakUmur - 1] = child
          ? formatChildAge(child.age_years, child.age_months, child.age_days)
          : null
        rowValues[COL.anakLP - 1] =
          child?.gender === 'male' ? 'L' : child?.gender === 'female' ? 'P' : null
        rowValues[COL.anakKe - 1] = null // Anak Ke
        rowValues[COL.anakAgama - 1] = null // Agama anak
        rowValues[COL.anakImunisasi - 1] = null // Status Imunisasi
        rowValues[COL.anakBB - 1] = null // BB
        rowValues[COL.anakTB - 1] = null // TB

        // 4 kolom pertanyaan (belum ada di database) -> COL.q1..q4

        // Pre Test
        const preCells = buildAnswerCells(tests.pre)
        for (let i = 0; i < TOTAL_QUESTIONS; i++) rowValues[COL.preStart - 1 + i] = preCells[i]
        if (tests.pre) {
          const preScore =
            tests.pre.score ?? preCells.reduce((s: number, v) => s + (v === 1 ? 1 : 0), 0)
          const preFraction = preScore / TOTAL_QUESTIONS
          rowValues[COL.preJumlah - 1] = preScore
          rowValues[COL.prePersentase - 1] = preFraction
          rowValues[COL.preKategori - 1] = getKategori(preFraction)
        }

        // Post Test
        const postCells = buildAnswerCells(tests.post)
        for (let i = 0; i < TOTAL_QUESTIONS; i++) rowValues[COL.postStart - 1 + i] = postCells[i]
        if (tests.post) {
          const postScore =
            tests.post.score ?? postCells.reduce((s: number, v) => s + (v === 1 ? 1 : 0), 0)
          const postFraction = postScore / TOTAL_QUESTIONS
          rowValues[COL.postJumlah - 1] = postScore
          rowValues[COL.postPersentase - 1] = postFraction
          rowValues[COL.postKategori - 1] = getKategori(postFraction)
        }
      }

      // Tulis nilai + style per sel
      for (let c = 1; c <= TOTAL_COLUMNS; c++) {
        const cell = ws.getCell(excelRow, c)
        const v = rowValues[c - 1]
        if (v !== null && v !== undefined) cell.value = v
        cell.border = thinBorder
        cell.font = { size: 9 }

        // Kolom teks identitas rata kiri, sisanya rata tengah
        const isTextCol =
          c === COL.tanggalDaftar ||
          (c >= COL.ortuNama && c <= COL.anakNama) ||
          c === COL.anakTglLahir
        cell.alignment = {
          horizontal: isTextCol ? 'left' : 'center',
          vertical: 'middle',
          wrapText: false,
        }

        // Format persen untuk kolom Persentase
        if (c === COL.prePersentase || c === COL.postPersentase) {
          cell.numFmt = '0.00%'
        }
      }
    }

    // ---- Lebar kolom ----
    const widths: Record<number, number> = {
      [COL.no]: 4,
      [COL.tanggalDaftar]: 18,
      [COL.ortuNama]: 18,
      [COL.ortuUmur]: 8,
      [COL.ortuPendidikan]: 12,
      [COL.ortuPekerjaan]: 14,
      [COL.ortuAgama]: 9,
      [COL.ortuSuku]: 11,
      [COL.ortuAlamat]: 20,
      [COL.anakNama]: 16,
      [COL.anakTglLahir]: 12,
      [COL.anakUmur]: 12,
      [COL.anakLP]: 5,
      [COL.anakKe]: 7,
      [COL.anakAgama]: 10,
      [COL.anakImunisasi]: 13,
      [COL.anakBB]: 6,
      [COL.anakTB]: 6,
      [COL.q1]: 14,
      [COL.q2]: 14,
      [COL.q3]: 14,
      [COL.q4]: 14,
      [COL.preJumlah]: 7,
      [COL.prePersentase]: 11,
      [COL.preKategori]: 9,
      [COL.postJumlah]: 7,
      [COL.postPersentase]: 11,
      [COL.postKategori]: 9,
    }
    for (let c = 1; c <= TOTAL_COLUMNS; c++) {
      ws.getColumn(c).width = widths[c] ?? 3.5 // default untuk kolom soal
    }

    // Tinggi baris header agar teks multi-baris muat
    ws.getRow(HEADER_TOP).height = 34
    ws.getRow(HEADER_SUB).height = 30

    // ---- Tulis buffer ----
    const arrayBuffer = await workbook.xlsx.writeBuffer()
    const excelBuffer = Buffer.from(arrayBuffer)

    const now = new Date()
    const filename = `Master_Data_Pneumonia_${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Master data export error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengekspor master data, silakan coba lagi' },
      { status: 500 }
    )
  }
}
