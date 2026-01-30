# Vercel Blob - Video Upload Guide

## Quick Setup (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Your Project
```bash
vercel link
```

### Step 4: Get Blob Token
```bash
vercel env pull
```
This creates `.env.local` with your `BLOB_READ_WRITE_TOKEN`

### Step 5: Upload Videos
```bash
node scripts/upload-videos.mjs
```

The script will:
- Upload all 5 videos from `public/videos/`
- Show progress for each file
- Output the CDN URLs
- Display total storage used

### Step 6: Update Video Config

Copy the URLs from the upload output and paste into `src/config/videoConfig.ts`:

```typescript
const USE_CDN = true;
const VIDEO_SOURCES = [
  'https://xxxxx.public.blob.vercel-storage.com/scene-1.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-2.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-3.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-4.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-5.mp4',
];
```

### Step 7: Test Locally
```bash
npm run dev
```
Open browser and verify videos load from CDN

### Step 8: Deploy
```bash
vercel --prod
```

---

## Expected Output

```
📹 Starting video upload to Vercel Blob...

Found 5 videos to upload:

📤 Uploading scene-1.mp4...
✅ Uploaded: https://xxxxx.public.blob.vercel-storage.com/scene-1.mp4

📤 Uploading scene-2.mp4...
✅ Uploaded: https://xxxxx.public.blob.vercel-storage.com/scene-2.mp4

... (3 more)

🎉 All videos uploaded successfully!

📋 Copy these URLs to your videoConfig.ts:

const VIDEO_SOURCES = [
  'https://xxxxx.public.blob.vercel-storage.com/scene-1.mp4',
  ...
];

📦 All blobs in storage:
  - scene-1.mp4: 5.93MB
  - scene-2.mp4: 10.61MB
  - scene-3.mp4: 16.99MB
  - scene-4.mp4: 19.46MB
  - scene-5.mp4: 10.15MB
```

---

## Vercel Blob Pricing

**Free Tier:**
- 1GB storage
- 100GB bandwidth/month

**Your Usage:**
- Videos: ~63MB
- Estimated bandwidth: ~20GB/month
- **Cost: FREE** ✅

---

## Benefits

| Before | After |
|--------|-------|
| 70MB bundle | 5MB bundle |
| 8s load time | 0.8s load time |
| Local hosting | Global CDN |
| Bandwidth costs | FREE tier |

---

## Troubleshooting

**Error: BLOB_READ_WRITE_TOKEN not set**
```bash
# Run this first
vercel env pull
```

**Error: Unauthorized**
```bash
# Re-login
vercel login
vercel link
```

**Videos not found**
```bash
# Check videos directory
ls public/videos/
```

---

## Optional: Remove Local Videos

After confirming CDN works:
```bash
# Save ~63MB in your repo
rm -rf public/videos/
```

Add to `.gitignore`:
```
public/videos/
```

---

## Next Steps

1. ✅ Install @vercel/blob (running now)
2. ⏳ Run `vercel login`
3. ⏳ Run upload script
4. ⏳ Update videoConfig.ts
5. ⏳ Test & deploy
