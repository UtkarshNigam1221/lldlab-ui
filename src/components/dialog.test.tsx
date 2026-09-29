import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, Theme } from '../index';

function Harness({ onClose = () => {}, removeOpener = false }: { onClose?: () => void; removeOpener?: boolean }) {
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  return (
    <>
      {!(removeOpener && open) && <button type="button" onClick={() => setOpen(true)}>Open</button>}
      <Dialog
        open={open}
        title="Sign in"
        description="Save your progress"
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        footer={<button type="button" onClick={() => setTick((t) => t + 1)}>Rerender {tick}</button>}
      >
        <input aria-label="Email" />
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('renders nothing when closed', () => {
    render(<Dialog open={false} onClose={() => {}} title="x" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('is a labelled, described modal that focuses the first field and locks scroll', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog', { name: 'Sign in' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Save your progress');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('traps Tab inside the dialog', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.tab(); // footer button
    await userEvent.tab(); // close button (last in DOM order)
    await userEvent.tab(); // wraps to first
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });
  it('closes on Escape, restores scroll and returns focus to the opener', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(opener).toHaveFocus();
  });
  it('closes on backdrop mousedown but not on content mousedown', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.mouseDown(screen.getByRole('textbox', { name: 'Email' }));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('keeps focus when the parent re-renders with a new inline onClose', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const rerender = screen.getByRole('button', { name: /Rerender/ });
    rerender.focus();
    await userEvent.click(rerender);
    expect(screen.getByRole('button', { name: 'Rerender 1' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('falls back to body when the opener was removed', async () => {
    render(<Harness removeOpener />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');
    expect(document.body).toHaveFocus();
  });
  it("inherits the opener's theme", async () => {
    render(<Theme tone="dark"><Harness /></Theme>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog').parentElement).toHaveAttribute('data-theme', 'dark');
  });
});
