import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarGroup, Badge, Button, Chip, IconButton } from '../index';

function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return <a {...props} />;
}

describe('Button variants', () => {
  it('brand is cobalt and accent is crimson (non-destructive)', () => {
    render(<><Button variant="brand">Submit</Button><Button variant="accent">Start</Button></>);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass('bg-brand-cobalt', 'text-white');
    expect(screen.getByRole('button', { name: 'Start' })).toHaveClass('bg-brand-crimson-hover', 'text-white');
  });
  it('renders a leading node instead of the icon, and toned or filled icons', () => {
    render(<><Button leading={<svg data-testid="g" />} icon="login">Google</Button><Button icon="star" iconTone="warning" iconFilled>4.8k</Button></>);
    expect(screen.getByTestId('g')).toBeInTheDocument();
    expect(screen.queryByText('login')).toBeNull();
    expect(screen.getByText('star')).toHaveClass('text-fg-warning', 'icon-filled');
  });
});

describe('IconButton variants', () => {
  it('renders as a link through as, without a type attribute', () => {
    render(<IconButton as={FakeLink} href="/me" icon="person" label="Profile" />);
    const a = screen.getByRole('link', { name: 'Profile' });
    expect(a).toHaveAttribute('href', '/me');
    expect(a).not.toHaveAttribute('type');
  });
  it('secondary, xs, dot and badge', () => {
    render(<><IconButton icon="share" label="Share" variant="secondary" size="xs" /><IconButton icon="notifications" label="Notifications, 3 unread" dot="danger" badge="3" /></>);
    expect(screen.getByRole('button', { name: 'Share' })).toHaveClass('border', 'size-6', 'max-md:min-w-11');
    const bell = screen.getByRole('button', { name: 'Notifications, 3 unread' });
    expect(bell.querySelector('.bg-brand-crimson')).not.toBeNull();
    expect(bell).toHaveTextContent('3');
  });
});

describe('Badge and Chip variants', () => {
  it('Badge shows an icon and a pulsing dot', () => {
    const { container } = render(<Badge tone="success" icon="bolt" dot="success" pulse>Runtime Ready</Badge>);
    expect(screen.getByText('bolt')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });
  it('Chip supports status tones, token dots and CSS-colour dots', () => {
    const { container } = render(<><Chip tone="danger" dot="danger">Advanced</Chip><Chip dot="#00ADD8">Go 1.22</Chip></>);
    expect(screen.getByText('Advanced').parentElement).toHaveClass('text-fg-danger');
    expect(container.querySelector('.bg-brand-crimson')).not.toBeNull();
    const custom = [...container.querySelectorAll('span[aria-hidden="true"]')].find((s) => (s as HTMLElement).style.backgroundColor);
    expect((custom as HTMLElement).style.backgroundColor).toBe('rgb(0, 173, 216)');
  });
});

describe('Avatar variants and AvatarGroup', () => {
  it('status dot, status label, square shape and tone', () => {
    const { container } = render(<Avatar name="Alex Lin" status="success" statusLabel="online" shape="square" tone="brand" />);
    const img = screen.getByRole('img', { name: 'Alex Lin, online' });
    expect(img).toHaveClass('rounded-lg', 'bg-brand-cobalt');
    expect(container.querySelector('.bg-brand-emerald')).not.toBeNull();
  });
  it('resets the failed image state when src changes', () => {
    const { rerender } = render(<Avatar name="Grace" src="/a.png" />);
    fireEvent.error(screen.getByRole('img', { name: 'Grace' }));
    expect(screen.getByRole('img', { name: 'Grace' }).tagName).toBe('SPAN');
    rerender(<Avatar name="Grace" src="/b.png" />);
    expect(screen.getByRole('img', { name: 'Grace' }).tagName).toBe('IMG');
  });
  it('AvatarGroup overlaps avatars and collapses the rest into +N', () => {
    render(
      <AvatarGroup label="Solvers" max={2}>
        <Avatar name="A B" /><Avatar name="C D" /><Avatar name="E F" /><Avatar name="G H" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Solvers' })).toHaveClass('-space-x-2');
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
