import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout, Card, CheckList, MetricTile, ProgressBar, ResultRow } from '../index';

describe('Card variants', () => {
  it('orders header, media, body, footer and supports subtle tone with a pattern', () => {
    const { container } = render(
      <Card tone="subtle" pattern="dots">
        <Card.Footer>foot</Card.Footer>
        <p>body</p>
        <Card.Header start="Test Suite" end="3 PASS" />
        <Card.Media caption="UML SCHEMA" height="md">m</Card.Media>
      </Card>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('bg-surface-subtle', 'bg-pattern-dots');
    expect([...root.children].map((c) => c.textContent)).toEqual(['Test Suite3 PASS', 'UML SCHEMAm', 'body', 'foot']);
    expect(root.children[1]).toHaveClass('h-35');
    expect(screen.getByText('UML SCHEMA')).toHaveClass('absolute');
  });
});

describe('Callout variants', () => {
  it('live={false} drops the live role; size sm and accent', () => {
    const { container } = render(<Callout tone="danger" live={false} size="sm" accent icon="close" title="Cons">x</Callout>);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.firstElementChild).toHaveClass('p-space-sm', 'border-l-4');
    expect(screen.getByText('close')).toBeInTheDocument();
  });
});

describe('ResultRow variants', () => {
  it('warning status, badge, boxed, selected and mono title', () => {
    const { container } = render(<ResultRow status="warning" title="refactor_candidate" titleMono badge={<span>SRP</span>} variant="boxed" selected />);
    expect(screen.getByRole('img', { name: 'Warning' })).toHaveClass('text-fg-warning');
    expect(screen.getByText('SRP')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('border-l-brand-cobalt', 'bg-surface-subtle');
    expect(screen.getByText('refactor_candidate')).toHaveClass('font-code-inline');
  });
});

describe('CheckList, MetricTile, ProgressBar variants', () => {
  it('CheckList uses the given icon and tone', () => {
    render(<CheckList icon="close" tone="danger" items={['More classes']} />);
    expect(screen.getByText('close')).toHaveClass('text-fg-danger');
  });
  it('MetricTile brand tone and hint', () => {
    render(<MetricTile label="Latency" value="41ms" tone="brand" hint="Beats 82.4%" hintTone="success" />);
    expect(screen.getByText('41ms')).toHaveClass('text-fg-brand');
    expect(screen.getByText('Beats 82.4%')).toHaveClass('text-fg-success');
  });
  it('ProgressBar accepts node labels, a value label, a caption and a small size', () => {
    render(<ProgressBar label={<b>Mastery</b>} valueLabel="7 of 12" caption="5 remaining" value={7} max={12} size="sm" />);
    const bar = screen.getByRole('progressbar', { name: 'Mastery' });
    expect(bar).toHaveClass('h-1');
    expect(screen.getByText('7 of 12')).toBeInTheDocument();
    expect(screen.queryByText('58%')).toBeNull();
    expect(screen.getByText('5 remaining')).toBeInTheDocument();
  });
});
