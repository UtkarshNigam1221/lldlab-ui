import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, IconButton, Kbd, Select, TextField } from '../index';

function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return <a {...props} />;
}

describe('Button', () => {
  it('is a type=button with variant and size classes and a touch target', () => {
    render(<Button variant="secondary" size="sm" icon="play_arrow">Run</Button>);
    const b = screen.getByRole('button', { name: /Run/ });
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveClass('bg-surface-elevated', 'text-ink', 'h-8', 'max-md:min-h-11', 'whitespace-nowrap');
    expect(screen.getByText('play_arrow')).toHaveAttribute('aria-hidden', 'true');
  });
  it('keeps an explicit submit type and forwards refs', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button type="submit" ref={ref}>Save</Button>);
    expect(ref.current).toHaveAttribute('type', 'submit');
  });
  it('renders through as without a type attribute', () => {
    render(<Button as={FakeLink} href="/problems" variant="ghost">Browse</Button>);
    const a = screen.getByRole('link', { name: 'Browse' });
    expect(a).toHaveAttribute('href', '/problems');
    expect(a).not.toHaveAttribute('type');
  });
  it('loading disables, marks busy, shows a spinner and blocks clicks', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Submit</Button>);
    const b = screen.getByRole('button', { name: /Submit/ });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('progress_activity')).toHaveClass('animate-spin');
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });
  it('fullWidth and danger variant', () => {
    render(<Button variant="danger" fullWidth>Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('w-full', 'bg-danger', 'text-white');
  });
  it('a disabled link gets aria-disabled', () => {
    render(<Button as={FakeLink} href="/x" disabled>Nope</Button>);
    expect(screen.getByRole('link', { name: 'Nope' })).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('IconButton', () => {
  it('is named by its label and has an icon-sized touch target', () => {
    render(<IconButton icon="close" label="Close" />);
    const b = screen.getByRole('button', { name: 'Close' });
    expect(b).toHaveAttribute('title', 'Close');
    expect(b).toHaveClass('size-10', 'max-md:min-w-11', 'max-md:min-h-11');
  });
});

describe('Kbd', () => {
  it('renders a kbd element', () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });
});

describe('TextField', () => {
  it('labels the input, shows a hint and links the error', async () => {
    render(<TextField label="Search" hideLabel icon="search" hint={<Kbd>⌘K</Kbd>} error="Too short" placeholder="Find" />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(screen.getByText('Search')).toHaveClass('sr-only');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Too short');
    await userEvent.type(input, 'abc');
    expect(input).toHaveValue('abc');
  });
  it('respects a caller id', () => {
    render(<TextField label="Email" id="email" type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  });
});

describe('Select', () => {
  it('renders a labelled native select with options', async () => {
    const onChange = vi.fn();
    render(<Select label="Language" options={[{ value: 'go', label: 'Go' }, { value: 'py', label: 'Python' }]} defaultValue="go" onChange={onChange} />);
    const select = screen.getByRole('combobox', { name: 'Language' });
    await userEvent.selectOptions(select, 'py');
    expect(select).toHaveValue('py');
    expect(onChange).toHaveBeenCalled();
  });
});
