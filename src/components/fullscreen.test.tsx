import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FullScreen } from '../index';

function Harness({ onClose = () => {} }) {
  const [open, setOpen] = useState(false);
  const exit = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Expand</button>
      <FullScreen open={open} label="Workspace" initialFocusRef={exit} onClose={() => { onClose(); setOpen(false); }}>
        <a href="#a">First</a>
        <button type="button" ref={exit}>Exit</button>
      </FullScreen>
    </>
  );
}

describe('FullScreen', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('is a modal over the whole viewport, focusing the requested element and locking page scroll', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    const panel = screen.getByRole('dialog', { name: 'Workspace' });
    expect(panel).toHaveAttribute('aria-modal', 'true');
    expect(panel).toHaveClass('fixed', 'inset-0');
    expect(screen.getByRole('button', { name: 'Exit' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes on Escape, restores focus and page scroll, and leaves keys other widgets handled', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole('button', { name: 'Expand' });
    await userEvent.click(opener);
    const handled = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    handled.preventDefault();
    document.dispatchEvent(handled);
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps Tab inside', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand' }));
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();
  });
});
