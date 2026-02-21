// Cloudinary Asset Configuration
// Auto-optimization parameters: f_auto (format), q_auto (quality)
const CLOUD_BASE = "https://res.cloudinary.com/dlanrr3jl";

export const ASSETS = {
    // Images
    LOGO: '/logo_bg.jpeg', // Black Background Logo
    LOGO_WHITE_TEXT_TRANSPARENT: '/logo_bg.jpeg', // Used everywhere now
    DEVXTREME_POSTER: `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_800/v1769794944/devx_y2lkjc.jpg`,
    SEA_BG: `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1200/v1769794945/sea_yyeaix.jpg`,
    ROCK_TEXTURE: `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1200/v1769794945/sea_yyeaix.jpg`,
    MUSIC_THEME: '/audio/theme_music.mp3',

    // Videos (Optimized)
    // q_auto:eco (economy quality), vc_auto (auto video codec), br_1m (1mbps bitrate limit)
    VIDEOS: [
        `${CLOUD_BASE}/video/upload/q_auto:eco,vc_auto,br_1m/v1769794991/scene1_wrfmca.mp4`,
        `${CLOUD_BASE}/video/upload/q_auto:eco,vc_auto,br_1m/v1769794987/scene2_k3ev3u.mp4`,
        `${CLOUD_BASE}/video/upload/q_auto:eco,vc_auto,br_1m/v1769794990/scene3_zx3drx.mp4`,
        `${CLOUD_BASE}/video/upload/q_auto:eco,vc_auto,br_1m/v1769795005/scene4_obyxpp.mp4`,
        `${CLOUD_BASE}/video/upload/q_auto:eco,vc_auto,br_1m/v1769795001/scene5_aujiwv.mp4`,
    ],

    // Generated Video Posters (Fallback)
    // Using Cloudinary video-to-image feature with auto-format and compression
    VIDEO_POSTERS: [
        `${CLOUD_BASE}/video/upload/so_0,f_auto,q_auto,w_800/v1769794991/scene1_wrfmca.jpg`,
        `${CLOUD_BASE}/video/upload/so_0,f_auto,q_auto,w_800/v1769794987/scene2_k3ev3u.jpg`,
        `${CLOUD_BASE}/video/upload/so_0,f_auto,q_auto,w_800/v1769794990/scene3_zx3drx.jpg`,
        `${CLOUD_BASE}/video/upload/so_0,f_auto,q_auto,w_800/v1769795005/scene4_obyxpp.jpg`,
        `${CLOUD_BASE}/video/upload/so_0,f_auto,q_auto,w_800/v1769795001/scene5_aujiwv.jpg`,
    ]
};
