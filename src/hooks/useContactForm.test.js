/**
 * @file Unit tests for useContactForm hook.
 *
 * Validates: Requirements 9.1, 9.3, 9.4, 9.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContactForm } from './useContactForm';

describe('useContactForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('returns initial form data with empty fields', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.formData).toEqual({
        name: '',
        email: '',
        message: '',
      });
    });

    it('returns empty errors object initially', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.errors).toEqual({});
    });

    it('returns idle status initially', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.status).toBe('idle');
    });

    it('returns handleChange and handleSubmit functions', () => {
      const { result } = renderHook(() => useContactForm());

      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
    });
  });

  describe('handleChange', () => {
    it('updates name field', () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
      });

      expect(result.current.formData.name).toBe('John Doe');
    });

    it('updates email field', () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('email', 'john@example.com');
      });

      expect(result.current.formData.email).toBe('john@example.com');
    });

    it('updates message field', () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('message', 'Hello there!');
      });

      expect(result.current.formData.message).toBe('Hello there!');
    });

    it('clears field error when user types', async () => {
      const { result } = renderHook(() => useContactForm());

      // Submit with empty fields to trigger validation errors
      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.name).toBeDefined();

      // Type in the name field
      act(() => {
        result.current.handleChange('name', 'J');
      });

      // Error should be cleared
      expect(result.current.errors.name).toBeUndefined();
    });

    it('does not affect other field errors when clearing one', async () => {
      const { result } = renderHook(() => useContactForm());

      // Submit with empty fields to trigger validation errors
      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.name).toBeDefined();
      expect(result.current.errors.email).toBeDefined();

      // Type in the name field only
      act(() => {
        result.current.handleChange('name', 'John');
      });

      // Name error cleared, email error remains
      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.errors.email).toBeDefined();
    });
  });

  describe('handleSubmit - validation', () => {
    it('sets validation errors for empty fields', async () => {
      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.message).toBe('Message is required');
    });

    it('sets validation error for invalid email format', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'invalid-email');
        result.current.handleChange('message', 'Test message');
      });

      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.email).toBe('Please enter a valid email address');
      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.errors.message).toBeUndefined();
    });

    it('does not change status when validation fails', async () => {
      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        result.current.handleSubmit();
      });

      // Status should remain idle when validation fails
      expect(result.current.status).toBe('idle');
    });

    it('retains form data on validation failure (Req 9.5)', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'invalid'); // Invalid email
        result.current.handleChange('message', 'Hello');
      });

      await act(async () => {
        result.current.handleSubmit();
      });

      // Form data should be retained
      expect(result.current.formData.name).toBe('John Doe');
      expect(result.current.formData.email).toBe('invalid');
      expect(result.current.formData.message).toBe('Hello');
    });
  });

  describe('handleSubmit - successful submission', () => {
    it('sets status to submitting during submission', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'john@example.com');
        result.current.handleChange('message', 'Hello there!');
      });

      // Start submission but don't advance timers yet
      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.status).toBe('submitting');
    });

    it('sets status to success after successful submission', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'john@example.com');
        result.current.handleChange('message', 'Hello there!');
      });

      act(() => {
        result.current.handleSubmit();
      });

      // Advance timers to complete the submission
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.status).toBe('success');
    });

    it('clears form data after successful submission', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'john@example.com');
        result.current.handleChange('message', 'Hello there!');
      });

      act(() => {
        result.current.handleSubmit();
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.formData).toEqual({
        name: '',
        email: '',
        message: '',
      });
    });

    it('clears errors after successful submission', async () => {
      const { result } = renderHook(() => useContactForm());

      // First, trigger some errors
      await act(async () => {
        result.current.handleSubmit();
      });

      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

      // Now fill in valid data
      act(() => {
        result.current.handleChange('name', 'John Doe');
        result.current.handleChange('email', 'john@example.com');
        result.current.handleChange('message', 'Hello there!');
      });

      act(() => {
        result.current.handleSubmit();
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.errors).toEqual({});
    });
  });

  describe('form data constraints', () => {
    it('validates name at boundary (100 chars)', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'a'.repeat(100));
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Test message');
      });

      act(() => {
        result.current.handleSubmit();
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should succeed with exactly 100 chars
      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.status).toBe('success');
    });

    it('rejects name over 100 chars', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'a'.repeat(101));
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'Test message');
      });

      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.name).toBe('Name must be 100 characters or less');
    });

    it('validates message at boundary (1000 chars)', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'Test User');
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'a'.repeat(1000));
      });

      act(() => {
        result.current.handleSubmit();
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should succeed with exactly 1000 chars
      expect(result.current.errors.message).toBeUndefined();
      expect(result.current.status).toBe('success');
    });

    it('rejects message over 1000 chars', async () => {
      const { result } = renderHook(() => useContactForm());

      act(() => {
        result.current.handleChange('name', 'Test User');
        result.current.handleChange('email', 'test@example.com');
        result.current.handleChange('message', 'a'.repeat(1001));
      });

      await act(async () => {
        result.current.handleSubmit();
      });

      expect(result.current.errors.message).toBe('Message must be 1000 characters or less');
    });
  });
});
