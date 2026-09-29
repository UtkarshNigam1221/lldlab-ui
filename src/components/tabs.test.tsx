import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl, Tabs, type TabItem } from '../index';

const ITEMS: TabItem[] = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'solved', label: 'Solved', dot: 'success' },
  { id: 'todo', label: 'Todo' },
];

function ControlledTabs({ onChange }: { onChange?: (id: string) => void }) {
  const [v, setV] = useState('all');
  return <Tabs label="Filter" items={ITEMS} value={v} onChange={(id) => { setV(id); onChange?.(id); }} />;
}

describe('Tabs (tablist)', () => {
  it('marks the selected tab and makes only it tabbable', () => {
    render(<Tabs label="Filter" items={ITEMS} value="solved" />);
    expect(screen.getByRole('tablist', { name: 'Filter' })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
  });
  it('moves focus and selection with arrows, Home and End', async () => {
    const onChange = vi.fn();
    render(<ControlledTabs onChange={onChange} />);
    const [first] = screen.getAllByRole('tab');
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Solved' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Solved' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Todo' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /All/ })).toHaveFocus();
    expect(onChange.mock.calls.map((c) => c[0])).toEqual(['solved', 'todo', 'all']);
  });
  it('selects on click and shows counts', async () => {
    const onChange = vi.fn();
    render(<Tabs label="Filter" items={ITEMS} value="all" onChange={onChange} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Todo' }));
    expect(onChange).toHaveBeenCalledWith('todo');
  });
  it('pills variant styles the active tab', () => {
    render(<Tabs label="Filter" items={ITEMS} value="all" variant="pills" />);
    expect(screen.getByRole('tab', { name: /All/ })).toHaveClass('bg-surface-elevated', 'shadow-sm');
  });
  it('renders nothing for no items', () => {
    const { container } = render(<Tabs label="Filter" items={[]} value="x" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Tabs (links)', () => {
  it('renders nav links with aria-current on the active one, through as', () => {
    function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
      return <a data-fake="1" {...props} />;
    }
    render(
      <Tabs
        label="Sections"
        value="problems"
        items={[
          { id: 'home', label: 'Home', href: '/', as: FakeLink },
          { id: 'problems', label: 'Problems', href: '/problems', as: FakeLink },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).toBeNull();
    const active = screen.getByRole('link', { name: 'Problems' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(active).toHaveAttribute('data-fake', '1');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});

describe('SegmentedControl', () => {
  const OPTIONS = [
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' },
    { value: 'go', label: 'Go' },
  ];
  function Controlled() {
    const [v, setV] = useState('ts');
    return <SegmentedControl label="Language" options={OPTIONS} value={v} onChange={setV} />;
  }
  it('is a named radio group with the checked option tabbable', () => {
    render(<SegmentedControl label="Language" options={OPTIONS} value="py" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false']);
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
  });
  it('makes the first option tabbable when nothing is checked', () => {
    render(<SegmentedControl label="Language" options={OPTIONS} value="rust" onChange={() => {}} />);
    expect(screen.getAllByRole('radio').map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  });
  it('arrows move focus and select, wrapping', async () => {
    render(<Controlled />);
    screen.getByRole('radio', { name: 'TypeScript' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Go' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Go' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'TypeScript' })).toHaveAttribute('aria-checked', 'true');
  });
});
