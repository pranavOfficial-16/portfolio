/**
 * @file Text utility functions for the portfolio website.
 */

/**
 * Truncates text at maxLength and appends ellipsis if exceeded.
 * Returns original text if within limit.
 *
 * When truncation is needed, the result will be exactly maxLength characters,
 * with the last character being the ellipsis (…).
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum allowed length (must be at least 1)
 * @returns {string} Original text if within limit, or truncated text with ellipsis
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate and append ellipsis, resulting in exactly maxLength characters
  return text.slice(0, maxLength - 1) + '…';
}
