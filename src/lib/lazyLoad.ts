/**
 * Lazy Loading Utilities
 * 
 * Provides utilities for dynamic imports and lazy loading of components
 * with proper error handling and performance monitoring.
 * 
 * Requirements: 12.4, 12.5
 */

import { ComponentType, lazy, LazyExoticComponent, ReactNode } from 'react';

/**
 * Configuration for lazy loading behavior
 */
export interface LazyLoadConfig {
  /**
   * Delay before showing fallback (ms)
   */
  fallbackDelay?: number;
  
  /**
   * Timeout for component load (ms)
   */
  timeout?: number;
  
  /**
   * Enable performance monitoring
   */
  monitorPerformance?: boolean;
}

/**
 * Performance metrics for lazy-loaded components
 */
export interface LazyLoadMetrics {
  componentName: string;
  loadTime: number;
  bundleSize?: number;
  timestamp: number;
}

/**
 * Store for performance metrics
 */
const performanceMetrics: LazyLoadMetrics[] = [];

/**
 * Lazy load a component with error handling and performance monitoring
 * 
 * @param importFn - Dynamic import function
 * @param componentName - Name of the component for monitoring
 * @param config - Configuration options
 * @returns Lazy component
 */
export function lazyLoadComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  componentName: string,
  config: LazyLoadConfig = {}
): LazyExoticComponent<ComponentType<P>> {
  const { monitorPerformance = true } = config;

  return lazy(async () => {
    const startTime = performance.now();

    try {
      const module = await importFn();
      
      if (monitorPerformance) {
        const loadTime = performance.now() - startTime;
        recordMetric({
          componentName,
          loadTime,
          timestamp: Date.now(),
        });
      }

      return module;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      
      // Return a fallback component
      const FallbackComponent: ComponentType<P> = () => {
        return null as any;
      };
      
      return {
        default: FallbackComponent,
      };
    }
  });
}

/**
 * Record performance metric for a lazy-loaded component
 */
export function recordMetric(metric: LazyLoadMetrics): void {
  performanceMetrics.push(metric);
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `[LazyLoad] ${metric.componentName} loaded in ${metric.loadTime.toFixed(2)}ms`
    );
  }
}

/**
 * Get all recorded performance metrics
 */
export function getMetrics(): LazyLoadMetrics[] {
  return [...performanceMetrics];
}

/**
 * Get average load time for a component
 */
export function getAverageLoadTime(componentName: string): number {
  const metrics = performanceMetrics.filter(m => m.componentName === componentName);
  if (metrics.length === 0) return 0;
  
  const total = metrics.reduce((sum, m) => sum + m.loadTime, 0);
  return total / metrics.length;
}

/**
 * Clear all recorded metrics
 */
export function clearMetrics(): void {
  performanceMetrics.length = 0;
}

/**
 * Generate a performance report
 */
export function generatePerformanceReport(): string {
  const report: string[] = ['=== Lazy Load Performance Report ===\n'];
  
  const componentMetrics = new Map<string, LazyLoadMetrics[]>();
  
  performanceMetrics.forEach(metric => {
    if (!componentMetrics.has(metric.componentName)) {
      componentMetrics.set(metric.componentName, []);
    }
    componentMetrics.get(metric.componentName)!.push(metric);
  });

  componentMetrics.forEach((metrics, componentName) => {
    const avgTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
    const maxTime = Math.max(...metrics.map(m => m.loadTime));
    const minTime = Math.min(...metrics.map(m => m.loadTime));
    
    report.push(`${componentName}:`);
    report.push(`  Average: ${avgTime.toFixed(2)}ms`);
    report.push(`  Min: ${minTime.toFixed(2)}ms`);
    report.push(`  Max: ${maxTime.toFixed(2)}ms`);
    report.push(`  Loads: ${metrics.length}\n`);
  });

  return report.join('\n');
}

/**
 * Log performance report to console
 */
export function logPerformanceReport(): void {
  console.log(generatePerformanceReport());
}
