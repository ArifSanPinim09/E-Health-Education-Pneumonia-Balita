import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  try {
    // Verify admin token (consistent with other admin APIs)
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

    // Use admin client to bypass RLS (consistent with other admin APIs)
    const supabase = createAdminClient() as any // Cast to any to allow user_feedback table

    // First, check if user_feedback table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_feedback')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('user_feedback table error:', tableError)
      
      // If table doesn't exist, return empty data
      if (tableError.code === 'PGRST116' || tableError.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          data: [],
          stats: {
            total_feedback: 0,
            average_rating: 0,
            rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          },
          message: 'Tabel feedback belum ada. Silakan jalankan migration terlebih dahulu.'
        })
      }
      
      return NextResponse.json(
        { success: false, error: `Database error: ${tableError.message}` },
        { status: 500 }
      )
    }

    // Get all feedback with user profile information
    const { data: feedbackList, error: feedbackError } = await supabase
      .from('user_feedback')
      .select(`
        *,
        mother_profiles(name, phone)
      `)
      .order('created_at', { ascending: false })

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError)
      
      // Handle specific errors
      if (feedbackError.code === 'PGRST116') {
        // No data found - this is OK
        return NextResponse.json({
          success: true,
          data: [],
          stats: {
            total_feedback: 0,
            average_rating: 0,
            rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          },
        })
      }
      
      return NextResponse.json(
        { success: false, error: `Gagal mengambil data feedback: ${feedbackError.message}` },
        { status: 500 }
      )
    }

    // Calculate statistics
    const totalFeedback = feedbackList?.length || 0
    const averageRating = totalFeedback > 0 && feedbackList
      ? (feedbackList.reduce((sum: number, f: any) => sum + f.overall_rating, 0) / totalFeedback).toFixed(2)
      : 0

    const ratingDistribution = {
      5: feedbackList?.filter((f: any) => f.overall_rating === 5).length || 0,
      4: feedbackList?.filter((f: any) => f.overall_rating === 4).length || 0,
      3: feedbackList?.filter((f: any) => f.overall_rating === 3).length || 0,
      2: feedbackList?.filter((f: any) => f.overall_rating === 2).length || 0,
      1: feedbackList?.filter((f: any) => f.overall_rating === 1).length || 0,
    }

    return NextResponse.json({
      success: true,
      data: feedbackList || [],
      stats: {
        total_feedback: totalFeedback,
        average_rating: typeof averageRating === 'string' ? parseFloat(averageRating) : averageRating,
        rating_distribution: ratingDistribution,
      },
    })
  } catch (error) {
    console.error('Error in admin feedback:', error)
    return NextResponse.json(
      { success: false, error: `Terjadi kesalahan server: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
