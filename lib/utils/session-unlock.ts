/**
 * Utility functions untuk unlock sessions
 */

import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Unlock semua sessions (Day 1-5) untuk user tertentu
 * Digunakan saat AUTO_UNLOCK_ALL_SESSIONS=true
 */
export async function unlockAllSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString()
    const sessionsToInsert = []

    // Prepare data untuk Day 1-5
    for (let day = 1; day <= 5; day++) {
      sessionsToInsert.push({
        user_id: userId,
        day: day,
        completed: false,
        unlocked_at: now,
      })
    }

    // Insert semua sessions sekaligus
    const { error } = await supabase
      .from('session_progress')
      .insert(sessionsToInsert as any)

    if (error) {
      console.error('Error unlocking all sessions:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ All sessions (Day 1-5) unlocked for user: ${userId}`)
    return { success: true }
  } catch (error) {
    console.error('Exception unlocking all sessions:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Unlock hanya Day 1 session untuk user tertentu
 * Digunakan saat AUTO_UNLOCK_ALL_SESSIONS=false (flow normal)
 */
export async function unlockDay1Session(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('session_progress')
      .insert({
        user_id: userId,
        day: 1,
        completed: false,
        unlocked_at: new Date().toISOString(),
      } as any)

    if (error) {
      console.error('Error unlocking Day 1 session:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Day 1 session unlocked for user: ${userId}`)
    return { success: true }
  } catch (error) {
    console.error('Exception unlocking Day 1 session:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check apakah auto unlock all sessions diaktifkan
 */
export function isAutoUnlockEnabled(): boolean {
  return process.env.AUTO_UNLOCK_ALL_SESSIONS === 'true'
}

/**
 * Check apakah session sudah unlock berdasarkan unlocked_at timestamp
 * Digunakan untuk countdown timer
 */
export function checkSessionUnlock(unlockedAt: string): {
  unlocked: boolean
  remainingMs: number
  remainingHours: number
  remainingMinutes: number
} {
  const now = new Date()
  const unlockTime = new Date(unlockedAt)
  const remainingMs = unlockTime.getTime() - now.getTime()

  if (remainingMs <= 0) {
    return {
      unlocked: true,
      remainingMs: 0,
      remainingHours: 0,
      remainingMinutes: 0,
    }
  }

  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60))
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))

  return {
    unlocked: false,
    remainingMs,
    remainingHours,
    remainingMinutes,
  }
}
