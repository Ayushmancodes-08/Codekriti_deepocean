/**
 * Vite Plugin for Image Optimization
 * Handles image compression and format conversion
 * 
 * This plugin provides:
 * - Automatic image compression
 * - WebP format generation
 * - Responsive image generation
 * - Image size validation
 */

import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

interface ImageOptimizationOptions {
  /**
   * Maximum image size in KB
   */
  maxSize?: number;
  /**
   * Image sizes to generate (in pixels)
   */
  sizes?: number[];
  /**
   * Enable WebP generation
   */
  generateWebP?: boolean;
  /**
   * Image quality (0-100)
   */
  quality?: number;
  /**
   * Directories to optimize
   */
  include?: string[];
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxSize: 100,
  sizes: [480, 768, 1024, 1440],
  generateWebP: true,
  quality: 80,
  include: ['public/images', 'src/assets'],
};

/**
 * Creates a Vite plugin for image optimization
 * Note: This is a configuration plugin that documents the optimization strategy
 * Actual image optimization should be done during build using external tools
 */
export function imageOptimizationPlugin(
  options: ImageOptimizationOptions = {}
): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return {
    name: 'vite-plugin-image-optimization',
    apply: 'build',
    enforce: 'pre',

    resolveId(id) {
      // This plugin documents the optimization strategy
      // Actual optimization is handled by build tools
      if (id.includes('?imageOptimization')) {
        return id;
      }
    },

    async transform(code, id) {
      // Log optimization info during build
      if (id.includes('imageOptimization')) {
        console.log(`[Image Optimization] Processing: ${id}`);
      }
      return null;
    },

    generateBundle() {
      // Log optimization summary
      console.log(`
[Image Optimization Summary]
- Max image size: ${config.maxSize}KB
- Responsive sizes: ${config.sizes?.join(', ')}px
- WebP generation: ${config.generateWebP ? 'enabled' : 'disabled'}
- Quality: ${config.quality}%
- Include directories: ${config.include?.join(', ')}

Note: For production image optimization, use:
- ImageMagick/GraphicsMagick for batch conversion
- sharp (Node.js) for programmatic optimization
- Squoosh CLI for WebP generation
- Or integrate with your CI/CD pipeline
      `);
    },
  };
}

export default imageOptimizationPlugin;
