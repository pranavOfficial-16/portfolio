/**
 * @file useInView hook for triggering scroll-based animations.
 * Uses Intersection Observer to detect when an element enters the viewport.
 * 
 * Validates: Requirements 11.3, 11.5, 12.5
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Checks if the user prefers reduced motion.
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if IntersectionObserver is supported.
 * @returns {boolean} True if IntersectionObserver is available
 */
function isIntersectionObserverSupported() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Custom hook that triggers when an element enters the viewport.
 * Sets inView to true once and disconnects the observer (no repeat triggers).
 * Respects prefers-reduced-motion by immediately setting inView to true.
 * Falls back to always visible if IntersectionObserver is not supported.
 *
 * @param {Object} [options={}] - Intersection Observer options
 * @param {number} [options.threshold=0.2] - Visibility threshold (0-1), default 0.2 (20%)
 * @param {string} [options.rootMargin='0px'] - Root margin for the observer
 * @param {Element|null} [options.root=null] - Root element for the observer
 * @returns {{ ref: function, inView: boolean }} Object with ref callback and inView state
 */
export function useInView(options = {}) {
  const { threshold = 0.2, rootMargin = '0px', root = null } = options;
  
  // Determine initial state based on reduced motion preference and feature support
  const shouldSkipAnimation = prefersReducedMotion() || !isIntersectionObserverSupported();
  
  const [inView, setInView] = useState(shouldSkipAnimation);
  const observerRef = useRef(null);
  const elementRef = useRef(null);
  const hasTriggeredRef = useRef(shouldSkipAnimation);

  // Cleanup function to disconnect observer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  /**
   * Ref callback to attach to the element to observe.
   * @param {Element|null} node - The DOM element to observe
   */
  const ref = useCallback(
    (node) => {
      // Cleanup previous observer if element changes
      cleanup();
      
      // Store the element reference
      elementRef.current = node;

      // If already triggered, no animation support, or reduced motion, don't observe
      if (hasTriggeredRef.current || !node) {
        return;
      }

      // Double-check feature support (could have changed or been mocked)
      if (!isIntersectionObserverSupported()) {
        setInView(true);
        hasTriggeredRef.current = true;
        return;
      }

      // Check reduced motion preference again (could change dynamically)
      if (prefersReducedMotion()) {
        setInView(true);
        hasTriggeredRef.current = true;
        return;
      }

      // Create the observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setInView(true);
            // Disconnect immediately after triggering once
            cleanup();
          }
        },
        {
          threshold,
          rootMargin,
          root,
        }
      );

      // Start observing the element
      observerRef.current.observe(node);
    },
    [threshold, rootMargin, root, cleanup]
  );

  return { ref, inView };
}
