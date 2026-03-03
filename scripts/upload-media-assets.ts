/**
 * Script to upload media assets to Supabase Storage
 * Place your media files in the public/media folder before running
 * 
 * Usage: npx tsx scripts/upload-media-assets.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MEDIA_FILES = {
  images: [
    'gambar-ibu.png',
    'gambar-paru.png',
    'anatomi-paru.png',
    'virus-bakteri.png',
    'tanda-gejala.png',
    'penatalaksanaan.png'
  ],
  videos: [
    'video-suhu.mp4',
    'video-hitung-napas.mp4',
    'video-napas-tambahan.mp4',
    'video-retraksi.mp4',
    'video-saturasi.mp4',
    'video-inhalasi.mp4',
    'video-nebulizer.mp4',
    'video-obat.mp4',
    'video-tepid-sponge.mp4',
    'video-fisioterapi.mp4'
  ]
};

async function uploadFile(folder: string, filename: string): Promise<boolean> {
  const localPath = path.join(process.cwd(), 'public', 'media', folder, filename);
  
  // Check if file exists
  if (!fs.existsSync(localPath)) {
    console.log(`   ⚠️  File not found: ${localPath}`);
    return false;
  }

  try {
    // Read file
    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = `${folder}/${filename}`;

    // Check if file already exists
    const { data: existingFile } = await supabase.storage
      .from('media-assets')
      .list(folder, {
        search: filename
      });

    if (existingFile && existingFile.length > 0) {
      console.log(`   ⏭️  Skipping (already exists): ${filename}`);
      return true;
    }

    // Upload file
    const { error } = await supabase.storage
      .from('media-assets')
      .upload(storagePath, fileBuffer, {
        contentType: folder === 'images' ? 'image/png' : 'video/mp4',
        upsert: false
      });

    if (error) {
      console.log(`   ❌ Error uploading ${filename}: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Uploaded: ${filename}`);
    return true;
  } catch (error) {
    console.log(`   ❌ Error uploading ${filename}:`, error);
    return false;
  }
}

async function uploadAllMedia() {
  console.log('📤 Uploading media assets to Supabase Storage...\n');

  let totalFiles = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let missingFiles = 0;

  // Upload images
  console.log('📸 Uploading images...');
  for (const filename of MEDIA_FILES.images) {
    totalFiles++;
    const result = await uploadFile('images', filename);
    if (result) {
      uploadedFiles++;
    } else {
      const localPath = path.join(process.cwd(), 'public', 'media', 'images', filename);
      if (!fs.existsSync(localPath)) {
        missingFiles++;
      }
    }
  }

  console.log('');

  // Upload videos
  console.log('🎥 Uploading videos...');
  for (const filename of MEDIA_FILES.videos) {
    totalFiles++;
    const result = await uploadFile('videos', filename);
    if (result) {
      uploadedFiles++;
    } else {
      const localPath = path.join(process.cwd(), 'public', 'media', 'videos', filename);
      if (!fs.existsSync(localPath)) {
        missingFiles++;
      }
    }
  }

  console.log('\n📊 Upload Summary:');
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Uploaded: ${uploadedFiles}`);
  console.log(`   Missing: ${missingFiles}`);
  console.log('');

  if (missingFiles > 0) {
    console.log('⚠️  Some files are missing from public/media/');
    console.log('   Please add the missing files and run this script again.');
    console.log('');
    console.log('   Expected structure:');
    console.log('   public/media/images/');
    console.log('   public/media/videos/');
  } else {
    console.log('✅ All media assets uploaded successfully!');
  }
}

uploadAllMedia();
