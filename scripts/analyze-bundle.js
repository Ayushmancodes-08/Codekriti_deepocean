#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes the production bundle size and provides insights on code splitting effectiveness.
 * Run with: npm run analyze:bundle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileSizeInBytes(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

function analyzeBundle() {
  console.log(`\n${colors.bright}${colors.cyan}=== Bundle Analysis ===${colors.reset}\n`);

  if (!fs.existsSync(distDir)) {
    console.error(`${colors.red}Error: dist directory not found. Run 'npm run build' first.${colors.reset}\n`);
    process.exit(1);
  }

  const files = fs.readdirSync(distDir).filter(file => {
    return file.endsWith('.js') || file.endsWith('.css');
  });

  if (files.length === 0) {
    console.error(`${colors.red}Error: No built files found in dist directory.${colors.reset}\n`);
    process.exit(1);
  }

  let totalSize = 0;
  const chunks = [];

  files.forEach(file => {
    const filePath = path.join(distDir, file);
    const size = getFileSizeInBytes(filePath);
    totalSize += size;
    chunks.push({ name: file, size });
  });

  // Sort by size descending
  chunks.sort((a, b) => b.size - a.size);

  // Display chunks
  console.log(`${colors.bright}Chunk Breakdown:${colors.reset}\n`);
  chunks.forEach(chunk => {
    const sizeFormatted = formatBytes(chunk.size);
    const percentage = ((chunk.size / totalSize) * 100).toFixed(1);
    
    let color = colors.green;
    if (chunk.size > 200 * 1024) color = colors.red;
    else if (chunk.size > 100 * 1024) color = colors.yellow;

    console.log(`  ${color}${chunk.name.padEnd(40)}${colors.reset} ${sizeFormatted.padStart(12)} (${percentage}%)`);
  });

  console.log(`\n${colors.bright}Total Bundle Size:${colors.reset} ${formatBytes(totalSize)}\n`);

  // Recommendations
  console.log(`${colors.bright}${colors.cyan}Recommendations:${colors.reset}\n`);
  
  const largeChunks = chunks.filter(c => c.size > 200 * 1024);
  if (largeChunks.length > 0) {
    console.log(`  ${colors.yellow}⚠ Large chunks detected (> 200KB):${colors.reset}`);
    largeChunks.forEach(chunk => {
      console.log(`    - ${chunk.name} (${formatBytes(chunk.size)})`);
    });
    console.log(`    Consider further code splitting or lazy loading.\n`);
  }

  const vendorChunks = chunks.filter(c => c.name.includes('vendor'));
  if (vendorChunks.length > 0) {
    const vendorTotal = vendorChunks.reduce((sum, c) => sum + c.size, 0);
    console.log(`  ${colors.cyan}ℹ Vendor chunks total: ${formatBytes(vendorTotal)}${colors.reset}\n`);
  }

  // Performance targets
  console.log(`${colors.bright}${colors.cyan}Performance Targets:${colors.reset}\n`);
  const targets = [
    { name: 'Main bundle', target: 200, actual: chunks.find(c => c.name === 'index.js')?.size || 0 },
    { name: 'Total (gzipped estimate)', target: 400, actual: Math.round(totalSize * 0.3) },
  ];

  targets.forEach(target => {
    const actualFormatted = formatBytes(target.actual);
    const targetFormatted = formatBytes(target.target * 1024);
    const status = target.actual <= target.target * 1024 ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${status}${colors.reset} ${target.name.padEnd(30)} ${actualFormatted.padStart(12)} / ${targetFormatted}`);
  });

  console.log('');
}

analyzeBundle();
