import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'

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

    // Get search and filter parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all' // all, completed, in-progress, not-started

    // Fetch all mother profiles with user emails
    const { data: motherProfiles, error: motherError } = await supabase
      .from('mother_profiles')
      .select('user_id, name, age, religion, occupation, address, phone, created_at')

    if (motherError) {
      console.error('Error fetching mother profiles:', motherError)
      throw motherError
    }

    if (!motherProfiles || motherProfiles.length === 0) {
      return NextResponse.json({
        success: true,
        respondents: [],
      })
    }

    // Get user IDs
    const userIds = motherProfiles.map((profile: any) => profile.user_id)

    // Fetch child profiles
    const { data: childProfiles, error: childError } = await supabase
      .from('child_profiles')
      .select('user_id, name, birth_date, gender, age_years, age_months, age_days')
      .in('user_id', userIds)

    if (childError) {
      console.error('Error fetching child profiles:', childError)
      throw childError
    }

    // Fetch test submissions
    const { data: testSubmissions, error: testError } = await supabase
      .from('test_submissions')
      .select('user_id, test_type, score, completed_at')
      .in('user_id', userIds)

    if (testError) {
      console.error('Error fetching test submissions:', testError)
      throw testError
    }

    // Fetch session progress
    const { data: sessionProgress, error: sessionError } = await supabase
      .from('session_progress')
      .select('user_id, day, completed, completed_at')
      .in('user_id', userIds)

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

    // Create a map for quick lookups
    const childMap = new Map((childProfiles || []).map((c: any) => [c.user_id, c]))
    const testMap = new Map<string, { pre?: number; post?: number }>()
    const sessionMap = new Map<string, number>()
    const emailMap = new Map(authUsers.users.map((u) => [u.id, u.email]))

    // Process test submissions
    testSubmissions?.forEach((test: any) => {
      if (!testMap.has(test.user_id)) {
        testMap.set(test.user_id, {})
      }
      const userTests = testMap.get(test.user_id)!
      if (test.test_type === 'pre') {
        userTests.pre = test.score
      } else if (test.test_type === 'post') {
        userTests.post = test.score
      }
    })

    // Process session progress
    sessionProgress?.forEach((session: any) => {
      if (session.completed) {
        const current = sessionMap.get(session.user_id) || 0
        sessionMap.set(session.user_id, current + 1)
      }
    })

    // Combine all data
    const respondents = motherProfiles.map((mother: any) => {
      const child = childMap.get(mother.user_id)
      const tests = testMap.get(mother.user_id) || {}
      const sessionsCompleted = sessionMap.get(mother.user_id) || 0
      const email = emailMap.get(mother.user_id) || ''

      // Determine status
      let status = 'not-started'
      if (tests.post !== undefined) {
        status = 'completed'
      } else if (tests.pre !== undefined || sessionsCompleted > 0) {
        status = 'in-progress'
      }

      return {
        user_id: mother.user_id,
        email,
        mother_name: mother.name,
        mother_age: mother.age,
        mother_religion: mother.religion,
        mother_occupation: mother.occupation,
        mother_address: mother.address,
        mother_phone: mother.phone,
        child_name: child?.name || '',
        child_birth_date: child?.birth_date || '',
        child_gender: child?.gender || '',
        child_age_years: child?.age_years || 0,
        child_age_months: child?.age_months || 0,
        child_age_days: child?.age_days || 0,
        pre_test_score: tests.pre ?? null,
        post_test_score: tests.post ?? null,
        sessions_completed: sessionsCompleted,
        status,
        created_at: mother.created_at,
      }
    })

    // Apply search filter
    let filteredRespondents = respondents
    if (search) {
      const searchLower = search.toLowerCase()
      filteredRespondents = respondents.filter(
        (r) =>
          r.mother_name.toLowerCase().includes(searchLower) ||
          r.child_name.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filter !== 'all') {
      filteredRespondents = filteredRespondents.filter((r) => r.status === filter)
    }

    // Sort by created_at (newest first)
    filteredRespondents.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json({
      success: true,
      respondents: filteredRespondents,
    })
  } catch (error) {
    console.error('Admin respondents error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
