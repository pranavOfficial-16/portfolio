/**
 * @file Theme utility functions for the portfolio website.
 * Handles theme detection and initialization logic.
 * 
 * Validates: Requirements 1.5, 1.6, 1.7, 1.8
 */

import { THEME_STORAGE_KEY } from '../data/constants.js';

/**
 * Determines the initial theme for the application.
 * Priority order:
 * 1. Reads from localStorage first (Req 1.5)
 * 2. Falls back to OS color scheme preference via matchMedia (Req 1.6)
 * 3. Defaults to 'light' if neither available (Req 1.7)
 *
 * @returns {'dark' | 'light'} The initial theme to use
 */
export function getInitialTheme() {
  // Try to read from localStorage first (Req 1.5)
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
  } catch {
    // localStorage unavailable (Req 1.8) - continue to OS preference
  }

  // Fall back to OS color scheme preference (Req 1.6)
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        return 'dark';
      }
    }
  } catch {
    // matchMedia unavailable - continue to default
  }

  // Default to 'light' if nothing else available (Req 1.7)
  return 'light';
}
