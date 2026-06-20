import { describe, it, expect } from 'vitest';
import { validateContactForm } from './validation';

describe('validateContactForm', () => {
  describe('valid form data', () => {
    it('returns empty object for valid data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, I would like to connect.',
      };
      expect(validateContactForm(data)).toEqual({});
    });

    it('accepts name at maximum length (100 chars)', () => {
      const data = {
        name: 'a'.repeat(100),
        email: 'test@example.com',
        message: 'Test message',
      };
      expect(validateContactForm(data)).toEqual({});
    });

    it('accepts email at maximum length (254 chars)', () => {
      // Create a valid email within 254 chars: test@ + domain + .com
      const validEmail = 'test@' + 'a'.repeat(245) + '.com';
      const data = {
        name: 'Test',
        email: validEmail.slice(0, 254),
        message: 'Test message',
      };
      expect(validateContactForm(data)).toEqual({});
    });

    it('accepts message at maximum length (1000 chars)', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'a'.repeat(1000),
      };
      expect(validateContactForm(data)).toEqual({});
    });
  });

  describe('name validation', () => {
    it('returns error for empty name', () => {
      const data = {
        name: '',
        email: 'test@example.com',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBeUndefined();
      expect(errors.message).toBeUndefined();
    });

    it('returns error for whitespace-only name', () => {
      const data = {
        name: '   ',
        email: 'test@example.com',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.name).toBe('Name is required');
    });

    it('returns error for name exceeding 100 characters', () => {
      const data = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.name).toBe('Name must be 100 characters or less');
    });
  });

  describe('email validation', () => {
    it('returns error for empty email', () => {
      const data = {
        name: 'Test User',
        email: '',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Email is required');
    });

    it('returns error for whitespace-only email', () => {
      const data = {
        name: 'Test User',
        email: '   ',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Email is required');
    });

    it('returns error for email exceeding 254 characters', () => {
      const data = {
        name: 'Test User',
        email: 'a'.repeat(255) + '@example.com',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Email must be 254 characters or less');
    });

    it('returns error for invalid email format - no @', () => {
      const data = {
        name: 'Test User',
        email: 'testexample.com',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('returns error for invalid email format - no domain', () => {
      const data = {
        name: 'Test User',
        email: 'test@',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('returns error for invalid email format - no TLD', () => {
      const data = {
        name: 'Test User',
        email: 'test@example',
        message: 'Test message',
      };
      const errors = validateContactForm(data);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('accepts valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'user+tag@example.org',
        'user123@subdomain.example.co.uk',
      ];

      validEmails.forEach((email) => {
        const data = {
          name: 'Test User',
          email,
          message: 'Test message',
        };
        const errors = validateContactForm(data);
        expect(errors.email).toBeUndefined();
      });
    });
  });

  describe('message validation', () => {
    it('returns error for empty message', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: '',
      };
      const errors = validateContactForm(data);
      expect(errors.message).toBe('Message is required');
    });

    it('returns error for whitespace-only message', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: '   ',
      };
      const errors = validateContactForm(data);
      expect(errors.message).toBe('Message is required');
    });

    it('returns error for message exceeding 1000 characters', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'a'.repeat(1001),
      };
      const errors = validateContactForm(data);
      expect(errors.message).toBe('Message must be 1000 characters or less');
    });
  });

  describe('multiple validation errors', () => {
    it('returns errors for all invalid fields', () => {
      const data = {
        name: '',
        email: 'invalid',
        message: '',
      };
      const errors = validateContactForm(data);
      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.message).toBe('Message is required');
    });
  });
});
