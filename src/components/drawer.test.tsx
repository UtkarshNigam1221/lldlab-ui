import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer, Theme } from '../index';

function Harness({ side = 'left' as 'left' | 'right', onClose = () => {} }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Menu</button>
      <Drawer open={open} side={side} title="Navigation" onClose={() => { onClose(); setOpen(false); }}>
        <a href="#problems">Problems</a>
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  it('is a modal dialog named by its title, on the requested side', async () => {
    render(<Harness side="right" />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const panel = screen.getByRole('dialog', { name: 'Navigation' });
    expect(panel).toHaveAttribute('aria-modal', 'true');
    expect(panel).toHaveClass('right-0');
    expect(screen.getByRole('link', { name: 'Problems' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('closes on Escape and backdrop, restoring focus', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(opener).toHaveFocus();
    await userEvent.click(opener);
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it('inherits the theme of its React scope', () => {
    render(
      <Theme tone="dark">
        <Drawer open onClose={() => {}} title="Nav">x</Drawer>
      </Theme>,
    );
    expect(screen.getByRole('dialog').parentElement).toHaveAttribute('data-theme', 'dark');
  });
});
