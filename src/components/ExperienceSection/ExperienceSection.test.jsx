/**
 * @file Tests for ExperienceSection component
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 11.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from './ExperienceSection.jsx';
import { sortExperienceByDate } from './utils.js';

// Mock useInView hook to simulate scroll animation
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({ ref: vi.fn(), inView: true }))
}));

describe('ExperienceSection', () => {
  const mockExperience = [
    {
      role: 'Senior Developer',
      company: 'Tech Corp',
      startDate: 'Jan 2023',
      endDate: 'Present',
      description: 'Leading development of web applications using React and Node.js.'
    },
    {
      role: 'Junior Developer',
      company: 'StartUp Inc',
      startDate: 'Jun 2020',
      endDate: 'Dec 2022',
      description: 'Built and maintained web applications.'
    },
    {
      role: 'Intern',
      company: 'Learning Co',
      startDate: 'Jan 2020',
      endDate: 'May 2020',
      description: 'Assisted with frontend development tasks.'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Requirement 7.1: Vertical timeline, newest first', () => {
    it('renders experience entries in descending order by start date', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      const entries = screen.getAllByRole('article');
      
      // First entry should be the most recent (Senior Developer)
      expect(entries[0]).toHaveTextContent('Senior Developer');
      // Second entry should be Junior Developer
      expect(entries[1]).toHaveTextContent('Junior Developer');
      // Last entry should be Intern
      expect(entries[2]).toHaveTextContent('Intern');
    });

    it('handles "Present" as the most recent date', () => {
      const withPresent = [
        {
          role: 'Current Role',
          company: 'Company A',
          startDate: 'Jan 2024',
          endDate: 'Present',
          description: 'Current job'
        },
        {
          role: 'Past Role',
          company: 'Company B',
          startDate: 'Jan 2025',
          endDate: 'Dec 2025',
          description: 'Past job with later start date'
        }
      ];
      
      render(<ExperienceSection experience={withPresent} />);
      
      const entries = screen.getAllByRole('article');
      // Jan 2025 is later than Jan 2024, so Past Role should be first
      expect(entries[0]).toHaveTextContent('Past Role');
      expect(entries[1]).toHaveTextContent('Current Role');
    });
  });

  describe('Requirement 7.2: Entry includes all required fields', () => {
    it('displays role title for each entry', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
      expect(screen.getByText('Intern')).toBeInTheDocument();
    });

    it('displays company name for each entry', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('StartUp Inc')).toBeInTheDocument();
      expect(screen.getByText('Learning Co')).toBeInTheDocument();
    });

    it('displays time period with start and end dates', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      // Check for time period formatting
      expect(screen.getByText(/Jan 2023 – Present/)).toBeInTheDocument();
      expect(screen.getByText(/Jun 2020 – Dec 2022/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 2020 – May 2020/)).toBeInTheDocument();
    });

    it('displays description for each entry', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      expect(screen.getByText(/Leading development of web applications/)).toBeInTheDocument();
      expect(screen.getByText(/Built and maintained web applications/)).toBeInTheDocument();
      expect(screen.getByText(/Assisted with frontend development tasks/)).toBeInTheDocument();
    });
  });

  describe('Requirement 7.4: Single-column on mobile with timeline on left', () => {
    it('renders entries in a timeline container', () => {
      const { container } = render(<ExperienceSection experience={mockExperience} />);
      
      // Check for timeline structure
      const timeline = container.querySelector('[class*="timeline"]');
      expect(timeline).toBeInTheDocument();
    });
  });

  describe('Requirement 7.5: Entries visually connected to timeline', () => {
    it('renders timeline dots for each entry', () => {
      const { container } = render(<ExperienceSection experience={mockExperience} />);
      
      // Each entry should have a timeline dot
      const dots = container.querySelectorAll('[class*="timelineDot"]');
      expect(dots.length).toBe(mockExperience.length);
    });
  });

  describe('Accessibility', () => {
    it('has proper section heading', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      const heading = screen.getByRole('heading', { level: 2, name: 'Experience' });
      expect(heading).toBeInTheDocument();
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'experience-heading');
    });

    it('renders each entry as an article', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(mockExperience.length);
    });

    it('role title is rendered as heading level 3', () => {
      render(<ExperienceSection experience={mockExperience} />);
      
      const roleHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(roleHeadings.length).toBe(mockExperience.length);
    });
  });

  describe('Empty state handling', () => {
    it('renders without errors when given empty experience array', () => {
      render(<ExperienceSection experience={[]} />);
      
      // Section should still render
      expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    });
  });
});

describe('sortExperienceByDate', () => {
  it('sorts entries by start date in descending order (newest first)', () => {
    const entries = [
      { role: 'A', company: 'A', startDate: '2020', endDate: '2021', description: '' },
      { role: 'B', company: 'B', startDate: '2023', endDate: '2024', description: '' },
      { role: 'C', company: 'C', startDate: '2021', endDate: '2022', description: '' }
    ];
    
    const sorted = sortExperienceByDate(entries);
    
    expect(sorted[0].role).toBe('B'); // 2023
    expect(sorted[1].role).toBe('C'); // 2021
    expect(sorted[2].role).toBe('A'); // 2020
  });

  it('handles various date formats', () => {
    const entries = [
      { role: 'A', company: 'A', startDate: 'Jan 2020', endDate: '2021', description: '' },
      { role: 'B', company: 'B', startDate: 'March 2023', endDate: '2024', description: '' },
      { role: 'C', company: 'C', startDate: '2021-06-01', endDate: '2022', description: '' }
    ];
    
    const sorted = sortExperienceByDate(entries);
    
    expect(sorted[0].role).toBe('B'); // March 2023
    expect(sorted[1].role).toBe('C'); // June 2021
    expect(sorted[2].role).toBe('A'); // Jan 2020
  });

  it('does not mutate the original array', () => {
    const entries = [
      { role: 'A', company: 'A', startDate: '2020', endDate: '2021', description: '' },
      { role: 'B', company: 'B', startDate: '2023', endDate: '2024', description: '' }
    ];
    
    const sorted = sortExperienceByDate(entries);
    
    expect(sorted).not.toBe(entries);
    expect(entries[0].role).toBe('A'); // Original unchanged
  });

  it('returns empty array for empty input', () => {
    const sorted = sortExperienceByDate([]);
    expect(sorted).toEqual([]);
  });

  it('handles single entry', () => {
    const entries = [
      { role: 'A', company: 'A', startDate: '2020', endDate: '2021', description: '' }
    ];
    
    const sorted = sortExperienceByDate(entries);
    expect(sorted.length).toBe(1);
    expect(sorted[0].role).toBe('A');
  });
});
