import {describe, expect, it, vi, afterEach} from 'vitest';
import {formatChartValue, prefersReducedMotion, resolveChartPalette} from './chart.utils';

describe('formatChartValue', () => {
  it('formats as number by default', () => {
    expect(formatChartValue(1234567, 'number')).toBe('1,234,567');
  });

  it('formats zero as number', () => {
    expect(formatChartValue(0, 'number')).toBe('0');
  });

  it('formats negative numbers as number', () => {
    expect(formatChartValue(-42, 'number')).toBe('-42');
  });

  it('formats decimals as number', () => {
    expect(formatChartValue(1234.56, 'number')).toBe('1,234.56');
  });

  it('formats currency MXN without decimals', () => {
    const result = formatChartValue(1500, 'currency');
    expect(result).toContain('1,500');
    expect(result).toMatch(/\$/);
  });

  it('formats zero as currency', () => {
    const result = formatChartValue(0, 'currency');
    expect(result).toMatch(/\$/);
  });

  it('formats negative currency', () => {
    const result = formatChartValue(-500, 'currency');
    expect(result).toContain('500');
    expect(result).toMatch(/-/);
  });

  it('formats percent dividing by 100', () => {
    expect(formatChartValue(75, 'percent')).toBe('75.0%');
  });

  it('formats zero percent', () => {
    expect(formatChartValue(0, 'percent')).toBe('0.0%');
  });

  it('formats 100 percent', () => {
    expect(formatChartValue(100, 'percent')).toBe('100.0%');
  });

  it('formats negative percent', () => {
    expect(formatChartValue(-25, 'percent')).toBe('-25.0%');
  });

  it('formats compact for large values', () => {
    const result = formatChartValue(1500, 'compact');
    expect(result).toMatch(/1\.5\s?k/i);
  });

  it('formats compact for millions', () => {
    const result = formatChartValue(2000000, 'compact');
    expect(result).toMatch(/2\s?M/i);
  });

  it('formats compact for small values', () => {
    expect(formatChartValue(5, 'compact')).toBe('5');
  });

  it('formats compact for zero', () => {
    expect(formatChartValue(0, 'compact')).toBe('0');
  });
});

describe('resolveChartPalette', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 5 colors', () => {
    const palette = resolveChartPalette();
    expect(palette).toHaveLength(5);
  });

  it('returns non-empty strings', () => {
    const palette = resolveChartPalette();
    for (const color of palette) {
      expect(color.length).toBeGreaterThan(0);
    }
  });

  it('falls back to oklch values in jsdom when CSS vars are absent', () => {
    const palette = resolveChartPalette();
    for (const color of palette) {
      expect(color).toContain('oklch');
    }
  });
});

describe('prefersReducedMotion', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: originalMatchMedia,
      writable: true,
      configurable: true,
    });
  });

  it('returns false when matchMedia is not a function', () => {
    Object.defineProperty(window, 'matchMedia', {value: undefined, writable: true, configurable: true});
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns true when matchMedia matches', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({matches: true, media: query} as MediaQueryList),
      writable: true,
      configurable: true,
    });
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when matchMedia does not match', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({matches: false, media: query} as MediaQueryList),
      writable: true,
      configurable: true,
    });
    expect(prefersReducedMotion()).toBe(false);
  });
});
