/**
 * @file Tests for the AboutSection component
 * 
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 11.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AboutSection } from './AboutSection.jsx';

// Mock useInView hook
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: true
  }))
}));

describe('AboutSection', () => {
  const defaultProps = {
    biography: 'This is a test biography that describes the portfolio owner. It contains enough characters to meet the minimum requirement of 50 characters.',
    photoUrl: 'https://example.com/photo.jpg',
    photoAlt: 'Portrait of the portfolio owner'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<AboutSection {...defaultProps} />);
      
      const section = document.getElementById('about');
      expect(section).toBeInTheDocument();
    });

    it('renders the "About Me" heading', () => {
      render(<AboutSection {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { name: /about me/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders the biography text (Req 4.1)', () => {
      render(<AboutSection {...defaultProps} />);
      
      expect(screen.getByText(defaultProps.biography)).toBeInTheDocument();
    });

    it('renders the photo with correct src and alt (Req 4.2)', () => {
      render(<AboutSection {...defaultProps} />);
      
      const photo = screen.getByRole('img');
      expect(photo).toHaveAttribute('src', defaultProps.photoUrl);
      expect(photo).toHaveAttribute('alt', defaultProps.photoAlt);
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<AboutSection {...defaultProps} />);
      
      const section = document.getElementById('about');
      expect(section).toHaveAttribute('aria-labelledby', 'about-heading');
    });
  });

  describe('Image Fallback (Req 4.5)', () => {
    it('switches to placeholder silhouette when image fails to load', () => {
      render(<AboutSection {...defaultProps} />);
      
      const photo = screen.getByRole('img');
      
      // Simulate image load error
      fireEvent.error(photo);
      
      // Should switch to placeholder SVG data URI
      expect(photo.src).toContain('data:image/svg+xml');
    });

    it('only switches to placeholder once (prevents infinite loop)', () => {
      render(<AboutSection {...defaultProps} />);
      
      const photo = screen.getByRole('img');
      
      // Simulate first error
      fireEvent.error(photo);
      const firstSrc = photo.src;
      
      // Simulate second error
      fireEvent.error(photo);
      const secondSrc = photo.src;
      
      // Should remain on placeholder
      expect(firstSrc).toBe(secondSrc);
      expect(photo.src).toContain('data:image/svg+xml');
    });
  });

  describe('Accessibility', () => {
    it('has proper section landmark', () => {
      render(<AboutSection {...defaultProps} />);
      
      const section = screen.getByRole('region', { name: /about me/i });
      expect(section).toBeInTheDocument();
    });

    it('image has alt text for accessibility (Req 12.3)', () => {
      render(<AboutSection {...defaultProps} />);
      
      const photo = screen.getByRole('img');
      expect(photo).toHaveAccessibleName(defaultProps.photoAlt);
    });

    it('image has loading="lazy" for performance', () => {
      render(<AboutSection {...defaultProps} />);
      
      const photo = screen.getByRole('img');
      expect(photo).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Scroll Animation (Req 11.3)', () => {
    it('applies visible class when inView is true', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: true });
      
      const { container } = render(<AboutSection {...defaultProps} />);
      
      const section = container.querySelector('section');
      expect(section.className).toContain('visible');
    });

    it('does not apply visible class when inView is false', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: false });
      
      const { container } = render(<AboutSection {...defaultProps} />);
      
      const section = container.querySelector('section');
      expect(section.className).not.toContain('visible');
    });
  });

  describe('Biography length boundaries (Req 4.1)', () => {
    it('renders minimum length biography (50 chars)', () => {
      const minBio = 'A'.repeat(50);
      render(<AboutSection {...defaultProps} biography={minBio} />);
      
      expect(screen.getByText(minBio)).toBeInTheDocument();
    });

    it('renders maximum length biography (2000 chars)', () => {
      const maxBio = 'B'.repeat(2000);
      render(<AboutSection {...defaultProps} biography={maxBio} />);
      
      expect(screen.getByText(maxBio)).toBeInTheDocument();
    });
  });
});
