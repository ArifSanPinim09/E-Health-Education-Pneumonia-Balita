import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'

/**
 * PUT /api/admin/questions/[id]
 * Update an existing quiz question
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params

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

    // Validate correct_answer if provided
    if (correct_answer !== undefined && correct_answer !== true && correct_answer !== false) {
      return NextResponse.json(
        { success: false, error: 'Jawaban harus berupa True atau False' },
        { status: 400 }
      )
    }

    // Update question
    const supabase = createAdminClient()
    
    // Build update payload
    const updatePayload = {
      updated_at: new Date().toISOString(),
      ...(question_text !== undefined && { question_text }),
      ...(correct_answer !== undefined && { correct_answer }),
      ...(order_number !== undefined && { order_number }),
    }
    
    const result: any = await (supabase.from('quiz_questions') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()
    
    const { data: updatedQuestion, error } = result

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Nomor urut sudah digunakan' },
          { status: 400 }
        )
      }
      // Check if question not found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Pertanyaan tidak ditemukan' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
    })
  } catch (error) {
    console.error('Error updating quiz question:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui pertanyaan' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/questions/[id]
 * Delete a quiz question
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params

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

    // Delete question
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Pertanyaan berhasil dihapus',
    })
  } catch (error) {
    console.error('Error deleting quiz question:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus pertanyaan' },
      { status: 500 }
    )
  }
}
