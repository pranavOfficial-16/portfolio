/**
 * @file Tests for the ProjectsSection component
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 11.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from './ProjectsSection.jsx';

// Mock useInView hook
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: true
  }))
}));

describe('ProjectsSection', () => {
  const defaultProjects = [
    {
      title: 'Project One',
      description: 'This is the description for project one. It showcases the key features.',
      tags: ['React', 'TypeScript', 'CSS'],
      demoUrl: 'https://demo.example.com',
      repoUrl: 'https://github.com/user/repo'
    },
    {
      title: 'Project Two',
      description: 'Another project with only a repo link.',
      tags: ['Node.js', 'Express'],
      repoUrl: 'https://github.com/user/repo2'
    },
    {
      title: 'Project Three',
      description: 'A project with no links at all.',
      tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const section = document.getElementById('projects');
      expect(section).toBeInTheDocument();
    });

    it('renders the "Projects" heading', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const heading = screen.getByRole('heading', { name: /projects/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders all project cards', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      expect(screen.getByText('Project Three')).toBeInTheDocument();
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const section = document.getElementById('projects');
      expect(section).toHaveAttribute('aria-labelledby', 'projects-heading');
    });
  });

  describe('Project Title and Description (Req 6.1)', () => {
    it('renders project title', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      expect(screen.getByText('Project One')).toBeInTheDocument();
    });

    it('renders project description', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      expect(screen.getByText(/This is the description for project one/)).toBeInTheDocument();
    });

    it('truncates title longer than 100 characters with ellipsis', () => {
      const longTitleProject = [{
        title: 'A'.repeat(120),
        description: 'Short description',
        tags: ['React']
      }];
      
      render(<ProjectsSection projects={longTitleProject} />);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title.textContent.length).toBe(100);
      expect(title.textContent).toContain('…');
    });

    it('truncates description longer than 200 characters with ellipsis', () => {
      const longDescProject = [{
        title: 'Test Project',
        description: 'B'.repeat(250),
        tags: ['React']
      }];
      
      render(<ProjectsSection projects={longDescProject} />);
      
      // Find the paragraph element with the description
      const description = screen.getByText(/^B+…$/);
      expect(description.textContent.length).toBe(200);
      expect(description.textContent).toContain('…');
    });

    it('does not truncate title within 100 characters', () => {
      const shortTitleProject = [{
        title: 'Short Title',
        description: 'Description',
        tags: []
      }];
      
      render(<ProjectsSection projects={shortTitleProject} />);
      
      expect(screen.getByText('Short Title')).toBeInTheDocument();
    });
  });

  describe('Technology Tags (Req 6.2)', () => {
    it('renders technology tags for each project', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('CSS')).toBeInTheDocument();
    });

    it('limits tags to maximum of 5', () => {
      const manyTagsProject = [{
        title: 'Many Tags Project',
        description: 'Has more than 5 tags',
        tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6', 'Tag7']
      }];
      
      render(<ProjectsSection projects={manyTagsProject} />);
      
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag5')).toBeInTheDocument();
      expect(screen.queryByText('Tag6')).not.toBeInTheDocument();
      expect(screen.queryByText('Tag7')).not.toBeInTheDocument();
    });

    it('renders exactly 5 tags when more are provided', () => {
      const manyTagsProject = [{
        title: 'Many Tags Project',
        description: 'Has more than 5 tags',
        tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6', 'Tag7']
      }];
      
      const { container } = render(<ProjectsSection projects={manyTagsProject} />);
      
      const tagElements = container.querySelectorAll('[class*="tag"]');
      // Filter to get only the actual tag elements (not tagsContainer)
      const actualTags = Array.from(tagElements).filter(el => 
        !el.className.includes('Container')
      );
      expect(actualTags).toHaveLength(5);
    });
  });

  describe('Project Links (Req 6.3, 6.4)', () => {
    it('renders card as link when demoUrl is present', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const link = screen.getByRole('link', { name: /view project one/i });
      expect(link).toHaveAttribute('href', 'https://demo.example.com');
    });

    it('links to demoUrl when both demoUrl and repoUrl exist (Req 6.3)', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const link = screen.getByRole('link', { name: /view project one/i });
      expect(link).toHaveAttribute('href', 'https://demo.example.com');
      // Should NOT link to repoUrl
      expect(link).not.toHaveAttribute('href', 'https://github.com/user/repo');
    });

    it('links to repoUrl when only repoUrl exists', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const link = screen.getByRole('link', { name: /view project two/i });
      expect(link).toHaveAttribute('href', 'https://github.com/user/repo2');
    });

    it('renders card without link when neither URL exists (Req 6.4)', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      // Project Three has no links
      const projectThreeTitle = screen.getByText('Project Three');
      const card = projectThreeTitle.closest('div');
      expect(card.tagName).toBe('DIV');
      expect(card).not.toHaveAttribute('href');
    });

    it('opens links in new tab with proper security attributes', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const link = screen.getByRole('link', { name: /view project one/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('has proper section landmark', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const section = screen.getByRole('region', { name: /projects/i });
      expect(section).toBeInTheDocument();
    });

    it('link cards have accessible label', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const link = screen.getByRole('link', { name: /view project one/i });
      expect(link).toHaveAccessibleName('View Project One project');
    });

    it('renders project titles as h3 headings', () => {
      render(<ProjectsSection projects={defaultProjects} />);
      
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings.length).toBe(3);
    });
  });

  describe('Scroll Animation (Req 11.3)', () => {
    it('applies visible class when inView is true', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: true });
      
      const { container } = render(<ProjectsSection projects={defaultProjects} />);
      
      const section = container.querySelector('section');
      expect(section.className).toContain('visible');
    });

    it('does not apply visible class when inView is false', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: false });
      
      const { container } = render(<ProjectsSection projects={defaultProjects} />);
      
      const section = container.querySelector('section');
      expect(section.className).not.toContain('visible');
    });
  });

  describe('Empty State', () => {
    it('renders empty grid when no projects provided', () => {
      const { container } = render(<ProjectsSection projects={[]} />);
      
      const grid = container.querySelector('[class*="projectsGrid"]');
      expect(grid).toBeInTheDocument();
      expect(grid.children.length).toBe(0);
    });
  });
});
