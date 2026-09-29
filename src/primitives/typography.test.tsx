import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Code, CodeBlock, Dot, Eyebrow, Heading, Icon, Text } from '../index';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="check" />);
    const el = container.querySelector('span')!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('material-symbols-outlined', 'text-[20px]');
    expect(el).toHaveTextContent('check');
  });
  it('is an image with a name when labelled, and supports filled, spin and tone', () => {
    render(<Icon name="check_circle" label="Passed" filled spin tone="success" size="lg" />);
    const el = screen.getByRole('img', { name: 'Passed' });
    expect(el).toHaveClass('icon-filled', 'animate-spin', 'text-fg-success', 'text-[24px]');
  });
});

describe('Dot', () => {
  it('maps tone, size and pulse', () => {
    const { container } = render(<Dot tone="success" size="md" pulse />);
    expect(container.firstChild).toHaveClass('rounded-full', 'bg-brand-emerald', 'size-2', 'animate-pulse');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Text', () => {
  it('defaults to a body-md paragraph', () => {
    render(<Text>hello</Text>);
    const el = screen.getByText('hello');
    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('font-body-md', 'text-body-md', 'text-on-surface');
  });
  it('maps variant, tone, weight, truncate and clamp', () => {
    render(<Text as="span" variant="label" tone="danger" weight="semibold" clamp={2}>x</Text>);
    const el = screen.getByText('x');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('font-label-mono', 'uppercase', 'text-fg-danger', 'font-semibold', 'line-clamp-2');
  });
});

describe('Heading', () => {
  it('uses the level for the element and default size', () => {
    render(<Heading level={2}>Title</Heading>);
    const el = screen.getByRole('heading', { level: 2, name: 'Title' });
    expect(el).toHaveClass('font-display', 'text-headline-lg', 'text-ink');
  });
  it('accepts a responsive size', () => {
    render(<Heading level={1} size={{ base: 'lg', md: 'display' }}>Hero</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-headline-lg', 'md:text-display');
  });
});

describe('Eyebrow, Code, CodeBlock', () => {
  it('Eyebrow is a mono uppercase pill with a dot', () => {
    const { container } = render(<Eyebrow tone="success">New</Eyebrow>);
    expect(container.firstChild).toHaveClass('rounded-full', 'font-label-mono', 'uppercase');
    expect(container.querySelector('.bg-brand-emerald')).not.toBeNull();
  });
  it('Code renders inline code', () => {
    render(<Code>x = 1</Code>);
    expect(screen.getByText('x = 1').tagName).toBe('CODE');
  });
  it('CodeBlock scrolls inside a focusable pre and labels the language', () => {
    render(<CodeBlock language="go">{'func main() {}'}</CodeBlock>);
    const pre = screen.getByText('func main() {}').closest('pre')!;
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).toHaveClass('overflow-x-auto');
    expect(screen.getByText('go')).toBeInTheDocument();
  });
});
