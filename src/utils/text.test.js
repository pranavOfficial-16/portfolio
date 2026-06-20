import { describe, it, expect } from 'vitest';
import { truncateText } from './text';

describe('truncateText', () => {
  it('returns original text when length is within limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('returns original text when length equals maxLength', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('truncates and adds ellipsis when text exceeds maxLength', () => {
    const result = truncateText('Hello World', 8);
    expect(result).toBe('Hello W…');
    expect(result.length).toBe(8);
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('truncates to single ellipsis when maxLength is 1', () => {
    expect(truncateText('Hello', 1)).toBe('…');
  });

  it('uses Unicode ellipsis character', () => {
    const result = truncateText('Hello World', 6);
    expect(result).toContain('…');
    expect(result).not.toContain('...');
  });

  it('preserves exact maxLength when truncating', () => {
    const maxLength = 15;
    const result = truncateText('This is a longer piece of text', maxLength);
    expect(result.length).toBe(maxLength);
  });
});
