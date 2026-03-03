import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'
import type { Database } from '@/lib/supabase/types'

type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']

export async function POST(request: NextRequest) {
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

    // Verify token to get user ID
    const verification = await verifyToken(authToken)
    if (!verification.valid || !verification.payload?.userId) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const userId = verification.payload.userId

    // Parse request body
    const body = await request.json()
    const { answers } = body

    // Validate answers array
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: 'Format jawaban tidak valid' },
        { status: 400 }
      )
    }

    if (answers.length !== 23) {
      return NextResponse.json(
        { success: false, error: 'Jumlah jawaban harus 23 pertanyaan' },
        { status: 400 }
      )
    }

    // Validate all answers are boolean
    if (!answers.every(answer => typeof answer === 'boolean')) {
      return NextResponse.json(
        { success: false, error: 'Semua jawaban harus berupa true atau false' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS (since we're using custom JWT, not Supabase Auth)
    const supabase = createAdminClient()

    // Check if user already submitted post-test
    const { data: existingSubmission } = await supabase
      .from('test_submissions')
      .select('id')
      .eq('user_id', userId)
      .eq('test_type', 'post')
      .single()

    if (existingSubmission) {
      return NextResponse.json(
        { success: false, error: 'Post-test sudah pernah dikerjakan' },
        { status: 400 }
      )
    }

    // Fetch correct answers from quiz_questions
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('correct_answer, order_number')
      .order('order_number', { ascending: true })
      .returns<Pick<QuizQuestion, 'correct_answer' | 'order_number'>[]>()

    if (questionsError || !questions || questions.length !== 23) {
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pertanyaan' },
        { status: 500 }
      )
    }

    // Calculate post-test score
    let score = 0
    for (let i = 0; i < 23; i++) {
      if (answers[i] === questions[i]?.correct_answer) {
        score++
      }
    }

    // Fetch pre-test score for comparison
    const { data: preTestSubmission, error: preTestError } = await supabase
      .from('test_submissions')
      .select('score')
      .eq('user_id', userId)
      .eq('test_type', 'pre')
      .single()

    if (preTestError || !preTestSubmission) {
      return NextResponse.json(
        { success: false, error: 'Pre-test belum dikerjakan' },
        { status: 400 }
      )
    }

    const preScore = (preTestSubmission as { score: number }).score

    // Store post-test submission
    const { error: submissionError } = await supabase
      .from('test_submissions')
      .insert({
        user_id: userId,
        test_type: 'post' as const,
        answers: answers,
        score: score,
      } as any)

    if (submissionError) {
      console.error('Error storing test submission:', submissionError)
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan hasil post-test' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      score: score,
      pre_score: preScore,
      message: 'Post-test berhasil diselesaikan',
    })
  } catch (error) {
    console.error('Error in submit-post API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
