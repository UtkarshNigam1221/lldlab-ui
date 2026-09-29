import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from '../index';

const DOC = `# Parking lot

Design a **parking lot**.

## Requirements

- [x] Park a car
- [ ] Leave

\`\`\`ts
const lot = new Lot();
\`\`\`

Use \`Lot.park()\`.

| a | b |
|---|---|
| 1 | 2 |
`;

describe('Markdown', () => {
  it('renders headings through Heading with library styles', () => {
    render(<Markdown>{DOC}</Markdown>);
    expect(screen.getByRole('heading', { level: 1, name: 'Parking lot' })).toHaveClass('font-display', 'text-headline-lg');
    expect(screen.getByRole('heading', { level: 2, name: 'Requirements' })).toHaveClass('text-headline-md');
  });
  it('renders task-list items as check icons, not inputs', () => {
    const { container } = render(<Markdown>{DOC}</Markdown>);
    expect(container.querySelector('input')).toBeNull();
    expect(screen.getByText('check_box')).toBeInTheDocument();
    expect(screen.getByText('check_box_outline_blank')).toBeInTheDocument();
  });
  it('renders code blocks in a focusable scrolling pre, and inline code as Code', () => {
    render(<Markdown>{DOC}</Markdown>);
    const pre = screen.getByText('const lot = new Lot();').closest('pre')!;
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).toHaveClass('overflow-x-auto');
    expect(screen.getByText('Lot.park()')).toHaveClass('bg-surface-muted');
  });
  it('wraps tables in a focusable horizontal scroller', () => {
    const { container } = render(<Markdown>{DOC}</Markdown>);
    expect(container.querySelector('table')!.parentElement).toHaveClass('overflow-x-auto');
  });
  it('does not render raw HTML or javascript: links', () => {
    const { container } = render(<Markdown>{'<script>alert(1)</script><b>bold</b>\n\n[click](javascript:alert(1))'}</Markdown>);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    const link = screen.getByText('click').closest('a');
    expect(link?.getAttribute('href') ?? '').not.toMatch(/^javascript:/i);
  });
});
