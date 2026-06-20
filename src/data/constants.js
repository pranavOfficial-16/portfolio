/**
 * @file Data shapes and constants for the portfolio website.
 * All prop shapes are documented using JSDoc @typedef comments for editor autocompletion.
 */

// =============================================================================
// Constants
// =============================================================================

/**
 * localStorage key for persisting theme preference
 * @type {string}
 */
export const THEME_STORAGE_KEY = 'portfolio-theme';

// =============================================================================
// Theme Types
// =============================================================================

/**
 * The available theme options
 * @typedef {'dark' | 'light'} Theme
 */

/**
 * Theme context value provided by ThemeProvider
 * @typedef {Object} ThemeContextValue
 * @property {'dark' | 'light'} theme - The current active theme
 * @property {() => void} toggleTheme - Function to switch between dark and light
 */

// =============================================================================
// Navigation Types
// =============================================================================

/**
 * Represents a navigation link to a section
 * @typedef {Object} SectionLink
 * @property {string} id - The section element ID
 * @property {string} label - Display label for the nav link
 */

// =============================================================================
// Hero Section Types
// =============================================================================

/**
 * Props for the HeroSection component
 * @typedef {Object} HeroSectionProps
 * @property {string} name - Portfolio owner's name (displayed as H1)
 * @property {string} tagline - Short description, max 150 characters
 */

// =============================================================================
// About Section Types
// =============================================================================

/**
 * Props for the AboutSection component
 * @typedef {Object} AboutSectionProps
 * @property {string} biography - Personal biography, 50-2000 characters
 * @property {string} photoUrl - URL of the professional photo
 * @property {string} photoAlt - Alt text for the photo (max 150 characters)
 */

// =============================================================================
// Skills Section Types
// =============================================================================

/**
 * Represents a single skill
 * @typedef {Object} Skill
 * @property {string} name - Skill name
 * @property {string} [icon] - URL or icon identifier (optional)
 */

/**
 * Represents a category of skills
 * @typedef {Object} SkillCategory
 * @property {string} name - Category name
 * @property {Skill[]} skills - Array of skills in this category
 */

// =============================================================================
// Projects Section Types
// =============================================================================

/**
 * Represents a project entry
 * @typedef {Object} Project
 * @property {string} title - Project title, max 100 characters
 * @property {string} description - Project description, max 200 characters (truncated with ellipsis if exceeded)
 * @property {string[]} tags - Technology tags, max 5 items
 * @property {string} [demoUrl] - Live demo link (optional)
 * @property {string} [repoUrl] - Repository link (optional)
 */

// =============================================================================
// Experience Section Types
// =============================================================================

/**
 * Represents a professional experience entry
 * @typedef {Object} ExperienceEntry
 * @property {string} role - Job title
 * @property {string} company - Company name
 * @property {string} startDate - Start date string
 * @property {string} endDate - End date string or 'Present' for current roles
 * @property {string} description - Role description, max 500 characters
 */

// =============================================================================
// Services Section Types
// =============================================================================

/**
 * Represents a professional service offered
 * @typedef {Object} Service
 * @property {string} title - Service title, max 50 characters
 * @property {string} description - Service description, max 150 characters
 * @property {string} icon - Icon identifier or URL
 */

// =============================================================================
// Contact Section Types
// =============================================================================

/**
 * Contact form data structure
 * @typedef {Object} ContactFormData
 * @property {string} name - Required, max 100 characters
 * @property {string} email - Required, max 254 characters, valid email format
 * @property {string} message - Required, max 1000 characters
 */

/**
 * Validation errors for contact form fields
 * @typedef {Object} FormValidationErrors
 * @property {string} [name] - Error message for name field
 * @property {string} [email] - Error message for email field
 * @property {string} [message] - Error message for message field
 */

/**
 * Represents a social media profile link
 * @typedef {Object} SocialLink
 * @property {string} platform - Social media platform name
 * @property {string} url - Profile URL
 * @property {string} ariaLabel - Accessible label for the link
 */

// =============================================================================
// Portfolio Data Types
// =============================================================================

/**
 * Complete portfolio data structure
 * @typedef {Object} PortfolioData
 * @property {{ name: string, tagline: string }} hero - Hero section data
 * @property {{ biography: string, photoUrl: string, photoAlt: string }} about - About section data
 * @property {SkillCategory[]} skills - Skills grouped by category
 * @property {Project[]} projects - Array of project entries
 * @property {ExperienceEntry[]} experience - Professional experience entries
 * @property {Service[]} services - Professional services offered
 * @property {{ socialLinks: SocialLink[] }} contact - Contact section data with social links
 */
