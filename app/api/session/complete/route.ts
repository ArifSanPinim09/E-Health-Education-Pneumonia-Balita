import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserFromCookie } from '@/lib/auth/get-user-from-cookie';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = await getUserFromCookie();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    // Parse request body
    const body = await request.json();
    const { day } = body;

    // Validate day number
    if (!day || day < 1 || day > 5) {
      return NextResponse.json(
        { success: false, error: 'Nomor hari tidak valid (harus 1-5)' },
        { status: 400 }
      );
    }

    // Check if session exists and is not already completed
    const { data: existingSession, error: fetchError } = await supabase
      .from('session_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle();

    if (fetchError || !existingSession) {
      return NextResponse.json(
        { success: false, error: 'Sesi tidak ditemukan' },
        { status: 404 }
      );
    }

    if ((existingSession as any).completed) {
      return NextResponse.json(
        { success: false, error: 'Sesi sudah diselesaikan sebelumnya' },
        { status: 400 }
      );
    }

    // Mark current session as completed
    const now = new Date().toISOString();
    
    // @ts-ignore - Supabase type inference issue
    const { error: updateError } = await supabase
      .from('session_progress')
      // @ts-ignore
      .update({
        completed: true,
        completed_at: now
      })
      .eq('user_id', userId)
      .eq('day', day);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json(
        { success: false, error: 'Gagal menyelesaikan sesi' },
        { status: 500 }
      );
    }

    // If not Day 5, create next session record with 24-hour lock
    let nextUnlockTime = null;
    
    if (day < 5) {
      const nextDay = day + 1;
      const unlockDate = new Date();
      unlockDate.setHours(unlockDate.getHours() + 24);
      nextUnlockTime = unlockDate.toISOString();

      // Check if next session already exists
      const { data: nextSession } = await supabase
        .from('session_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('day', nextDay)
        .single();

      if (!nextSession) {
        // Create next session record
        // @ts-ignore - Supabase type inference issue
        const { error: insertError } = await supabase
          .from('session_progress')
          // @ts-ignore
          .insert({
            user_id: userId,
            day: nextDay,
            completed: false,
            unlocked_at: nextUnlockTime
          });

        if (insertError) {
          console.error('Error creating next session:', insertError);
          // Don't fail the request if next session creation fails
          // The session completion was successful
        }
      }
    }

    // If Day 5 completed, post-test access is automatically enabled
    // (handled by frontend checking if all 5 sessions are completed)

    return NextResponse.json({
      success: true,
      message: day === 5 
        ? 'Selamat! Anda telah menyelesaikan semua sesi pembelajaran. Post-test sekarang tersedia.'
        : `Sesi Day ${day} berhasil diselesaikan. Sesi berikutnya akan terbuka dalam 24 jam.`,
      next_unlock_time: nextUnlockTime,
      day_completed: day,
      all_sessions_completed: day === 5
    });

  } catch (error) {
    console.error('Error in session complete API:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
