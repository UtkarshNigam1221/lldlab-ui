import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Box, Card, Container, Stack } from '../index';

describe('height props', () => {
  it('Box and Stack fill their parent or take the remaining space', () => {
    render(
      <>
        <Box data-testid="fill" fill />
        <Box data-testid="grow" grow />
        <Stack data-testid="stack-fill" fill />
        <Stack data-testid="stack-grow" grow />
      </>,
    );
    expect(screen.getByTestId('fill')).toHaveClass('h-full', 'min-h-0');
    expect(screen.getByTestId('grow')).toHaveClass('flex-1', 'min-h-0');
    expect(screen.getByTestId('stack-fill')).toHaveClass('h-full', 'min-h-0');
    expect(screen.getByTestId('stack-grow')).toHaveClass('flex-1', 'min-h-0');
  });

  it('Box takes a fixed height from the scale', () => {
    render(<Box data-testid="b" height="lg" />);
    expect(screen.getByTestId('b')).toHaveClass('h-[32rem]');
  });

  it('Card fills its parent', () => {
    render(<Card data-testid="c" fill>x</Card>);
    expect(screen.getByTestId('c')).toHaveClass('h-full');
  });

  it('Container can span the full width', () => {
    render(<Container data-testid="full" size="full" />);
    expect(screen.getByTestId('full')).toHaveClass('max-w-none');
    expect(screen.getByTestId('full')).not.toHaveClass('max-w-7xl');
  });
});
