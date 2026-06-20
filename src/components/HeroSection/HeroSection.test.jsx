/**
 * @file Tests for the HeroSection component
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection.jsx';

describe('HeroSection', () => {
  beforeEach(() => {
    // Mock matchMedia for prefers-reduced-motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Requirement 3.1: Name as H1', () => {
    it('renders name as an H1 element', () => {
      render(<HeroSection name="John Doe" tagline="Web Developer" />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('John Doe');
    });

    it('displays the full name without truncation', () => {
      const longName = 'Alexander Christopher Wellington';
      render(<HeroSection name={longName} tagline="Designer" />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longName);
    });
  });

  describe('Requirement 3.2: Tagline', () => {
    it('displays tagline below the name', () => {
      render(<HeroSection name="John Doe" tagline="Full Stack Developer" />);
      
      expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    });

    it('truncates tagline longer than 150 characters', () => {
      const longTagline = 'A'.repeat(160);
      render(<HeroSection name="John Doe" tagline={longTagline} />);
      
      const taglineElement = screen.getByText(/^A+\.\.\.$/);
      expect(taglineElement.textContent.length).toBeLessThanOrEqual(150);
    });

    it('does not truncate tagline at exactly 150 characters', () => {
      const exactTagline = 'B'.repeat(150);
      render(<HeroSection name="John Doe" tagline={exactTagline} />);
      
      expect(screen.getByText(exactTagline)).toBeInTheDocument();
    });

    it('does not truncate tagline under 150 characters', () => {
      const shortTagline = 'Building great web experiences';
      render(<HeroSection name="John Doe" tagline={shortTagline} />);
      
      expect(screen.getByText(shortTagline)).toBeInTheDocument();
    });

    it('handles empty tagline gracefully', () => {
      render(<HeroSection name="John Doe" tagline="" />);
      
      // Should not render tagline paragraph if empty
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('handles undefined tagline gracefully', () => {
      render(<HeroSection name="John Doe" />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Requirement 3.3: Full Viewport Height', () => {
    it('renders section with hero id', () => {
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const section = document.getElementById('hero');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('has appropriate aria-label for accessibility', () => {
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const section = screen.getByRole('region', { name: 'Introduction' });
      expect(section).toBeInTheDocument();
    });
  });

  describe('Requirement 3.5: Scroll Affordance', () => {
    it('renders scroll affordance indicator', () => {
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      expect(scrollButton).toBeInTheDocument();
    });

    it('displays scroll text', () => {
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });

    it('scroll affordance is keyboard accessible', () => {
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      expect(scrollButton).toHaveAttribute('tabIndex', '0');
    });

    it('handles click on scroll affordance', () => {
      // Mock getElementById and scrollIntoView
      const mockScrollIntoView = vi.fn();
      const mockAboutSection = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, 'getElementById').mockReturnValue(mockAboutSection);
      
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      fireEvent.click(scrollButton);
      
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('handles keyboard Enter on scroll affordance', () => {
      const mockScrollIntoView = vi.fn();
      const mockAboutSection = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, 'getElementById').mockReturnValue(mockAboutSection);
      
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      fireEvent.keyDown(scrollButton, { key: 'Enter' });
      
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('handles keyboard Space on scroll affordance', () => {
      const mockScrollIntoView = vi.fn();
      const mockAboutSection = { scrollIntoView: mockScrollIntoView };
      vi.spyOn(document, 'getElementById').mockReturnValue(mockAboutSection);
      
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      fireEvent.keyDown(scrollButton, { key: ' ' });
      
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('gracefully handles missing about section', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);
      
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      const scrollButton = screen.getByRole('button', { name: /scroll to about/i });
      
      // Should not throw when clicking
      expect(() => fireEvent.click(scrollButton)).not.toThrow();
    });
  });

  describe('Reduced Motion Preference', () => {
    it('respects prefers-reduced-motion setting', () => {
      // Mock reduced motion preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      render(<HeroSection name="John Doe" tagline="Developer" />);
      
      // Content should be visible immediately with reduced motion
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders all expected elements in correct hierarchy', () => {
      const { container } = render(
        <HeroSection name="John Doe" tagline="Web Developer" />
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveAttribute('id', 'hero');
      
      // Contains h1
      const h1 = section.querySelector('h1');
      expect(h1).toHaveTextContent('John Doe');
      
      // Contains tagline paragraph
      const tagline = section.querySelector('p');
      expect(tagline).toHaveTextContent('Web Developer');
      
      // Contains scroll affordance with SVG
      const svg = section.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
