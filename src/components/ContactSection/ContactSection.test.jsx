/**
 * @file Tests for the ContactSection component
 *
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 12.4, 12.6
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactSection } from './ContactSection.jsx';

// Mock useInView hook
vi.mock('../../hooks/useInView.js', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: true,
  })),
}));

// Mock useContactForm hook
const mockHandleChange = vi.fn();
const mockHandleSubmit = vi.fn();

vi.mock('../../hooks/useContactForm.js', () => ({
  useContactForm: vi.fn(() => ({
    formData: { name: '', email: '', message: '' },
    errors: {},
    status: 'idle',
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  })),
}));

describe('ContactSection', () => {
  const defaultProps = {
    socialLinks: [
      {
        platform: 'GitHub',
        url: 'https://github.com/example',
        ariaLabel: 'Visit my GitHub profile',
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/example',
        ariaLabel: 'Connect on LinkedIn',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the section with correct id', () => {
      render(<ContactSection {...defaultProps} />);

      const section = document.getElementById('contact');
      expect(section).toBeInTheDocument();
    });

    it('renders the "Get In Touch" heading', () => {
      render(<ContactSection {...defaultProps} />);

      const heading = screen.getByRole('heading', { name: /get in touch/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('has aria-labelledby pointing to heading', () => {
      render(<ContactSection {...defaultProps} />);

      const section = document.getElementById('contact');
      expect(section).toHaveAttribute('aria-labelledby', 'contact-heading');
    });
  });

  describe('Form Fields (Req 9.1)', () => {
    it('renders name field with label and required indicator', () => {
      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('aria-required', 'true');
      expect(nameInput).toHaveAttribute('maxLength', '100');
    });

    it('renders email field with label and required indicator', () => {
      render(<ContactSection {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('maxLength', '254');
    });

    it('renders message field with label and required indicator', () => {
      render(<ContactSection {...defaultProps} />);

      const messageInput = screen.getByLabelText(/message/i);
      expect(messageInput).toBeInTheDocument();
      expect(messageInput.tagName).toBe('TEXTAREA');
      expect(messageInput).toHaveAttribute('aria-required', 'true');
      expect(messageInput).toHaveAttribute('maxLength', '1000');
    });

    it('renders submit button', () => {
      render(<ContactSection {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('displays character counts for all fields', () => {
      render(<ContactSection {...defaultProps} />);

      expect(screen.getByText('0/100')).toBeInTheDocument();
      expect(screen.getByText('0/254')).toBeInTheDocument();
      expect(screen.getByText('0/1000')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('calls handleChange when input values change', async () => {
      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John', name: 'name' } });

      expect(mockHandleChange).toHaveBeenCalledWith('name', 'John');
    });

    it('calls handleSubmit when form is submitted', async () => {
      render(<ContactSection {...defaultProps} />);

      const form = document.querySelector('form');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Errors (Req 9.4)', () => {
    it('displays inline error messages adjacent to invalid fields', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {
          name: 'Name is required',
          email: 'Please enter a valid email address',
        },
        status: 'idle',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('marks invalid fields with aria-invalid', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: { name: 'Name is required' },
        status: 'idle',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('associates error message with field using aria-describedby', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: { name: 'Name is required' },
        status: 'idle',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    it('error messages have role="alert"', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: { name: 'Name is required' },
        status: 'idle',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const errorMessage = screen.getByRole('alert', { name: '' });
      expect(errorMessage).toHaveTextContent('Name is required');
    });
  });

  describe('Success State (Req 9.3)', () => {
    it('displays success confirmation message on successful submission', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {},
        status: 'success',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const successMessage = screen.getByRole('alert');
      expect(successMessage).toHaveTextContent(/thank you for your message/i);
    });
  });

  describe('Error State (Req 9.5)', () => {
    it('displays error banner on network/server failure', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: 'John', email: 'john@example.com', message: 'Hello' },
        errors: {},
        status: 'error',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const errorBanner = screen.getByRole('alert');
      expect(errorBanner).toHaveTextContent(/submission failed/i);
    });

    it('preserves form data on network failure', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: 'John', email: 'john@example.com', message: 'Hello' },
        errors: {},
        status: 'error',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      // Form data should still be present (preserved)
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toHaveValue('John');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('Hello');
    });
  });

  describe('Submitting State', () => {
    it('disables form fields when submitting', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: 'John', email: 'john@example.com', message: 'Hello' },
        errors: {},
        status: 'submitting',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      expect(screen.getByLabelText(/name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/message/i)).toBeDisabled();
    });

    it('disables submit button when submitting', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {},
        status: 'submitting',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /sending/i });
      expect(submitButton).toBeDisabled();
    });

    it('shows "Sending..." text when submitting', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {},
        status: 'submitting',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });

    it('submit button has aria-busy when submitting', async () => {
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {},
        status: 'submitting',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });

      render(<ContactSection {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /sending/i });
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Social Links (Req 9.2)', () => {
    it('renders at least 2 social media links', () => {
      render(<ContactSection {...defaultProps} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it('social links open in new tabs', () => {
      render(<ContactSection {...defaultProps} />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('target', '_blank');
    });

    it('social links have rel="noopener noreferrer" for security', () => {
      render(<ContactSection {...defaultProps} />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders correct URLs for social links', () => {
      render(<ContactSection {...defaultProps} />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

      expect(githubLink).toHaveAttribute('href', 'https://github.com/example');
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://linkedin.com/in/example'
      );
    });

    it('social links display platform names', () => {
      render(<ContactSection {...defaultProps} />);

      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('social links have accessible labels (aria-label)', () => {
      render(<ContactSection {...defaultProps} />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('aria-label', 'Visit my GitHub profile');
    });
  });

  describe('Keyboard Accessibility (Req 12.4, 12.6)', () => {
    beforeEach(async () => {
      // Reset useContactForm mock to idle state for keyboard tests
      const { useContactForm } = await import('../../hooks/useContactForm.js');
      useContactForm.mockReturnValue({
        formData: { name: '', email: '', message: '' },
        errors: {},
        status: 'idle',
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
      });
    });

    it('all form elements are focusable', () => {
      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      // Focus on each element to verify they are focusable
      nameInput.focus();
      expect(document.activeElement).toBe(nameInput);

      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);

      messageInput.focus();
      expect(document.activeElement).toBe(messageInput);

      submitButton.focus();
      expect(document.activeElement).toBe(submitButton);
    });

    it('social links are focusable', () => {
      render(<ContactSection {...defaultProps} />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

      githubLink.focus();
      expect(document.activeElement).toBe(githubLink);

      linkedinLink.focus();
      expect(document.activeElement).toBe(linkedinLink);
    });

    it('form has correct tab order (follows visual reading sequence)', () => {
      render(<ContactSection {...defaultProps} />);

      // Get all focusable elements in order
      const focusableElements = [
        screen.getByLabelText(/name/i),
        screen.getByLabelText(/email/i),
        screen.getByLabelText(/message/i),
        screen.getByRole('button', { name: /send message/i }),
      ];

      // Verify all elements have proper tabindex (not negative)
      focusableElements.forEach((element) => {
        const tabIndex = element.getAttribute('tabIndex');
        expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true);
      });
    });
  });

  describe('Scroll Animation (Req 11.3)', () => {
    it('applies visible class when inView is true', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: true });

      const { container } = render(<ContactSection {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section.className).toContain('visible');
    });

    it('does not apply visible class when inView is false', async () => {
      const { useInView } = await import('../../hooks/useInView.js');
      useInView.mockReturnValue({ ref: vi.fn(), inView: false });

      const { container } = render(<ContactSection {...defaultProps} />);

      const section = container.querySelector('section');
      expect(section.className).not.toContain('visible');
    });
  });

  describe('Social Links Navigation', () => {
    it('renders social links navigation with proper aria-label', () => {
      render(<ContactSection {...defaultProps} />);

      const nav = screen.getByRole('navigation', { name: /social media links/i });
      expect(nav).toBeInTheDocument();
    });

    it('renders "Connect With Me" heading', () => {
      render(<ContactSection {...defaultProps} />);

      const heading = screen.getByRole('heading', { name: /connect with me/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('Autocomplete Attributes', () => {
    it('name input has autocomplete="name"', () => {
      render(<ContactSection {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('autocomplete', 'name');
    });

    it('email input has autocomplete="email"', () => {
      render(<ContactSection {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });
  });
});
