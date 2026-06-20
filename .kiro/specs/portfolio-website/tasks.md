# Implementation Plan: Portfolio Website

## Overview

A single-page portfolio website built with React + Vite, using JavaScript with JSDoc documentation, CSS Modules, and CSS custom properties for theming. The implementation follows an incremental approach: project scaffolding → theming → layout/navigation → content sections → animations → form logic → final integration.

## Tasks

- [x] 1. Set up project structure, data shapes, and theming foundation
  - [x] 1.1 Initialize Vite + React project and configure directory structure
    - Create the project with Vite's React template
    - Set up directory structure: `src/components/`, `src/hooks/`, `src/utils/`, `src/styles/`, `src/data/`
    - Install dev dependencies: vitest, @testing-library/react, fast-check, @axe-core/react
    - Configure Vitest in `vite.config.js`
    - _Requirements: 12.1_

  - [x] 1.2 Define data shapes and constants
    - Create `src/data/constants.js` with `THEME_STORAGE_KEY` constant and JSDoc-documented prop shapes for: `ThemeContextValue`, `SectionLink`, `HeroSectionProps`, `AboutSectionProps`, `SkillCategory`, `Skill`, `Project`, `ExperienceEntry`, `Service`, `ContactFormData`, `FormValidationErrors`, `PortfolioData`, `SocialLink`
    - Document all data shapes using JSDoc `@typedef` comments for editor autocompletion
    - _Requirements: 1.1, 3.1, 4.1, 5.1, 6.1, 7.2, 8.2, 9.1_

  - [x] 1.3 Create CSS custom properties and global styles
    - Create `src/styles/variables.css` with light and dark theme custom properties (using `data-theme` attribute on `:root`)
    - Create `src/styles/global.css` with reset, typography (2 sans-serif typefaces, body line-height 1.5, heading line-height 1.2), spacing scale, and responsive breakpoints
    - Define container max-width (1440px) and responsive media queries (768px, 1024px)
    - Add `prefers-reduced-motion` media query to disable transitions globally
    - _Requirements: 1.3, 1.4, 2.4, 11.1, 11.2, 11.4, 12.5_

  - [x] 1.4 Implement `getInitialTheme` utility and `ThemeProvider` context
    - Create `src/utils/theme.js` with `getInitialTheme()` — reads localStorage, falls back to OS preference, defaults to 'light'
    - Create `src/hooks/useTheme.js` with `useTheme` hook consuming context
    - Create `src/components/ThemeProvider.jsx` — provides theme context, sets `data-theme` on `document.documentElement`, persists to localStorage with try/catch
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8_

- [x] 2. Implement utility functions and custom hooks
  - [x] 2.1 Implement `truncateText` and `validateContactForm` utilities
    - Create `src/utils/text.js` with `truncateText(text, maxLength)` — returns original if within limit, else truncates and appends ellipsis character
    - Create `src/utils/validation.js` with `validateContactForm(data)` — validates name (non-empty, ≤100), email (non-empty, valid format, ≤254), message (non-empty, ≤1000)
    - _Requirements: 6.1, 9.1, 9.3, 9.4_

  - [ ]* 2.2 Write property test for text truncation
    - **Property 1: Text truncation preserves content or truncates correctly**
    - **Validates: Requirements 3.2, 6.1**

  - [ ]* 2.3 Write property test for valid contact form data
    - **Property 4: Valid contact form data passes validation**
    - **Validates: Requirements 9.1, 9.3**

  - [ ]* 2.4 Write property test for invalid contact form data
    - **Property 5: Invalid contact form data produces specific errors**
    - **Validates: Requirements 9.4**

  - [x] 2.5 Implement `useInView` hook
    - Create `src/hooks/useInView.js` — uses Intersection Observer with configurable threshold (default 0.2)
    - Sets `inView` to `true` once and disconnects observer (no repeat triggers)
    - Checks `prefers-reduced-motion` — if reduced, immediately sets `inView: true`
    - Includes feature detection for IntersectionObserver (fallback: always visible)
    - _Requirements: 11.3, 11.5, 12.5_

  - [ ]* 2.6 Write property test for animation trigger once
    - **Property 6: Animation triggers exactly once per element**
    - **Validates: Requirements 11.5**

  - [x] 2.7 Implement `useScrollSpy` hook
    - Create `src/hooks/useScrollSpy.js` — uses Intersection Observer to track which section is most visible
    - Returns the ID of the currently active section
    - _Requirements: 10.6_

  - [x] 2.8 Implement `useContactForm` hook
    - Create `src/hooks/useContactForm.js` — manages form data, validation errors, submission status ('idle' | 'submitting' | 'success' | 'error')
    - Calls `validateContactForm` on submit; retains data on failure
    - _Requirements: 9.1, 9.3, 9.4, 9.5_

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Navigation and Layout components
  - [x] 4.1 Create Layout component
    - Create `src/components/Layout/Layout.jsx` and `Layout.module.css`
    - Wraps all sections with proper container constraints (max-width 1440px, centered)
    - Applies consistent spacing between sections (minimum 48px)
    - _Requirements: 2.3, 11.4_

  - [x] 4.2 Implement Navigation component with hamburger menu
    - Create `src/components/Navigation/Navigation.jsx` and `Navigation.module.css`
    - Fixed header with links to all sections (Hero, About, Skills, Projects, Experience, Services, Contact)
    - Highlights active section using `useScrollSpy`
    - Smooth scroll on link click (300-800ms via `scroll-behavior: smooth`)
    - Hamburger menu at mobile breakpoint (≤767px) — full-screen overlay, closes on link click or outside tap
    - Theme toggle button in navigation, keyboard accessible
    - Tap targets minimum 44x44px on mobile
    - _Requirements: 1.1, 2.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 12.4, 12.6_

