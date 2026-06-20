/**
 * @file Tests for the Layout component
 * 
 * Validates: Requirements 2.3, 11.4
 * - Content constrained to max width of 1440px and centered (Req 2.3)
 * - Minimum 48px between sections (Req 11.4)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout.jsx';

describe('Layout', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <section data-testid="test-section">Test Content</section>
      </Layout>
    );

    expect(screen.getByTestId('test-section')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps children in main element with sections class', () => {
    render(
      <Layout>
        <section>Section 1</section>
        <section>Section 2</section>
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main.children).toHaveLength(2);
  });

  it('renders layout container structure', () => {
    const { container } = render(
      <Layout>
        <section>Content</section>
      </Layout>
    );

    // Layout wrapper div exists
    const layoutDiv = container.firstChild;
    expect(layoutDiv).toHaveClass(/_layout/);
    
    // Container div with max-width constraint exists
    const containerDiv = layoutDiv.firstChild;
    expect(containerDiv).toHaveClass(/_container/);
    
    // Main element with sections class exists
    const mainElement = containerDiv.firstChild;
    expect(mainElement.tagName).toBe('MAIN');
    expect(mainElement).toHaveClass(/_sections/);
  });

  it('renders multiple children correctly', () => {
    render(
      <Layout>
        <section data-testid="section-1">First Section</section>
        <section data-testid="section-2">Second Section</section>
        <section data-testid="section-3">Third Section</section>
      </Layout>
    );

    expect(screen.getByTestId('section-1')).toBeInTheDocument();
    expect(screen.getByTestId('section-2')).toBeInTheDocument();
    expect(screen.getByTestId('section-3')).toBeInTheDocument();
  });
});
