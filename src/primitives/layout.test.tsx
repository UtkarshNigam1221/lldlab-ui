import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Box, Container, Grid, Section, Split, Stack, Theme } from '../index';

describe('Theme', () => {
  it('sets data-theme for the scope', () => {
    render(<Theme tone="dark" data-testid="t">x</Theme>);
    expect(screen.getByTestId('t')).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('t')).toHaveClass('bg-surface', 'text-on-surface');
  });
});

describe('Box', () => {
  it('maps tone, padding, radius, border and shadow to token classes', () => {
    render(<Box data-testid="b" tone="inverse" padding={{ base: 'sm', md: 'lg' }} radius="lg" border="subtle" shadow="md">x</Box>);
    expect(screen.getByTestId('b')).toHaveClass('min-w-0', 'bg-brand-obsidian', 'p-space-sm', 'md:p-space-lg', 'rounded-xl', 'border-border-subtle', 'shadow-md');
  });
  it('renders the as element', () => {
    render(<Box as="article" data-testid="b">x</Box>);
    expect(screen.getByTestId('b').tagName).toBe('ARTICLE');
  });
});

describe('Stack', () => {
  it('defaults to a column with md gap', () => {
    render(<Stack data-testid="s">x</Stack>);
    expect(screen.getByTestId('s')).toHaveClass('flex', 'flex-col', 'gap-space-md');
  });
  it('maps responsive direction, gap, align, justify and wrap', () => {
    render(
      <Stack data-testid="s" direction={{ base: 'column', md: 'row' }} gap={{ base: 'sm', lg: 'xl' }} align="center" justify="between" wrap>
        x
      </Stack>,
    );
    expect(screen.getByTestId('s')).toHaveClass('flex-col', 'md:flex-row', 'gap-space-sm', 'lg:gap-space-xl', 'items-center', 'justify-between', 'flex-wrap');
  });
});

describe('Grid', () => {
  it('collapses a scalar cols to one column below md', () => {
    render(<Grid data-testid="g" cols={3}>x</Grid>);
    expect(screen.getByTestId('g')).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-space-md');
  });
  it('adds base: 1 to a breakpoint object', () => {
    render(<Grid data-testid="g" cols={{ md: 2, xl: 4 }}>x</Grid>);
    expect(screen.getByTestId('g')).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-4');
  });
});

describe('Container and Section', () => {
  it('Container uses fluid gutters and the size max width', () => {
    render(<Container data-testid="c">x</Container>);
    expect(screen.getByTestId('c')).toHaveClass('mx-auto', 'w-full', 'max-w-7xl', 'px-gutter-fluid');
  });
  it('Section renders a section with fluid padding, tone and pattern', () => {
    render(<Section data-testid="s" tone="subtle" padding="xl" pattern="dots">x</Section>);
    const s = screen.getByTestId('s');
    expect(s.tagName).toBe('SECTION');
    expect(s).toHaveClass('py-section-xl', 'bg-surface-subtle', 'bg-pattern-dots');
  });
});

describe('Split', () => {
  it('stacks below xl and splits 8/4 from xl', () => {
    render(<Split aside={<p>side</p>} sticky>main</Split>);
    const aside = screen.getByText('side').closest('aside')!;
    expect(aside).toHaveClass('xl:col-span-4', 'xl:sticky');
    expect(screen.getByText('main')).toHaveClass('xl:col-span-8');
    expect(aside.parentElement).toHaveClass('grid', 'grid-cols-1', 'xl:grid-cols-12', 'gap-space-lg');
  });
});
