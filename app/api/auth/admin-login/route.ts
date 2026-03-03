import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminToken } from '@/lib/auth/jwt'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Get admin user from database
    const supabase = await createClient()
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()

    if (error || !adminUser) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Type assertion for admin user
    type AdminUserData = {
      id: string
      email: string
      password_hash: string
    }
    const admin = adminUser as AdminUserData

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Create admin JWT token
    const token = await createAdminToken(admin.id, admin.email)

    // Set token in cookie
    const response = NextResponse.json({
      success: true,
      token,
      admin_id: admin.id,
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Koneksi gagal, silakan coba lagi' },
      { status: 500 }
    )
  }
}
