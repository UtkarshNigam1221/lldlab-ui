import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster, useToast } from '../index';
import { toastStore } from './Toast';

function Trigger() {
  const { show } = useToast();
  return <button type="button" onClick={() => show({ title: 'Saved', description: 'Solution stored', tone: 'success' })}>save</button>;
}

beforeEach(() => {
  toastStore.clear();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('Toaster', () => {
  it('announces toasts in a polite live region and auto-dismisses', () => {
    render(<><Toaster /><Trigger /></>);
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.querySelector('[aria-live="polite"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'save' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Saved').closest('li')).toHaveClass('border-l-brand-emerald');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText('Saved')).toBeNull();
  });
  it('pauses while hovered and can be dismissed', () => {
    render(<Toaster />);
    act(() => void toastStore.show({ title: 'Hold', duration: 1000 }));
    const item = screen.getByText('Hold').closest('li')!;
    fireEvent.mouseEnter(item);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('Hold')).toBeInTheDocument();
    fireEvent.mouseLeave(item);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Hold')).toBeNull();
  });
  it('shows toasts queued before mount', () => {
    act(() => void toastStore.show({ title: 'Early' }));
    render(<Toaster />);
    expect(screen.getByText('Early')).toBeInTheDocument();
  });
  it('never auto-dismisses Infinity', () => {
    render(<Toaster />);
    act(() => void toastStore.show({ title: 'Sticky', duration: Infinity }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('Sticky')).toBeInTheDocument();
  });
});
