import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, Overlay, Switch, TextField } from '../index';

describe('Checkbox', () => {
  it('is a labelled native checkbox with a description', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Read the intent" description="Section 1" onChange={onChange} strikeWhenChecked />);
    const box = screen.getByRole('checkbox', { name: 'Read the intent' });
    expect(box).toHaveAccessibleDescription('Section 1');
    await userEvent.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.getByText('Read the intent')).toHaveClass('group-has-checked:line-through');
  });
  it('supports indeterminate', () => {
    render(<Checkbox label="Some" indeterminate />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
  });
});

describe('Switch', () => {
  it('is a named switch that reports the next state', async () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch label="Race detector" checked={on} onChange={setOn} description="Slower runs" />;
    }
    render(<Controlled />);
    const sw = screen.getByRole('switch', { name: 'Race detector' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveAccessibleDescription('Slower runs');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(sw).toHaveClass('bg-brand-cobalt');
  });
});

describe('Overlay', () => {
  it('makes covered content inert and hidden, and shows the overlay', () => {
    render(<Overlay overlay={<p>Sign in to solve</p>}><button type="button">Run</button></Overlay>);
    expect(screen.queryByRole('button', { name: 'Run' })).toBeNull();
    expect(screen.getByText('Sign in to solve')).toBeInTheDocument();
    expect(screen.getByText('Run').closest('[inert]')).not.toBeNull();
  });
});

describe('TextField variants', () => {
  it('shows labelEnd next to the label and toggles password visibility', async () => {
    render(<TextField label="Password" type="password" revealable labelEnd={<a href="#forgot">Forgot password?</a>} />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });
  it('has a compact size', () => {
    render(<TextField label="Name" size="sm" />);
    expect(screen.getByLabelText('Name').parentElement).toHaveClass('h-8');
  });
});
