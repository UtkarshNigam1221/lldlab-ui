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

import { IconButton } from './components/IconButton';
import { Kbd } from './components/Kbd';
import { Select } from './components/Select';
import { Stat } from './components/Stat';
import { TextField } from './components/TextField';
import { Avatar } from './ide/Avatar';
import { MetricTile } from './ide/MetricTile';

describe('inputs and tiles (0.3.0)', () => {
  it('TextField filled and raised variants drop the border; ms and lg sizes; trailing icon', () => {
    const { rerender } = render(<TextField label="Search" variant="filled" size="ms" icon="search" />);
    const box = () => screen.getByLabelText('Search').parentElement!;
    expect(box()).toHaveClass('h-9', 'bg-surface-subtle');
    expect(box().className).not.toMatch(/\bborder\b/);
    rerender(<TextField label="Search" variant="raised" size="lg" icon="mail" iconPosition="end" />);
    expect(box()).toHaveClass('h-11', 'bg-surface-elevated', 'shadow-sm');
    expect(box().lastElementChild).toHaveTextContent('mail');
  });
  it('Select raised lg', () => {
    render(<Select label="Difficulty" variant="raised" size="lg" options={[{ value: 'a', label: 'A' }]} />);
    expect(screen.getByLabelText('Difficulty')).toHaveClass('h-11', 'bg-surface-elevated', 'shadow-sm');
  });
  it('Kbd raised', () => {
    render(<Kbd variant="raised">⌘K</Kbd>);
    expect(screen.getByText('⌘K')).toHaveClass('bg-surface-elevated', 'shadow-sm');
  });
  it('IconButton ms is 36px; Avatar ms/ml are 32/40px', () => {
    render(
      <>
        <IconButton icon="notifications" label="Notifications" size="ms" variant="subtle" />
        <Avatar name="Ada Lovelace" size="ms" />
        <Avatar name="Grace Hopper" size="ml" />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Notifications' })).toHaveClass('size-9');
    expect(screen.getByText('AL').closest('.size-8')).not.toBeNull();
    expect(screen.getByText('GH').closest('.size-10')).not.toBeNull();
  });
  it('MetricTile has no border; centered variant puts the label under the value', () => {
    const { container, rerender } = render(<MetricTile label="Architects" value="7" />);
    expect(container.firstElementChild!.className).not.toMatch(/\bborder\b/);
    rerender(<MetricTile label="Problems" value="7" variant="centered" tone="brand" />);
    const tile = container.firstElementChild!;
    expect(tile).toHaveClass('text-center');
    expect(tile.firstElementChild).toHaveTextContent('7');
  });
  it('Stat tile variant with a coloured icon', () => {
    const { container } = render(<Stat variant="tile" icon="layers" iconTone="brand" label="Total" value={7} />);
    expect(container.firstElementChild).toHaveClass('bg-surface-subtle', 'shadow-sm');
    expect(container.querySelector('.text-brand-cobalt')).not.toBeNull();
  });
});

describe('TextField width (0.3.0)', () => {
  it('lg fills the row up to 36rem', () => {
    const { container } = render(<TextField label="Search" hideLabel width="lg" />);
    expect(container.firstElementChild).toHaveClass('w-full', 'max-w-xl');
  });
  it('can take a fixed width', () => {
    const { container } = render(<TextField label="Search" hideLabel width="md" />);
    expect(container.firstElementChild).toHaveClass('w-80');
  });
});

describe('Tabs item title (0.3.0)', () => {
  it('passes a tooltip title to disabled nav items', () => {
    render(<Tabs label="Main" variant="nav" value="" items={[{ id: 'x', label: 'Playground', href: '/x', disabled: true, title: 'Coming soon' }]} />);
    expect(screen.getByText('Playground').closest('[aria-disabled="true"]')).toHaveAttribute('title', 'Coming soon');
  });
});

import { Show } from './primitives/Show';

describe('2xl breakpoint (0.3.0)', () => {
  it('Show above/below 2xl', () => {
    const { container } = render(<Show above="2xl">x</Show>);
    expect(container.firstElementChild).toHaveClass('hidden', '2xl:contents');
  });
  it('Tabs items can hide below a breakpoint', () => {
    render(<Tabs label="Main" variant="nav" value="" items={[{ id: 'x', label: 'Playground', href: '/x', hideBelow: '2xl' }]} />);
    expect(screen.getByRole('link', { name: 'Playground' }).closest('li')).toHaveClass('hidden', '2xl:flex');
  });
});

import { UmlClass } from './ide/UmlClass';

describe('UmlClass tinted (0.3.0)', () => {
  it('renders a borderless card with a tinted title block and cobalt methods', () => {
    const { container } = render(
      <UmlClass variant="tinted" headerTone="info" stereotype="implements" name="PercentOff" attributes={['- percent: number']} methods={['+ apply(total): number']} />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('shadow-sm');
    expect(root.className).not.toMatch(/\bborder\b/);
    expect(screen.getByText('PercentOff')).toHaveClass('font-headline-sm');
    expect(screen.getByText('PercentOff').parentElement).toHaveClass('bg-badge-intermediate-bg');
    expect(screen.getByText('+ apply(total): number')).toHaveClass('text-fg-brand');
  });
  it('strong header puts the tag at the end of the title row; members can use two columns', () => {
    render(<UmlClass variant="tinted" headerTone="strong" name="Checkout" tag={<span>Strategy Pattern</span>} columns={2} attributes={['- a', '- b']} />);
    expect(screen.getByText('Checkout').parentElement).toHaveClass('justify-between', 'bg-surface-container-high');
    expect(screen.getByText('- a').parentElement).toHaveClass('grid-cols-2');
  });
});

import { CodeBlock } from './primitives/CodeBlock';

describe('CodeBlock bare (0.3.0)', () => {
  it('drops the caption bar, the frame and the padding', () => {
    const { container } = render(<CodeBlock language="ts" bare>{'const a = 1;'}</CodeBlock>);
    expect(container.querySelector('figcaption')).toBeNull();
    const fig = container.firstElementChild!;
    expect(fig.className).not.toMatch(/rounded-xl/);
    expect(container.querySelector('pre')).toHaveClass('p-0');
  });
});

import { Heading } from './primitives/Heading';

describe('Heading and Button sizing (0.3.0)', () => {
  it('Heading can opt out of balanced wrapping and use leading-none', () => {
    render(<Heading level={1} size="display" balance={false} leading="none">Hero</Heading>);
    const h = screen.getByRole('heading', { name: 'Hero' });
    expect(h).toHaveClass('leading-none');
    expect(h.className).not.toMatch(/text-balance/);
  });
  it('Button ms is padding-sized (24px sides, 8px top and bottom)', () => {
    render(<Button size="ms">Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveClass('px-space-lg', 'py-space-sm');
  });
});

import { Box } from './primitives/Box';

describe('Box container tone (0.3.0)', () => {
  it('uses the cobalt-tinted container surface', () => {
    const { container } = render(<Box tone="container">x</Box>);
    expect(container.firstElementChild).toHaveClass('bg-surface-container');
  });
});

import { SectionHeader } from './components/SectionHeader';

describe('SectionHeader (0.3.0)', () => {
  it('can drop the rule, use a 12px dot and keep meta in sentence case', () => {
    const { container } = render(<SectionHeader title="Beginner" dot="success" meta="3 problems listed" divider={false} metaUppercase={false} />);
    const root = container.firstElementChild!;
    expect(root.className).not.toMatch(/border-b/);
    expect(root.querySelector('.size-3')).not.toBeNull();
    expect(screen.getByText('3 problems listed').className).not.toMatch(/uppercase/);
  });
});

import { SegmentedControl } from './components/SegmentedControl';
import { ResultRow } from './components/ResultRow';
import { Countdown } from './ide/Countdown';
import { StatusBar } from './ide/StatusBar';

describe('workspace pieces (0.3.0)', () => {
  it('SegmentedControl label variant: mono, no track border, cobalt checked', () => {
    const { container } = render(<SegmentedControl variant="label" label="Language" value="ts" onChange={() => {}} options={[{ value: 'ts', label: 'TypeScript' }, { value: 'go', label: 'Go' }]} />);
    expect(container.firstElementChild!.className).not.toMatch(/\bborder\b/);
    expect(screen.getByRole('radio', { name: 'TypeScript' })).toHaveClass('font-label-mono', 'text-brand-cobalt');
  });
  it('Countdown chip: tinted chip with a brand timer icon and mono digits', () => {
    render(<Countdown direction="up" variant="chip" />);
    const t = screen.getByRole('timer');
    expect(t).toHaveClass('bg-surface-subtle', 'font-label-mono');
    expect(t.firstElementChild).toHaveClass('text-fg-brand');
  });
  it('StatusBar raised: container fill, no rule', () => {
    render(<StatusBar tone="raised" start="solution.ts" />);
    const bar = screen.getByRole('contentinfo');
    expect(bar).toHaveClass('bg-surface-container', 'h-9');
    expect(bar.className).not.toMatch(/border-t/);
  });
  it('ResultRow boxed rows have no border and centre their content', () => {
    const { container } = render(<ResultRow status="pass" title="adds" variant="boxed" />);
    expect(container.firstElementChild).toHaveClass('items-center', 'bg-surface-subtle');
    expect(container.firstElementChild!.className).not.toMatch(/\bborder\b/);
  });
});

import { Checkbox } from './components/Checkbox';

describe('Checkbox sm (0.3.0)', () => {
  it('uses body-sm text for compact lists', () => {
    render(<Checkbox label="Inspect the UML" size="sm" />);
    expect(screen.getByText('Inspect the UML')).toHaveClass('text-body-sm');
  });
});

import { EmptyState } from './components/EmptyState';

describe('EmptyState heading level (0.3.0)', () => {
  it('renders the title at the requested level', () => {
    render(<EmptyState code="404" title="Problem not found" headingLevel={1} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Problem not found' })).toBeInTheDocument();
  });
  it('defaults to h3', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Nothing here' })).toBeInTheDocument();
  });
});
