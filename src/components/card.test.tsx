import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../index';

function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return <a data-fake="1" {...props} />;
}

describe('Card', () => {
  it('puts media first, body padded, footer last regardless of JSX order', () => {
    const { container } = render(
      <Card padding="md">
        <Card.Footer>foot</Card.Footer>
        <p>body</p>
        <Card.Media pattern="grid" aspect="square">media</Card.Media>
      </Card>,
    );
    const root = container.firstElementChild!;
    const kids = [...root.children];
    expect(kids.map((k) => k.textContent)).toEqual(['media', 'body', 'foot']);
    expect(kids[0]).toHaveClass('bg-pattern-grid', 'aspect-square');
    expect(kids[1]).toHaveClass('p-space-md');
    expect(kids[2]).toHaveClass('bg-surface-subtle');
  });
  it('supports interactive link cards through as', () => {
    render(<Card as={FakeLink} href="/p/x" interactive>Go</Card>);
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/p/x');
    expect(link).toHaveAttribute('data-fake', '1');
    expect(link).toHaveClass('hover:shadow-md', 'focus-visible:outline-2');
  });
  it('inverse tone uses the obsidian surface and marks the tone for the footer', () => {
    const { container } = render(<Card tone="inverse">x</Card>);
    expect(container.firstElementChild).toHaveClass('bg-brand-obsidian', 'text-on-primary');
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'inverse');
  });
});
