import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from '../index';
import { formatClock } from './Countdown';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-29T10:00:00Z'));
});
afterEach(() => vi.useRealTimers());

describe('formatClock', () => {
  it('formats minutes and hours', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(65)).toBe('01:05');
    expect(formatClock(3725)).toBe('1:02:05');
  });
});

describe('Countdown', () => {
  it('counts down each second, warns and fires onExpire exactly once at zero', () => {
    const onExpire = vi.fn();
    render(<Countdown seconds={3} warnAt={2} onExpire={onExpire} />);
    const timer = screen.getByRole('timer', { name: 'Time remaining' });
    expect(timer).toHaveTextContent('00:03');
    expect(timer).not.toHaveClass('text-fg-danger');
    act(() => vi.advanceTimersByTime(1000));
    expect(timer).toHaveTextContent('00:02');
    expect(timer).toHaveClass('text-fg-danger');
    act(() => vi.advanceTimersByTime(5000));
    expect(timer).toHaveTextContent('00:00');
    expect(onExpire).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('uses until, and a past until expires immediately', () => {
    const onExpire = vi.fn();
    render(<Countdown until={new Date('2026-09-29T09:59:00Z')} onExpire={onExpire} />);
    expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    expect(onExpire).toHaveBeenCalledOnce();
  });
  it('counts up from seconds and never expires', () => {
    const onExpire = vi.fn();
    render(<Countdown direction="up" seconds={58} onExpire={onExpire} label="Elapsed" />);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole('timer', { name: 'Elapsed' })).toHaveTextContent('01:01');
    expect(onExpire).not.toHaveBeenCalled();
  });
  it('does not fire after unmount and leaves no interval', () => {
    const onExpire = vi.fn();
    const { unmount } = render(<Countdown seconds={2} onExpire={onExpire} />);
    unmount();
    act(() => vi.advanceTimersByTime(5000));
    expect(onExpire).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
