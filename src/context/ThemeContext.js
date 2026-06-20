/**
 * @file ThemeContext - React context for theme state.
 * Separated from ThemeProvider for React Fast Refresh compatibility.
 */

import { createContext } from 'react';

/**
 * Context for theme state and toggle function.
 * @type {import('react').Context<import('../data/constants.js').ThemeContextValue | undefined>}
 */
export const ThemeContext = createContext(undefined);
