/**
 * @file Tests for SkillsSection component
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 11.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillsSection } from './SkillsSection.jsx';

// Mock useInView hook
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: true }))
}));

describe('SkillsSection', () => {
  const mockSkills = [
    {
      name: 'Frontend',
      skills: [
        { name: 'React', icon: '/icons/react.svg' },
        { name: 'JavaScript' },
        { name: 'CSS', icon: '/icons/css.svg' }
      ]
    },
    {
      name: 'Backend',
      skills: [
        { name: 'Node.js', icon: '/icons/node.svg' },
        { name: 'Python' }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirement 5.1: Skills grouped by category', () => {
    it('renders skills grouped into named categories', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      // Check category names are displayed
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
    });

    it('renders at least 2 categories', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      // h3 elements are category names
      const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(categoryHeadings.length).toBeGreaterThanOrEqual(2);
    });

    it('renders skills within each category', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      // Check skills are displayed
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('CSS')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  describe('Requirement 5.2: Visual indicator (icon/badge)', () => {
    it('renders skill badges with icons when icon URL is provided', () => {
      const { container } = render(<SkillsSection skills={mockSkills} />);
      
      // Find images for skills that have icons (decorative images with aria-hidden)
      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images.length).toBe(3); // React, CSS, Node.js have icons
    });

    it('renders skill badges without icons when no icon URL is provided', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      // JavaScript has no icon, should still render
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('renders each skill as a badge/list item', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      const skillsList = screen.getAllByRole('list');
      expect(skillsList.length).toBe(2); // One list per category
      
      // Check list items exist
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(5); // Total skills across categories
    });
  });

  describe('Requirement 5.4: Text-only fallback on icon load failure', () => {
    it('hides icon and shows text when icon fails to load', () => {
      const { container } = render(<SkillsSection skills={mockSkills} />);
      
      // Find an image and trigger error
      const images = container.querySelectorAll('img');
      const firstImage = images[0];
      
      // Trigger error event
      fireEvent.error(firstImage);
      
      // The skill name should still be visible
      expect(screen.getByText('React')).toBeInTheDocument();
      
      // After error, the image count should be reduced since the icon is hidden
      const imagesAfterError = container.querySelectorAll('img');
      expect(imagesAfterError.length).toBe(2); // One less than before
    });
  });

  describe('Accessibility', () => {
    it('has proper section heading', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      const heading = screen.getByRole('heading', { level: 2, name: 'Skills' });
      expect(heading).toBeInTheDocument();
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'skills-heading');
    });

    it('renders skills in proper list structure', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe('Empty state handling', () => {
    it('renders without errors when given empty skills array', () => {
      render(<SkillsSection skills={[]} />);
      
      // Section should still render
      expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
    });

    it('renders category with no skills', () => {
      const emptyCategory = [{ name: 'Empty Category', skills: [] }];
      render(<SkillsSection skills={emptyCategory} />);
      
      expect(screen.getByText('Empty Category')).toBeInTheDocument();
    });
  });

  describe('Stagger delay calculation', () => {
    it('applies stagger delay to skill badges via CSS custom property', () => {
      render(<SkillsSection skills={mockSkills} />);
      
      const listItems = screen.getAllByRole('listitem');
      
      // Each skill badge should have a --stagger-index CSS custom property
      listItems.forEach((item) => {
        expect(item.style.getPropertyValue('--stagger-index')).toBeTruthy();
      });
    });
  });
});
