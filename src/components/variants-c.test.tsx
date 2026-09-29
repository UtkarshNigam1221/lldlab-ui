import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button, FileTree, Menu, SegmentedControl, Tabs } from '../index';

describe('Menu variants', () => {
  function setup() {
    render(
      <Menu
        label="Account"
        header={<p>Alex Lin</p>}
        footer={<p>Session #38291</p>}
        items={[
          { label: 'Submissions', meta: '28' },
          { type: 'separator' },
          { label: 'Settings', shortcut: '⌘,' },
          { type: 'separator' },
          { label: 'Sign out', tone: 'danger' },
        ]}
        trigger={(p) => <Button {...p}>Account</Button>}
      />,
    );
    return screen.getByRole('button', { name: 'Account' });
  }
  it('renders header, footer, separators, meta and shortcuts outside the menuitem role tree', async () => {
    await userEvent.click(setup());
    expect(screen.getByText('Alex Lin').closest('[role=menu]')).toBeNull();
    expect(screen.getByText('Session #38291')).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(2);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('⌘,').tagName).toBe('KBD');
  });
  it('skips separators with the keyboard', async () => {
    const trigger = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Submissions/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Submissions/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
  });
});

describe('Tabs badge, SegmentedControl hideLabel/dot', () => {
  it('Tabs renders a badge node', () => {
    render(<Tabs label="Panel" value="t" items={[{ id: 't', label: 'Test Results', badge: <span>6/8 Passing</span> }]} />);
    expect(screen.getByRole('tab', { name: /Test Results/ })).toHaveTextContent('6/8 Passing');
  });
  it('icon-only options keep an accessible name; dots render', () => {
    const { container } = render(
      <SegmentedControl
        label="View"
        value="grid"
        onChange={() => {}}
        options={[
          { value: 'grid', label: 'Grid view', icon: 'grid_view', hideLabel: true },
          { value: 'go', label: 'Go', dot: 'success' },
        ]}
      />,
    );
    const grid = screen.getByRole('radio', { name: 'Grid view' });
    expect(grid).not.toHaveTextContent('Grid view');
    expect(grid).toHaveClass('max-md:min-w-11');
    expect(container.querySelector('.bg-brand-emerald')).not.toBeNull();
  });
});

describe('FileTree node variants', () => {
  it('uses a custom icon, a named status icon and meta', () => {
    render(
      <FileTree
        label="Files"
        onOpen={() => {}}
        nodes={[
          { path: 'parking_test.go', kind: 'file', status: 'success', meta: '42 lines' },
          { path: 'README.md', kind: 'file', icon: 'info' },
        ]}
      />,
    );
    expect(screen.getByRole('treeitem', { name: /parking_test\.go Passing/ })).toBeInTheDocument();
    expect(screen.getByText('42 lines')).toBeInTheDocument();
    expect(screen.getByText('info')).toBeInTheDocument();
  });
});
