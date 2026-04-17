import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient() as any // Cast to any to allow user_feedback table

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (feedbackError && feedbackError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay
      console.error('Error fetching feedback:', feedbackError)
      return NextResponse.json(
        { error: 'Gagal mengambil feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: feedback || null,
      has_submitted: !!feedback,
    })
  } catch (error) {
    console.error('Error in get feedback:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
