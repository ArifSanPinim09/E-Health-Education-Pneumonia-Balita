import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Berhasil logout',
    })

    // Clear both user and admin tokens
    response.cookies.delete('auth-token')
    response.cookies.delete('admin-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal logout' },
      { status: 500 }
    )
  }
}
