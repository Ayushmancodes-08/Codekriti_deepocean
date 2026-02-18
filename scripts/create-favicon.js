import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/logo_bg.jpeg');
const outputPath = path.join(__dirname, '../public/logo_circle.png');

async function createCircularLogo() {
    try {
        console.log(`Processing ${inputPath}...`);
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Determine size for square crop
        const size = Math.min(metadata.width, metadata.height);

        // Create a circle mask (SVG)
        // White circle on transparent background
        const r = size / 2;
        const circleSvg = Buffer.from(
            `<svg width="${size}" height="${size}">
        <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
      </svg>`
        );

        await image
            .resize(size, size, { fit: 'cover' }) // ensure square
            .composite([{
                input: circleSvg,
                blend: 'dest-in'
            }])
            .toFormat('png')
            .toFile(outputPath);

        console.log(`Circular favicon created at: ${outputPath}`);
    } catch (err) {
        console.error('Error creating circular favicon:', err);
        process.exit(1);
    }
}

createCircularLogo();
