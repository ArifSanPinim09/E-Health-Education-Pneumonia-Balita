import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const {
      overall_rating,
      content_quality,
      ease_of_use,
      chatbot_helpful,
      positive_feedback,
      improvement_feedback,
      pre_test_score,
      post_test_score,
      improvement_percentage,
    } = body

    // Validate required fields
    if (!overall_rating || overall_rating < 1 || overall_rating > 5) {
      return NextResponse.json(
        { error: 'Rating keseluruhan harus antara 1-5' },
        { status: 400 }
      )
    }

    // Check if user already submitted feedback
    const { data: existingFeedback } = await supabase
      .from('user_feedback')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingFeedback) {
      // Update existing feedback
      const { error: updateError } = await supabase
        .from('user_feedback')
        .update({
          overall_rating,
          content_quality,
          ease_of_use,
          chatbot_helpful,
          positive_feedback,
          improvement_feedback,
          pre_test_score,
          post_test_score,
          improvement_percentage,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating feedback:', updateError)
        return NextResponse.json(
          { error: 'Gagal memperbarui feedback' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Feedback berhasil diperbarui',
      })
    } else {
      // Insert new feedback
      const { error: insertError } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          overall_rating,
          content_quality,
          ease_of_use,
          chatbot_helpful,
          positive_feedback,
          improvement_feedback,
          pre_test_score,
          post_test_score,
          improvement_percentage,
        })

      if (insertError) {
        console.error('Error inserting feedback:', insertError)
        return NextResponse.json(
          { error: 'Gagal menyimpan feedback' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Feedback berhasil dikirim',
      })
    }
  } catch (error) {
    console.error('Error in feedback submission:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
