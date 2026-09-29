import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './components/Card';

// 0.3.0: Stitch fidelity pass. Surfaces separate by shadow, not borders.
describe('Card (0.3.0)', () => {
  it('has a soft shadow and no border by default', () => {
    const { container } = render(<Card>x</Card>);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('shadow-sm');
    expect(root.className).not.toMatch(/\bborder\b/);
  });
  it('supports outlined, shadow and body gap', () => {
    const { container } = render(
      <Card outlined shadow="xl" gap="md">
        x
      </Card>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('border', 'border-border-subtle', 'shadow-xl');
    expect(root.firstElementChild).toHaveClass('gap-space-md');
  });
  it('header and footer bars are tinted with no rule unless divider is set', () => {
    render(
      <Card>
        <Card.Header tone="slate" density="sm">
          head
        </Card.Header>
        body
        <Card.Footer divider>foot</Card.Footer>
      </Card>,
    );
    const head = screen.getByText('head').parentElement!;
    expect(head).toHaveClass('bg-brand-slate', 'px-space-md');
    expect(head.className).not.toMatch(/border-b/);
    expect(screen.getByText('foot')).toHaveClass('border-t', 'bg-surface-subtle');
  });
});

import { AppBar } from './primitives/AppBar';
import { Eyebrow } from './primitives/Eyebrow';
import { Grid, GridItem } from './primitives/Grid';
import { Section } from './primitives/Section';
import { Split } from './primitives/Split';
import { Text } from './primitives/Text';

describe('layout primitives (0.3.0)', () => {
  it('AppBar floats on a shadow by default and can keep the hairline', () => {
    const { container, rerender } = render(<AppBar start="a" />);
    expect(container.firstElementChild).toHaveClass('shadow-appbar');
    expect(container.firstElementChild!.className).not.toMatch(/border-b/);
    rerender(<AppBar start="a" divider="border" />);
    expect(container.firstElementChild).toHaveClass('border-b');
  });
  it('Section takes fixed top/bottom padding and the brand dot field', () => {
    const { container } = render(<Section paddingTop="xl" paddingBottom="2xl" pattern="dots-brand" />);
    expect(container.firstElementChild).toHaveClass('pt-space-xl', 'pb-space-2xl', 'bg-pattern-dots-brand');
    expect(container.firstElementChild!.className).not.toMatch(/py-section/);
  });
  it('Split supports 7/5 from lg', () => {
    const { container } = render(<Split ratio="7/5" breakpoint="lg" aside="side">main</Split>);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('lg:grid-cols-12');
    expect(root.children[0]).toHaveClass('lg:col-span-7');
    expect(root.children[1]).toHaveClass('lg:col-span-5');
  });
  it('GridItem spans columns responsively', () => {
    render(
      <Grid cols={{ base: 1, lg: 5 }}>
        <GridItem span={{ lg: 2 }}>brand</GridItem>
      </Grid>,
    );
    expect(screen.getByText('brand')).toHaveClass('lg:col-span-2');
  });
  it('Eyebrow text takes its tone colour; tinted and raised variants; dot optional', () => {
    const { container, rerender } = render(<Eyebrow>Lab</Eyebrow>);
    expect(container.firstElementChild).toHaveClass('text-fg-brand', 'shadow-sm', 'bg-surface-elevated');
    rerender(<Eyebrow variant="tinted" dot={false}>Lab</Eyebrow>);
    expect(container.firstElementChild).toHaveClass('bg-surface-container');
    expect(container.querySelector('[data-dot]')).toBeNull();
  });
  it('Text wavy underline', () => {
    render(<Text underline="wavy">Real-World</Text>);
    expect(screen.getByText('Real-World')).toHaveClass('decoration-wavy');
  });
});

import { Badge } from './components/Badge';
import { Button } from './components/Button';
import { Dot } from './components/Dot';
import { Tabs } from './components/Tabs';

describe('controls (0.3.0)', () => {
  it('Tabs nav: icon, count pill, active tint, and disabled "soon" items that are not links', () => {
    render(
      <Tabs
        label="Main"
        variant="nav"
        value="p"
        items={[
          { id: 'p', label: 'Problems', href: '/p', icon: 'code_blocks', count: 7, countTone: 'info' },
          { id: 'x', label: 'Playground', href: '/x', icon: 'schema', disabled: true, badge: 'Soon' },
        ]}
      />,
    );
    const active = screen.getByRole('link', { name: /Problems/ });
    expect(active).toHaveClass('bg-surface-container/60', 'text-brand-cobalt');
    expect(active).toHaveTextContent('code_blocks');
    expect(screen.getByText('7').parentElement).toHaveClass('rounded-full', 'bg-badge-intermediate-bg');
    expect(screen.queryByRole('link', { name: /Playground/ })).toBeNull();
    expect(screen.getByText('Playground').closest('[aria-disabled="true"]')).not.toBeNull();
  });
  it('Tabs solid: active ink fill, dot before the label', () => {
    render(<Tabs label="Tier" variant="solid" value="a" onChange={() => {}} items={[{ id: 'a', label: 'All' }, { id: 'b', label: 'Beginner', dot: 'success' }]} />);
    expect(screen.getByRole('tab', { name: 'All' })).toHaveClass('bg-ink', 'text-on-ink');
    const b = screen.getByRole('tab', { name: 'Beginner' });
    expect(b).toHaveClass('bg-surface-subtle');
    expect(b.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
  it('Tabs label: mono uppercase with cobalt active underline and no list rule', () => {
    const { container } = render(<Tabs label="Ws" variant="label" value="a" onChange={() => {}} items={[{ id: 'a', label: 'Spec' }]} />);
    expect(screen.getByRole('tab')).toHaveClass('font-label-mono', 'uppercase', 'border-brand-cobalt');
    expect(container.firstElementChild!.className).not.toMatch(/border-b\b/);
  });
  it('Button xs, raised and slate', () => {
    render(
      <>
        <Button size="xs">A</Button>
        <Button variant="raised">B</Button>
        <Button variant="slate">C</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('px-space-md', 'py-space-xs');
    expect(screen.getByRole('button', { name: 'B' })).toHaveClass('bg-surface-elevated', 'shadow-sm');
    expect(screen.getByRole('button', { name: 'B' }).className).not.toMatch(/\bborder\b/);
    expect(screen.getByRole('button', { name: 'C' })).toHaveClass('bg-brand-slate');
  });
  it('Badge pill, outlined, xs, subtle; uppercase keeps the token tracking', () => {
    render(
      <>
        <Badge shape="pill">pill</Badge>
        <Badge outlined tone="success">out</Badge>
        <Badge size="xs" tone="subtle">xs</Badge>
        <Badge uppercase>up</Badge>
      </>,
    );
    expect(screen.getByText('pill').parentElement).toHaveClass('rounded-full');
    expect(screen.getByText('out').parentElement).toHaveClass('border', 'border-current/25');
    expect(screen.getByText('xs').parentElement).toHaveClass('text-[10px]', 'bg-surface-subtle');
    expect(screen.getByText('up').parentElement!.className).not.toMatch(/tracking-wider/);
  });
  it('Dot lg is 12px', () => {
    const { container } = render(<Dot size="lg" tone="success" />);
    expect(container.firstElementChild).toHaveClass('size-3');
  });
});
