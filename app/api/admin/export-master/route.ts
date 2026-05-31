import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'
import ExcelJS from 'exceljs'
import { formatDateIndonesian } from '@/lib/utils/date-formatter'
import { filterRespondentItems } from '@/lib/admin/respondent-filter'

/**
 * Export "Master Data" mengikuti template Excel yang disediakan
 * (docs/MAster Data.xlsx) dengan struktur header bertingkat + border tabel.
 *
 * Memakai ExcelJS (bukan xlsx/SheetJS) karena kita butuh styling:
 * border, merge cell, bold header, alignment, dan format persen.
 *
 *  - Identitas Orang Tua (Nama, Umur, Pendidikan, Pekerjaan, Agama, Suku/Bangsa, Alamat)
 *  - Identitas Anak (Nama, Umur/Tgl Lahir, L/P, Anak Ke, Agama, Status Imunisasi, BB, TB)
 *  - 4 kolom pertanyaan pengalaman/informasi/riwayat/kunjungan
 *  - Pre Test  : soal 1-23 + Jumlah + Persentase + Kategori
 *  - Post Test : soal 1-23 + Jumlah + Persentase + Kategori
 *
 * Kolom yang belum tersedia di database tetap dipertahankan (dibiarkan kosong)
 * sesuai permintaan agar bentuk tabel persis dengan template.
 */

const TOTAL_QUESTIONS = 23
const TOTAL_COLUMNS = 72 // A..BT

// Jumlah baris data kosong tambahan agar tabel terlihat seperti template (bergaris penuh)
const MIN_DATA_ROWS = 30

