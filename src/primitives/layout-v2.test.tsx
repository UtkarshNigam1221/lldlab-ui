import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppBar, Box, EmptyState, Eyebrow, Heading, SectionHeader, Split, Text } from '../index';

describe('Heading and Text variants', () => {
  it('Heading success tone, truncate and centre alignment', () => {
    render(<Heading level={1} tone="success" truncate align="center">Accepted</Heading>);
    expect(screen.getByRole('heading', { name: 'Accepted' })).toHaveClass('text-fg-success', 'truncate', 'text-center');
  });
  it('Text align, measure, inherit variant and a non-uppercase label', () => {
    render(
      <>
        <Text align="center" measure>lead</Text>
        <Text as="span" variant="inherit" tone="brand">word</Text>
        <Text variant="label" uppercase={false}>Mono</Text>
      </>,
    );
    expect(screen.getByText('lead')).toHaveClass('text-center', 'max-w-prose');
    expect(screen.getByText('word')).not.toHaveClass('text-body-md');
    expect(screen.getByText('word')).toHaveClass('text-fg-brand');
    expect(screen.getByText('Mono')).toHaveClass('font-label-mono');
    expect(screen.getByText('Mono')).not.toHaveClass('uppercase');
  });
});

describe('Eyebrow, SectionHeader, EmptyState, Box variants', () => {
  it('Eyebrow plain with a pulsing dot', () => {
    const { container } = render(<Eyebrow variant="plain" pulse>Live</Eyebrow>);
    expect(container.firstElementChild).not.toHaveClass('border');
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });
  it('SectionHeader description, icon, accent, tag tone and size', () => {
    const { container } = render(<SectionHeader title="Creational" icon="category" accent="warning" tag="4 patterns" tagTone="warning" size="md" description="Object creation" />);
    expect(container.firstElementChild).toHaveClass('border-b-2', 'border-b-brand-amber');
    expect(screen.getByRole('heading', { name: 'Creational' })).toHaveClass('text-headline-md');
    expect(screen.getByText('4 patterns').parentElement).toHaveClass('bg-badge-amber-bg');
    expect(screen.getByText('Object creation')).toBeInTheDocument();
    expect(screen.getByText('category')).toBeInTheDocument();
  });
  it('EmptyState code numeral, media and danger tone', () => {
    render(<><EmptyState code="404" title="Problem not found" /><EmptyState tone="danger" title="Failed" description="500" media={<svg data-testid="art" />} /></>);
    expect(screen.getByText('404')).toHaveClass('font-label-mono');
    expect(screen.getByTestId('art')).toBeInTheDocument();
    expect(screen.getByText('500')).toHaveClass('text-fg-danger');
  });
  it('Box dimmed is inert', () => {
    render(<Box dimmed data-testid="b"><button type="button">x</button></Box>);
    expect(screen.getByTestId('b')).toHaveClass('opacity-40');
    expect(screen.getByTestId('b')).toHaveAttribute('inert');
  });
});

describe('Split start rail and sticky offset', () => {
  it('renders three columns from lg with the start rail hidden below lg', () => {
    render(<Split start={<nav>toc</nav>} aside={<p>facts</p>} sticky stickyOffset="appbar">main</Split>);
    const start = screen.getByText('toc').parentElement!;
    expect(start).toHaveClass('hidden', 'lg:block', 'lg:col-span-3', 'lg:sticky');
    expect(screen.getByText('main')).toHaveClass('lg:col-span-9', 'xl:col-span-7');
    expect(screen.getByText('facts').closest('aside')).toHaveClass('xl:col-span-3', 'xl:top-[calc(var(--spacing-appbar)+1rem)]');
    expect(start.parentElement).toHaveClass('lg:grid-cols-12');
  });
});

describe('AppBar', () => {
  it('is a sticky, blurred header with start/center/end slots', () => {
    render(<AppBar start={<span>logo</span>} center={<span>search</span>} end={<span>me</span>} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'backdrop-blur-md', 'z-40');
    expect(header.firstElementChild).toHaveClass('h-16', 'max-w-7xl');
    expect(header).toHaveTextContent('logosearchme');
  });
  it('fixed, small, opaque and full width', () => {
    render(<AppBar position="fixed" height="sm" blur={false} contained={false} start="x" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'bg-surface-elevated');
    expect(header.firstElementChild).toHaveClass('h-12');
    expect(header.firstElementChild).not.toHaveClass('max-w-7xl');
  });
});
