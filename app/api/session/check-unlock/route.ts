import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { jwtVerify } from 'jose'
import type { SessionProgress } from '@/lib/supabase/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

interface UserTokenPayload {
  userId: string
  email: string
  type: 'user'
}

async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.type === 'user') {
      return payload as unknown as UserTokenPayload
    }
    return null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyUserToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    // Get day parameter from query string
    const searchParams = request.nextUrl.searchParams
    const dayParam = searchParams.get('day')

    if (!dayParam) {
      return NextResponse.json(
        { success: false, error: 'Parameter day diperlukan' },
        { status: 400 }
      )
    }

    const day = parseInt(dayParam, 10)
    if (isNaN(day) || day < 1 || day > 5) {
      return NextResponse.json(
        { success: false, error: 'Day harus antara 1 dan 5' },
        { status: 400 }
      )
    }

    const userId = payload.userId
    const supabase = createAdminClient()

    // Fetch session progress for the specified day
    const { data: session, error: sessionError } = await supabase
      .from('session_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle() as { data: SessionProgress | null, error: any }

    if (sessionError) {
      console.error('Session fetch error:', sessionError)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data sesi' },
        { status: 500 }
      )
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Sesi tidak ditemukan' },
        { status: 404 }
      )
    }

    // Use server time to prevent client manipulation
    const serverTime = new Date()
    const unlockTime = new Date(session.unlocked_at)
    const isUnlocked = unlockTime <= serverTime

    // Calculate remaining time in milliseconds
    const remainingMs = isUnlocked ? 0 : unlockTime.getTime() - serverTime.getTime()

    return NextResponse.json({
      success: true,
      data: {
        unlocked: isUnlocked,
        unlock_time: session.unlocked_at,
        remaining_ms: remainingMs,
        completed: session.completed,
        completed_at: session.completed_at
      }
    })
  } catch (error) {
    console.error('Check unlock error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
