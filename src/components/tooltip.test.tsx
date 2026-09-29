import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Theme, Tooltip } from '../index';

describe('Tooltip', () => {
  it('shows on hover, describes the trigger, and hides on leave', async () => {
    render(<Tooltip content="Reset zoom" delay={0}><button type="button">R</button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'R' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await userEvent.hover(trigger);
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Reset zoom');
    expect(trigger).toHaveAccessibleDescription('Reset zoom');
    await userEvent.unhover(trigger);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('shows on focus and hides on Escape and blur', async () => {
    render(<Tooltip content="Copy" delay={0}><button type="button">C</button></Tooltip>);
    await userEvent.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it("keeps the trigger's own handlers and ref, and inherits the theme", async () => {
    const onMouseEnter = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Theme tone="dark">
        <Tooltip content="tip" delay={0}>
          <button type="button" ref={ref} onMouseEnter={onMouseEnter}>T</button>
        </Tooltip>
      </Theme>,
    );
    await userEvent.hover(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalled();
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-theme', 'dark');
  });
  it('waits for the delay before showing', () => {
    vi.useFakeTimers();
    render(<Tooltip content="late" delay={400}><button type="button">L</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
    vi.advanceTimersByTime(400);
    vi.useRealTimers();
  });
});
