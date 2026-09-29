import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider, Icon, IconTile, TextLink } from '../index';

function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return <a data-fake="1" {...props} />;
}

describe('TextLink', () => {
  it('is a brand link with hover underline and focus ring by default', () => {
    render(<TextLink href="/docs" iconRight="arrow_forward">Blueprint</TextLink>);
    const a = screen.getByRole('link', { name: 'Blueprint' });
    expect(a).toHaveAttribute('href', '/docs');
    expect(a).toHaveClass('text-fg-brand', 'hover:underline', 'focus-visible:outline-2', 'wrap-break-word');
    expect(screen.getByText('arrow_forward')).toHaveAttribute('aria-hidden', 'true');
  });
  it('supports as, tone, size and underline', () => {
    render(<TextLink as={FakeLink} href="/x" tone="muted" size="sm" underline="always">Forgot password?</TextLink>);
    const a = screen.getByRole('link', { name: 'Forgot password?' });
    expect(a).toHaveAttribute('data-fake', '1');
    expect(a).toHaveClass('text-on-surface-variant', 'text-body-sm', 'underline');
  });
});

describe('Divider', () => {
  it('is a horizontal separator by default', () => {
    render(<Divider spacing="md" />);
    const d = screen.getByRole('separator');
    expect(d).toHaveAttribute('aria-orientation', 'horizontal');
    expect(d).toHaveClass('h-px', 'my-space-md');
  });
  it('can be vertical', () => {
    render(<Divider orientation="vertical" spacing="sm" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByRole('separator')).toHaveClass('w-px', 'mx-space-sm');
  });
  it('renders a centred label between two rules', () => {
    render(<Divider label="or" />);
    expect(screen.getByRole('separator')).toHaveTextContent('or');
  });
});

describe('IconTile', () => {
  it('is decorative, with tone, size and shape classes', () => {
    const { container } = render(<IconTile icon="bolt" tone="brand" size="lg" shape="circle" />);
    const tile = container.firstElementChild!;
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(tile).toHaveClass('size-12', 'rounded-full', 'bg-badge-intermediate-bg', 'text-badge-intermediate-text');
  });
  it('filled tones invert, and a label makes it an image', () => {
    render(<IconTile icon="check" tone="success" filled label="Accepted" size="xl" />);
    const tile = screen.getByRole('img', { name: 'Accepted' });
    expect(tile).toHaveClass('size-14', 'bg-badge-beginner-text', 'text-badge-beginner-bg');
  });
});

describe('Icon xl', () => {
  it('has a 32px size', () => {
    render(<Icon name="lock" size="xl" label="Locked" />);
    expect(screen.getByRole('img', { name: 'Locked' })).toHaveClass('text-[32px]');
  });
});
