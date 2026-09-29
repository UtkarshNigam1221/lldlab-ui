import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Menu, type MenuItem } from '../index';

function setup(onSelect = vi.fn()) {
  const items: MenuItem[] = [
    { label: 'Profile', icon: 'person', onSelect },
    { label: 'Settings', icon: 'settings', onSelect },
    { label: 'Sign out', icon: 'logout', tone: 'danger', onSelect },
  ];
  render(
    <>
      <Menu label="Account" items={items} trigger={(p) => <Button {...p} variant="ghost">Account</Button>} />
      <p>outside</p>
    </>,
  );
  return { onSelect, trigger: screen.getByRole('button', { name: 'Account' }) };
}

describe('Menu', () => {
  it('wires the trigger and toggles on click', async () => {
    const { trigger } = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    await userEvent.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('ArrowDown opens with the first item focused; arrows, Home, End move', async () => {
    const { trigger } = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
  });
  it('ArrowUp opens with the last item focused', async () => {
    const { trigger } = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
  });
  it('Escape closes and refocuses the trigger', async () => {
    const { trigger } = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });
  it('selecting an item calls onSelect, closes and refocuses the trigger', async () => {
    const { trigger, onSelect } = setup();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });
  it('closes on outside mousedown and on Tab', async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).toBeNull();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.tab();
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('danger items use the danger tone', async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveClass('text-fg-danger');
  });
});
