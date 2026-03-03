import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { jwtVerify } from 'jose'
import type { SessionProgress, TestSubmission } from '@/lib/supabase/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

interface UserTokenPayload {
  userId: string
  email: string
  type: 'user'
}

async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.type === 'user') {
      return payload as unknown as UserTokenPayload
    }
    return null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyUserToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const userId = payload.userId
    console.log('🔍 Fetching progress for user:', userId)
    const supabase = createAdminClient()

    // Fetch pre-test status
    const { data: preTest } = await supabase
      .from('test_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('test_type', 'pre')
      .maybeSingle() as { data: TestSubmission | null }

    console.log('📝 Pre-test status:', preTest ? 'Completed' : 'Not completed')

    // Fetch post-test status
    const { data: postTest } = await supabase
      .from('test_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('test_type', 'post')
      .maybeSingle() as { data: TestSubmission | null }

    // Fetch all session progress
    const { data: sessions, error: sessionsError } = await supabase
      .from('session_progress')
      .select('*')
      .eq('user_id', userId)
      .order('day', { ascending: true }) as { data: SessionProgress[] | null, error: any }

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError)
    }

    console.log('📚 Sessions found:', sessions?.length || 0)

    // Calculate overall completion percentage
    // Total activities: 1 pre-test + 5 sessions + 1 post-test = 7
    let completedActivities = 0
    const totalActivities = 7

    if (preTest) completedActivities++
    if (sessions && sessions.length > 0) {
      completedActivities += sessions.filter(s => s.completed).length
    }
    if (postTest) completedActivities++

    const overallPercentage = Math.round((completedActivities / totalActivities) * 100)

    console.log('✅ Progress calculated:', {
      completedActivities,
      totalActivities,
      percentage: overallPercentage
    })

    // Format session statuses
    const sessionStatuses = sessions?.map(session => ({
      day: session.day,
      completed: session.completed,
      completed_at: session.completed_at,
      unlocked_at: session.unlocked_at,
      is_unlocked: new Date(session.unlocked_at) <= new Date(),
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        pre_test_completed: !!preTest,
        pre_test_score: preTest?.score ?? null,
        post_test_completed: !!postTest,
        post_test_score: postTest?.score ?? null,
        sessions: sessionStatuses,
        overall_percentage: overallPercentage,
        completed_activities: completedActivities,
        total_activities: totalActivities,
      }
    })
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
