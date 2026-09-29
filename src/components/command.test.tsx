import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, type CommandGroup } from '../index';

function Harness({ onSelect = vi.fn(), onClose = vi.fn() }) {
  const [q, setQ] = useState('');
  const all: CommandGroup[] = [
    { label: 'Problems', items: [{ id: 'p1', label: 'Parking lot', icon: 'local_parking', onSelect }, { id: 'p2', label: 'Elevator', onSelect }] },
    { label: 'Patterns', items: [{ id: 'x1', label: 'Strategy', meta: 'Behavioral', onSelect }] },
  ];
  const groups = all.map((g) => ({ ...g, items: g.items.filter((i) => String(i.label).toLowerCase().includes(q.toLowerCase())) })).filter((g) => g.items.length);
  return <CommandPalette open onClose={onClose} query={q} onQueryChange={setQ} groups={groups} />;
}

describe('CommandPalette', () => {
  it('is a dialog with a focused combobox controlling a grouped listbox', () => {
    render(<Harness />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(screen.getAllByRole('group').map((g) => g.getAttribute('aria-labelledby'))).toHaveLength(2);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0].id);
  });
  it('arrows move the active option (wrapping) and Enter selects and closes', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<Harness onSelect={onSelect} onClose={onClose} />);
    const input = screen.getByRole('combobox');
    await userEvent.keyboard('{ArrowUp}');
    const options = screen.getAllByRole('option');
    expect(input).toHaveAttribute('aria-activedescendant', options[2].id);
    expect(options[2]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('typing reports the query, results update, and an empty result shows the empty text', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByRole('combobox'), 'strat');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['StrategyBehavioral']);
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.queryByRole('option')).toBeNull();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
