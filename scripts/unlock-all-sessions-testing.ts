// /**
//  * Script untuk unlock semua sessions untuk testing
//  * HANYA UNTUK DEVELOPMENT/TESTING!
//  * 
//  * Usage: npx tsx scripts/unlock-all-sessions-testing.ts <user_email>
//  */

// import dotenv from 'dotenv'
// import { resolve } from 'path'
// import { createClient } from '@supabase/supabase-js'

// // Load .env.local from project root
// dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// if (!supabaseUrl || !supabaseServiceKey) {
//   console.error('❌ Missing Supabase credentials')
//   console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
//   console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Found' : '❌ Missing')
//   console.error('')
//   console.error('💡 Pastikan file .env.local ada di root project dengan isi:')
//   console.error('   NEXT_PUBLIC_SUPABASE_URL=https://...')
//   console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...')
//   process.exit(1)
// }

// const supabase = createClient(supabaseUrl, supabaseServiceKey)

// async function unlockAllSessions(userEmail: string) {
//   try {
//     console.log('🔍 Mencari user dengan email:', userEmail)

//     // Get user from Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

//     if (authError) {
//       console.error('❌ Error fetching users:', authError.message)
//       process.exit(1)
//     }

//     const user = authData.users.find(u => u.email === userEmail)

//     if (!user) {
//       console.error('❌ User tidak ditemukan dengan email:', userEmail)
//       console.log('')
//       console.log('💡 Pastikan:')
//       console.log('   1. Email sudah terdaftar (sudah pernah login dengan OTP)')
//       console.log('   2. Email ditulis dengan benar')
//       console.log('')
//       console.log('📋 Untuk melihat semua users, buka Supabase Dashboard:')
//       console.log('   Authentication → Users')
//       process.exit(1)
//     }

//     const userId = user.id
//     console.log('✅ User ditemukan:', userId)

//     // Check if pre-test is completed
//     const { data: preTest } = await supabase
//       .from('test_submissions')
//       .select('id, score')
//       .eq('user_id', userId)
//       .eq('test_type', 'pre')
//       .single()

//     if (!preTest) {
//       console.log('⚠️  Pre-test belum diselesaikan')
//       console.log('💡 Silakan selesaikan pre-test dulu di aplikasi')
//       process.exit(1)
//     }

//     console.log('✅ Pre-test sudah selesai dengan score:', preTest.score)

//     // Get existing session progress
//     const { data: existingSessions } = await supabase
//       .from('session_progress')
//       .select('day, completed, unlocked_at')
//       .eq('user_id', userId)
//       .order('day', { ascending: true })

//     console.log('\n📊 Status sessions saat ini:')
//     existingSessions?.forEach(session => {
//       console.log(`  Day ${session.day}: ${session.completed ? '✅ Completed' : '⏳ Unlocked'} at ${session.unlocked_at}`)
//     })

//     // Unlock all 5 sessions with immediate unlock time
//     const now = new Date()
//     const sessionsToUpsert = []

//     for (let day = 1; day <= 5; day++) {
//       const existing = existingSessions?.find(s => s.day === day)
      
//       sessionsToUpsert.push({
//         user_id: userId,
//         day: day,
//         completed: existing?.completed || false,
//         unlocked_at: now.toISOString(), // Unlock immediately
//         completed_at: existing?.completed_at || null,
//       })
//     }

//     console.log('\n🔓 Unlocking semua sessions...')

//     const { error: upsertError } = await supabase
//       .from('session_progress')
//       .upsert(sessionsToUpsert, {
//         onConflict: 'user_id,day',
//         ignoreDuplicates: false,
//       })

//     if (upsertError) {
//       console.error('❌ Error unlocking sessions:', upsertError)
//       process.exit(1)
//     }

//     console.log('✅ Semua sessions berhasil di-unlock!')
//     console.log('\n📋 Sessions yang tersedia:')
//     for (let day = 1; day <= 5; day++) {
//       console.log(`  ✅ Day ${day} - Unlocked sekarang`)
//     }

//     console.log('\n💡 Sekarang Anda bisa:')
//     console.log('  1. Akses semua sessions (Day 1-5) tanpa menunggu')
//     console.log('  2. Complete sessions dengan klik tombol "Selesai"')
//     console.log('  3. Setelah Day 5 selesai, post-test akan tersedia')
//     console.log('  4. Selesaikan post-test untuk melihat hasil akhir')

//     console.log('\n⚠️  INGAT: Ini hanya untuk testing!')
//     console.log('   Di production, sessions akan unlock otomatis setiap 24 jam')

//   } catch (error) {
//     console.error('❌ Error:', error)
//     process.exit(1)
//   }
// }

// // Get email from command line argument
// const userEmail = process.argv[2]

// if (!userEmail) {
//   console.error('❌ Error: Email user diperlukan')
//   console.log('Usage: npx tsx scripts/unlock-all-sessions-testing.ts <user_email>')
//   console.log('Example: npx tsx scripts/unlock-all-sessions-testing.ts projectakhirsatu@gmail.com')
//   process.exit(1)
// }

// unlockAllSessions(userEmail)
