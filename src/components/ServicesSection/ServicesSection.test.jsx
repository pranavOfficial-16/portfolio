/**
 * @file Tests for ServicesSection component
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 11.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServicesSection } from './ServicesSection.jsx';

// Mock useInView hook
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: true }))
}));

describe('ServicesSection', () => {
  const mockServices = [
    {
      title: 'Web Development',
      description: 'Building modern, responsive websites and web applications using the latest technologies.',
      icon: '/icons/web.svg'
    },
    {
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces that enhance user experience.',
      icon: '/icons/design.svg'
    },
    {
      title: 'Consulting',
      description: 'Providing expert advice on technology choices and architecture decisions.',
      icon: '/icons/consulting.svg'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirement 8.1: Display at least 3 services', () => {
    it('renders all provided services', () => {
      render(<ServicesSection services={mockServices} />);
      
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      expect(screen.getByText('Consulting')).toBeInTheDocument();
    });

    it('renders 3 service cards', () => {
      render(<ServicesSection services={mockServices} />);
      
      // h3 elements are service titles
      const serviceTitles = screen.getAllByRole('heading', { level: 3 });
      expect(serviceTitles.length).toBe(3);
    });
  });

  describe('Requirement 8.2: Service with title, description, and icon', () => {
    it('displays service title (max 50 chars)', () => {
      render(<ServicesSection services={mockServices} />);
      
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });

    it('truncates title longer than 50 characters', () => {
      const longTitleService = [{
        title: 'This is a very long service title that exceeds fifty characters limit',
        description: 'Short description.',
        icon: '/icons/test.svg'
      }];
      
      render(<ServicesSection services={longTitleService} />);
      
      // Should be truncated with ellipsis
      const truncatedTitle = screen.getByRole('heading', { level: 3 });
      expect(truncatedTitle.textContent.length).toBeLessThanOrEqual(50);
      expect(truncatedTitle.textContent).toContain('...');
    });

    it('displays service description (max 150 chars)', () => {
      render(<ServicesSection services={mockServices} />);
      
      expect(screen.getByText(/Building modern, responsive websites/)).toBeInTheDocument();
    });

    it('truncates description longer than 150 characters', () => {
      const longDescService = [{
        title: 'Test Service',
        description: 'This is a very long description that definitely exceeds the one hundred and fifty characters limit that we have set for the service descriptions in this component.',
        icon: '/icons/test.svg'
      }];
      
      render(<ServicesSection services={longDescService} />);
      
      const description = screen.getByText(/This is a very long description/);
      expect(description.textContent.length).toBeLessThanOrEqual(150);
      expect(description.textContent).toContain('...');
    });

    it('renders service icons when provided', () => {
      const { container } = render(<ServicesSection services={mockServices} />);
      
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(3);
    });
  });

  describe('Graceful degradation on icon load failure', () => {
    it('shows text label fallback when icon fails to load', () => {
      const { container } = render(<ServicesSection services={mockServices} />);
      
      // Find an image and trigger error
      const images = container.querySelectorAll('img');
      const firstImage = images[0];
      
      // Trigger error event
      fireEvent.error(firstImage);
      
      // The service title should still be visible
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      
      // A fallback should be shown (first letter of title)
      const fallback = container.querySelector('[aria-hidden="true"]');
      expect(fallback).toBeInTheDocument();
    });

    it('displays first letter of title as fallback', () => {
      const serviceWithoutIcon = [{
        title: 'Mobile Development',
        description: 'Building native mobile apps.',
        icon: '' // No icon
      }];
      
      const { container } = render(<ServicesSection services={serviceWithoutIcon} />);
      
      // Should show 'M' as fallback
      expect(container.textContent).toContain('M');
    });
  });

  describe('Animation (Requirement 8.5)', () => {
    it('applies stagger delay to service cards via CSS custom property', () => {
      const { container } = render(<ServicesSection services={mockServices} />);
      
      const cards = container.querySelectorAll('article');
      
      // Each card should have a --stagger-index CSS custom property
      cards.forEach((card, index) => {
        expect(card.style.getPropertyValue('--stagger-index')).toBe(`${index * 100}ms`);
      });
    });

    it('adds visible class when section is in view', () => {
      const { container } = render(<ServicesSection services={mockServices} />);
      
      const cards = container.querySelectorAll('article');
      
      // Cards should have visible class since inView is mocked to true
      cards.forEach((card) => {
        expect(card.className).toContain('visible');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper section heading', () => {
      render(<ServicesSection services={mockServices} />);
      
      const heading = screen.getByRole('heading', { level: 2, name: 'Services' });
      expect(heading).toBeInTheDocument();
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<ServicesSection services={mockServices} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'services-heading');
    });

    it('renders each service as an article', () => {
      render(<ServicesSection services={mockServices} />);
      
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(3);
    });

    it('hides decorative icons from screen readers', () => {
      const { container } = render(<ServicesSection services={mockServices} />);
      
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Empty state handling', () => {
    it('renders without errors when given empty services array', () => {
      render(<ServicesSection services={[]} />);
      
      // Section should still render
      expect(screen.getByRole('heading', { level: 2, name: 'Services' })).toBeInTheDocument();
    });
  });

  describe('Section structure', () => {
    it('has id="services" for navigation', () => {
      render(<ServicesSection services={mockServices} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'services');
    });
  });
});
