import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Box, Card, Section, Show } from '../index';

describe('Show', () => {
  it('uses display: contents at the visible breakpoints only', () => {
    render(<><Show above="md" data-testid="a">desktop</Show><Show below="lg" data-testid="b">mobile</Show></>);
    expect(screen.getByTestId('a')).toHaveClass('hidden', 'md:contents');
    expect(screen.getByTestId('b')).toHaveClass('contents', 'lg:hidden');
  });
});

describe('inverse surfaces scope dark tokens', () => {
  it('Card, Box and Section with tone="inverse" set data-theme="dark"', () => {
    const { container } = render(<><Card tone="inverse">c</Card><Box tone="inverse">b</Box><Section tone="inverse">s</Section><Card>plain</Card></>);
    const [card, box, section, plain] = [...container.children];
    expect(card).toHaveAttribute('data-theme', 'dark');
    expect(box).toHaveAttribute('data-theme', 'dark');
    expect(section).toHaveAttribute('data-theme', 'dark');
    expect(plain).not.toHaveAttribute('data-theme');
  });
});
