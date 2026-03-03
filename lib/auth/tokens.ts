import { SignJWT, jwtVerify } from 'jose'

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-admin-secret-key-change-in-production'
)

export interface AdminTokenPayload {
  adminId: string
  email: string
  role: 'admin'
}

export async function createAdminToken(adminId: string, email: string): Promise<string> {
  const token = await new SignJWT({ adminId, email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7-day expiry for admin tokens
    .sign(ADMIN_JWT_SECRET)

  return token
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET)
    return payload as unknown as AdminTokenPayload
  } catch {
    return null
  }
}
