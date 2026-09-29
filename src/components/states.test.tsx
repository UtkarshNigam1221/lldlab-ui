import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton, TerminalOutput, VerdictBanner } from '../index';

describe('Skeleton', () => {
  it('is hidden from assistive tech and uses the shimmer utility', () => {
    const { container } = render(<Skeleton shape="pill" width="1/3" />);
    const s = container.firstElementChild!;
    expect(s).toHaveAttribute('aria-hidden', 'true');
    expect(s).toHaveClass('skeleton-shimmer', 'rounded-full', 'w-1/3', 'h-8');
  });
  it('renders n lines with a shorter last line; circles ignore width', () => {
    const { container } = render(<><Skeleton lines={3} data-testid="lines" /><Skeleton shape="circle" height="lg" data-testid="c" /></>);
    const lines = screen.getByTestId('lines').children;
    expect(lines).toHaveLength(3);
    expect(lines[2]).toHaveClass('w-3/4');
    expect(screen.getByTestId('c')).toHaveClass('aspect-square', 'h-8');
    expect(container.querySelectorAll('.skeleton-shimmer')).toHaveLength(4);
  });
});

describe('TerminalOutput', () => {
  it('is a focusable log with toned lines and a $ prompt for commands', () => {
    render(
      <TerminalOutput
        title="Terminal"
        status={<span>BUILD BROKEN</span>}
        lines={[
          { kind: 'command', text: 'go build ./...' },
          { kind: 'error', text: 'undefined: SpotFactory' },
          { kind: 'hint', text: 'did you mean spotFactory?' },
        ]}
      />,
    );
    const log = screen.getByRole('log', { name: 'Terminal' });
    expect(log).toHaveAttribute('tabindex', '0');
    expect(log).toHaveClass('max-h-72', 'overflow-auto');
    expect(screen.getByText('go build ./...').parentElement).toHaveTextContent('$ go build ./...');
    expect(screen.getByText('undefined: SpotFactory').parentElement).toHaveClass('border-l-2', 'text-red-300');
    expect(screen.getByText('BUILD BROKEN')).toBeInTheDocument();
  });
});

describe('VerdictBanner', () => {
  it('shows a large toned title, a filled icon tile, meta items and actions', () => {
    render(<VerdictBanner tone="success" icon="check" title="Accepted" badge={<span>8/8</span>} meta={['41ms', 'attempt #3']} actions={<button type="button">Next</button>} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Accepted' })).toHaveClass('text-fg-success', 'text-headline-xl');
    expect(screen.getAllByRole('listitem').map((l) => l.textContent)).toEqual(['41ms', 'attempt #3']);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('check').parentElement).toHaveClass('rounded-full', 'size-14');
  });
});
