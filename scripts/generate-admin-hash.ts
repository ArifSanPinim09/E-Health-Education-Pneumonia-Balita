/**
 * Script to generate bcrypt password hash for admin user
 * Usage: npx tsx scripts/generate-admin-hash.ts <password>
 */

import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Error: Please provide a password')
  console.log('Usage: npx tsx scripts/generate-admin-hash.ts <password>')
  process.exit(1)
}

async function generateHash() {
  const hash = await bcrypt.hash(password, 10)
  console.log('\nGenerated bcrypt hash:')
  console.log(hash)
  console.log('\nAdd this to your .env.local file:')
  console.log(`ADMIN_PASSWORD_HASH=${hash}`)
}

generateHash()
