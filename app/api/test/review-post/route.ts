import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'
import type { Database } from '@/lib/supabase/types'

type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']

export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie
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

    // Use admin client
    const supabase = createAdminClient()

    // Get post-test submission
    const { data: submission, error: submissionError } = await supabase
      .from('test_submissions')
      .select('answers, score, completed_at')
      .eq('user_id', userId)
      .eq('test_type', 'post')
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { success: false, error: 'Post-test belum dikerjakan' },
        { status: 404 }
      )
    }

    // Type assertion for submission data
    const submissionData = submission as {
      answers: boolean[]
      score: number
      completed_at: string
    }

    // Get all questions with correct answers
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, question_text, correct_answer, order_number')
      .order('order_number', { ascending: true })

    if (questionsError || !questions) {
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data pertanyaan' },
        { status: 500 }
      )
    }

    // Combine questions with user answers
    const userAnswers = submissionData.answers
    const review = questions.map((question: any, index: number) => ({
      id: question.id,
      questionNumber: index + 1,
      questionText: question.question_text,
      correctAnswer: question.correct_answer,
      userAnswer: userAnswers[index],
      isCorrect: userAnswers[index] === question.correct_answer,
    }))

    return NextResponse.json({
      success: true,
      score: submissionData.score,
      totalQuestions: questions.length,
      completedAt: submissionData.completed_at,
      review,
    })
  } catch (error) {
    console.error('Error in review-post API:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
