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

    // Calculate total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('mother_profiles')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.error('Error fetching total users:', usersError)
      throw usersError
    }

    // Calculate completed pre-tests
    const { count: completedPreTests, error: preTestError } = await supabase
      .from('test_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('test_type', 'pre')

    if (preTestError) {
      console.error('Error fetching completed pre-tests:', preTestError)
      throw preTestError
    }

    // Calculate completed post-tests
    const { count: completedPostTests, error: postTestError } = await supabase
      .from('test_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('test_type', 'post')

    if (postTestError) {
      console.error('Error fetching completed post-tests:', postTestError)
      throw postTestError
    }

    // Calculate average pre-test score
    const { data: preTestScores, error: preScoresError } = await supabase
      .from('test_submissions')
      .select('score')
      .eq('test_type', 'pre')

    if (preScoresError) {
      console.error('Error fetching pre-test scores:', preScoresError)
      throw preScoresError
    }

    type ScoreData = { score: number }
    const averagePreScore = preTestScores && preTestScores.length > 0
      ? (preTestScores as ScoreData[]).reduce((sum, item) => sum + item.score, 0) / preTestScores.length
      : 0

    // Calculate average post-test score
    const { data: postTestScores, error: postScoresError } = await supabase
      .from('test_submissions')
      .select('score')
      .eq('test_type', 'post')

    if (postScoresError) {
      console.error('Error fetching post-test scores:', postScoresError)
      throw postScoresError
    }

    const averagePostScore = postTestScores && postTestScores.length > 0
      ? (postTestScores as ScoreData[]).reduce((sum, item) => sum + item.score, 0) / postTestScores.length
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        total_users: totalUsers || 0,
        completed_pre_tests: completedPreTests || 0,
        completed_post_tests: completedPostTests || 0,
        average_pre_score: Math.round(averagePreScore * 10) / 10, // Round to 1 decimal
        average_post_score: Math.round(averagePostScore * 10) / 10, // Round to 1 decimal
      },
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
