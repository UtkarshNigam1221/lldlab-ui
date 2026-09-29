import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// jsdom gives import.meta.url a non-file scheme, so resolve from the repo root (vitest's cwd).
const css = readFileSync(resolve(process.cwd(), 'src/tokens/theme.css'), 'utf8');
const CODE = ['keyword', 'string', 'number', 'comment', 'function', 'type', 'punctuation', 'plain'];

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return '';
  return css.slice(start, css.indexOf('}', start));
}

describe('theme tokens (addendum)', () => {
  it('defines every code token for the dark code surface', () => {
    for (const t of CODE) expect(css).toMatch(new RegExp(`--color-code-${t}:\\s*#`));
  });
  it('swaps code tokens for light and dark subtle surfaces', () => {
    const light = block('@utility code-subtle');
    const dark = block('[data-theme="dark"] .code-subtle');
    for (const t of CODE) {
      expect(light).toContain(`--color-code-${t}:`);
      expect(dark).toContain(`--color-code-${t}:`);
    }
  });
  it('defines diff, skeleton and appbar tokens', () => {
    for (const t of ['diff-add-bg', 'diff-add-fg', 'diff-del-bg', 'diff-del-fg', 'code-bg-subtle']) expect(css).toContain(`--color-${t}:`);
    expect(css).toContain('@utility skeleton-shimmer');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('--spacing-appbar: 4rem');
  });
});
