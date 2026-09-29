import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox, Dialog, Drawer, Switch, TextLink, Toaster, UmlDiagram } from './index';
import { toastStore } from './components/Toast';
import { diffLines } from './internal/diff';

describe('nested modals', () => {
  function Nested({ onDrawer = () => {}, onDialog = () => {} }) {
    return (
      <Drawer open title="Nav" onClose={onDrawer}>
        <button type="button">drawer-btn</button>
        <Dialog open title="Settings" onClose={onDialog}>
          <button type="button">b-1</button>
          <button type="button">b-2</button>
        </Dialog>
      </Drawer>
    );
  }
  it('only the topmost modal handles Tab and Escape', async () => {
    const onDrawer = vi.fn();
    const onDialog = vi.fn();
    render(<Nested onDrawer={onDrawer} onDialog={onDialog} />);
    screen.getByRole('button', { name: 'b-1' }).focus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'b-2' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onDialog).toHaveBeenCalledOnce();
    expect(onDrawer).not.toHaveBeenCalled();
  });
  it('restores body scroll when a dialog opened later inside a drawer unmounts with it', () => {
    document.body.style.overflow = '';
    const tree = (dialogOpen: boolean) => (
      <Drawer open title="Nav" onClose={() => {}}>
        <Dialog open={dialogOpen} title="Settings" onClose={() => {}}>x</Dialog>
      </Drawer>
    );
    const { rerender } = render(tree(false));
    rerender(tree(true));
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<div />);
    expect(document.body.style.overflow).toBe('');
  });
});

describe('toast defaults', () => {
  beforeEach(() => {
    toastStore.clear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());
  it('explicit undefined options keep the default duration and tone', () => {
    render(<Toaster />);
    const opts: { duration?: number; tone?: 'success' } = {};
    act(() => void toastStore.show({ title: 'U', duration: opts.duration, tone: opts.tone }));
    expect(screen.getByText('U').closest('li')).toHaveClass('border-l-ink');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText('U')).toBeNull();
  });
});

describe('touch targets', () => {
  it('Checkbox row is a 44px clickable label', async () => {
    render(<Checkbox label="Read the intent" description="Section 1" />);
    const row = screen.getByText('Read the intent').closest('label')!;
    expect(row).toHaveClass('max-md:min-h-11');
    expect(screen.getByRole('checkbox', { name: 'Read the intent' })).toHaveAccessibleDescription('Section 1');
  });
  it('Switch toggles from its label and has a 44px row target', async () => {
    const onChange = vi.fn();
    render(<Switch label="Race detector" checked={false} onChange={onChange} />);
    const row = screen.getByText('Race detector').closest('label')!;
    expect(row).toHaveClass('max-md:min-h-11');
    await userEvent.click(screen.getByText('Race detector'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('code-subtle tokens follow the nearest scope', () => {
  it('reads the subtle palette through per-scope variables', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/tokens/theme.css'), 'utf8');
    expect(css).not.toContain('[data-theme="dark"] .code-subtle');
    expect(css).toMatch(/@utility code-subtle \{[^}]*--color-code-keyword: var\(--code-subtle-keyword\)/);
    expect(css).toMatch(/\[data-theme="dark"\] \{[^}]*--code-subtle-keyword:/);
    expect(css).toMatch(/\[data-theme="light"\] \{[^}]*--code-subtle-keyword:/);
  });
});

describe('TextLink hover contrast', () => {
  it('brand hover uses a scope-aware token', () => {
    render(<TextLink href="#x">x</TextLink>);
    expect(screen.getByRole('link')).toHaveClass('hover:text-fg-brand-hover');
    expect(screen.getByRole('link')).not.toHaveClass('hover:text-brand-cobalt-hover');
  });
});

describe('diff trailing newline', () => {
  it('ignores a single trailing newline on either side', () => {
    expect(diffLines('a\n', 'a').map((l) => l.kind)).toEqual(['same']);
    expect(diffLines('a\nb\n', 'a\nb\n').map((l) => l.kind)).toEqual(['same', 'same']);
  });
});

describe('UmlDiagram re-layout', () => {
  it('lays out again when box sizes change (e.g. revealed from hidden, fonts loaded)', async () => {
    const callbacks: Array<() => void> = [];
    const RO = vi.fn(function (this: unknown, cb: () => void) {
      callbacks.push(cb);
      return { observe() {}, unobserve() {}, disconnect() {} };
    });
    vi.stubGlobal('ResizeObserver', RO);
    const { container } = render(<UmlDiagram label="d" nodes={[{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]} edges={[{ from: 'a', to: 'b', kind: 'association' }]} direction="LR" />);
    const canvas = () => container.querySelector<HTMLElement>('[role="img"]')!;
    await vi.waitFor(() => expect(canvas().style.width).not.toBe(''));
    const before = parseFloat(canvas().style.width);
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
    act(() => callbacks.forEach((cb) => cb()));
    await vi.waitFor(() => expect(parseFloat(canvas().style.width)).toBeGreaterThan(before));
    spy.mockRestore();
    vi.unstubAllGlobals();
  });
});

void fireEvent;
