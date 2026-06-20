/**
 * @file useTheme hook for consuming the ThemeContext.
 * 
 * Validates: Requirements 1.1, 1.2
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.js';

/**
 * Custom hook that consumes the ThemeProvider context.
 * Must be used within a ThemeProvider component.
 *
 * @returns {import('../data/constants.js').ThemeContextValue} The theme context value containing theme and toggleTheme
 * @throws {Error} If used outside of a ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
