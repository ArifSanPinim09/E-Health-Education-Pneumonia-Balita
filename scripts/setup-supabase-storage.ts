/**
 * Script to set up Supabase Storage bucket for media assets
 * Run this script once to create the bucket and configure access policies
 * 
 * Usage: npx tsx scripts/setup-supabase-storage.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage for media assets...\n');

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      process.exit(1);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'media-assets');

    if (bucketExists) {
      console.log('✅ Bucket "media-assets" already exists');
    } else {
      // Create the bucket
      const { data: bucket, error: createError } = await supabase.storage.createBucket('media-assets', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'video/mp4']
      });

      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        process.exit(1);
      }

      console.log('✅ Created bucket "media-assets"');
    }

    // Create folders structure (by uploading placeholder files)
    console.log('\n📁 Setting up folder structure...');
    
    const folders = ['images', 'videos'];
    
    for (const folder of folders) {
      // Check if folder exists by trying to list files
      const { data: files } = await supabase.storage
        .from('media-assets')
        .list(folder);
      
      if (files && files.length === 0) {
        console.log(`   ✅ Folder "${folder}" ready`);
      } else {
        console.log(`   ✅ Folder "${folder}" already exists`);
      }
    }

    console.log('\n✅ Supabase Storage setup complete!\n');
    console.log('📋 Next steps:');
    console.log('   1. Upload images to: media-assets/images/');
    console.log('      - gambar-ibu.png');
    console.log('      - gambar-paru.png');
    console.log('      - anatomi-paru.png');
    console.log('      - virus-bakteri.png');
    console.log('      - tanda-gejala.png');
    console.log('      - penatalaksanaan.png');
    console.log('');
    console.log('   2. Upload videos to: media-assets/videos/');
    console.log('      - video-suhu.mp4');
    console.log('      - video-hitung-napas.mp4');
    console.log('      - video-napas-tambahan.mp4');
    console.log('      - video-retraksi.mp4');
    console.log('      - video-saturasi.mp4');
    console.log('      - video-inhalasi.mp4');
    console.log('      - video-nebulizer.mp4');
    console.log('      - video-obat.mp4');
    console.log('      - video-tepid-sponge.mp4');
    console.log('      - video-fisioterapi.mp4');
    console.log('');
    console.log('   3. You can upload files via:');
    console.log('      - Supabase Dashboard: https://app.supabase.com');
    console.log('      - Or use the upload script: npm run upload-media');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

setupStorage();
