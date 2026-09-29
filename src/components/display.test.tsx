import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Badge, Callout, CheckList, Chip, EmptyState, Message, ProgressBar, ResultRow, SectionHeader, Stat } from '../index';

describe('Badge', () => {
  it('maps tone, size and uppercase', () => {
    render(<Badge tone="success" size="md" uppercase>Beginner</Badge>);
    expect(screen.getByText('Beginner')).toHaveClass('bg-badge-beginner-bg', 'text-badge-beginner-text', 'px-space-sm', 'uppercase', 'whitespace-nowrap');
  });
});

describe('Chip', () => {
  it('renders a remove button named after the chip', async () => {
    const onRemove = vi.fn();
    render(<Chip icon="category" onRemove={onRemove}>Creational</Chip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Creational' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
  it('has no button without onRemove', () => {
    render(<Chip>Creational</Chip>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat icon="bolt" label="Solved" value="12" />);
    expect(screen.getByText('Solved')).toBeInTheDocument();
    expect(screen.getByText('12')).toHaveClass('text-ink');
  });
});

describe('ProgressBar', () => {
  it('exposes a named progressbar with clamped values', () => {
    render(<ProgressBar label="Creational" value={150} max={100} tone="success" />);
    const bar = screen.getByRole('progressbar', { name: 'Creational' });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar.firstElementChild).toHaveClass('bg-brand-emerald');
    expect(bar.firstElementChild).toHaveStyle({ width: '100%' });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
  it('treats negative values and max 0 as 0%', () => {
    render(<ProgressBar label="Empty" value={-5} max={0} />);
    expect(screen.getByRole('progressbar', { name: 'Empty' })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
  it('can hide the visible label but keep the name', () => {
    render(<ProgressBar label="Hidden" value={20} hideLabel />);
    expect(screen.getByRole('progressbar', { name: 'Hidden' })).toBeInTheDocument();
    expect(screen.getByText('Hidden').parentElement).toHaveClass('sr-only');
  });
});

describe('SectionHeader', () => {
  it('renders a heading with tag and meta', () => {
    render(<SectionHeader title="Tier 1" dot="success" tag="Core" meta="4 Problems Listed" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Tier 1' })).toBeInTheDocument();
    expect(screen.getByText('Core')).toHaveClass('uppercase');
    expect(screen.getByText('4 Problems Listed')).toBeInTheDocument();
  });
});

describe('Callout and Message', () => {
  it('danger callout is an alert with tone classes and an action', () => {
    render(<Callout tone="danger" title="Timed out" action={<button type="button">Retry</button>}>Loop ran too long</Callout>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-badge-advanced-bg', 'text-badge-advanced-text');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
  it('info callout is a status', () => {
    render(<Callout>Heads up</Callout>);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
  });
  it('Message uses status by default and alert for danger', () => {
    render(<><Message>Loading…</Message><Message tone="danger">Failed</Message></>);
    expect(screen.getByRole('status')).toHaveClass('text-on-surface-variant');
    expect(screen.getByRole('alert')).toHaveClass('text-fg-danger');
  });
});

describe('ResultRow', () => {
  it('names the status icon and shows detail and meta', () => {
    render(<ResultRow status="fail" title="parks a car" detail="expected 1, got 0" meta="3ms" />);
    expect(screen.getByRole('img', { name: 'Failed' })).toHaveClass('text-fg-danger');
    expect(screen.getByText('expected 1, got 0')).toHaveClass('whitespace-pre-wrap');
    expect(screen.getByText('3ms')).toBeInTheDocument();
  });
});

describe('EmptyState and CheckList', () => {
  it('EmptyState renders title, description and action', () => {
    render(<EmptyState title="No problems" description="Try another filter" action={<button type="button">Reset</button>} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No problems' })).toBeInTheDocument();
    expect(screen.getByText('Try another filter')).toBeInTheDocument();
  });
  it('CheckList renders one item per entry with a check icon', () => {
    render(<CheckList items={['One', 'Two']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByText('check')).toHaveLength(2);
  });
});
