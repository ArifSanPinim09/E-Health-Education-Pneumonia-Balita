/**
 * Script untuk toggle AUTO_UNLOCK_ALL_SESSIONS feature flag
 * 
 * Usage:
 *   npx tsx scripts/toggle-auto-unlock.ts enable   # Aktifkan auto unlock semua sessions
 *   npx tsx scripts/toggle-auto-unlock.ts disable  # Nonaktifkan (kembali ke flow normal)
 *   npx tsx scripts/toggle-auto-unlock.ts status   # Cek status saat ini
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const ENV_FILE_PATH = resolve(process.cwd(), '.env.local')

function readEnvFile(): string {
  try {
    return readFileSync(ENV_FILE_PATH, 'utf-8')
  } catch (error) {
    console.error('❌ Error: File .env.local tidak ditemukan')
    console.log('💡 Pastikan file .env.local ada di root project')
    process.exit(1)
  }
}

function writeEnvFile(content: string): void {
  try {
    writeFileSync(ENV_FILE_PATH, content, 'utf-8')
  } catch (error) {
    console.error('❌ Error: Gagal menulis file .env.local')
    process.exit(1)
  }
}

function getCurrentStatus(envContent: string): boolean | null {
  const match = envContent.match(/AUTO_UNLOCK_ALL_SESSIONS=(true|false)/i)
  if (!match) return null
  return match[1].toLowerCase() === 'true'
}

function updateAutoUnlock(enable: boolean): void {
  let envContent = readEnvFile()
  const currentStatus = getCurrentStatus(envContent)

  // Jika variable belum ada, tambahkan
  if (currentStatus === null) {
    console.log('⚠️  Variable AUTO_UNLOCK_ALL_SESSIONS belum ada, menambahkan...')
    envContent += `\n\n# Feature Flags\n# Set to 'true' untuk unlock semua sessions otomatis saat user selesai pre-test\n# Set to 'false' untuk flow normal (unlock per hari)\nAUTO_UNLOCK_ALL_SESSIONS=${enable}\n`
  } else {
    // Update existing variable
    envContent = envContent.replace(
      /AUTO_UNLOCK_ALL_SESSIONS=(true|false)/i,
      `AUTO_UNLOCK_ALL_SESSIONS=${enable}`
    )
  }

  writeEnvFile(envContent)

  console.log('\n✅ Berhasil update AUTO_UNLOCK_ALL_SESSIONS')
  console.log(`   Status: ${enable ? '🔓 ENABLED' : '🔒 DISABLED'}`)
  
  if (enable) {
    console.log('\n📋 Mode: AUTO UNLOCK ALL SESSIONS')
    console.log('   • Semua user baru yang selesai pre-test akan langsung unlock Day 1-5')
    console.log('   • Cocok untuk FGD/demo/testing')
    console.log('   • User tidak perlu menunggu 24 jam antar sessions')
  } else {
    console.log('\n📋 Mode: NORMAL FLOW')
    console.log('   • User yang selesai pre-test hanya unlock Day 1')
    console.log('   • Sessions berikutnya unlock otomatis setiap 24 jam')
    console.log('   • Ini adalah flow production yang normal')
  }

  console.log('\n⚠️  PENTING:')
  console.log('   • Restart development server agar perubahan berlaku')
  console.log('   • Jika deploy di Vercel, redeploy atau restart instance')
  console.log('   • Perubahan ini hanya berlaku untuk user BARU yang daftar')
  console.log('   • User yang sudah terdaftar tidak terpengaruh')
}

function showStatus(): void {
  const envContent = readEnvFile()
  const currentStatus = getCurrentStatus(envContent)

  console.log('\n📊 Status AUTO_UNLOCK_ALL_SESSIONS:')
  
  if (currentStatus === null) {
    console.log('   ⚠️  Variable belum diset (default: disabled)')
    console.log('\n💡 Gunakan command berikut untuk mengatur:')
    console.log('   npx tsx scripts/toggle-auto-unlock.ts enable')
    console.log('   npx tsx scripts/toggle-auto-unlock.ts disable')
  } else if (currentStatus) {
    console.log('   🔓 ENABLED - Auto unlock semua sessions')
    console.log('\n📋 Behavior saat ini:')
    console.log('   • User baru yang selesai pre-test langsung unlock Day 1-5')
    console.log('   • Cocok untuk FGD/demo/testing')
    console.log('\n💡 Untuk kembali ke flow normal:')
    console.log('   npx tsx scripts/toggle-auto-unlock.ts disable')
  } else {
    console.log('   🔒 DISABLED - Flow normal (unlock per hari)')
    console.log('\n📋 Behavior saat ini:')
    console.log('   • User baru yang selesai pre-test hanya unlock Day 1')
    console.log('   • Sessions berikutnya unlock otomatis setiap 24 jam')
    console.log('\n💡 Untuk enable auto unlock (FGD/testing):')
    console.log('   npx tsx scripts/toggle-auto-unlock.ts enable')
  }
}

// Main execution
const command = process.argv[2]?.toLowerCase()

if (!command) {
  console.error('❌ Error: Command diperlukan')
  console.log('\nUsage:')
  console.log('  npx tsx scripts/toggle-auto-unlock.ts enable   # Aktifkan auto unlock')
  console.log('  npx tsx scripts/toggle-auto-unlock.ts disable  # Nonaktifkan (flow normal)')
  console.log('  npx tsx scripts/toggle-auto-unlock.ts status   # Cek status saat ini')
  process.exit(1)
}

switch (command) {
  case 'enable':
    updateAutoUnlock(true)
    break
  case 'disable':
    updateAutoUnlock(false)
    break
  case 'status':
    showStatus()
    break
  default:
    console.error(`❌ Error: Command '${command}' tidak dikenal`)
    console.log('\nCommand yang tersedia: enable, disable, status')
    process.exit(1)
}
