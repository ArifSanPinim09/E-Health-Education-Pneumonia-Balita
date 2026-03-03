/**
 * Script to update admin password
 * Usage: npx tsx scripts/update-admin-password.ts <email> <new-password>
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.argv[2]
const newPassword = process.argv[3]

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local')
  process.exit(1)
}

if (!email || !newPassword) {
  console.error('Error: Please provide email and new password')
  console.log('Usage: npx tsx scripts/update-admin-password.ts <email> <new-password>')
  console.log('Example: npx tsx scripts/update-admin-password.ts admin@example.com newpass123')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAdminPassword() {
  try {
    console.log(`Updating password for admin: ${email}`)
    
    // Check if admin exists
    const { data: existing, error: fetchError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (fetchError || !existing) {
      console.error(`Admin user with email ${email} not found`)
      console.log('\nAvailable options:')
      console.log('1. Create new admin: npx tsx scripts/seed-admin.ts')
      console.log('2. Check email spelling')
      process.exit(1)
    }

    // Generate new hash
    const newHash = await bcrypt.hash(newPassword, 10)
    console.log('Generated new password hash')

    // Update password
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating password:', updateError)
      process.exit(1)
    }

    console.log('✓ Password updated successfully')
    console.log(`Email: ${email}`)
    console.log(`New password: ${newPassword}`)
    console.log('\nYou can now login with the new password')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

updateAdminPassword()
