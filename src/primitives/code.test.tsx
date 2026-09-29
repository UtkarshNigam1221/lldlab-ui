import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock, CopyButton } from '../index';
import { resolveLanguage, tokenClass } from '../internal/highlight';

describe('highlight helpers', () => {
  it('resolves aliases, including the locally defined java and bash grammars', () => {
    expect(resolveLanguage('ts')).toBe('typescript');
    expect(resolveLanguage('Go')).toBe('go');
    expect(resolveLanguage('java')).toBe('java');
    expect(resolveLanguage('sh')).toBe('bash');
    expect(resolveLanguage('cobol')).toBeUndefined();
  });
  it('maps the most specific known token type to a class', () => {
    expect(tokenClass(['keyword'])).toBe('text-code-keyword');
    expect(tokenClass(['string', 'template-string'])).toBe('text-code-string');
    expect(tokenClass(['plain'])).toBe('');
  });
});

describe('CodeBlock highlighting', () => {
  it.each([
    ['go', 'func main() { return 42 }', 'func', 'text-code-keyword'],
    ['ts', 'const x: number = 1;', 'const', 'text-code-keyword'],
    ['python', 'def f():\n    return "hi"', '"hi"', 'text-code-string'],
    ['java', 'public class Lot { }', 'public', 'text-code-keyword'],
    ['bash', 'echo "$HOME" # comment', '# comment', 'text-code-comment'],
  ])('%s: colours %s', (language, code, token, cls) => {
    render(<CodeBlock language={language} highlight>{code}</CodeBlock>);
    expect(screen.getByText(token)).toHaveClass(cls);
  });
  it('falls back to plain text for unknown languages and non-string children', () => {
    render(<><CodeBlock language="cobol" highlight>{'MOVE A TO B'}</CodeBlock><CodeBlock highlight language="go"><b>node</b></CodeBlock></>);
    expect(screen.getByText('MOVE A TO B')).toBeInTheDocument();
    expect(screen.getByText('node').tagName).toBe('B');
  });
  it('renders line numbers, a header with title/meta/actions, and a subtle tone', () => {
    const { container } = render(
      <CodeBlock language="ts" title="strategy.ts" meta={<span>BRITTLE</span>} actions={<button type="button">Copy</button>} lineNumbers tone="subtle">
        {'a\nb'}
      </CodeBlock>,
    );
    expect(screen.getByText('strategy.ts')).toBeInTheDocument();
    expect(screen.getByText('BRITTLE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByText('2')).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveClass('code-subtle', 'bg-code-bg-subtle');
  });
});

describe('CopyButton', () => {
  afterEach(() => vi.useRealTimers());
  it('copies, confirms, and reverts after 2s', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // Fake timers from the start, so the component's 2s reset timer is controllable.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    // After setup: user-event installs its own clipboard stub.
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CopyButton value="snippet" />);
    await user.click(screen.getByRole('button', { name: /Copy/ }));
    expect(writeText).toHaveBeenCalledWith('snippet');
    expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument();
  });
  it('reports failure without throwing', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true });
    render(<CopyButton value="x" />);
    await userEvent.click(screen.getByRole('button', { name: /Copy/ }));
    expect(await screen.findByRole('button', { name: /Copy failed/ })).toBeInTheDocument();
  });
});
