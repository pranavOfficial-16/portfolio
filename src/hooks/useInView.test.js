/**
 * @file Unit tests for useInView hook.
 * Tests scroll-triggered animation behavior, reduced motion handling, and feature detection.
 * 
 * Validates: Requirements 11.3, 11.5, 12.5
 */

/* eslint-disable no-undef */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInView } from './useInView.js';

describe('useInView', () => {
  let originalIntersectionObserver;
  let originalMatchMedia;
  let mockObserve;
  let mockDisconnect;
  let observerCallback;
  let lastObserverOptions;

  beforeEach(() => {
    // Store originals
    originalIntersectionObserver = global.IntersectionObserver;
    originalMatchMedia = window.matchMedia;

    // Mock IntersectionObserver as a class
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    
    class MockIntersectionObserver {
      constructor(callback, options) {
        observerCallback = callback;
        lastObserverOptions = options;
        this.observe = mockObserve;
        this.disconnect = mockDisconnect;
        this.unobserve = vi.fn();
      }
    }
    
    global.IntersectionObserver = MockIntersectionObserver;

    // Default: no reduced motion preference
    window.matchMedia = vi.fn((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    // Restore originals
    global.IntersectionObserver = originalIntersectionObserver;
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return ref function and initial inView as false', () => {
      const { result } = renderHook(() => useInView());
      
      expect(typeof result.current.ref).toBe('function');
      expect(result.current.inView).toBe(false);
    });

    it('should create observer when ref is attached to element', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      expect(mockObserve).toHaveBeenCalledWith(element);
    });

    it('should use default threshold of 0.2', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      expect(lastObserverOptions).toEqual(
        expect.objectContaining({ threshold: 0.2 })
      );
    });

    it('should accept custom threshold option', () => {
      const { result } = renderHook(() => useInView({ threshold: 0.5 }));
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      expect(lastObserverOptions).toEqual(
        expect.objectContaining({ threshold: 0.5 })
      );
    });

    it('should accept custom rootMargin option', () => {
      const { result } = renderHook(() => useInView({ rootMargin: '10px' }));
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      expect(lastObserverOptions).toEqual(
        expect.objectContaining({ rootMargin: '10px' })
      );
    });
  });

  describe('intersection detection (Requirements 11.3)', () => {
    it('should set inView to true when element becomes visible', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      // Simulate intersection
      act(() => {
        observerCallback([{ isIntersecting: true }]);
      });
      
      expect(result.current.inView).toBe(true);
    });

    it('should not change inView when element is not intersecting', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      // Simulate non-intersection
      act(() => {
        observerCallback([{ isIntersecting: false }]);
      });
      
      expect(result.current.inView).toBe(false);
    });
  });

  describe('one-time trigger (Requirements 11.5)', () => {
    it('should trigger only once and disconnect observer', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      // First intersection - should trigger
      act(() => {
        observerCallback([{ isIntersecting: true }]);
      });
      
      expect(result.current.inView).toBe(true);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should remain true even if observer callbacks fire again', () => {
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      // First intersection
      act(() => {
        observerCallback([{ isIntersecting: true }]);
      });
      
      expect(result.current.inView).toBe(true);
      
      // Simulate leaving and re-entering viewport (shouldn't happen after disconnect, but testing guard)
      act(() => {
        observerCallback([{ isIntersecting: false }]);
      });
      
      expect(result.current.inView).toBe(true);
      
      act(() => {
        observerCallback([{ isIntersecting: true }]);
      });
      
      expect(result.current.inView).toBe(true);
    });
  });

  describe('prefers-reduced-motion (Requirements 12.5)', () => {
    it('should immediately set inView to true when reduced motion is preferred', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const { result } = renderHook(() => useInView());
      
      // Should be true immediately without needing observer
      expect(result.current.inView).toBe(true);
    });

    it('should not create observer when reduced motion is preferred', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      // Observer should not be created
      expect(mockObserve).not.toHaveBeenCalled();
    });
  });

  describe('feature detection fallback', () => {
    it('should set inView to true when IntersectionObserver is not supported', () => {
      // Remove IntersectionObserver
      delete global.IntersectionObserver;
      
      const { result } = renderHook(() => useInView());
      
      expect(result.current.inView).toBe(true);
    });

    it('should handle missing matchMedia gracefully', () => {
      // Remove matchMedia
      delete window.matchMedia;
      
      const { result } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      // Should not throw and should work normally
      act(() => {
        result.current.ref(element);
      });
      
      expect(result.current.inView).toBe(false);
      
      act(() => {
        observerCallback([{ isIntersecting: true }]);
      });
      
      expect(result.current.inView).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const { result, unmount } = renderHook(() => useInView());
      const element = document.createElement('div');
      
      act(() => {
        result.current.ref(element);
      });
      
      unmount();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should disconnect previous observer when ref changes', () => {
      const { result } = renderHook(() => useInView());
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      
      act(() => {
        result.current.ref(element1);
      });
      
      const disconnectCalls = mockDisconnect.mock.calls.length;
      
      act(() => {
        result.current.ref(element2);
      });
      
      expect(mockDisconnect.mock.calls.length).toBeGreaterThan(disconnectCalls);
    });

    it('should handle null ref gracefully', () => {
      const { result } = renderHook(() => useInView());
      
      // Should not throw
      act(() => {
        result.current.ref(null);
      });
      
      expect(mockObserve).not.toHaveBeenCalled();
    });
  });
});
