/**
 * Tests for Lazy Loading Utilities
 * 
 * Validates that lazy loading components work correctly with performance monitoring.
 * 
 * Requirements: 12.4, 12.5
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordMetric,
  getMetrics,
  clearMetrics,
  getAverageLoadTime,
  generatePerformanceReport,
} from './lazyLoad';

describe('Lazy Loading Utilities', () => {
  beforeEach(() => {
    clearMetrics();
  });

  describe('recordMetric', () => {
    it('should record a performance metric', () => {
      recordMetric({
        componentName: 'TestComponent',
        loadTime: 100,
        timestamp: Date.now(),
      });

      const metrics = getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].componentName).toBe('TestComponent');
      expect(metrics[0].loadTime).toBe(100);
    });

    it('should record multiple metrics', () => {
      recordMetric({
        componentName: 'Component1',
        loadTime: 100,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'Component2',
        loadTime: 200,
        timestamp: Date.now(),
      });

      const metrics = getMetrics();
      expect(metrics).toHaveLength(2);
    });
  });

  describe('getMetrics', () => {
    it('should return all recorded metrics', () => {
      recordMetric({
        componentName: 'Component1',
        loadTime: 100,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'Component2',
        loadTime: 200,
        timestamp: Date.now(),
      });

      const metrics = getMetrics();
      expect(metrics).toHaveLength(2);
      expect(metrics[0].componentName).toBe('Component1');
      expect(metrics[1].componentName).toBe('Component2');
    });

    it('should return empty array when no metrics recorded', () => {
      const metrics = getMetrics();
      expect(metrics).toHaveLength(0);
    });
  });

  describe('getAverageLoadTime', () => {
    it('should calculate average load time for a component', () => {
      recordMetric({
        componentName: 'TestComponent',
        loadTime: 100,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'TestComponent',
        loadTime: 200,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'TestComponent',
        loadTime: 300,
        timestamp: Date.now(),
      });

      const avgTime = getAverageLoadTime('TestComponent');
      expect(avgTime).toBe(200);
    });

    it('should return 0 for non-existent component', () => {
      const avgTime = getAverageLoadTime('NonExistent');
      expect(avgTime).toBe(0);
    });
  });

  describe('clearMetrics', () => {
    it('should clear all metrics', () => {
      recordMetric({
        componentName: 'Component1',
        loadTime: 100,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'Component2',
        loadTime: 200,
        timestamp: Date.now(),
      });

      clearMetrics();
      const metrics = getMetrics();
      expect(metrics).toHaveLength(0);
    });
  });

  describe('generatePerformanceReport', () => {
    it('should generate a report with metrics', () => {
      recordMetric({
        componentName: 'Component1',
        loadTime: 100,
        timestamp: Date.now(),
      });
      recordMetric({
        componentName: 'Component1',
        loadTime: 200,
        timestamp: Date.now(),
      });

      const report = generatePerformanceReport();
      expect(report).toContain('Component1');
      expect(report).toContain('Average');
      expect(report).toContain('Min');
      expect(report).toContain('Max');
    });

    it('should include load statistics', () => {
      recordMetric({
        componentName: 'TestComponent',
        loadTime: 150,
        timestamp: Date.now(),
      });

      const report = generatePerformanceReport();
      expect(report).toContain('150');
    });
  });
});
