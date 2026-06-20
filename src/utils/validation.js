/**
 * @file Validation utility functions for the portfolio website.
 */

/**
 * Simplified RFC 5322 email validation regex.
 * Validates common email formats without being overly strict.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates contact form data.
 * - name: non-empty, max 100 chars
 * - email: non-empty, valid format (RFC 5322 simplified), max 254 chars
 * - message: non-empty, max 1000 chars
 *
 * @param {import('../data/constants').ContactFormData} data - The form data to validate
 * @returns {import('../data/constants').FormValidationErrors} Object with error messages for invalid fields, or empty object if valid
 */
export function validateContactForm(data) {
  /** @type {import('../data/constants').FormValidationErrors} */
  const errors = {};

  // Validate name
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  // Validate email
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (data.email.length > 254) {
    errors.email = 'Email must be 254 characters or less';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate message
  if (!data.message || data.message.trim() === '') {
    errors.message = 'Message is required';
  } else if (data.message.length > 1000) {
    errors.message = 'Message must be 1000 characters or less';
  }

  return errors;
}
