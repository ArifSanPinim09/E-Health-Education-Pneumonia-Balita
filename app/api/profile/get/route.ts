import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { jwtVerify } from 'jose'

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
      console.log('❌ No token found')
      return NextResponse.json(
        { success: false, error: 'Tidak terautentikasi' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyUserToken(token)
    if (!payload) {
      console.log('❌ Invalid token')
      return NextResponse.json(
        { success: false, error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const userId = payload.userId
    console.log('🔍 Fetching profile for user:', userId)

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Fetch mother profile
    const { data: motherProfile, error: motherError } = await supabase
      .from('mother_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle() as { data: any, error: any }

    if (motherError) {
      console.error('❌ Mother profile fetch error:', motherError)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil profil ibu' },
        { status: 500 }
      )
    }

    if (!motherProfile) {
      console.log('⚠️ Mother profile not found for user:', userId)
      return NextResponse.json(
        { success: false, error: 'Profil tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Mother profile found:', motherProfile.name)

    // Fetch child profile
    const { data: childProfile, error: childError } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle() as { data: any, error: any }

    if (childError) {
      console.error('❌ Child profile fetch error:', childError)
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil profil anak' },
        { status: 500 }
      )
    }

    if (!childProfile) {
      console.log('⚠️ Child profile not found for user:', userId)
      return NextResponse.json(
        { success: false, error: 'Profil anak tidak ditemukan' },
        { status: 404 }
      )
    }

    console.log('✅ Child profile found:', childProfile.name)

    return NextResponse.json({
      success: true,
      mother: motherProfile,
      child: childProfile,
    })
  } catch (error) {
    console.error('❌ Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
