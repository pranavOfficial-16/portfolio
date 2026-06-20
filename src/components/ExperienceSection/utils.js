/**
 * @file Utility functions for ExperienceSection component.
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} role - Job title
 * @property {string} company - Company name
 * @property {string} startDate - Start date string
 * @property {string} endDate - End date string or 'Present'
 * @property {string} description - Role description, max 500 chars
 */

/**
 * Parses a date string to a comparable value for sorting.
 * Handles various date formats and returns a timestamp.
 * 
 * @param {string} dateStr - Date string to parse
 * @returns {number} Timestamp for comparison (higher = more recent)
 */
function parseDateForSort(dateStr) {
  // Handle "Present" as current date
  if (dateStr.toLowerCase() === 'present') {
    return Date.now();
  }
  
  // Try parsing the date string
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return parsed;
  }
  
  // Handle formats like "Jan 2023", "January 2023", "2023"
  // Try adding a day to make it parseable
  const withDay = Date.parse(`1 ${dateStr}`);
  if (!isNaN(withDay)) {
    return withDay;
  }
  
  // If just a year, parse as January 1st of that year
  const yearOnly = parseInt(dateStr, 10);
  if (!isNaN(yearOnly) && yearOnly > 1900 && yearOnly < 2100) {
    return new Date(yearOnly, 0, 1).getTime();
  }
  
  // Return 0 as fallback (will sort to end)
  return 0;
}

/**
 * Sorts experience entries by startDate in descending order (newest first).
 * 
 * @param {ExperienceEntry[]} entries - Array of experience entries
 * @returns {ExperienceEntry[]} Sorted array (newest first)
 */
export function sortExperienceByDate(entries) {
  return [...entries].sort((a, b) => {
    const dateA = parseDateForSort(a.startDate);
    const dateB = parseDateForSort(b.startDate);
    return dateB - dateA; // Descending order (newest first)
  });
}