- [x] 5. Implement Hero and About sections
  - [x] 5.1 Implement Hero Section
    - Create `src/components/HeroSection/HeroSection.jsx` and `HeroSection.module.css`
    - Renders name as H1 (largest heading), tagline below (≤150 chars)
    - Full viewport height (min-height: 100vh)
    - Entry animation: fade-in/slide-up within 1000ms on page load
    - Scroll affordance indicator (downward arrow/chevron) at bottom
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.2 Implement About Section
    - Create `src/components/AboutSection/AboutSection.jsx` and `AboutSection.module.css`
    - Side-by-side layout (image + biography) above mobile breakpoint
    - Stacked layout (image above text) at/below mobile breakpoint
    - Photo minimum 150x150px rendered size
    - `onError` handler on image to swap to placeholder silhouette SVG
    - Scroll-triggered fade-in animation via `useInView`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 11.3_

- [x] 6. Implement Skills and Projects sections
  - [x] 6.1 Implement Skills Section
    - Create `src/components/SkillsSection/SkillsSection.jsx` and `SkillsSection.module.css`
    - Displays skills grouped by category (minimum 2 categories)
    - Each skill shows icon/badge with text fallback on icon load failure
    - Staggered reveal animation: 50-150ms per item, max 2000ms total, triggered when 25% visible
    - Uses `useInView` with threshold 0.25
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 11.3_

  - [x] 6.2 Implement Projects Section
    - Create `src/components/ProjectsSection/ProjectsSection.jsx` and `ProjectsSection.module.css`
    - Project cards with title (≤100 chars), description (≤200 chars, truncated with ellipsis via `truncateText`)
    - Up to 5 technology tags per card as badges
    - Card links to demoUrl if present; no link if neither URL exists
    - Responsive grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
    - Scroll-triggered animation via `useInView`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.3_

- [x] 7. Implement Experience and Services sections
  - [x] 7.1 Implement Experience Section
    - Create `src/components/ExperienceSection/ExperienceSection.jsx` and `ExperienceSection.module.css`
    - Vertical timeline layout, entries sorted newest first
    - Each entry: role, company, start/end dates (or "Present"), description (≤500 chars)
    - Entries visually connected to timeline line
    - Single-column on mobile with timeline line on left
    - Fade-in animation on scroll within 500ms via `useInView`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 11.3_

  - [ ]* 7.2 Write property test for experience chronological ordering
    - **Property 2: Experience entries render in chronological order (newest first)**
    - **Validates: Requirements 7.1**

  - [ ]* 7.3 Write property test for experience entry completeness
    - **Property 3: Experience entry rendering includes all required fields**
    - **Validates: Requirements 7.2**

  - [x] 7.4 Implement Services Section
    - Create `src/components/ServicesSection/ServicesSection.jsx` and `ServicesSection.module.css`
    - Displays at least 3 services with title (≤50 chars), description (≤150 chars), and icon
    - Grid: 1 col (mobile), 3 col (desktop)
    - Fade-in/slide-up animation on scroll within 600ms via `useInView`
    - Graceful degradation on icon load failure (text label fallback)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 11.3_

- [x] 8. Implement Contact Section
  - [x] 8.1 Implement Contact Section with form and social links
    - Create `src/components/ContactSection/ContactSection.jsx` and `ContactSection.module.css`
    - Contact form: name, email, message fields (all required) with character limits
    - Uses `useContactForm` hook for state management
    - Inline validation error messages adjacent to invalid fields
    - Success confirmation message on successful submission
    - Error banner on network/server failure; form data preserved
    - Social media links (≥2) opening in new tabs with `rel="noopener noreferrer"`
    - All form elements keyboard accessible with visible focus indicators
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 12.4, 12.6_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Wire together App component, data layer, and accessibility
  - [x] 10.1 Create portfolio data file and wire App component
    - Create `src/data/portfolio.js` with sample `PortfolioData` object (hero, about, skills, projects, experience, services, contact)
    - Create `src/App.jsx` — wraps content in `ThemeProvider`, renders `Navigation` and all sections in order with proper section IDs
    - Create `src/main.jsx` — React entry point rendering `App`
    - Ensure all sections receive correct props from portfolio data
    - _Requirements: 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.2, 10.1_

  - [x] 10.2 Add accessibility attributes and keyboard navigation
    - Add descriptive `alt` text (≤150 chars) for all informational images; empty `alt` for decorative images
    - Ensure logical tab order follows visual reading sequence
    - Add `aria-label` attributes for social links and navigation elements
    - Add visible focus indicators (outline/ring) for all interactive elements
    - Verify landmark roles (header, main, nav, section)
    - _Requirements: 12.2, 12.3, 12.4, 12.6_

  - [ ]* 10.3 Write unit tests for theme toggling and navigation behavior
    - Test theme context provides correct values and toggles correctly
    - Test `data-theme` attribute updates on toggle
    - Test navigation highlights active section
    - Test hamburger menu opens/closes correctly
    - _Requirements: 1.2, 10.6_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses JavaScript with JSDoc throughout, with CSS Modules for scoped styling
- All animations respect `prefers-reduced-motion` media query
- The contact form submission endpoint should be configured based on deployment target (e.g., Formspree, Netlify Forms, or custom API)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.7", "2.8"] },
    { "id": 4, "tasks": ["2.6", "4.1", "4.2"] },
    { "id": 5, "tasks": ["5.1", "5.2", "6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1", "7.4", "8.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["10.1"] },
    { "id": 9, "tasks": ["10.2", "10.3"] }
  ]
}
```
