/**
 * Bundle Size Monitoring Utility
 * 
 * Monitors and reports on bundle chunk sizes at runtime.
 * Helps identify performance regressions and optimization opportunities.
 * 
 * Requirements: 12.4, 12.5
 */

/**
 * Bundle chunk information
 */
export interface BundleChunk {
  name: string;
  size: number;
  gzipSize?: number;
  type: 'vendor' | 'component' | 'main' | 'other';
}

/**
 * Bundle size thresholds (in bytes)
 */
export const BUNDLE_THRESHOLDS = {
  main: 200 * 1024,           // 200KB
  vendor: 150 * 1024,         // 150KB
  component: 100 * 1024,      // 100KB
  total: 400 * 1024,          // 400KB (gzipped estimate)
};

/**
 * Estimate gzip size (rough approximation: ~30% of original)
 */
export function estimateGzipSize(size: number): number {
  return Math.round(size * 0.3);
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Determine chunk type from name
 */
export function getChunkType(name: string): BundleChunk['type'] {
  if (name.includes('vendor')) return 'vendor';
  if (name.includes('chunk-')) return 'component';
  if (name === 'index.js' || name === 'main.js') return 'main';
  return 'other';
}

/**
 * Check if chunk size exceeds threshold
 */
export function checkChunkSize(chunk: BundleChunk): { ok: boolean; message: string } {
  const type = chunk.type;
  const threshold = BUNDLE_THRESHOLDS[type] || BUNDLE_THRESHOLDS.component;

  if (chunk.size > threshold) {
    return {
      ok: false,
      message: `${chunk.name} (${formatBytes(chunk.size)}) exceeds ${type} threshold (${formatBytes(threshold)})`,
    };
  }

  return {
    ok: true,
    message: `${chunk.name} (${formatBytes(chunk.size)}) is within threshold`,
  };
}

/**
 * Generate bundle report
 */
export function generateBundleReport(chunks: BundleChunk[]): string {
  const report: string[] = ['=== Bundle Size Report ===\n'];

  // Sort by size descending
  const sorted = [...chunks].sort((a, b) => b.size - a.size);

  // Total size
  const totalSize = sorted.reduce((sum, c) => sum + c.size, 0);
  const totalGzip = estimateGzipSize(totalSize);

  report.push(`Total Bundle Size: ${formatBytes(totalSize)}`);
  report.push(`Estimated Gzip Size: ${formatBytes(totalGzip)}\n`);

  // Chunks by type
  const byType = new Map<BundleChunk['type'], BundleChunk[]>();
  sorted.forEach(chunk => {
    const type = chunk.type;
    if (!byType.has(type)) {
      byType.set(type, []);
    }
    byType.get(type)!.push(chunk);
  });

  // Report by type
  byType.forEach((typeChunks, type) => {
    const typeTotal = typeChunks.reduce((sum, c) => sum + c.size, 0);
    report.push(`${type.toUpperCase()} (${formatBytes(typeTotal)}):`);

    typeChunks.forEach(chunk => {
      const percentage = ((chunk.size / totalSize) * 100).toFixed(1);
      const status = checkChunkSize(chunk);
      const icon = status.ok ? '✓' : '✗';
      report.push(`  ${icon} ${chunk.name.padEnd(40)} ${formatBytes(chunk.size).padStart(12)} (${percentage}%)`);
    });
    report.push('');
  });

  // Warnings
  const warnings = sorted
    .map(chunk => checkChunkSize(chunk))
    .filter(result => !result.ok);

  if (warnings.length > 0) {
    report.push('WARNINGS:');
    warnings.forEach(warning => {
      report.push(`  ⚠ ${warning.message}`);
    });
  }

  return report.join('\n');
}

/**
 * Log bundle report to console
 */
export function logBundleReport(chunks: BundleChunk[]): void {
  console.log(generateBundleReport(chunks));
}

/**
 * Monitor chunk loading via Resource Timing API
 */
export function monitorChunkLoading(): BundleChunk[] {
  const chunks: BundleChunk[] = [];

  if (typeof window === 'undefined' || !window.performance) {
    return chunks;
  }

  const resources = window.performance.getEntriesByType('resource');

  resources.forEach(resource => {
    if (resource.name.includes('.js') || resource.name.includes('.css')) {
      const name = resource.name.split('/').pop() || resource.name;
      
      chunks.push({
        name,
        size: (resource as PerformanceResourceTiming).transferSize || 0,
        type: getChunkType(name),
      });
    }
  });

  return chunks;
}

/**
 * Get bundle size statistics
 */
export function getBundleStats(chunks: BundleChunk[]): {
  totalSize: number;
  totalGzip: number;
  largestChunk: BundleChunk | null;
  chunkCount: number;
  byType: Record<string, number>;
} {
  const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
  const byType: Record<string, number> = {};

  chunks.forEach(chunk => {
    byType[chunk.type] = (byType[chunk.type] || 0) + chunk.size;
  });

  return {
    totalSize,
    totalGzip: estimateGzipSize(totalSize),
    largestChunk: chunks.length > 0 ? chunks.reduce((max, c) => c.size > max.size ? c : max) : null,
    chunkCount: chunks.length,
    byType,
  };
}
