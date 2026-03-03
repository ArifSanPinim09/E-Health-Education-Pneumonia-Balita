import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'
import * as XLSX from 'xlsx'
import { formatDateIndonesian, formatDateTimeIndonesian, formatNumberIndonesian } from '@/lib/utils/date-formatter'

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

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Fetch all mother profiles
    const { data: motherProfiles, error: motherError } = await supabase
      .from('mother_profiles')
      .select('user_id, name, age, religion, occupation, address, phone, created_at')
      .order('created_at', { ascending: false })

    if (motherError) {
      console.error('Error fetching mother profiles:', motherError)
      throw motherError
    }

    if (!motherProfiles || motherProfiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada data untuk diekspor' },
        { status: 404 }
      )
    }

    // Get user IDs
    const userIds = motherProfiles.map((profile: any) => profile.user_id)

    // Fetch child profiles
    const { data: childProfiles, error: childError } = await supabase
      .from('child_profiles')
      .select('user_id, name, birth_date, gender, age_years, age_months, age_days, assessment_date')
      .in('user_id', userIds)

    if (childError) {
      console.error('Error fetching child profiles:', childError)
      throw childError
    }

    // Fetch test submissions with answers
    const { data: testSubmissions, error: testError } = await supabase
      .from('test_submissions')
      .select('user_id, test_type, score, answers, completed_at')
      .in('user_id', userIds)

    if (testError) {
      console.error('Error fetching test submissions:', testError)
      throw testError
    }

    // Fetch session progress
    const { data: sessionProgress, error: sessionError } = await supabase
      .from('session_progress')
      .select('user_id, day, completed, completed_at, unlocked_at')
      .in('user_id', userIds)
      .order('day', { ascending: true })

    if (sessionError) {
      console.error('Error fetching session progress:', sessionError)
      throw sessionError
    }

    // Fetch user emails from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error fetching auth users:', authError)
      throw authError
    }

    // Create maps for quick lookups
    const childMap = new Map((childProfiles || []).map((c: any) => [c.user_id, c]))
    const emailMap = new Map(authUsers.users.map((u) => [u.id, u.email]))
    
    // Group test submissions by user and type
    const testMap = new Map<string, { pre?: any; post?: any }>()
    testSubmissions?.forEach((test: any) => {
      if (!testMap.has(test.user_id)) {
        testMap.set(test.user_id, {})
      }
      const userTests = testMap.get(test.user_id)!
      if (test.test_type === 'pre') {
        userTests.pre = test
      } else if (test.test_type === 'post') {
        userTests.post = test
      }
    })

    // Group session progress by user
    const sessionMap = new Map<string, any[]>()
    sessionProgress?.forEach((session: any) => {
      if (!sessionMap.has(session.user_id)) {
        sessionMap.set(session.user_id, [])
      }
      sessionMap.get(session.user_id)!.push(session)
    })

    // Format data for Excel export
    const exportData = motherProfiles.map((mother: any) => {
      const child = childMap.get(mother.user_id)
      const tests = testMap.get(mother.user_id) || {}
      const sessions = sessionMap.get(mother.user_id) || []
      const email = emailMap.get(mother.user_id) || ''

      // Format dates
      const formatDate = (dateString: string | null) => {
        if (!dateString) return ''
        return formatDateIndonesian(dateString)
      }

      const formatDateTime = (dateString: string | null) => {
        if (!dateString) return ''
        return formatDateTimeIndonesian(dateString)
      }

      // Calculate sessions completed
      const sessionsCompleted = sessions.filter((s) => s.completed).length

      // Format session completion timestamps
      const sessionTimestamps: { [key: string]: string } = {}
      sessions.forEach((session) => {
        sessionTimestamps[`Sesi ${session.day} Selesai`] = session.completed
          ? formatDateTime(session.completed_at)
          : 'Belum Selesai'
      })

      return {
        // User Info
        'Email': email,
        'Tanggal Registrasi': formatDateTime(mother.created_at),
        
        // Mother Profile
        'Nama Ibu': mother.name,
        'Usia Ibu': mother.age,
        'Agama': mother.religion,
        'Pekerjaan': mother.occupation,
        'Alamat': mother.address,
        'No. Telepon': mother.phone,
        
        // Child Profile
        'Nama Anak': child?.name || '',
        'Tanggal Lahir Anak': formatDate(child?.birth_date),
        'Jenis Kelamin Anak': child?.gender === 'male' ? 'Laki-laki' : child?.gender === 'female' ? 'Perempuan' : '',
        'Usia Anak (Tahun)': child?.age_years || 0,
        'Usia Anak (Bulan)': child?.age_months || 0,
        'Usia Anak (Hari)': child?.age_days || 0,
        'Tanggal Asesmen': formatDate(child?.assessment_date),
        
        // Pre-Test
        'Pre-Test Selesai': tests.pre ? 'Ya' : 'Tidak',
        'Skor Pre-Test': tests.pre?.score ?? '',
        'Tanggal Pre-Test': tests.pre ? formatDateTime(tests.pre.completed_at) : '',
        
        // Post-Test
        'Post-Test Selesai': tests.post ? 'Ya' : 'Tidak',
        'Skor Post-Test': tests.post?.score ?? '',
        'Tanggal Post-Test': tests.post ? formatDateTime(tests.post.completed_at) : '',
        
        // Score Improvement
        'Peningkatan Skor': tests.pre && tests.post ? tests.post.score - tests.pre.score : '',
        'Persentase Peningkatan': tests.pre && tests.post && tests.pre.score > 0
          ? `${formatNumberIndonesian(((tests.post.score - tests.pre.score) / tests.pre.score) * 100, 2)}%`
          : '',
        
        // Session Progress
        'Sesi Selesai': `${sessionsCompleted}/5`,
        ...sessionTimestamps,
        
        // Status
        'Status': tests.post ? 'Selesai' : tests.pre || sessionsCompleted > 0 ? 'Sedang Berjalan' : 'Belum Mulai',
      }
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Set column widths for better readability
    const columnWidths = [
      { wch: 30 }, // Email
      { wch: 20 }, // Tanggal Registrasi
      { wch: 25 }, // Nama Ibu
      { wch: 10 }, // Usia Ibu
      { wch: 15 }, // Agama
      { wch: 20 }, // Pekerjaan
      { wch: 40 }, // Alamat
      { wch: 15 }, // No. Telepon
      { wch: 25 }, // Nama Anak
      { wch: 15 }, // Tanggal Lahir Anak
      { wch: 18 }, // Jenis Kelamin Anak
      { wch: 15 }, // Usia Anak (Tahun)
      { wch: 15 }, // Usia Anak (Bulan)
      { wch: 15 }, // Usia Anak (Hari)
      { wch: 15 }, // Tanggal Asesmen
      { wch: 15 }, // Pre-Test Selesai
      { wch: 15 }, // Skor Pre-Test
      { wch: 20 }, // Tanggal Pre-Test
      { wch: 15 }, // Post-Test Selesai
      { wch: 15 }, // Skor Post-Test
      { wch: 20 }, // Tanggal Post-Test
      { wch: 15 }, // Peningkatan Skor
      { wch: 20 }, // Persentase Peningkatan
      { wch: 15 }, // Sesi Selesai
      { wch: 20 }, // Sesi 1 Selesai
      { wch: 20 }, // Sesi 2 Selesai
      { wch: 20 }, // Sesi 3 Selesai
      { wch: 20 }, // Sesi 4 Selesai
      { wch: 20 }, // Sesi 5 Selesai
      { wch: 20 }, // Status
    ]
    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Responden')

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Generate filename with current date
    const now = new Date()
    const filename = `Data_Responden_Pneumonia_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`

    // Return file as response
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengekspor data, silakan coba lagi' },
      { status: 500 }
    )
  }
}
