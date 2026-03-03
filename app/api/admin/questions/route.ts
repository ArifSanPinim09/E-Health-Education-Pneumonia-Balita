import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'

/**
 * GET /api/admin/questions
 * Fetch all quiz questions ordered by order_number
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token from cookie
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

    // Fetch all questions
    const supabase = createAdminClient()
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('order_number', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pertanyaan' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/questions
 * Create a new quiz question
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token from cookie
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

    // Parse request body
    const body = await request.json()
    const { question_text, correct_answer, order_number } = body

    // Validate required fields
    if (!question_text || typeof correct_answer !== 'boolean' || !order_number) {
      return NextResponse.json(
        { success: false, error: 'Data pertanyaan tidak lengkap' },
        { status: 400 }
      )
    }

    // Validate correct_answer is boolean
    if (correct_answer !== true && correct_answer !== false) {
      return NextResponse.json(
        { success: false, error: 'Jawaban harus berupa True atau False' },
        { status: 400 }
      )
    }

    // Insert new question
    const supabase = createAdminClient()
    const { data: newQuestion, error } = await supabase
      .from('quiz_questions')
      .insert({
        question_text,
        correct_answer,
        order_number,
      } as any)
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Nomor urut sudah digunakan' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: newQuestion,
    })
  } catch (error) {
    console.error('Error creating quiz question:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal membuat pertanyaan baru' },
      { status: 500 }
    )
  }
}
