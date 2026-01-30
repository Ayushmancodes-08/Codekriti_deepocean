#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script provides a template for optimizing images in the project.
 * It documents the optimization strategy and provides guidance for implementation.
 * 
 * To use this script with actual image optimization:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Uncomment the sharp implementation below
 * 3. Run: node scripts/optimize-images.js
 * 
 * Alternatively, use external tools:
 * - ImageMagick: convert input.jpg -quality 85 -resize 1024x1024 output.jpg
 * - Squoosh CLI: squoosh-cli --webp auto input.jpg
 * - ImageOptim: imageoptim --quality high input.jpg
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  maxSizeKB: 100,
  sizes: [480, 768, 1024, 1440],
  quality: {
    webp: 80,
    jpeg: 85,
    png: 90,
  },
  inputDirs: ['public/images', 'src/assets'],
  outputDir: 'public/images/optimized',
};

/**
 * Logs optimization information
 */
function logInfo(message) {
  console.log(`[Image Optimization] ${message}`);
}

/**
 * Logs optimization errors
 */
function logError(message) {
  console.error(`[Image Optimization Error] ${message}`);
}

/**
 * Gets file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Validates image size
 */
function validateImageSize(filePath) {
  const sizeKB = parseFloat(getFileSizeKB(filePath));
  if (sizeKB > CONFIG.maxSizeKB) {
    logError(
      `Image ${path.basename(filePath)} is ${sizeKB}KB (max: ${CONFIG.maxSizeKB}KB)`
    );
    return false;
  }
  return true;
}

/**
 * Finds all images in input directories
 */
function findImages() {
  const images = [];
  
  CONFIG.inputDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      logInfo(`Directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        images.push(path.join(dir, file));
      }
    });
  });

  return images;
}

/**
 * Main optimization function
 * 
 * This is a template showing the optimization strategy.
 * To implement actual optimization, uncomment the sharp code below.
 */
async function optimizeImages() {
  logInfo('Starting image optimization...');
  logInfo(`Configuration: ${JSON.stringify(CONFIG, null, 2)}`);

  const images = findImages();
  
  if (images.length === 0) {
    logInfo('No images found to optimize');
    return;
  }

  logInfo(`Found ${images.length} image(s) to optimize`);

  // Validate image sizes
  let validImages = 0;
  images.forEach((imagePath) => {
    const sizeKB = getFileSizeKB(imagePath);
    logInfo(`${path.basename(imagePath)}: ${sizeKB}KB`);
    
    if (validateImageSize(imagePath)) {
      validImages++;
    }
  });

  logInfo(`Validation complete: ${validImages}/${images.length} images within size limits`);

  // IMPLEMENTATION GUIDE:
  // To implement actual image optimization, uncomment and use sharp:
  /*
  const sharp = require('sharp');

  for (const imagePath of images) {
    try {
      const filename = path.basename(imagePath, path.extname(imagePath));
      const ext = path.extname(imagePath).toLowerCase();

      // Create output directory if it doesn't exist
      if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      }

      // Generate responsive sizes
      for (const size of CONFIG.sizes) {
        // Generate JPEG
        await sharp(imagePath)
          .resize(size, size, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: CONFIG.quality.jpeg })
          .toFile(path.join(CONFIG.outputDir, `${filename}-${size}w.jpg`));

        // Generate WebP
        await sharp(imagePath)
          .resize(size, size, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: CONFIG.quality.webp })
          .toFile(path.join(CONFIG.outputDir, `${filename}-${size}w.webp`));

        logInfo(`Generated: ${filename}-${size}w.{jpg,webp}`);
      }
    } catch (error) {
      logError(`Failed to optimize ${imagePath}: ${error.message}`);
    }
  }
  */

  logInfo('Image optimization complete!');
  logInfo('');
  logInfo('To implement actual optimization:');
  logInfo('1. Install sharp: npm install --save-dev sharp');
  logInfo('2. Uncomment the sharp implementation in this script');
  logInfo('3. Run: node scripts/optimize-images.js');
  logInfo('');
  logInfo('Or use external tools:');
  logInfo('- ImageMagick: convert input.jpg -quality 85 output.jpg');
  logInfo('- Squoosh CLI: squoosh-cli --webp auto input.jpg');
  logInfo('- ImageOptim: imageoptim --quality high input.jpg');
}

// Run optimization
optimizeImages().catch((error) => {
  logError(`Optimization failed: ${error.message}`);
  process.exit(1);
});
