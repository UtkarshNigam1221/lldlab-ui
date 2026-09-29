import { describe, expect, it } from 'vitest';
import { cx } from './cx';
import { BREAKPOINTS, responsive, type ClassTable } from './responsive';
import { rovingIndex } from './roving';
import { ALIGN, COLS, DIRECTION, GAP, HEADING_SIZE, JUSTIFY, PADDING } from './tables';

describe('cx', () => {
  it('joins truthy parts with single spaces', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});

describe('responsive', () => {
  it('returns the base class for a scalar value', () => {
    expect(responsive(GAP, 'md')).toBe('gap-space-md');
  });
  it('returns one class per breakpoint given, in breakpoint order', () => {
    expect(responsive(GAP, { lg: 'xl', base: 'sm' })).toBe('gap-space-sm lg:gap-space-xl');
  });
  it('returns an empty string for undefined', () => {
    expect(responsive(GAP, undefined)).toBe('');
  });
});

const TABLES = { GAP, PADDING, COLS, DIRECTION, ALIGN, JUSTIFY, HEADING_SIZE };

describe.each(Object.entries(TABLES))('%s table', (_name, table) => {
  it('has every value at every breakpoint, written with the right prefix', () => {
    const t = table as ClassTable<string | number>;
    const values = Object.keys(t.base);
    expect(values.length).toBeGreaterThan(0);
    for (const bp of BREAKPOINTS) {
      expect(Object.keys(t[bp])).toEqual(values);
      for (const v of values) {
        const base = t.base[v];
        expect(base).not.toContain(':');
        expect(t[bp][v]).toBe(bp === 'base' ? base : `${bp}:${base}`);
      }
    }
  });
});

describe('rovingIndex', () => {
  it('moves forward and back with wrap-around', () => {
    expect(rovingIndex('ArrowRight', 2, 3)).toBe(0);
    expect(rovingIndex('ArrowDown', 0, 3)).toBe(1);
    expect(rovingIndex('ArrowLeft', 0, 3)).toBe(2);
    expect(rovingIndex('ArrowUp', 1, 3)).toBe(0);
  });
  it('jumps with Home and End and ignores other keys', () => {
    expect(rovingIndex('Home', 2, 3)).toBe(0);
    expect(rovingIndex('End', 0, 3)).toBe(2);
    expect(rovingIndex('a', 0, 3)).toBeNull();
  });
});
