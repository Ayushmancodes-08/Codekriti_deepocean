import { cxVideo, cxImage } from '@/lib/cloudinary';

// Cloudinary Configuration
// These are the Public IDs of your videos in Cloudinary
// Ensure these match exactly what you uploaded (minus extension if auto-detected)
const VIDEO_IDS = [
    'scene-1',
    'scene-2',
    'scene-3',
    'scene-4',
    'scene-5',
];

// Generate source objects for VideoBackground to use
export const VIDEO_SOURCES = VIDEO_IDS.map(id => ({
    desktop: cxVideo(id, { mobile: false, quality: 'auto' }),
    mobile: cxVideo(id, { mobile: true, quality: 'eco' }), // 'eco' for better mobile perf
    originalId: id
}));

// Fallback logic is largely deprecated by "Video Everywhere" plan, 
// but we keep posters just in case of error.
export const VIDEO_POSTERS = VIDEO_IDS.map(id =>
    cxImage(id, { width: 640 }) // Small poster for quick loading
);


