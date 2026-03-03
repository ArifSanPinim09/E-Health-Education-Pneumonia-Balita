import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { jwtVerify } from 'jose'
import { calculateAge } from '@/lib/utils/age-calculator'
import { profileSchema, ProfileSetupInput } from '@/lib/validations/profile-schema'
import { handleApiError, validateRequest, AppError, ErrorType, ERROR_MESSAGES } from '@/lib/utils/error-handler'

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

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new AppError(
        ErrorType.AUTHENTICATION,
        ERROR_MESSAGES.UNAUTHORIZED,
        401
      )
    }

    // Verify token
    const payload = await verifyUserToken(token)
    if (!payload) {
      throw new AppError(
        ErrorType.AUTHENTICATION,
        ERROR_MESSAGES.TOKEN_INVALID,
        401
      )
    }

    const userId = payload.userId

    // Validate request body
    const { mother, child } = await validateRequest<ProfileSetupInput>(request, profileSchema)

    // Calculate child age
    const assessmentDate = new Date()
    const { age_years, age_months, age_days } = calculateAge(child.birth_date, assessmentDate)

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('mother_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingProfile) {
      throw new AppError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.PROFILE_EXISTS,
        400
      )
    }

    // Insert mother profile
    const { error: motherError } = await supabase
      .from('mother_profiles')
      .insert({
        user_id: userId,
        name: mother.name,
        age: Number(mother.age),
        religion: mother.religion,
        occupation: mother.occupation,
        address: mother.address,
        phone: mother.phone,
      } as any)

    if (motherError) {
      console.error('Mother profile insert error:', motherError)
      throw motherError
    }

    console.log('✅ Mother profile created for user:', userId)

    // Insert child profile
    const { error: childError } = await supabase
      .from('child_profiles')
      .insert({
        user_id: userId,
        name: child.name,
        birth_date: child.birth_date,
        gender: child.gender,
        age_years,
        age_months,
        age_days,
        assessment_date: assessmentDate.toISOString().split('T')[0],
      } as any)

    if (childError) {
      console.error('Child profile insert error:', childError)
      // Rollback mother profile if child insert fails
      await supabase.from('mother_profiles').delete().eq('user_id', userId)
      throw childError
    }

    console.log('✅ Child profile created for user:', userId)
    console.log('📊 Child age:', { age_years, age_months, age_days })

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil dibuat',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
