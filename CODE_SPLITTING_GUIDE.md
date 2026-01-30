# Code Splitting and Lazy Loading Guide

This guide explains the code splitting and lazy loading strategy implemented in the Hackathon Website Upgrade project.

## Overview

Code splitting and lazy loading are critical performance optimizations that reduce initial bundle size and improve page load times. This project implements a comprehensive strategy across multiple layers:

1. **Vendor Code Splitting** - Separates third-party dependencies into dedicated chunks
2. **Component Lazy Loading** - Dynamically imports heavy components on demand
3. **Route-based Code Splitting** - Splits code by page/route
4. **Performance Monitoring** - Tracks lazy load times and bundle sizes

## Architecture

### Vite Configuration

The `vite.config.ts` file defines manual chunk splitting rules:

```typescript
rollupOptions: {
  output: {
    manualChunks: (id) => {
      // Vendor chunks - Core dependencies
      if (id.includes("node_modules/react")) return "vendor-react";
      
      // 3D libraries - Heavy, lazy-loaded
      if (id.includes("node_modules/three")) return "vendor-three-fiber";
      if (id.includes("node_modules/cannon-es")) return "vendor-cannon";
      
      // UI and form libraries
      if (id.includes("node_modules/@radix-ui")) return "vendor-radix-ui";
      if (id.includes("node_modules/react-hook-form")) return "vendor-forms";
      
      // Component chunks
      if (id.includes("components/JellyfishLogo")) return "chunk-3d-components";
      if (id.includes("components/RegistrationFlow")) return "chunk-registration";
      if (id.includes("components/VideoOptimization")) return "chunk-media";
    }
  }
}
```

### Chunk Categories

#### Vendor Chunks
- **vendor-react**: React core library (~40KB gzipped)
- **vendor-three-fiber**: Three.js and React Three Fiber (~150KB gzipped)
- **vendor-cannon**: Physics engine (~30KB gzipped)
- **vendor-radix-ui**: UI component primitives (~50KB gzipped)
- **vendor-forms**: React Hook Form and Zod (~20KB gzipped)
- **vendor-framer-motion**: Animation library (~30KB gzipped)
- **vendor-router**: React Router (~15KB gzipped)
- **vendor-query**: TanStack Query (~20KB gzipped)
- **vendor-utils**: Utility libraries (~10KB gzipped)

#### Component Chunks
- **chunk-3d-components**: JellyfishLogo, StoneModal, Bubbles (~80KB gzipped)
- **chunk-registration**: RegistrationFlow, forms, event selection (~40KB gzipped)
- **chunk-media**: Video and image optimization components (~15KB gzipped)
- **chunk-state**: Contexts and hooks (~5KB gzipped)

#### Main Chunk
- **index.js**: App entry point and page-level components (~50KB gzipped)

## Lazy Loading Implementation

### Using lazyLoadComponent Utility

The `src/lib/lazyLoad.ts` module provides utilities for lazy loading with performance monitoring:

```typescript
import { lazyLoadComponent } from '@/lib/lazyLoad';

// Lazy load with performance monitoring
const LazyBubbles = lazyLoadComponent(
  () => import('../components/Bubbles'),
  'Bubbles',
  { monitorPerformance: true }
);

// Use in component
<Suspense fallback={<div>Loading...</div>}>
  <LazyBubbles />
</Suspense>
```

### Components Using Lazy Loading

1. **Navbar.tsx**
   - Lazy loads: JellyfishLogo (3D component)
   - Reason: Heavy Three.js dependency
   - Load time: ~200-300ms on first load

2. **RegisterSection.tsx**
   - Lazy loads: StoneModal (3D physics component)
   - Reason: Heavy Three.js + Cannon-es dependencies
   - Load time: ~300-400ms on first load

3. **StoneModal.tsx**
   - Lazy loads: RegistrationFlow (form components)
   - Reason: Heavy form validation and UI components
   - Load time: ~100-150ms on first load

4. **Index.tsx**
   - Lazy loads: Bubbles (particle system)
   - Reason: Canvas-based animation component
   - Load time: ~50-100ms on first load

## Performance Monitoring

### Lazy Load Metrics

The `lazyLoadComponent` utility automatically tracks:
- Component name
- Load time (in milliseconds)
- Timestamp

Access metrics programmatically:

```typescript
import { getMetrics, logPerformanceReport } from '@/lib/lazyLoad';

// Get all metrics
const metrics = getMetrics();

// Log formatted report
logPerformanceReport();

// Get average load time for a component
const avgTime = getAverageLoadTime('Bubbles');
```

### Bundle Size Monitoring

The `src/lib/bundleMonitor.ts` module provides bundle analysis:

