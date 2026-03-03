import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

/**
 * GET /api/questions
 * Fetch all quiz questions for authenticated users (for tests)
 * This is a public endpoint for authenticated users to get questions
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie (middleware already verified auth)
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }

    // Fetch all questions using admin client
    const supabase = createAdminClient()
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('id, question_text, order_number')
      .order('order_number', { ascending: true })

    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      questions: questions || [],
    })
  } catch (error) {
    console.error('Error in GET /api/questions:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pertanyaan' },
      { status: 500 }
    )
  }
}
