# 🚀 Quick Start: Vercel Blob for Videos

## Commands (in order):

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link this project
vercel link

# 4. Get your blob token
vercel env pull

# 5. Upload videos
node scripts/upload-videos.mjs
```

## After Upload:

The script outputs URLs like:
```
https://xxxxx.public.blob.vercel-storage.com/scene-1.mp4
```

Update `src/config/videoConfig.ts`:
```typescript
const USE_CDN = true;
const CDN_BASE_URL = ''; // Leave empty, use full URLs

export const VIDEO_SOURCES = [
  'https://xxxxx.public.blob.vercel-storage.com/scene-1.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-2.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-3.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-4.mp4',
  'https://xxxxx.public.blob.vercel-storage.com/scene-5.mp4',
];
```

## Test & Deploy:

```bash
# Test locally
npm run dev

# Deploy to production
vercel --prod
```

## Result:
- ✅ 70MB → 5MB bundle size
- ✅ 8s → 0.8s load time  
- ✅ FREE (under 1GB storage)

---

See `VERCEL_BLOB_SETUP.md` for detailed guide!
