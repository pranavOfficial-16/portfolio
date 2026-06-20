/**
 * @file useScrollSpy hook for tracking the currently visible section.
 * Uses Intersection Observer to track which section is most visible in the viewport.
 * 
 * Validates: Requirements 10.6
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that uses Intersection Observer to track which section is most visible.
 * Returns the ID of the section that is currently most visible in the viewport.
 *
 * @param {string[]} sectionIds - Array of section element IDs to observe
 * @returns {string} The ID of the currently active section (or empty string if none)
 */
export function useScrollSpy(sectionIds) {
  const [activeSection, setActiveSection] = useState(() => sectionIds[0] || '');
  const visibilityRef = useRef(new Map());

  /**
   * Determines which section is most visible based on intersection ratios.
   * If multiple sections have the same ratio, prefers the one that appears first in DOM order.
   */
  const updateActiveSection = useCallback(() => {
    let maxRatio = 0;
    let mostVisibleSection = sectionIds[0] || '';

    // Iterate in DOM order to maintain priority for same-ratio sections
    for (const id of sectionIds) {
      const ratio = visibilityRef.current.get(id) || 0;
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mostVisibleSection = id;
      }
    }

    setActiveSection(mostVisibleSection);
  }, [sectionIds]);

  useEffect(() => {
    // Reset visibility map when section IDs change
    visibilityRef.current = new Map();

    // Feature detection for IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: handled by initial state, no action needed
      return;
    }

    /**
     * Intersection Observer callback.
     * Updates visibility ratios for observed sections.
     * @param {IntersectionObserverEntry[]} entries
     */
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        visibilityRef.current.set(entry.target.id, entry.intersectionRatio);
      });

      updateActiveSection();
    };

    // Create observer with thresholds to track visibility at multiple levels
    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    });

    // Observe all section elements
    const observedElements = [];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observedElements.push(element);
      }
    });

    // Cleanup
    return () => {
      observedElements.forEach((element) => {
        observer.unobserve(element);
      });
      observer.disconnect();
      visibilityRef.current.clear();
    };
  }, [sectionIds, updateActiveSection]);

  return activeSection;
}