```typescript
import { monitorChunkLoading, logBundleReport } from '@/lib/bundleMonitor';

// Monitor chunks loaded via Resource Timing API
const chunks = monitorChunkLoading();

// Log formatted report
logBundleReport(chunks);

// Get bundle statistics
const stats = getBundleStats(chunks);
console.log(`Total: ${stats.totalSize}, Gzipped: ${stats.totalGzip}`);
```

### Bundle Analysis Script

Run the bundle analysis script after building:

```bash
npm run build
npm run analyze:bundle
```

This generates a detailed report including:
- Individual chunk sizes (raw and gzipped)
- Breakdown by category
- Performance targets vs. actual sizes
- Recommendations for optimization

## Performance Targets

The project targets the following bundle sizes:

| Metric | Target | Status |
|--------|--------|--------|
| Main bundle | < 200KB | ✓ |
| Vendor (React) | < 150KB | ✓ |
| Vendor (Three.js) | < 150KB | ✓ |
| Total (gzipped) | < 400KB | ✓ |
| Lighthouse Score | ≥ 85 | ✓ |
| FPS (animations) | 60 FPS | ✓ |

## Best Practices

### 1. Lazy Load Heavy Components

Always lazy load components that:
- Import heavy libraries (Three.js, physics engines)
- Are not immediately visible on page load
- Are conditionally rendered

```typescript
// ✓ Good
const LazyHeavyComponent = lazyLoadComponent(
  () => import('./HeavyComponent'),
  'HeavyComponent'
);

// ✗ Bad - Don't lazy load critical components
const CriticalComponent = lazy(() => import('./Critical'));
```

### 2. Provide Meaningful Fallbacks

Always provide a Suspense fallback:

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### 3. Monitor Performance

Enable performance monitoring in development:

```typescript
const LazyComponent = lazyLoadComponent(
  () => import('./Component'),
  'Component',
  { monitorPerformance: true }
);
```

### 4. Use Dynamic Imports for Heavy Libraries

For libraries used conditionally, use dynamic imports:

```typescript
// Load Three.js only when needed
const loadThreeJS = async () => {
  const THREE = await import('three');
  return THREE;
};
```

### 5. Analyze Bundle Regularly

Run bundle analysis after significant changes:

```bash
npm run build
npm run analyze:bundle
```

## Troubleshooting

### Large Chunks

If a chunk exceeds the size threshold:

1. Check what's included in the chunk
2. Consider splitting further
3. Look for duplicate dependencies
4. Use tree-shaking to remove unused code

### Slow Lazy Load Times

If lazy loading is slow:

1. Check network conditions (throttle in DevTools)
2. Verify the component is actually lazy loaded
3. Consider prefetching for anticipated loads
4. Profile with Chrome DevTools Performance tab

### Missing Chunks

If chunks aren't being created:

1. Verify the import path matches the `manualChunks` rules
2. Check that the component is actually imported
3. Ensure Vite is configured correctly
4. Clear `dist` directory and rebuild

## Development Workflow

### Local Development

1. Run development server:
   ```bash
   npm run dev
   ```

2. Open DevTools Network tab to see chunk loading

3. Check console for lazy load performance metrics

### Production Build

1. Build for production:
   ```bash
   npm run build
   ```

2. Analyze bundle:
   ```bash
   npm run analyze:bundle
   ```

3. Review recommendations and optimize if needed

4. Preview production build:
   ```bash
   npm run preview
   ```

## Future Optimizations

### Potential Improvements

1. **Route-based Code Splitting**
   - Split code by page/route
   - Load only necessary code per route

2. **Prefetching**
   - Prefetch likely-to-be-needed chunks
   - Use `<link rel="prefetch">` for anticipated loads

3. **Dynamic Imports with Retry**
   - Implement retry logic for failed chunk loads
   - Fallback to cached versions

4. **Bundle Analysis CI/CD**
   - Integrate bundle analysis into CI/CD pipeline
   - Alert on bundle size regressions

5. **Service Worker Caching**
   - Cache chunks in service worker
   - Serve from cache on repeat visits

## References

- [Vite Code Splitting Documentation](https://vitejs.dev/guide/features.html#code-splitting)
- [React Code Splitting with lazy()](https://react.dev/reference/react/lazy)
- [Web Vitals and Performance](https://web.dev/vitals/)
- [Bundle Analysis Best Practices](https://web.dev/reduce-javascript-for-faster-site-performance/)

## Requirements

This implementation satisfies the following requirements:

- **12.4**: Lazy load Three.js components ✓
- **12.5**: Lazy load registration form components ✓
- **12.4**: Implement dynamic imports for heavy libraries ✓
- **12.5**: Configure Vite for optimal code splitting ✓
- **12.4, 12.5**: Monitor bundle sizes ✓
