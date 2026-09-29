import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from '../index';

const BARS = [{ value: 10, label: '0–10ms' }, { value: 40, label: '10–20ms' }, { value: 20, label: '20–30ms' }, { value: 0, label: '30–40ms' }];

describe('BarChart', () => {
  it('summarises the data for assistive tech and exposes the values as a hidden table', () => {
    render(<BarChart label="Runtime distribution" bars={BARS} highlight={1} highlightLabel="41ms" axis={['0ms', '20ms', '40ms']} />);
    expect(screen.getByRole('img', { name: 'Runtime distribution: 4 bars, highest 40; highlighted 10–20ms = 40' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'Runtime distribution' });
    expect(table).toHaveClass('sr-only');
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(screen.getByText('41ms')).toBeInTheDocument();
  });
  it('scales bar heights to the max and keeps a sliver for zero values', () => {
    const { container } = render(<BarChart label="x" bars={BARS} highlight={1} />);
    const fills = [...container.querySelectorAll<HTMLElement>('[data-bar]')];
    expect(fills.map((f) => f.style.height)).toEqual(['25%', '100%', '50%', '2%']);
    expect(fills[1]).toHaveClass('bg-brand-cobalt');
    expect(fills[0]).toHaveClass('bg-surface-container-high');
  });
  it('handles an empty or all-zero series', () => {
    const { container } = render(<BarChart label="empty" bars={[{ value: 0 }, { value: 0 }]} />);
    expect([...container.querySelectorAll<HTMLElement>('[data-bar]')].map((f) => f.style.height)).toEqual(['2%', '2%']);
  });
});
