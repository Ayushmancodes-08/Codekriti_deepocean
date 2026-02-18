#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  maxSizeKB: 100,
  maxWidth: 1920, // Max width for images
  quality: {
    webp: 80,
    jpeg: 80,
    png: 80, // PNG compression
  },
  inputDirs: ['public/assets', 'src/assets'],
};

function logInfo(message) {
  console.log(`[Image Optimization] ${message}`);
}

function logError(message) {
  console.error(`[Image Optimization Error] ${message}`);
}

function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Finds all images in input directories recursively
 */
function findImages() {
  const images = [];

  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) {
      logInfo(`Directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          images.push(filePath);
        }
      }
    });
  };

  CONFIG.inputDirs.forEach((dir) => {
    scanDir(dir);
  });

  return images;
}

async function optimizeImages() {
  logInfo('Starting in-place image optimization...');
  logInfo(`Configuration: ${JSON.stringify(CONFIG, null, 2)}`);

  const images = findImages();

  if (images.length === 0) {
    logInfo('No images found to optimize');
    return;
  }

  logInfo(`Found ${images.length} image(s) to scan`);

  let optimizedCount = 0;
  let savedKB = 0;

  for (const imagePath of images) {
    const sizeKB = parseFloat(getFileSizeKB(imagePath));

    if (sizeKB > CONFIG.maxSizeKB) {
      logInfo(`Optimizing ${path.basename(imagePath)} (${sizeKB}KB)...`);

      try {
        const ext = path.extname(imagePath).toLowerCase();
        let pipeline = sharp(imagePath).resize({
          width: CONFIG.maxWidth,
          withoutEnlargement: true,
          fit: 'inside'
        });

        if (ext === '.png') {
          pipeline = pipeline.png({ quality: CONFIG.quality.png, compressionLevel: 8, adaptiveFiltering: true });
        } else if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg({ quality: CONFIG.quality.jpeg, mozjpeg: true });
        } else if (ext === '.webp') {
          pipeline = pipeline.webp({ quality: CONFIG.quality.webp });
        }

        const buffer = await pipeline.toBuffer();

        fs.writeFileSync(imagePath, buffer);

        const newSizeKB = parseFloat(getFileSizeKB(imagePath));
        const saved = sizeKB - newSizeKB;
        savedKB += saved;

        logInfo(`  -> Optimized to ${newSizeKB}KB (Saved ${saved.toFixed(2)}KB)`);
        optimizedCount++;
      } catch (error) {
        logError(`Failed to optimize ${imagePath}: ${error.message}`);
      }
    }
  }

  logInfo('------------------------------------------------');
  logInfo(`Optimization complete!`);
  logInfo(`Optimized ${optimizedCount} images.`);
  logInfo(`Total size saved: ${savedKB.toFixed(2)}KB (${(savedKB / 1024).toFixed(2)}MB)`);
}

optimizeImages().catch((error) => {
  logError(`Optimization failed: ${error.message}`);
  process.exit(1);
});
