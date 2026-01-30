
// Cloudinary utility for generating optimized URLs

const CLOUD_NAME = 'codekriti';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;

interface VideoOptions {
    mobile?: boolean;
    quality?: 'auto' | 'good' | 'eco';
}

interface ImageOptions {
    width?: number;
    height?: number;
}

/**
 * Generates an optimized Cloudinary video URL
 * @param publicId The public ID of the video in Cloudinary
 * @param options configuration for mobile/quality
 */
export const cxVideo = (publicId: string, options: VideoOptions = {}) => {
    const { mobile = false, quality = 'auto' } = options;

    const transformations = [
        'f_auto:video', // Auto format (webm for chrome, mp4 for safari)
        `q_${quality}`, // Auto quality (adjusts bitrate)
    ];

    if (mobile) {
        transformations.push('w_720'); // Resize to 720p width for mobile
        transformations.push('vc_auto'); // Optimize video codec
    } else {
        transformations.push('w_1920'); // 1080p equivalent width (1920px)
    }

    // Connect parts
    return `${BASE_URL}/video/upload/${transformations.join(',')}/${publicId}`;
};

/**
 * Generates an optimized Cloudinary image URL
 * @param publicId The public ID of the image
 * @param options width/height
 */
export const cxImage = (publicId: string, options: ImageOptions = {}) => {
    const { width } = options;

    const transformations = [
        'f_auto', // WebP/AVIF
        'q_auto', // Auto compression
    ];

    if (width) transformations.push(`w_${width}`);

    return `${BASE_URL}/image/upload/${transformations.join(',')}/${publicId}`;
};
