#!/usr/bin/env node

/**
 * Bundle Monitoring Script
 * 
 * Monitors bundle chunk sizes and provides detailed analysis.
 * Helps identify code splitting effectiveness and optimization opportunities.
 * 
 * Run with: npm run analyze:bundle
 * 
 * Requirements: 12.4, 12.5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file size in bytes
 */
function getFileSizeInBytes(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

/**
 * Get gzipped file size
 */
function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    return gzipped.length;
  } catch (err) {
    return 0;
  }
}

/**
 * Categorize chunk by name
 */
function categorizeChunk(filename) {
  if (filename.includes('vendor')) {
    if (filename.includes('react')) return 'vendor-react';
    if (filename.includes('three')) return 'vendor-three';
    if (filename.includes('radix')) return 'vendor-ui';
    if (filename.includes('forms')) return 'vendor-forms';
    if (filename.includes('framer')) return 'vendor-animation';
    return 'vendor-other';
  }
  if (filename.includes('chunk-')) return 'component';
  if (filename === 'index.js' || filename === 'main.js') return 'main';
  return 'other';
}

/**
 * Main analysis function
 */
function analyzeBundle() {
  console.log(`\n${colors.bright}${colors.cyan}=== Bundle Analysis Report ===${colors.reset}\n`);

  if (!fs.existsSync(distDir)) {
    console.error(`${colors.red}Error: dist directory not found. Run 'npm run build' first.${colors.reset}\n`);
    process.exit(1);
  }

  // Check both dist and dist/assets directories
  let searchDir = distDir;
  if (!fs.readdirSync(distDir).some(f => f.endsWith('.js'))) {
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      searchDir = assetsDir;
    }
  }

  const files = fs.readdirSync(searchDir).filter(file => {
    return file.endsWith('.js') || file.endsWith('.css');
  });

  if (files.length === 0) {
    console.error(`${colors.red}Error: No built files found in dist directory.${colors.reset}\n`);
    process.exit(1);
  }

  let totalSize = 0;
  let totalGzipSize = 0;
  const chunks = [];

  files.forEach(file => {
    const filePath = path.join(searchDir, file);
    const size = getFileSizeInBytes(filePath);
    const gzipSize = getGzipSize(filePath);
    totalSize += size;
    totalGzipSize += gzipSize;
    chunks.push({
      name: file,
      size,
      gzipSize,
      category: categorizeChunk(file),
    });
  });

  // Sort by size descending
  chunks.sort((a, b) => b.size - a.size);

  // Display chunks
  console.log(`${colors.bright}Chunk Breakdown:${colors.reset}\n`);
  console.log(`${colors.dim}File Name${colors.reset.padEnd(45)} ${colors.dim}Size${colors.reset.padStart(12)} ${colors.dim}Gzip${colors.reset.padStart(12)} ${colors.dim}%${colors.reset.padStart(6)}`);
  console.log('-'.repeat(80));

  chunks.forEach(chunk => {
    const sizeFormatted = formatBytes(chunk.size);
    const gzipFormatted = formatBytes(chunk.gzipSize);
    const percentage = ((chunk.size / totalSize) * 100).toFixed(1);

    let color = colors.green;
    if (chunk.size > 200 * 1024) color = colors.red;
    else if (chunk.size > 100 * 1024) color = colors.yellow;

    console.log(
      `${color}${chunk.name.padEnd(45)}${colors.reset} ${sizeFormatted.padStart(12)} ${gzipFormatted.padStart(12)} ${percentage.padStart(5)}%`
    );
  });

  console.log('-'.repeat(80));
  console.log(`${colors.bright}Total Bundle Size:${colors.reset} ${formatBytes(totalSize)}`);
  console.log(`${colors.bright}Total Gzip Size:${colors.reset} ${formatBytes(totalGzipSize)}\n`);

  // Breakdown by category
  console.log(`${colors.bright}${colors.cyan}Breakdown by Category:${colors.reset}\n`);
  const byCategory = {};
  chunks.forEach(chunk => {
    if (!byCategory[chunk.category]) {
      byCategory[chunk.category] = { size: 0, gzipSize: 0, count: 0 };
    }
    byCategory[chunk.category].size += chunk.size;
    byCategory[chunk.category].gzipSize += chunk.gzipSize;
    byCategory[chunk.category].count += 1;
  });

  Object.entries(byCategory)
    .sort((a, b) => b[1].size - a[1].size)
    .forEach(([category, stats]) => {
      const percentage = ((stats.size / totalSize) * 100).toFixed(1);
      console.log(
        `  ${category.padEnd(25)} ${formatBytes(stats.size).padStart(12)} (${percentage}%) [${stats.count} file(s)]`
      );
    });

  console.log('');

  // Performance targets
  console.log(`${colors.bright}${colors.cyan}Performance Targets:${colors.reset}\n`);
  const targets = [
    { name: 'Main bundle', target: 200, actual: chunks.find(c => c.category === 'main')?.size || 0 },
    { name: 'Vendor (React)', target: 150, actual: chunks.find(c => c.category === 'vendor-react')?.size || 0 },
    { name: 'Vendor (Three.js)', target: 150, actual: chunks.find(c => c.category === 'vendor-three')?.size || 0 },
    { name: 'Total (gzipped)', target: 400, actual: totalGzipSize },
  ];

  targets.forEach(target => {
    const actualFormatted = formatBytes(target.actual);
    const targetFormatted = formatBytes(target.target * 1024);
    const status = target.actual <= target.target * 1024 ? colors.green + '✓' : colors.red + '✗';
    console.log(
      `  ${status}${colors.reset} ${target.name.padEnd(30)} ${actualFormatted.padStart(12)} / ${targetFormatted}`
    );
  });

  console.log('');

  // Recommendations
  console.log(`${colors.bright}${colors.cyan}Recommendations:${colors.reset}\n`);

  const largeChunks = chunks.filter(c => c.size > 200 * 1024);
  if (largeChunks.length > 0) {
    console.log(`  ${colors.yellow}⚠ Large chunks detected (> 200KB):${colors.reset}`);
    largeChunks.forEach(chunk => {
      console.log(`    - ${chunk.name} (${formatBytes(chunk.size)})`);
    });
    console.log(`    Consider further code splitting or lazy loading.\n`);
  } else {
    console.log(`  ${colors.green}✓ All chunks are within size limits${colors.reset}\n`);
  }

  // Code splitting effectiveness
  const componentChunks = chunks.filter(c => c.category === 'component');
  if (componentChunks.length > 0) {
    console.log(`  ${colors.cyan}ℹ Code splitting is active:${colors.reset}`);
    console.log(`    - ${componentChunks.length} component chunk(s) detected`);
    console.log(`    - Total component size: ${formatBytes(componentChunks.reduce((sum, c) => sum + c.size, 0))}\n`);
  }

  // Vendor analysis
  const vendorChunks = chunks.filter(c => c.category.startsWith('vendor'));
  if (vendorChunks.length > 0) {
    const vendorTotal = vendorChunks.reduce((sum, c) => sum + c.size, 0);
    const vendorPercentage = ((vendorTotal / totalSize) * 100).toFixed(1);
    console.log(`  ${colors.cyan}ℹ Vendor dependencies:${colors.reset}`);
    console.log(`    - Total: ${formatBytes(vendorTotal)} (${vendorPercentage}% of bundle)`);
    console.log(`    - Chunks: ${vendorChunks.length}\n`);
  }

  console.log('');
}

analyzeBundle();
