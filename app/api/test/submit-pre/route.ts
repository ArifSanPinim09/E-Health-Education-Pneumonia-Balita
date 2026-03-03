import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'
import type { Database } from '@/lib/supabase/types'
import { testSubmissionSchema } from '@/lib/validations/auth-schema'
import { handleApiError, validateRequest, AppError, ErrorType, ERROR_MESSAGES } from '@/lib/utils/error-handler'

type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']

export async function POST(request: NextRequest) {
  try {
    // Get user ID from cookie (middleware already verified auth)
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      throw new AppError(
        ErrorType.AUTHENTICATION,
        ERROR_MESSAGES.UNAUTHORIZED,
        401
      )
    }

    // Verify token to get user ID
    const verification = await verifyToken(authToken)
    if (!verification.valid || !verification.payload?.userId) {
      throw new AppError(
        ErrorType.AUTHENTICATION,
        ERROR_MESSAGES.TOKEN_INVALID,
        401
      )
    }

    const userId = verification.payload.userId

    // Validate request body
    const { answers } = await validateRequest<{ answers: boolean[] }>(request, testSubmissionSchema)

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Check if user already submitted pre-test
    const { data: existingSubmission } = await supabase
      .from('test_submissions')
      .select('id')
      .eq('user_id', userId)
      .eq('test_type', 'pre')
      .single()

    if (existingSubmission) {
      throw new AppError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.TEST_ALREADY_TAKEN,
        400
      )
    }

    // Fetch correct answers from quiz_questions
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('correct_answer, order_number')
      .order('order_number', { ascending: true })
      .returns<Pick<QuizQuestion, 'correct_answer' | 'order_number'>[]>()

    if (questionsError || !questions || questions.length !== 23) {
      console.error('Error fetching questions:', questionsError)
      throw new AppError(
        ErrorType.DATABASE,
        'Gagal mengambil data pertanyaan',
        500
      )
    }

    // Calculate score
    let score = 0
    for (let i = 0; i < 23; i++) {
      if (answers[i] === questions[i]?.correct_answer) {
        score++
      }
    }

    // Store test submission
    const { error: submissionError } = await supabase
      .from('test_submissions')
      .insert({
        user_id: userId,
        test_type: 'pre' as const,
        answers: answers,
        score: score,
      } as any)

    if (submissionError) {
      console.error('Error storing test submission:', submissionError)
      throw submissionError
    }

    // Unlock Day 1 session
    const { error: sessionError } = await supabase
      .from('session_progress')
      .insert({
        user_id: userId,
        day: 1,
        completed: false,
        unlocked_at: new Date().toISOString(),
      } as any)

    if (sessionError) {
      console.error('Error unlocking Day 1 session:', sessionError)
      // Don't fail the request if session unlock fails
    }

    return NextResponse.json({
      success: true,
      score: score,
      message: 'Pre-test berhasil diselesaikan',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
