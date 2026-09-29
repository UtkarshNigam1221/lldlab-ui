import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, Breadcrumbs, EditorTabs, MetricTile, StatusBar } from '../index';

describe('Breadcrumbs', () => {
  it('links earlier items, marks the last current and collapses the middle on mobile', () => {
    render(<Breadcrumbs items={[{ label: 'Problems', href: '/problems' }, { label: 'Creational', href: '/p/c' }, { label: 'Singleton' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Problems' })).toHaveAttribute('href', '/problems');
    expect(screen.getByText('Singleton')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Creational' }).closest('li')).toHaveClass('max-md:hidden');
    expect(screen.getByText('…').closest('li')).toHaveClass('md:hidden');
  });
  it('has no ellipsis for two items', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Here' }]} />);
    expect(screen.queryByText('…')).toBeNull();
  });
});

describe('StatusBar', () => {
  it('renders start and end items with tones', () => {
    render(<StatusBar start={<StatusBar.Item icon="check" tone="success">Ready</StatusBar.Item>} end={<StatusBar.Item>Go 1.25</StatusBar.Item>} />);
    expect(screen.getByRole('contentinfo', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByText('Ready').closest('span')).toHaveClass('text-fg-success');
    expect(screen.getByText('Go 1.25')).toBeInTheDocument();
  });
});

describe('MetricTile', () => {
  it('shows label and toned value', () => {
    render(<MetricTile label="Passed" value="8/10" tone="success" />);
    expect(screen.getByText('8/10')).toHaveClass('text-fg-success');
  });
});

describe('Avatar', () => {
  it('shows initials with an accessible name when there is no src', () => {
    render(<Avatar name="Ada Lovelace" badge="42" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
    expect(screen.getByText('42')).toBeInTheDocument();
  });
  it('falls back to initials when the image fails', () => {
    render(<Avatar name="Grace" src="/broken.png" />);
    fireEvent.error(screen.getByRole('img', { name: 'Grace' }));
    expect(screen.getByRole('img', { name: 'Grace' })).toHaveTextContent('G');
  });
});

describe('EditorTabs', () => {
  const TABS = [
    { id: 'a', label: 'Main.ts', modified: true },
    { id: 'b', label: 'types.ts', readOnly: true },
  ];
  it('marks the active tab and shows modified and read-only state', () => {
    render(<EditorTabs tabs={TABS} activeId="a" onSelect={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Open files' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Main\.ts/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('(modified)')).toHaveClass('sr-only');
    expect(screen.getByRole('img', { name: 'Read-only' })).toBeInTheDocument();
  });
  it('selects, closes via button and middle-click', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<EditorTabs tabs={TABS} activeId="a" onSelect={onSelect} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /^Read-only types\.ts$/ }));
    expect(onSelect).toHaveBeenCalledWith('b');
    await userEvent.click(screen.getByRole('button', { name: 'Close Main.ts' }));
    expect(onClose).toHaveBeenCalledWith('a');
    fireEvent(screen.getByRole('button', { name: /^Read-only types\.ts$/ }), new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(onClose).toHaveBeenCalledWith('b');
  });
  it('renders nothing for no tabs', () => {
    const { container } = render(<EditorTabs tabs={[]} activeId="" onSelect={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
