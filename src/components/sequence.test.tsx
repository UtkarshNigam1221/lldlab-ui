import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Disclosure, Timeline } from '../index';

describe('Timeline', () => {
  it('is an ordered list with a spoken status for each item and aria-current on the current step', () => {
    render(
      <Timeline
        label="Learning track"
        items={[
          { id: '1', status: 'done', title: 'Parking lot' },
          { id: '2', status: 'current', title: 'Elevator', description: 'Next up' },
          { id: '3', status: 'locked', title: 'Rate limiter', meta: 'Unlocks after #2' },
        ]}
      />,
    );
    const list = screen.getByRole('list', { name: 'Learning track' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Completed: Parking lot');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).toHaveTextContent('Locked: Rate limiter');
    expect(screen.getByText('Unlocks after #2')).toBeInTheDocument();
  });
});

describe('Disclosure', () => {
  it('toggles an expandable region (uncontrolled)', async () => {
    render(<Disclosure summary="parks 100 cars concurrently">telemetry</Disclosure>);
    const button = screen.getByRole('button', { name: /parks 100 cars/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('telemetry')).not.toBeVisible();
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: /parks 100 cars/ })).toHaveTextContent('telemetry');
  });
  it('controlled mode reports changes without toggling itself; selected row style', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(<Disclosure summary="row" open={false} onOpenChange={onOpenChange} variant="row" selected>body</Disclosure>);
    await userEvent.click(screen.getByRole('button', { name: /row/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: /row/ })).toHaveAttribute('aria-expanded', 'false');
    expect(container.firstElementChild).toHaveClass('border-l-brand-cobalt');
  });
  it('can start open', () => {
    render(<Disclosure summary="s" defaultOpen>shown</Disclosure>);
    expect(screen.getByText('shown')).toBeVisible();
  });
});
