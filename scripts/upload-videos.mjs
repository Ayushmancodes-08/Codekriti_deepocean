/**
 * Upload videos to Vercel Blob Storage
 * 
 * Steps to use:
 * 1. Install Vercel CLI: npm install -g vercel
 * 2. Login: vercel login
 * 3. Get your blob token: vercel env pull
 * 4. Run this script: node scripts/upload-videos.mjs
 */

import { put, list } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure your Vercel Blob token
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not set');
    console.log('\nHow to get your token:');
    console.log('1. Run: vercel login');
    console.log('2. Run: vercel env pull');
    console.log('3. Check .env.local for BLOB_READ_WRITE_TOKEN');
    console.log('4. Run: BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-videos.mjs');
    process.exit(1);
}

async function uploadVideos() {
    const videosDir = join(__dirname, '..', 'public', 'videos');

    console.log('📹 Starting video upload to Vercel Blob...\n');

    try {
        const files = readdirSync(videosDir).filter(f => f.endsWith('.mp4'));

        console.log(`Found ${files.length} videos to upload:\n`);

        const uploadedUrls = [];

        for (const file of files) {
            const filePath = join(videosDir, file);
            const fileBuffer = readFileSync(filePath);
            const fileName = basename(file);

            console.log(`📤 Uploading ${fileName}...`);

            const blob = await put(fileName, fileBuffer, {
                access: 'public',
                token: BLOB_READ_WRITE_TOKEN,
            });

            console.log(`✅ Uploaded: ${blob.url}\n`);
            uploadedUrls.push({ name: fileName, url: blob.url });
        }

        console.log('\n🎉 All videos uploaded successfully!\n');
        console.log('📋 Copy these URLs to your videoConfig.ts:\n');

        console.log('const VIDEO_SOURCES = [');
        uploadedUrls.forEach(({ url }) => {
            console.log(`  '${url}',`);
        });
        console.log('];\n');

        // List all blobs
        console.log('📦 All blobs in storage:');
        const { blobs } = await list({ token: BLOB_READ_WRITE_TOKEN });
        blobs.forEach(blob => {
            console.log(`  - ${blob.pathname}: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
        });

    } catch (error) {
        console.error('❌ Upload failed:', error.message);
        process.exit(1);
    }
}

uploadVideos();
