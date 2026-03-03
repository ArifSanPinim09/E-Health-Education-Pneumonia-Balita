/**
 * Script untuk reset progress user untuk testing ulang
 * HANYA UNTUK DEVELOPMENT/TESTING!
 * 
 * Usage: npx tsx scripts/reset-user-progress.ts <user_email>
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local from project root
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Found' : '❌ Missing')
  console.error('')
  console.error('💡 Pastikan file .env.local ada di root project dengan isi:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://...')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetUserProgress(userEmail: string) {
  try {
    console.log('🔍 Mencari user dengan email:', userEmail)

    // Get user from Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('❌ Error fetching users:', authError.message)
      process.exit(1)
    }

    const user = authData.users.find(u => u.email === userEmail)

    if (!user) {
      console.error('❌ User tidak ditemukan dengan email:', userEmail)
      console.log('')
      console.log('💡 Pastikan:')
      console.log('   1. Email sudah terdaftar (sudah pernah login dengan OTP)')
      console.log('   2. Email ditulis dengan benar')
      console.log('')
      console.log('📋 Untuk melihat semua users, buka Supabase Dashboard:')
      console.log('   Authentication → Users')
      process.exit(1)
    }

    const userId = user.id
    console.log('✅ User ditemukan:', userId)

    // Show current progress
    const { data: sessions } = await supabase
      .from('session_progress')
      .select('day, completed')
      .eq('user_id', userId)
      .order('day', { ascending: true })

    const { data: preTest } = await supabase
      .from('test_submissions')
      .select('test_type, score')
      .eq('user_id', userId)
      .eq('test_type', 'pre')
      .single()

    const { data: postTest } = await supabase
      .from('test_submissions')
      .select('test_type, score')
      .eq('user_id', userId)
      .eq('test_type', 'post')
      .single()

    console.log('\n📊 Progress saat ini:')
    console.log(`  Pre-test: ${preTest ? `✅ Score ${preTest.score}` : '❌ Belum'}`)
    console.log(`  Sessions: ${sessions?.length || 0} sessions`)
    sessions?.forEach(s => {
      console.log(`    Day ${s.day}: ${s.completed ? '✅ Completed' : '⏳ In Progress'}`)
    })
    console.log(`  Post-test: ${postTest ? `✅ Score ${postTest.score}` : '❌ Belum'}`)

    // Confirm deletion
    console.log('\n⚠️  PERINGATAN: Ini akan menghapus SEMUA progress user!')
    console.log('   - Test submissions (pre & post)')
    console.log('   - Session progress (Day 1-5)')
    console.log('')
    console.log('💡 Untuk melanjutkan, jalankan script dengan flag --confirm:')
    console.log(`   npx tsx scripts/reset-user-progress.ts ${userEmail} --confirm`)

    // Check for confirmation flag
    if (!process.argv.includes('--confirm')) {
      console.log('\n❌ Reset dibatalkan (tidak ada flag --confirm)')
      process.exit(0)
    }

    console.log('\n🗑️  Menghapus progress...')

    // Delete test submissions
    const { error: testError } = await supabase
      .from('test_submissions')
      .delete()
      .eq('user_id', userId)

    if (testError) {
      console.error('❌ Error deleting test submissions:', testError)
    } else {
      console.log('  ✅ Test submissions dihapus')
    }

    // Delete session progress
    const { error: sessionError } = await supabase
      .from('session_progress')
      .delete()
      .eq('user_id', userId)

    if (sessionError) {
      console.error('❌ Error deleting session progress:', sessionError)
    } else {
      console.log('  ✅ Session progress dihapus')
    }

    console.log('\n✅ Progress berhasil di-reset!')
    console.log('\n💡 Sekarang Anda bisa:')
    console.log('  1. Login ke aplikasi')
    console.log('  2. Mulai dari pre-test lagi')
    console.log('  3. Test full flow dari awal')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Get email from command line argument
const userEmail = process.argv[2]

if (!userEmail) {
  console.error('❌ Error: Email user diperlukan')
  console.log('Usage: npx tsx scripts/reset-user-progress.ts <user_email>')
  console.log('Example: npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com')
  console.log('')
  console.log('Untuk benar-benar reset, tambahkan flag --confirm:')
  console.log('Example: npx tsx scripts/reset-user-progress.ts projectakhirsatu@gmail.com --confirm')
  process.exit(1)
}

resetUserProgress(userEmail)
