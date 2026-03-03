/**
 * Script to seed initial admin user
 * Usage: npx tsx scripts/seed-admin.ts
 * 
 * Make sure to set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.local first
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.ADMIN_EMAIL
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local')
  process.exit(1)
}

if (!adminEmail || !adminPasswordHash) {
  console.error('Error: Missing ADMIN_EMAIL or ADMIN_PASSWORD_HASH in .env.local')
  console.log('\nTo generate a password hash, run:')
  console.log('npx tsx scripts/generate-admin-hash.ts <your-password>')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedAdmin() {
  try {
    console.log('Seeding admin user...')
    
    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', adminEmail)
      .single()

    if (existing) {
      console.log(`Admin user with email ${adminEmail} already exists`)
      return
    }

    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: adminEmail,
        password_hash: adminPasswordHash,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin user:', error)
      process.exit(1)
    }

    console.log('✓ Admin user created successfully')
    console.log(`Email: ${adminEmail}`)
    console.log(`ID: ${data.id}`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

seedAdmin()
