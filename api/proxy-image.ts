import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "url" query parameter' });
    }

    try {
        // Fetch the image from the external URL (e.g., Supabase Storage)
        const imageRes = await fetch(url);

        if (!imageRes.ok) {
            console.error(`Failed to fetch image from ${url}: ${imageRes.status} ${imageRes.statusText}`);
            return res.status(imageRes.status).json({ error: 'Failed to fetch image from source' });
        }

        // Get the content type and buffer
        const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Set appropriate headers for caching and content type
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 1 day

        // Send the image data
        return res.send(buffer);
    } catch (error: any) {
        console.error('Error proxying image:', error);
        return res.status(500).json({ error: 'Internal Server Error while proxying image' });
    }
}
