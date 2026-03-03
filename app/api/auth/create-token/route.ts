import { NextRequest, NextResponse } from 'next/server'
import { createUserToken } from '@/lib/auth/jwt'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or email' },
        { status: 400 }
      )
    }

    // Verify user exists in Supabase
    const supabase = createAdminClient()
    const { data: user, error } = await supabase.auth.admin.getUserById(userId)

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if profile exists
    const { data: motherProfile, error: profileError } = await supabase
      .from('mother_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile check error:', profileError)
    }

    const requiresProfileSetup = !motherProfile
    const redirectTo = requiresProfileSetup ? '/profile-setup' : '/dashboard'

    // Create custom JWT token
    const token = await createUserToken(userId, email)

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      token,
      redirectTo,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Create token error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create token' },
      { status: 500 }
    )
  }
}
