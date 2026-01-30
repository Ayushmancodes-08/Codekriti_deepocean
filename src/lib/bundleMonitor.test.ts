/**
 * Tests for Bundle Monitoring Utilities
 * 
 * Validates bundle size tracking and reporting functionality.
 * 
 * Requirements: 12.4, 12.5
 */

import { describe, it, expect } from 'vitest';
import {
  estimateGzipSize,
  formatBytes,
  getChunkType,
  checkChunkSize,
  generateBundleReport,
  getBundleStats,
  BUNDLE_THRESHOLDS,
  type BundleChunk,
} from './bundleMonitor';

describe('Bundle Monitor Utilities', () => {
  describe('estimateGzipSize', () => {
    it('should estimate gzip size as ~30% of original', () => {
      expect(estimateGzipSize(1000)).toBe(300);
      expect(estimateGzipSize(10000)).toBe(3000);
    });

    it('should handle zero size', () => {
      expect(estimateGzipSize(0)).toBe(0);
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(512)).toContain('Bytes');
      expect(formatBytes(1024)).toContain('KB');
      expect(formatBytes(1024 * 1024)).toContain('MB');
    });

    it('should round to 2 decimal places', () => {
      const result = formatBytes(1536); // 1.5 KB
      expect(result).toContain('1.5');
    });
  });

  describe('getChunkType', () => {
    it('should identify vendor chunks', () => {
      expect(getChunkType('vendor-react.js')).toBe('vendor');
      expect(getChunkType('vendor-three.js')).toBe('vendor');
    });

    it('should identify component chunks', () => {
      expect(getChunkType('chunk-3d-components.js')).toBe('component');
      expect(getChunkType('chunk-registration.js')).toBe('component');
    });

    it('should identify main chunk', () => {
      expect(getChunkType('index.js')).toBe('main');
      expect(getChunkType('main.js')).toBe('main');
    });

    it('should identify other chunks', () => {
      expect(getChunkType('styles.css')).toBe('other');
      expect(getChunkType('unknown.js')).toBe('other');
    });
  });

  describe('checkChunkSize', () => {
    it('should pass for chunks within threshold', () => {
      const chunk: BundleChunk = {
        name: 'vendor-react.js',
        size: 100 * 1024, // 100KB
        type: 'vendor',
      };

      const result = checkChunkSize(chunk);
      expect(result.ok).toBe(true);
    });

    it('should fail for chunks exceeding threshold', () => {
      const chunk: BundleChunk = {
        name: 'vendor-three.js',
        size: 200 * 1024, // 200KB
        type: 'vendor',
      };

      const result = checkChunkSize(chunk);
      expect(result.ok).toBe(false);
      expect(result.message).toContain('exceeds');
    });

    it('should use correct threshold for each type', () => {
      const vendorChunk: BundleChunk = {
        name: 'vendor-test.js',
        size: BUNDLE_THRESHOLDS.vendor + 1,
        type: 'vendor',
      };

      const result = checkChunkSize(vendorChunk);
      expect(result.ok).toBe(false);
    });
  });

  describe('generateBundleReport', () => {
    it('should generate report with chunk information', () => {
      const chunks: BundleChunk[] = [
        { name: 'vendor-react.js', size: 100 * 1024, type: 'vendor' },
        { name: 'chunk-registration.js', size: 50 * 1024, type: 'component' },
      ];

      const report = generateBundleReport(chunks);
      expect(report).toContain('vendor-react.js');
      expect(report).toContain('chunk-registration.js');
      expect(report).toContain('Total Bundle Size');
    });

    it('should include gzip estimates', () => {
      const chunks: BundleChunk[] = [
        { name: 'test.js', size: 100 * 1024, type: 'main' },
      ];

      const report = generateBundleReport(chunks);
      expect(report).toContain('Gzip');
    });

    it('should include warnings for oversized chunks', () => {
      const chunks: BundleChunk[] = [
        { name: 'vendor-huge.js', size: 300 * 1024, type: 'vendor' },
      ];

      const report = generateBundleReport(chunks);
      expect(report).toContain('WARNINGS');
    });
  });

  describe('getBundleStats', () => {
    it('should calculate total size', () => {
      const chunks: BundleChunk[] = [
        { name: 'chunk1.js', size: 100 * 1024, type: 'main' },
        { name: 'chunk2.js', size: 50 * 1024, type: 'component' },
      ];

      const stats = getBundleStats(chunks);
      expect(stats.totalSize).toBe(150 * 1024);
    });

    it('should calculate gzip estimate', () => {
      const chunks: BundleChunk[] = [
        { name: 'chunk.js', size: 100 * 1024, type: 'main' },
      ];

      const stats = getBundleStats(chunks);
      expect(stats.totalGzip).toBe(estimateGzipSize(100 * 1024));
    });

    it('should identify largest chunk', () => {
      const chunks: BundleChunk[] = [
        { name: 'small.js', size: 10 * 1024, type: 'component' },
        { name: 'large.js', size: 100 * 1024, type: 'vendor' },
      ];

      const stats = getBundleStats(chunks);
      expect(stats.largestChunk?.name).toBe('large.js');
    });

    it('should count chunks by type', () => {
      const chunks: BundleChunk[] = [
        { name: 'vendor1.js', size: 50 * 1024, type: 'vendor' },
        { name: 'vendor2.js', size: 50 * 1024, type: 'vendor' },
        { name: 'component.js', size: 30 * 1024, type: 'component' },
      ];

      const stats = getBundleStats(chunks);
      expect(stats.byType.vendor).toBe(100 * 1024);
      expect(stats.byType.component).toBe(30 * 1024);
    });

    it('should handle empty chunks array', () => {
      const stats = getBundleStats([]);
      expect(stats.totalSize).toBe(0);
      expect(stats.chunkCount).toBe(0);
      expect(stats.largestChunk).toBeNull();
    });
  });
});
