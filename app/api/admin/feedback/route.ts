import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient() as any // Cast to any to allow user_feedback table

    // Get all feedback with user profile information
    const { data: feedbackList, error: feedbackError } = await supabase
      .from('user_feedback')
      .select(`
        *,
        mother_profiles!inner(name, phone)
      `)
      .order('created_at', { ascending: false })

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError)
      return NextResponse.json(
        { error: 'Gagal mengambil data feedback' },
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
      data: feedbackList,
      stats: {
        total_feedback: totalFeedback,
        average_rating: typeof averageRating === 'string' ? parseFloat(averageRating) : averageRating,
        rating_distribution: ratingDistribution,
      },
    })
  } catch (error) {
    console.error('Error in admin feedback:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
