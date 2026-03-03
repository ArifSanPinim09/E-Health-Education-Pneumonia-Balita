import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

/**
 * Get authenticated user ID from cookie
 * Returns null if not authenticated
 */
export async function getUserFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return null
    }

    const verification = await verifyToken(authToken)
    if (!verification.valid || !verification.payload?.userId) {
      return null
    }

    return verification.payload.userId
  } catch (error) {
    console.error('Error getting user from cookie:', error)
    return null
  }
}