// Kategori tingkat pengetahuan (standar Arikunto) berdasarkan persentase (0..1)
function getKategori(fraction: number): string {
  if (fraction >= 0.76) return 'Baik'
  if (fraction >= 0.56) return 'Cukup'
  return 'Kurang'
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
      .select('user_id, name, birth_date, gender')
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

    // Email user (dibutuhkan untuk pencarian via email)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error fetching auth users:', authError)
      throw authError
    }

    // Map untuk pencarian cepat
    const childMap = new Map((childProfiles || []).map((c: any) => [c.user_id, c]))
    const emailMap = new Map(authUsers.users.map((u) => [u.id, u.email]))
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
      1: 'No',
      2: 'Identitas Orang Tua',
      9: 'Identitas Anak',
      17: '1. Pengalaman Merawat balita dgn Pneumonia',
      18: '2. Informasi Mengenai Pneumonia',
      19: '3. Riwayat Dirawat dengan Pneumonia',
      20: '4. Kunjungan ke PKM dgn Pneumonia',
      21: 'Pre Test',
      44: 'Jumlah',
      45: 'Persentase',
      46: 'Kategori',
      47: 'Post Test',
      70: 'Jumlah',
      71: 'Persentase',
      72: 'Kategori',
    }
    Object.entries(top).forEach(([col, val]) => {
      ws.getCell(HEADER_TOP, Number(col)).value = val
    })

    // ---- Sub header (baris 6) ----
    const sub: Record<number, string | number> = {
      2: 'Nama',
      3: 'Umur (Th)',
      4: 'Pendidikan',
      5: 'Pekerjaan',
      6: 'Agama',
      7: 'Suku/Bangsa',
      8: 'Alamat',
      9: 'Nama',
      10: 'Umur/Tgl Lahir',
      11: 'L/P',
      12: 'Anak Ke',
      13: 'Agama',
      14: 'Status Imunisasi',
      15: 'BB',
      16: 'TB',
    }
    Object.entries(sub).forEach(([col, val]) => {
      ws.getCell(HEADER_SUB, Number(col)).value = val
    })
    // Nomor soal pre test (kolom 21..43) & post test (kolom 47..69)
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      ws.getCell(HEADER_SUB, 21 + i).value = i + 1
      ws.getCell(HEADER_SUB, 47 + i).value = i + 1
    }

    // ---- Merge header bertingkat ----
    ws.mergeCells(HEADER_TOP, 1, HEADER_SUB, 1) // No
    ws.mergeCells(HEADER_TOP, 2, HEADER_TOP, 8) // Identitas Orang Tua
    ws.mergeCells(HEADER_TOP, 9, HEADER_TOP, 16) // Identitas Anak
    ws.mergeCells(HEADER_TOP, 17, HEADER_SUB, 17) // Pengalaman
    ws.mergeCells(HEADER_TOP, 18, HEADER_SUB, 18) // Informasi
    ws.mergeCells(HEADER_TOP, 19, HEADER_SUB, 19) // Riwayat
    ws.mergeCells(HEADER_TOP, 20, HEADER_SUB, 20) // Kunjungan
    ws.mergeCells(HEADER_TOP, 21, HEADER_TOP, 43) // Pre Test
    ws.mergeCells(HEADER_TOP, 44, HEADER_SUB, 44) // Jumlah (pre)
    ws.mergeCells(HEADER_TOP, 45, HEADER_SUB, 45) // Persentase (pre)
    ws.mergeCells(HEADER_TOP, 46, HEADER_SUB, 46) // Kategori (pre)
    ws.mergeCells(HEADER_TOP, 47, HEADER_TOP, 69) // Post Test
    ws.mergeCells(HEADER_TOP, 70, HEADER_SUB, 70) // Jumlah (post)
    ws.mergeCells(HEADER_TOP, 71, HEADER_SUB, 71) // Persentase (post)
    ws.mergeCells(HEADER_TOP, 72, HEADER_SUB, 72) // Kategori (post)

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

        // Identitas Orang Tua
        rowValues[1] = mother.name ?? null
        rowValues[2] = mother.age ?? null
        rowValues[3] = null // Pendidikan (belum ada di database)
        rowValues[4] = mother.occupation ?? null
        rowValues[5] = mother.religion ?? null
        rowValues[6] = null // Suku/Bangsa (belum ada di database)
        rowValues[7] = mother.address ?? null

        // Identitas Anak
        rowValues[8] = child?.name ?? null
        rowValues[9] = child?.birth_date ? formatDateIndonesian(child.birth_date) : null
        rowValues[10] = child?.gender === 'male' ? 'L' : child?.gender === 'female' ? 'P' : null
        rowValues[11] = null // Anak Ke
        rowValues[12] = null // Agama anak
        rowValues[13] = null // Status Imunisasi
        rowValues[14] = null // BB
        rowValues[15] = null // TB

        // 4 kolom pertanyaan (belum ada di database) -> index 16..19

        // Pre Test
        const preCells = buildAnswerCells(tests.pre)
        for (let i = 0; i < TOTAL_QUESTIONS; i++) rowValues[20 + i] = preCells[i]
        if (tests.pre) {
          const preScore =
            tests.pre.score ?? preCells.reduce((s: number, v) => s + (v === 1 ? 1 : 0), 0)
          const preFraction = preScore / TOTAL_QUESTIONS
          rowValues[43] = preScore
          rowValues[44] = preFraction
          rowValues[45] = getKategori(preFraction)
        }

        // Post Test
        const postCells = buildAnswerCells(tests.post)
        for (let i = 0; i < TOTAL_QUESTIONS; i++) rowValues[46 + i] = postCells[i]
        if (tests.post) {
          const postScore =
            tests.post.score ?? postCells.reduce((s: number, v) => s + (v === 1 ? 1 : 0), 0)
          const postFraction = postScore / TOTAL_QUESTIONS
          rowValues[69] = postScore
          rowValues[70] = postFraction
          rowValues[71] = getKategori(postFraction)
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
        const isTextCol = (c >= 2 && c <= 9) || c === 10 // nama/pekerjaan/agama/alamat/nama anak/tgl lahir
        cell.alignment = {
          horizontal: isTextCol ? 'left' : 'center',
          vertical: 'middle',
          wrapText: false,
        }

        // Format persen untuk kolom Persentase (45 & 71)
        if (c === 45 || c === 71) {
          cell.numFmt = '0.00%'
        }
      }
    }

    // ---- Lebar kolom ----
    const widths: Record<number, number> = {
      1: 4, // No
      2: 18, // Nama ortu
      3: 8, // Umur
      4: 12, // Pendidikan
      5: 14, // Pekerjaan
      6: 9, // Agama
      7: 11, // Suku/Bangsa
      8: 20, // Alamat
      9: 16, // Nama anak
      10: 14, // Umur/Tgl Lahir
      11: 5, // L/P
      12: 7, // Anak Ke
      13: 10, // Agama anak
      14: 13, // Status Imunisasi
      15: 6, // BB
      16: 6, // TB
      17: 14, // Pengalaman
      18: 14, // Informasi
      19: 14, // Riwayat
      20: 14, // Kunjungan
      44: 7, // Jumlah pre
      45: 11, // Persentase pre
      46: 9, // Kategori pre
      70: 7, // Jumlah post
      71: 11, // Persentase post
      72: 9, // Kategori post
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
