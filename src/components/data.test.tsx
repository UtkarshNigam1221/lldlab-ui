import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DescriptionList, Table } from '../index';

const COLUMNS = [
  { key: 'name', header: 'Participant', mono: true },
  { key: 'role', header: 'Role' },
  { key: 'count', header: 'Count', align: 'end' as const, width: 'min' as const },
];

describe('Table', () => {
  it('renders a semantic table in a focusable, named scroll region', () => {
    render(<Table caption="Participants" columns={COLUMNS} rows={[{ name: 'Context', role: 'Holds a strategy', count: 1 }, { name: 'Strategy', role: 'Interface', count: 3 }]} rowKey={(r) => String(r.name)} />);
    const region = screen.getByRole('region', { name: 'Participants' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveClass('overflow-x-auto');
    const table = within(region).getByRole('table', { name: 'Participants' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Participant', 'Role', 'Count']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Context')).toHaveClass('font-code-inline');
    expect(screen.getByText('3')).toHaveClass('text-end');
    expect(screen.getByText('Participants', { selector: 'caption' })).toHaveClass('sr-only');
  });
  it('shows an empty row spanning every column', () => {
    render(<Table caption="Empty" columns={COLUMNS} rows={[]} empty="No participants" />);
    const cell = screen.getByText('No participants');
    expect(cell).toHaveAttribute('colspan', '3');
  });
});

describe('DescriptionList', () => {
  it('pairs terms and details', () => {
    render(<DescriptionList items={[{ term: 'Category', detail: 'Behavioral' }, { term: 'AKA', detail: 'Policy' }]} layout="inline" />);
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Category', 'AKA']);
    expect(screen.getAllByRole('definition').map((d) => d.textContent)).toEqual(['Behavioral', 'Policy']);
    expect(screen.getByText('Category').parentElement).toHaveClass('sm:contents');
  });
});
