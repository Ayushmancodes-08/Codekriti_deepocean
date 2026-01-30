// Video configuration with CDN support
// Set USE_CDN to true to load from CDN instead of bundled videos

const USE_CDN = false; // Toggle this to switch between local and CDN
const CDN_BASE_URL = 'https://your-cdn-url.com/videos'; // Update with your CDN URL

const VIDEO_FILES = [
    'scene-1.mp4',
    'scene-2.mp4',
    'scene-3.mp4',
    'scene-4.mp4',
    'scene-5.mp4',
];

export const VIDEO_SOURCES = VIDEO_FILES.map(filename =>
    USE_CDN ? `${CDN_BASE_URL}/${filename}` : `/videos/${filename}`
);

// Static poster images for low-end device fallback
// These should be placed in /public/videos/ as scene-1-poster.jpg etc.
export const VIDEO_POSTERS = VIDEO_FILES.map(filename => {
    const name = filename.replace('.mp4', '-poster.jpg');
    return USE_CDN ? `${CDN_BASE_URL}/${name}` : `/videos/${name}`;
});

// For production, you might want to use environment variables:
// const USE_CDN = import.meta.env.PROD; // Always use CDN in production
// const CDN_BASE_URL = import.meta.env.VITE_CDN_URL || 'https://your-cdn-url.com/videos';

