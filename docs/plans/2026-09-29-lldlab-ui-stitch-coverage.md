# lldlab-ui Stitch Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add every component and variant from the addendum, so that each of the ten Stitch screens can be built from `lldlab-ui` alone.

**Architecture:**
- New components follow the existing library conventions:
  - `NativeProps` / `PolyProps`, so there are no `className` or `style` props.
  - Tailwind classes are written as literal strings.
  - Colours come from tokens, and each component has one test file.
- Modal behaviour (focus trap, Escape, scroll lock, focus restore) moves out of `Dialog` into an internal `useModal` hook, shared with `Drawer` and `CommandPalette`.
- Syntax highlighting uses `prism-react-renderer`'s `useTokenize`, and each token type maps to a theme token class.
- `UmlDiagram` measures its class boxes, then lays them out with dagre, which is loaded on demand with `import()`.

**Tech Stack:** React 19, Tailwind v4, tsup, vitest + Testing Library, Ladle + Playwright + axe. New runtime dependencies: `prism-react-renderer` ^2.4.1 and `@dagrejs/dagre` ^3.1.1.

**Spec:**
- Base: `docs/specs/2026-09-29-lldlab-ui-library-design.md`
- Addendum: `docs/specs/2026-09-29-lldlab-ui-stitch-coverage-addendum.md`

Both paths are relative to the lldlab-ui repo root.

## Global Constraints

- Repo root: `/Users/utkarsh.nigam/Desktop/CP/lldlab-ui`. The branch is `feat/stitch-coverage`, which already exists and is stacked on `feat/v0.1`. Every command runs from the repo root.
- No public component accepts `className` or `style`. Every component forwards native props (`id`, `data-*`, `aria-*`, handlers) to its root, and keeps its own ARIA attributes after the spread.
- Every Tailwind class is a complete literal string. Computed values go through the internal `style` attribute (sizes, positions, percentages, brand-dot colours) and nowhere else.
- Text colours meet WCAG AA in both scopes. Use the `fg-*`, `on-surface*`, `ink`, badge `*-text`, or new `code-*` tokens for text, never `brand-emerald` / `brand-crimson` / `brand-amber`. White text is allowed only on `bg-brand-cobalt`, `bg-brand-crimson-hover`, `bg-danger` and `bg-ink`.
- Below `md`, interactive controls carry `TOUCH` (`max-md:min-h-11`), and icon-only controls carry `TOUCH_ICON`.
- Nothing touches `window`, `document`, `localStorage`, `navigator` or layout during render. Effects only.
- Runtime dependencies are exactly `react-markdown`, `remark-gfm`, `prism-react-renderer` and `@dagrejs/dagre`. Do **not** add `prismjs`: the Java and Bash grammars are defined locally with `Prism.languages.extend`.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- The final push and PR #2 go to `UtkarshNigam1221/lldlab-ui` with base `feat/v0.1`, over the `github-personal` SSH remote that is already configured.

## Plan-level rulings (deviations from the addendum)

- **No `prismjs` dependency:** Java and Bash grammars are defined locally with `Prism.languages.extend` (Task 13). The addendum allowed `prismjs` only if needed. Cost if wrong: less accurate Java/Bash tokenising than Prism's official grammars.
- **`UmlDiagram` has no ⌘/Ctrl+wheel zoom:** React registers wheel listeners as passive, so `preventDefault` can't stop page scroll. The zoom buttons, plus the focusable, scrollable viewport, cover zoom and pan (Task 16). Cost if wrong: one missing shortcut.
- **`DiffViewer` has no `language` prop:** diffs are not highlighted. The addendum listed `language?`; adding it later is additive (Task 14). Cost if wrong: plain-coloured diffs.
- **New `Show` component; inverse surfaces scope dark tokens:** both are needed to build the screens without `className` (Task 20). Cost if wrong: a small API addition.
- **`Split start` ignores `ratio`:** the three-column layout is fixed at 3/7/2 of 12 from `xl`, and 3/9 from `lg` (Task 6). Cost if wrong: another ratio can be added later.

## Review Focus

1. **Menu separators:** with separators in `items`, arrow keys, Home and End must never land on a separator, and End goes to the last actionable item. Pinned in Task 12 (`skips separators with the keyboard`).
2. **CodeBlock fallbacks:** with `highlight` on and an unknown `language`, or non-string children, the code renders as plain text and never crashes. Pinned in Task 13 (`falls back to plain text`).
3. **DiffViewer edge cases:** identical inputs produce no added or removed lines, and an empty `oldValue` produces only additions (not a phantom removed empty line). Pinned in Task 14 (`handles identical and empty inputs`).
4. **Toaster timing:** toasts shown before `<Toaster />` mounts must appear once it mounts, and `duration: Infinity` never auto-dismisses. Pinned in Task 18 (`shows toasts queued before mount` / `never auto-dismisses Infinity`).
5. **Pagination bounds:** out-of-range `page` values (0, or more than `pageCount`) are clamped, and `pageCount <= 1` renders nothing. Pinned in Task 7 (`clamps out-of-range pages`).

## File Structure

```
src/internal/useModal.ts          shared modal behaviour (Dialog, Drawer, CommandPalette)
src/internal/highlight.ts         Prism grammars (java, bash), language aliases, token → class map
src/internal/diff.ts              line LCS diff + split-row pairing
src/tokens/theme.css              + code/diff tokens, skeleton shimmer, appbar spacing, code-subtle scope
src/components/{TextLink,Divider,IconTile,AvatarGroup,Drawer,NavList,Pagination,Table,DescriptionList,
  Timeline,Disclosure,Skeleton,TerminalOutput,VerdictBanner,Checkbox,Switch,Overlay,CopyButton,DiffViewer,
  BarChart,Tooltip,Toast,CommandPalette}.tsx
src/ide/{UmlClass,UmlDiagram}.tsx
src/primitives/AppBar.tsx
modified: Icon, Button, IconButton, Badge, Chip, Avatar, Card, Callout, ResultRow, CheckList, MetricTile,
  ProgressBar, Heading, Text, Eyebrow, SectionHeader, EmptyState, Box, Split, Menu, Tabs, SegmentedControl,
  FileTree, tree.ts, TextField, CodeBlock, Dialog
tests: one *.test.tsx per task under src/
stories: src/stories/{chrome,data,feedback-v2,forms,code,uml}.stories.tsx, src/stories/screens/*.stories.tsx
scripts/size-check.mjs, .github/workflows/ci.yml (size step)
```

---

### Task 1: Dependencies, theme tokens and size budget

**Files:**
- Modify: `package.json` (dependencies, `size-check` script), `tsup.config.ts` (externals), `src/tokens/theme.css` (append), `.github/workflows/ci.yml` (size step)
- Create: `scripts/size-check.mjs`
- Test: `src/tokens/tokens.test.ts`

**Interfaces:**
- Produces:
  - Tailwind utilities `text-code-{keyword,string,number,comment,function,type,punctuation,plain}` and `bg-code-bg-subtle`.
  - Utilities `bg-diff-add-bg`, `text-diff-add-fg`, `bg-diff-del-bg`, `text-diff-del-fg`.
  - The `skeleton-shimmer` utility, and the `code-subtle` utility (which swaps the code tokens to their light-surface values).
  - The spacing token `--spacing-appbar` (4rem), giving `top-appbar`.
  - `npm run size-check`.

- [ ] **Step 1: Install the dependencies**

Run: `npm install prism-react-renderer@^2.4.1 @dagrejs/dagre@^3.1.1`
Expected: exits 0. `package.json` `dependencies` now lists `@dagrejs/dagre`, `prism-react-renderer`, `react-markdown` and `remark-gfm`.

In `tsup.config.ts`, replace the `external` line with:

```ts
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-markdown', 'remark-gfm', 'prism-react-renderer', '@dagrejs/dagre'],
```

- [ ] **Step 2: Write the failing token test**

`src/tokens/tokens.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./theme.css', import.meta.url), 'utf8');
const CODE = ['keyword', 'string', 'number', 'comment', 'function', 'type', 'punctuation', 'plain'];

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return '';
  return css.slice(start, css.indexOf('}', start));
}

describe('theme tokens (addendum)', () => {
  it('defines every code token for the dark code surface', () => {
    for (const t of CODE) expect(css).toMatch(new RegExp(`--color-code-${t}:\\s*#`));
  });
  it('swaps code tokens for light and dark subtle surfaces', () => {
    const light = block('@utility code-subtle');
    const dark = block('[data-theme="dark"] .code-subtle');
    for (const t of CODE) {
      expect(light).toContain(`--color-code-${t}:`);
      expect(dark).toContain(`--color-code-${t}:`);
    }
  });
  it('defines diff, skeleton and appbar tokens', () => {
    for (const t of ['diff-add-bg', 'diff-add-fg', 'diff-del-bg', 'diff-del-fg', 'code-bg-subtle']) expect(css).toContain(`--color-${t}:`);
    expect(css).toContain('@utility skeleton-shimmer');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('--spacing-appbar: 4rem');
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/tokens`
Expected: FAIL. The first assertion fails because there is no `--color-code-keyword`.

- [ ] **Step 4: Append the tokens**

Append to `src/tokens/theme.css`:

```css

/* ---- Addendum 1: code, diff, skeleton, app bar ---- */

@theme {
  /* Code on the dark code surface (brand-obsidian); AA on #0F172A. */
  --color-code-keyword: #F87171;
  --color-code-string: #34D399;
  --color-code-number: #FBBF24;
  --color-code-comment: #94A3B8;
  --color-code-function: #60A5FA;
  --color-code-type: #C4B5FD;
  --color-code-punctuation: #CBD5E1;
  --color-code-plain: #F1F5F9;
  --color-code-bg-subtle: #F8FAFC;
  /* Diff lines on the dark code surface. */
  --color-diff-add-bg: color-mix(in srgb, #10B981 18%, transparent);
  --color-diff-add-fg: #6EE7B7;
  --color-diff-del-bg: color-mix(in srgb, #EF4444 18%, transparent);
  --color-diff-del-fg: #FCA5A5;
  /* Height of a md AppBar; Split stickyOffset="appbar" clears it. */
  --spacing-appbar: 4rem;
}

/* Light code surface (CodeBlock tone="subtle"); AA on #F8FAFC. */
@utility code-subtle {
  --color-code-keyword: #B91C1C;
  --color-code-string: #047857;
  --color-code-number: #B45309;
  --color-code-comment: #475569;
  --color-code-function: #1D4ED8;
  --color-code-type: #6D28D9;
  --color-code-punctuation: #334155;
  --color-code-plain: #0F172A;
}

/* In the dark scope the subtle surface is dark, so keep the dark-surface palette. */
[data-theme="dark"] .code-subtle {
  --color-code-keyword: #F87171;
  --color-code-string: #34D399;
  --color-code-number: #FBBF24;
  --color-code-comment: #94A3B8;
  --color-code-function: #60A5FA;
  --color-code-type: #C4B5FD;
  --color-code-punctuation: #CBD5E1;
  --color-code-plain: #F1F5F9;
}

[data-theme="dark"] {
  --color-code-bg-subtle: #0F172A;
}

[data-theme="light"] {
  --color-code-bg-subtle: #F8FAFC;
}

@keyframes skeleton-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@utility skeleton-shimmer {
  background-image: linear-gradient(90deg, var(--color-surface-muted) 25%, var(--color-surface-container) 37%, var(--color-surface-muted) 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-image: none;
    background-color: var(--color-surface-muted);
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/tokens`
Expected: PASS, 3 tests.

- [ ] **Step 6: Add the size budget**

`scripts/size-check.mjs`:

```js
// Fails if the library bundle (without peer or runtime deps, which are external) grows past its gzip budget.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const LIMIT_KB = 150;
const buf = readFileSync(new URL('../dist/index.js', import.meta.url));
const gz = gzipSync(buf).length / 1024;
console.log(`size-check: dist/index.js ${(buf.length / 1024).toFixed(1)} KB raw, ${gz.toFixed(1)} KB gzip (limit ${LIMIT_KB} KB)`);
if (gz > LIMIT_KB) {
  console.error('size-check: over budget');
  process.exit(1);
}
```

In `package.json` `scripts`, add `"size-check": "node scripts/size-check.mjs"`. In `.github/workflows/ci.yml`, in the `check` job, add a step after `- run: npm run build`:

```yaml
      - run: npm run size-check
```

Run: `npm run build && npm run size-check && ~/go/bin/actionlint .github/workflows/*.yml`
Expected: prints `size-check: dist/index.js … KB gzip (limit 150 KB)` with a value under 150, and actionlint prints nothing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: prism and dagre deps, code/diff/skeleton tokens, bundle size budget

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: `useModal` and `Drawer`

**Files:**
- Create: `src/internal/useModal.ts`, `src/components/Drawer.tsx`
- Modify: `src/components/Dialog.tsx` (replace the whole file), `src/index.ts`
- Test: `src/components/drawer.test.tsx` (plus the existing `dialog.test.tsx` and `menu-in-dialog.test.tsx` as refactor guards)

**Interfaces:**
- Consumes: `IconButton` (existing), `useThemeTone` (existing), `NativeProps`, `cx`.
- Produces:
  - `useModal({ open, onClose, panelRef, initialFocusRef? }): void`. The effect runs on `open` only, and `onClose` is read through a ref. It handles:
    - initial focus: `initialFocusRef` first, then the first focusable element in `initialFocusRef`'s container, then the first focusable in the panel, then the panel itself
    - the Tab / Shift+Tab trap, including when focus is on the panel itself
    - Escape (skipped if `defaultPrevented`)
    - the body scroll lock
    - restoring focus to the opener, falling back to `document.body`
  - `Drawer({ open, onClose, title, side?: 'left'|'right' = 'left', size?: 'sm'|'md' = 'sm', children?, ...div props })`

- [ ] **Step 1: Write the failing test**

`src/components/drawer.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer, Theme } from '../index';

function Harness({ side = 'left' as 'left' | 'right', onClose = () => {} }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Menu</button>
      <Drawer open={open} side={side} title="Navigation" onClose={() => { onClose(); setOpen(false); }}>
        <a href="#problems">Problems</a>
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  it('is a modal dialog named by its title, on the requested side', async () => {
    render(<Harness side="right" />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const panel = screen.getByRole('dialog', { name: 'Navigation' });
    expect(panel).toHaveAttribute('aria-modal', 'true');
    expect(panel).toHaveClass('right-0');
    expect(screen.getByRole('link', { name: 'Problems' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('closes on Escape and backdrop, restoring focus', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(opener).toHaveFocus();
    await userEvent.click(opener);
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it('inherits the theme of its React scope', () => {
    render(
      <Theme tone="dark">
        <Drawer open onClose={() => {}} title="Nav">x</Drawer>
      </Theme>,
    );
    expect(screen.getByRole('dialog').parentElement).toHaveAttribute('data-theme', 'dark');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/drawer.test.tsx`
Expected: FAIL. `Drawer` is undefined, so render throws "Element type is invalid".

- [ ] **Step 3: Implement**

`src/internal/useModal.ts`:

```ts
import { useEffect, useRef, type RefObject } from 'react';

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Options = {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
  /** Element to focus first (or whose first focusable descendant to focus). */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

/** Modal behaviour shared by Dialog, Drawer and CommandPalette. Runs only when `open` changes. */
export function useModal({ open, onClose, panelRef, initialFocusRef }: Options): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current!;
    const focusables = () => [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const initial = initialFocusRef?.current;
    const target = initial?.matches(FOCUSABLE) ? initial : initial?.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? focusables()[0] ?? panel).focus();

    const onKey = (e: KeyboardEvent) => {
      // A nested widget (e.g. a Menu) that already handled the key owns it.
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      const onEdge = active === panel || !panel.contains(active);
      if (e.shiftKey && (active === first || onEdge)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || onEdge)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus();
      else {
        (document.activeElement as HTMLElement | null)?.blur();
        document.body.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable; the effect is keyed on open only
  }, [open]);
}
```

`src/components/Dialog.tsx` (replace the whole file):

```tsx
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { IconButton } from './IconButton';

const SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' } as const;

export type DialogProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZE;
  children?: ReactNode;
}>;

/** Native props (id, data-*, aria-*) go to the dialog panel. */
export function Dialog({ open, onClose, title, description, footer, size = 'md', children, ...rest }: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Portals leave the scope's DOM, so the tone comes from the React tree, not from focus.
  const theme = useThemeTone();
  useModal({ open, onClose, panelRef, initialFocusRef: contentRef });

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-obsidian/40 p-space-md backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cx('relative flex max-h-[calc(100dvh-2rem)] w-full min-w-0 flex-col gap-space-md overflow-y-auto rounded-xl bg-surface-elevated p-space-lg text-on-surface shadow-md outline-none', SIZE[size])}
      >
        <div className="min-w-0 pr-space-xl">
          <h2 id={titleId} className="font-display text-headline-md text-ink wrap-break-word">{title}</h2>
          {description && <p id={descId} className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
        </div>
        <div ref={contentRef} className="flex min-w-0 flex-col gap-space-sm">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-space-sm">{footer}</div>}
        <div className="absolute right-space-md top-space-md">
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

`src/components/Drawer.tsx`:

```tsx
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { IconButton } from './IconButton';

const SIDE = { left: 'left-0 border-r', right: 'right-0 border-l' } as const;
const SIZE = { sm: 'w-[min(85vw,20rem)]', md: 'w-[min(90vw,28rem)]' } as const;

export type DrawerProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  side?: keyof typeof SIDE;
  size?: keyof typeof SIZE;
  children?: ReactNode;
}>;

/** Modal slide-over (mobile navigation, side panels). Native props go to the panel. */
export function Drawer({ open, onClose, title, side = 'left', size = 'sm', children, ...rest }: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const theme = useThemeTone();
  useModal({ open, onClose, panelRef, initialFocusRef: bodyRef });

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 bg-brand-obsidian/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('fixed inset-y-0 flex flex-col border-border-subtle bg-surface-elevated text-on-surface shadow-md outline-none', SIDE[side], SIZE[size])}
      >
        <div className="flex min-w-0 items-center justify-between gap-space-sm border-b border-border-subtle px-space-md py-space-sm">
          <h2 id={titleId} className="min-w-0 truncate font-display text-headline-sm text-ink">{title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto p-space-md">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
```

Append to `src/index.ts`:

```ts
export { Drawer, type DrawerProps } from './components/Drawer';
```

- [ ] **Step 4: Run the tests to verify they pass (the Dialog suites are the refactor guard)**

Run: `npx vitest run src/components/drawer.test.tsx src/components/dialog.test.tsx src/components/menu-in-dialog.test.tsx src/native-props.test.tsx`
Expected: PASS. That is 3 drawer tests, all existing dialog tests (11), the menu-in-dialog test (1), and native-props (35).

- [ ] **Step 5: Lint, typecheck and commit**

Run: `npm run lint && npm run typecheck`
Expected: exit 0.

```bash
git add -A
git commit -m "feat: drawer; extract shared useModal from dialog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `TextLink`, `Divider`, `IconTile` (plus `Icon` size `xl`)

**Files:**
- Create: `src/components/TextLink.tsx`, `src/components/Divider.tsx`, `src/components/IconTile.tsx`
- Modify: `src/components/Icon.tsx` (SIZE gains `xl`), `src/index.ts`
- Test: `src/components/basics-v2.test.tsx`

**Interfaces:**
- Consumes: `Icon`, `cx`, `FOCUS_RING`, `PolyProps`, `NativeProps`, `Space`.
- Produces:
  - `TextLink<E='a'>({ as, tone?: 'brand'|'default'|'muted'|'danger'|'success'|'warning' = 'brand', size?: 'sm'|'md' = 'md', icon?, iconRight?, underline?: 'hover'|'always'|'none' = 'hover', children })`
  - `Divider({ orientation?: 'horizontal'|'vertical' = 'horizontal', label?: ReactNode, spacing?: Space = 'none' })`
  - `IconTile({ icon, tone?: 'neutral'|'brand'|'success'|'warning'|'danger' = 'neutral', size?: 'sm'|'md'|'lg'|'xl' = 'md', shape?: 'square'|'circle' = 'square', filled?, label? })`
  - `IconTileTone` type
  - `Icon` `size` adds `'xl'` (32px)

- [ ] **Step 1: Write the failing test**

`src/components/basics-v2.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/basics-v2.test.tsx`
Expected: FAIL. `TextLink`, `Divider` and `IconTile` are undefined ("Element type is invalid"), and the `Icon xl` test fails its class assertion.

- [ ] **Step 3: Implement**

`src/components/Icon.tsx` (replace the whole file):

```tsx
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { TEXT_TONE, type Tone } from '../internal/tones';

const SIZE = { sm: 'text-[16px]', md: 'text-[20px]', lg: 'text-[24px]', xl: 'text-[32px]' } as const;

export type IconProps = NativeProps<
  'span',
  { name: string; size?: keyof typeof SIZE; tone?: Tone | 'inherit'; filled?: boolean; spin?: boolean; label?: string; children?: never }
>;

/** Material Symbols Outlined ligature icon. The app loads the font. */
export function Icon({ name, size = 'md', tone = 'inherit', filled, spin, label, ...rest }: IconProps) {
  return (
    <span
      {...rest}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cx(
        'material-symbols-outlined inline-block shrink-0 select-none leading-none',
        SIZE[size],
        tone !== 'inherit' && TEXT_TONE[tone],
        filled && 'icon-filled',
        spin && 'animate-spin',
      )}
    >
      {name}
    </span>
  );
}
```

`src/components/TextLink.tsx`:

```tsx
import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { Icon } from './Icon';

const TONE = {
  brand: 'text-fg-brand hover:text-brand-cobalt-hover',
  default: 'text-on-surface hover:text-ink',
  muted: 'text-on-surface-variant hover:text-on-surface',
  danger: 'text-fg-danger',
  success: 'text-fg-success',
  warning: 'text-fg-warning',
} as const;
const SIZE = { sm: 'font-body-sm text-body-sm', md: 'font-body-md text-body-md' } as const;
const UNDERLINE = { hover: 'underline-offset-2 hover:underline', always: 'underline underline-offset-2', none: '' } as const;

type TextLinkOwnProps = {
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
  icon?: string;
  iconRight?: string;
  underline?: keyof typeof UNDERLINE;
  children: ReactNode;
};
export type TextLinkProps<E extends ElementType = 'a'> = PolyProps<E, TextLinkOwnProps>;

export function TextLink<E extends ElementType = 'a'>({ as, tone = 'brand', size = 'md', icon, iconRight, underline = 'hover', children, ...rest }: TextLinkProps<E>) {
  const C: ElementType = as ?? 'a';
  return (
    <C
      {...rest}
      className={cx('inline-flex max-w-full items-center gap-space-2xs rounded font-medium wrap-break-word transition-colors', TONE[tone], SIZE[size], UNDERLINE[underline], FOCUS_RING)}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span className="min-w-0">{children}</span>
      {iconRight && <Icon name={iconRight} size="sm" />}
    </C>
  );
}
```

`src/components/Divider.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { Space } from '../internal/tables';

const SPACE_Y: Record<Space, string> = {
  none: '', '2xs': 'my-space-2xs', xs: 'my-space-xs', sm: 'my-space-sm', md: 'my-space-md', lg: 'my-space-lg', xl: 'my-space-xl', '2xl': 'my-space-2xl',
};
const SPACE_X: Record<Space, string> = {
  none: '', '2xs': 'mx-space-2xs', xs: 'mx-space-xs', sm: 'mx-space-sm', md: 'mx-space-md', lg: 'mx-space-lg', xl: 'mx-space-xl', '2xl': 'mx-space-2xl',
};

export type DividerProps = NativeProps<'div', { orientation?: 'horizontal' | 'vertical'; label?: ReactNode; spacing?: Space; children?: never }>;

export function Divider({ orientation = 'horizontal', label, spacing = 'none', ...rest }: DividerProps) {
  if (orientation === 'vertical') {
    return <div {...rest} role="separator" aria-orientation="vertical" className={cx('min-h-4 w-px shrink-0 self-stretch bg-border-subtle', SPACE_X[spacing])} />;
  }
  if (label) {
    return (
      <div {...rest} role="separator" aria-orientation="horizontal" className={cx('flex w-full min-w-0 items-center gap-space-sm', SPACE_Y[spacing])}>
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="shrink-0 font-label-mono text-label-mono uppercase text-on-surface-variant">{label}</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>
    );
  }
  return <div {...rest} role="separator" aria-orientation="horizontal" className={cx('h-px w-full shrink-0 bg-border-subtle', SPACE_Y[spacing])} />;
}
```

`src/components/IconTile.tsx`:

```tsx
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type IconTileTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const TONE: Record<IconTileTone, string> = {
  neutral: 'bg-surface-muted text-on-surface-variant',
  brand: 'bg-badge-intermediate-bg text-badge-intermediate-text',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
};
// Inverted pairs: both halves are AA in light and dark scopes.
const FILLED: Record<IconTileTone, string> = {
  neutral: 'bg-ink text-on-ink',
  brand: 'bg-badge-intermediate-text text-badge-intermediate-bg',
  success: 'bg-badge-beginner-text text-badge-beginner-bg',
  warning: 'bg-badge-amber-text text-badge-amber-bg',
  danger: 'bg-badge-advanced-text text-badge-advanced-bg',
};
const SIZE = { sm: 'size-8', md: 'size-10', lg: 'size-12', xl: 'size-14' } as const;
const ICON_SIZE = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const;
const SHAPE = { square: 'rounded-lg', circle: 'rounded-full' } as const;

export type IconTileProps = NativeProps<'span', {
  icon: string;
  tone?: IconTileTone;
  size?: keyof typeof SIZE;
  shape?: keyof typeof SHAPE;
  filled?: boolean;
  label?: string;
  children?: never;
}>;

export function IconTile({ icon, tone = 'neutral', size = 'md', shape = 'square', filled, label, ...rest }: IconTileProps) {
  return (
    <span
      {...rest}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('inline-flex shrink-0 items-center justify-center', filled ? FILLED[tone] : TONE[tone], SIZE[size], SHAPE[shape])}
    >
      <Icon name={icon} size={ICON_SIZE[size]} filled={filled} />
    </span>
  );
}
```

Append to `src/index.ts`:

```ts
export { TextLink, type TextLinkProps } from './components/TextLink';
export { Divider, type DividerProps } from './components/Divider';
export { IconTile, type IconTileProps, type IconTileTone } from './components/IconTile';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/basics-v2.test.tsx src/primitives/typography.test.tsx`
Expected: PASS: 8 new tests, and the existing typography tests are still green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: text link, divider and icon tile

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 4: Button, IconButton, Badge, Chip and Avatar variants, and `AvatarGroup`

**Files:**
- Modify (replace the whole file each): `src/components/Button.tsx`, `src/components/IconButton.tsx`, `src/components/Badge.tsx`, `src/components/Chip.tsx`, `src/ide/Avatar.tsx`
- Create: `src/ide/AvatarGroup.tsx`
- Modify: `src/index.ts`
- Test: `src/components/variants-a.test.tsx`

**Interfaces:**
- Consumes: `Icon`, `Dot`, `DOT_TONE`, `StatusTone`, `Tone`.
- Produces:
  - `ButtonVariant` adds `'brand' | 'accent'`. `Button` gains `leading?: ReactNode`, `iconTone?: Tone` and `iconFilled?: boolean`.
  - `IconButton` becomes polymorphic (`as`). It gains `variant: 'secondary'`, `size: 'xs'`, `dot?: StatusTone` and `badge?: ReactNode`.
  - `Badge` gains `icon?`, `dot?: StatusTone` and `pulse?`.
  - `Chip` `tone` adds `'success'|'warning'|'danger'|'info'`, plus `dot?: StatusTone | string` (a CSS colour for brand dots).
  - `Avatar` gains `status?: StatusTone`, `statusLabel?: string`, `shape?: 'circle'|'square'` and `tone?: 'ink'|'brand'|'success'|'warning'|'danger'`. The image-error state resets when `src` changes.
  - `AVATAR_SIZE` is exported (used by `AvatarGroup`).
  - `AvatarGroup({ children, max?, size?: 'sm'|'md'|'lg' = 'md', label? })`

- [ ] **Step 1: Write the failing test**

`src/components/variants-a.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/variants-a.test.tsx`
Expected: FAIL on the missing classes and props. `AvatarGroup` is undefined.

- [ ] **Step 3: Implement**

`src/components/Button.tsx` (replace the whole file):

```tsx
import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import type { Tone } from '../internal/tones';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'ghost' | 'danger' | 'brand' | 'accent';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-on-ink shadow-sm hover:bg-ink-hover',
  secondary: 'border border-border-subtle bg-surface-elevated text-ink shadow-sm hover:bg-surface-muted',
  subtle: 'bg-surface-subtle text-on-surface hover:bg-surface-muted',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-muted',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover',
  brand: 'bg-brand-cobalt text-white shadow-sm hover:bg-brand-cobalt-hover',
  // Crimson call to action (not destructive): #DC2626 keeps white text at AA.
  accent: 'bg-brand-crimson-hover text-white shadow-sm hover:bg-danger',
};
const SIZE = { sm: 'h-8 px-space-md', md: 'h-10 px-space-lg', lg: 'h-12 px-space-lg' } as const;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE;
  icon?: string;
  iconRight?: string;
  iconTone?: Tone;
  iconFilled?: boolean;
  /** Custom leading content (e.g. a brand logo); replaces `icon`. */
  leading?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
};
export type ButtonProps<E extends ElementType = 'button'> = PolyProps<E, ButtonOwnProps>;

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  iconTone,
  iconFilled,
  leading,
  fullWidth,
  loading,
  disabled,
  children,
  ...rest
}: ButtonProps<E>) {
  const C: ElementType = as ?? 'button';
  const native = C === 'button';
  const off = Boolean(disabled || loading);
  const state = native
    ? { type: (rest as unknown as { type?: string }).type ?? 'button', disabled: off }
    : { 'aria-disabled': off || undefined };
  const start = loading ? (
    <Icon name="progress_activity" size="sm" spin />
  ) : leading ? (
    <span className="inline-flex shrink-0 items-center">{leading}</span>
  ) : (
    icon && <Icon name={icon} size="sm" tone={iconTone} filled={iconFilled} />
  );
  return (
    <C
      {...rest}
      {...state}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex max-w-full items-center justify-center gap-space-xs whitespace-nowrap rounded-lg font-button-text text-button-text transition-colors',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        VARIANT[variant],
        SIZE[size],
        FOCUS_RING,
        TOUCH,
        fullWidth && 'w-full',
      )}
    >
      {start}
      <span className="inline-flex min-w-0 items-center gap-space-xs truncate">{children}</span>
      {iconRight && <Icon name={iconRight} size="sm" />}
    </C>
  );
}
```

`src/components/IconButton.tsx` (replace the whole file):

```tsx
import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';
import { Icon } from './Icon';

const VARIANT = {
  ghost: 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface hover:bg-surface-muted',
  secondary: 'border border-border-subtle bg-surface-elevated text-on-surface hover:bg-surface-muted',
  primary: 'bg-ink text-on-ink hover:bg-ink-hover',
} as const;
const SIZE = { xs: 'size-6', sm: 'size-8', md: 'size-10' } as const;

type IconButtonOwnProps = {
  icon: string;
  /** Accessible name and tooltip. Include what `dot`/`badge` mean (e.g. "Notifications, 3 unread"). */
  label: string;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  dot?: StatusTone;
  badge?: ReactNode;
  children?: never;
};
export type IconButtonProps<E extends ElementType = 'button'> = PolyProps<E, IconButtonOwnProps>;

export function IconButton<E extends ElementType = 'button'>({ as, icon, label, variant = 'ghost', size = 'md', dot, badge, ...rest }: IconButtonProps<E>) {
  const C: ElementType = as ?? 'button';
  const native = C === 'button';
  const typeProp = native ? { type: (rest as unknown as { type?: string }).type ?? 'button' } : {};
  return (
    <C
      {...rest}
      {...typeProp}
      aria-label={label}
      title={label}
      className={cx(
        'relative inline-flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50',
        VARIANT[variant],
        SIZE[size],
        FOCUS_RING,
        TOUCH_ICON,
      )}
    >
      <Icon name={icon} size={size === 'md' ? 'md' : 'sm'} />
      {dot && <span aria-hidden="true" className={cx('absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-surface-elevated', DOT_TONE[dot])} />}
      {badge && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 min-w-4 rounded-full bg-brand-crimson-hover px-1 text-center font-label-mono text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </C>
  );
}
```

`src/components/Badge.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';
import { Dot } from './Dot';
import { Icon } from './Icon';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-on-surface-variant',
  brand: 'bg-ink text-on-ink',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
  info: 'bg-badge-intermediate-bg text-badge-intermediate-text',
};
const SIZE = { sm: 'px-space-xs py-space-2xs', md: 'px-space-sm py-space-xs' } as const;

export type BadgeProps = NativeProps<'span', {
  tone?: BadgeTone;
  uppercase?: boolean;
  size?: keyof typeof SIZE;
  icon?: string;
  dot?: StatusTone;
  pulse?: boolean;
  children: ReactNode;
}>;

export function Badge({ tone = 'neutral', uppercase, size = 'sm', icon, dot, pulse, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-2xs whitespace-nowrap rounded font-label-mono text-label-mono', TONE[tone], SIZE[size], uppercase && 'uppercase tracking-wider')}>
      {dot && <Dot tone={dot} pulse={pulse} />}
      {icon && <Icon name={icon} size="sm" />}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}
```

`src/components/Chip.tsx` (replace the whole file):

```tsx
import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';
import { Icon } from './Icon';

const TONE = {
  neutral: 'border-border-subtle text-on-surface',
  brand: 'border-brand-cobalt/40 text-fg-brand',
  info: 'border-brand-cobalt/40 text-fg-brand',
  success: 'border-fg-success/40 text-fg-success',
  warning: 'border-fg-warning/40 text-fg-warning',
  danger: 'border-fg-danger/40 text-fg-danger',
} as const;

export type ChipProps = NativeProps<'span', {
  tone?: keyof typeof TONE;
  icon?: string;
  /** A status tone, or any CSS colour (e.g. a language brand colour). */
  dot?: StatusTone | string;
  onRemove?: () => void;
  children: string;
}>;

const isStatusTone = (d: string): d is StatusTone => d in DOT_TONE;

export function Chip({ tone = 'neutral', icon, dot, onRemove, children, ...rest }: ChipProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-2xs rounded-full border bg-surface-elevated px-space-sm py-space-2xs font-body-sm text-body-sm', TONE[tone])}>
      {dot &&
        (isStatusTone(dot) ? (
          <span aria-hidden="true" className={cx('inline-block size-1.5 shrink-0 rounded-full', DOT_TONE[dot])} />
        ) : (
          <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
        ))}
      {icon && <Icon name={icon} size="sm" />}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${children}`}
          onClick={onRemove}
          className={cx('-mr-space-2xs inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface', FOCUS_RING, TOUCH_ICON)}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}
```

`src/ide/Avatar.tsx` (replace the whole file):

```tsx
import { useState, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';

export const AVATAR_SIZE = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-12 text-sm' } as const;
const SHAPE = { circle: 'rounded-full', square: 'rounded-lg' } as const;
const TONE = {
  ink: 'bg-ink text-on-ink',
  brand: 'bg-brand-cobalt text-white',
  success: 'bg-badge-beginner-text text-badge-beginner-bg',
  warning: 'bg-badge-amber-text text-badge-amber-bg',
  danger: 'bg-badge-advanced-text text-badge-advanced-bg',
} as const;

export type AvatarProps = NativeProps<'span', {
  name: string;
  src?: string;
  size?: keyof typeof AVATAR_SIZE;
  shape?: keyof typeof SHAPE;
  tone?: keyof typeof TONE;
  badge?: ReactNode;
  /** Presence dot at the corner. Pair with `statusLabel` so it isn't colour-only. */
  status?: StatusTone;
  statusLabel?: string;
  children?: never;
}>;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, src, size = 'md', shape = 'circle', tone = 'ink', badge, status, statusLabel, ...rest }: AvatarProps) {
  // Remember which src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const accessibleName = statusLabel ? `${name}, ${statusLabel}` : name;
  return (
    <span {...rest} className="relative inline-flex shrink-0">
      {src && failedSrc !== src ? (
        <img src={src} alt={accessibleName} onError={() => setFailedSrc(src)} className={cx('object-cover', SHAPE[shape], AVATAR_SIZE[size])} />
      ) : (
        <span role="img" aria-label={accessibleName} className={cx('inline-flex items-center justify-center font-label-mono', SHAPE[shape], TONE[tone], AVATAR_SIZE[size])}>
          {initials(name)}
        </span>
      )}
      {status && <span aria-hidden="true" className={cx('absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-surface-elevated', DOT_TONE[status])} />}
      {badge && (
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-surface-elevated bg-brand-cobalt px-1 font-label-mono text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </span>
  );
}
```

`src/ide/AvatarGroup.tsx`:

```tsx
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { AVATAR_SIZE, type AvatarProps } from './Avatar';

export type AvatarGroupProps = NativeProps<'div', { children: ReactNode; max?: number; size?: keyof typeof AVATAR_SIZE; label?: string }>;

export function AvatarGroup({ children, max, size = 'md', label, ...rest }: AvatarGroupProps) {
  const all = Children.toArray(children);
  const shown = max !== undefined ? all.slice(0, Math.max(0, max)) : all;
  const extra = all.length - shown.length;
  return (
    <div {...rest} role="group" aria-label={label} className="flex items-center -space-x-2">
      {shown.map((child, i) => (
        <span key={i} className="inline-flex rounded-full ring-2 ring-surface-elevated">
          {isValidElement(child) ? cloneElement(child as ReactElement<AvatarProps>, { size }) : child}
        </span>
      ))}
      {extra > 0 && (
        <span className={cx('inline-flex items-center justify-center rounded-full bg-surface-muted font-label-mono text-on-surface-variant ring-2 ring-surface-elevated', AVATAR_SIZE[size])}>
          +{extra}
        </span>
      )}
    </div>
  );
}
```

Append to `src/index.ts`:

```ts
export { AvatarGroup, type AvatarGroupProps } from './ide/AvatarGroup';
```

- [ ] **Step 4: Run the tests to verify they pass (including the existing input, display and IDE suites)**

Run: `npx vitest run src/components/variants-a.test.tsx src/components/inputs.test.tsx src/components/display.test.tsx src/ide/ide-small.test.tsx src/native-props.test.tsx src/no-escape-hatch.test.tsx && npm run typecheck`
Expected: PASS: 9 new tests plus the existing suites, and typecheck exits 0. The escape-hatch test still consumes its `@ts-expect-error` for `IconButton className`, because `PolyProps` omits it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: brand/accent buttons, polymorphic icon button with dot/badge, badge/chip/avatar variants, avatar group

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Card, Callout, ResultRow, CheckList, MetricTile and ProgressBar variants

**Files:**
- Modify (replace the whole file each): `src/components/Card.tsx`, `src/components/Callout.tsx`, `src/components/ResultRow.tsx`, `src/components/CheckList.tsx`, `src/ide/MetricTile.tsx`, `src/components/ProgressBar.tsx`
- Modify: `src/index.ts`
- Test: `src/components/variants-b.test.tsx`

**Interfaces:**
- Produces:
  - `Card`:
    - `tone` adds `'subtle'`; `pattern?: 'none'|'dots'|'grid'` on the root.
    - New `Card.Header({ start?, end?, children? })`, rendered first.
    - `Card.Media` gains `caption?` and `height?: 'sm'|'md'`.
    - `CardHeaderProps` is exported.
  - `Callout` gains `live?: boolean = true`, `icon?: string`, `size?: 'sm'|'md' = 'md'` and `accent?: boolean`.
  - `ResultRow` `status` adds `'warning'`. It gains `badge?`, `variant?: 'plain'|'boxed'`, `selected?` and `titleMono?`.
  - `CheckList` gains `icon?: string = 'check'` and `tone?: Tone = 'success'`.
  - `MetricTile` `tone` adds `'brand'|'warning'`. It gains `hint?` and `hintTone?: Tone = 'muted'`.
  - `ProgressBar`: `label: ReactNode`, plus `valueLabel?`, `caption?` and `size?: 'sm'|'md' = 'md'`.

- [ ] **Step 1: Write the failing test**

`src/components/variants-b.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout, Card, CheckList, MetricTile, ProgressBar, ResultRow } from '../index';

describe('Card variants', () => {
  it('orders header, media, body, footer and supports subtle tone with a pattern', () => {
    const { container } = render(
      <Card tone="subtle" pattern="dots">
        <Card.Footer>foot</Card.Footer>
        <p>body</p>
        <Card.Header start="Test Suite" end="3 PASS" />
        <Card.Media caption="UML SCHEMA" height="md">m</Card.Media>
      </Card>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('bg-surface-subtle', 'bg-pattern-dots');
    expect([...root.children].map((c) => c.textContent)).toEqual(['Test Suite3 PASS', 'UML SCHEMAm', 'body', 'foot']);
    expect(root.children[1]).toHaveClass('h-35');
    expect(screen.getByText('UML SCHEMA')).toHaveClass('absolute');
  });
});

describe('Callout variants', () => {
  it('live={false} drops the live role; size sm and accent', () => {
    const { container } = render(<Callout tone="danger" live={false} size="sm" accent icon="close" title="Cons">x</Callout>);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.firstElementChild).toHaveClass('p-space-sm', 'border-l-4');
    expect(screen.getByText('close')).toBeInTheDocument();
  });
});

describe('ResultRow variants', () => {
  it('warning status, badge, boxed, selected and mono title', () => {
    const { container } = render(<ResultRow status="warning" title="refactor_candidate" titleMono badge={<span>SRP</span>} variant="boxed" selected />);
    expect(screen.getByRole('img', { name: 'Warning' })).toHaveClass('text-fg-warning');
    expect(screen.getByText('SRP')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('border-l-brand-cobalt', 'bg-surface-subtle');
    expect(screen.getByText('refactor_candidate')).toHaveClass('font-code-inline');
  });
});

describe('CheckList, MetricTile, ProgressBar variants', () => {
  it('CheckList uses the given icon and tone', () => {
    render(<CheckList icon="close" tone="danger" items={['More classes']} />);
    expect(screen.getByText('close')).toHaveClass('text-fg-danger');
  });
  it('MetricTile brand tone and hint', () => {
    render(<MetricTile label="Latency" value="41ms" tone="brand" hint="Beats 82.4%" hintTone="success" />);
    expect(screen.getByText('41ms')).toHaveClass('text-fg-brand');
    expect(screen.getByText('Beats 82.4%')).toHaveClass('text-fg-success');
  });
  it('ProgressBar accepts node labels, a value label, a caption and a small size', () => {
    render(<ProgressBar label={<b>Mastery</b>} valueLabel="7 of 12" caption="5 remaining" value={7} max={12} size="sm" />);
    const bar = screen.getByRole('progressbar', { name: 'Mastery' });
    expect(bar).toHaveClass('h-1');
    expect(screen.getByText('7 of 12')).toBeInTheDocument();
    expect(screen.queryByText('58%')).toBeNull();
    expect(screen.getByText('5 remaining')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/variants-b.test.tsx`
Expected: FAIL, because `Card.Header` is undefined and the variant classes are missing.

- [ ] **Step 3: Implement**

`src/components/Card.tsx` (replace the whole file):

```tsx
import { Children, isValidElement, type ElementType, type ReactNode } from 'react';
import { cx, FOCUS_RING } from '../internal/cx';
import type { NativeProps, PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { PADDING, type Space } from '../internal/tables';

const TONE = {
  default: 'bg-surface-elevated border border-border-subtle text-on-surface',
  subtle: 'bg-surface-subtle border border-border-subtle text-on-surface',
  inverse: 'bg-brand-obsidian border border-brand-slate text-on-primary',
} as const;
const PATTERN = { none: '', dots: 'bg-pattern-dots', grid: 'bg-pattern-grid' } as const;
const ASPECT = { video: 'aspect-video', wide: 'aspect-[21/9]', square: 'aspect-square' } as const;
const HEIGHT = { sm: 'h-30', md: 'h-35' } as const;
const INVERSE_BAR = 'group-data-[tone=inverse]/card:border-white/10 group-data-[tone=inverse]/card:bg-white/5';

export type CardHeaderProps = NativeProps<'div', { start?: ReactNode; end?: ReactNode; children?: ReactNode }>;
export type CardMediaProps = NativeProps<'div', {
  pattern?: keyof typeof PATTERN;
  aspect?: keyof typeof ASPECT;
  /** Fixed height instead of an aspect ratio (120px / 140px). */
  height?: keyof typeof HEIGHT;
  caption?: ReactNode;
  children?: ReactNode;
}>;
export type CardFooterProps = NativeProps<'div', { children: ReactNode }>;

export function CardHeader({ start, end, children, ...rest }: CardHeaderProps) {
  return (
    <div {...rest} className={cx('flex min-w-0 flex-wrap items-center justify-between gap-space-sm border-b border-border-subtle bg-surface-subtle px-space-lg py-space-sm', INVERSE_BAR)}>
      <div className="flex min-w-0 items-center gap-space-sm">{start ?? children}</div>
      {end && <div className="flex shrink-0 flex-wrap items-center gap-space-sm">{end}</div>}
    </div>
  );
}

export function CardMedia({ pattern = 'dots', aspect = 'video', height, caption, children, ...rest }: CardMediaProps) {
  return (
    <div
      {...rest}
      className={cx('relative flex min-w-0 items-center justify-center border-b border-border-subtle bg-surface-subtle', INVERSE_BAR, PATTERN[pattern], height ? HEIGHT[height] : ASPECT[aspect])}
    >
      {caption && <span className="absolute left-space-sm top-space-sm font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{caption}</span>}
      {children}
    </div>
  );
}

export function CardFooter({ children, ...rest }: CardFooterProps) {
  return (
    <div {...rest} className={cx('flex min-w-0 flex-wrap items-center justify-between gap-space-sm border-t border-border-subtle bg-surface-subtle px-space-lg py-space-sm', INVERSE_BAR)}>
      {children}
    </div>
  );
}

type CardOwnProps = {
  padding?: Responsive<Space>;
  interactive?: boolean;
  tone?: keyof typeof TONE;
  pattern?: keyof typeof PATTERN;
  children?: ReactNode;
};
export type CardProps<E extends ElementType = 'div'> = PolyProps<E, CardOwnProps>;

function CardRoot<E extends ElementType = 'div'>({ as, padding = 'lg', interactive, tone = 'default', pattern = 'none', children, ...rest }: CardProps<E>) {
  const C: ElementType = as ?? 'div';
  const parts = Children.toArray(children);
  const isType = (t: unknown) => (p: ReactNode) => isValidElement(p) && p.type === t;
  const header = parts.filter(isType(CardHeader));
  const media = parts.filter(isType(CardMedia));
  const footer = parts.filter(isType(CardFooter));
  const body = parts.filter((p) => !header.includes(p) && !media.includes(p) && !footer.includes(p));
  return (
    <C
      {...rest}
      data-tone={tone}
      className={cx('group/card flex min-w-0 flex-col overflow-hidden rounded-xl', TONE[tone], PATTERN[pattern], interactive && cx('transition-shadow hover:shadow-md', FOCUS_RING))}
    >
      {header}
      {media}
      <div className={cx('flex min-w-0 flex-1 flex-col gap-space-sm', responsive(PADDING, padding))}>{body}</div>
      {footer}
    </C>
  );
}

export const Card = Object.assign(CardRoot, { Header: CardHeader, Media: CardMedia, Footer: CardFooter });
```

`src/components/Callout.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const TONE = {
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
  info: 'bg-badge-intermediate-bg text-badge-intermediate-text',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
} as const;
const ICON = { danger: 'error', info: 'info', success: 'check_circle', warning: 'warning' } as const;
const SIZE = { sm: 'gap-space-xs rounded-lg p-space-sm', md: 'gap-space-sm rounded-xl p-space-md' } as const;

export type CalloutProps = NativeProps<'div', {
  tone?: keyof typeof TONE;
  title?: ReactNode;
  action?: ReactNode;
  /** false for static content (pros/cons): no status/alert role. */
  live?: boolean;
  icon?: string;
  size?: keyof typeof SIZE;
  accent?: boolean;
  children: ReactNode;
}>;

export function Callout({ tone = 'info', title, action, live = true, icon, size = 'md', accent, children, ...rest }: CalloutProps) {
  const role = live ? (tone === 'danger' ? 'alert' : 'status') : undefined;
  return (
    <div {...rest} role={role} className={cx('flex min-w-0 flex-wrap items-start border border-current/20', TONE[tone], SIZE[size], accent && 'border-l-4')}>
      <Icon name={icon ?? ICON[tone]} size={size === 'sm' ? 'sm' : 'md'} />
      <div className="min-w-0 flex-1">
        {title && <p className={cx('font-display wrap-break-word', size === 'sm' ? 'text-body-md font-semibold' : 'text-headline-sm')}>{title}</p>}
        <div className="font-body-sm text-body-sm wrap-break-word">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
```

`src/components/ResultRow.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const STATUS = {
  pass: { icon: 'check_circle', tone: 'success', label: 'Passed' },
  fail: { icon: 'cancel', tone: 'danger', label: 'Failed' },
  warning: { icon: 'warning', tone: 'warning', label: 'Warning' },
  pending: { icon: 'schedule', tone: 'muted', label: 'Pending' },
} as const;
const VARIANT = { plain: 'py-space-sm', boxed: 'rounded-lg border border-border-subtle bg-surface-subtle p-space-sm' } as const;

export type ResultRowProps = NativeProps<'div', {
  status: keyof typeof STATUS;
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  variant?: keyof typeof VARIANT;
  selected?: boolean;
  titleMono?: boolean;
}>;

export function ResultRow({ status, title, detail, meta, badge, variant = 'plain', selected, titleMono, ...rest }: ResultRowProps) {
  const s = STATUS[status];
  return (
    <div {...rest} className={cx('flex min-w-0 items-start gap-space-sm', VARIANT[variant], selected && 'border-l-4 border-l-brand-cobalt pl-space-sm')}>
      <Icon name={s.icon} tone={s.tone} filled label={s.label} />
      <div className="min-w-0 flex-1">
        <p className={cx('text-on-surface wrap-break-word', titleMono ? 'font-code-inline text-code-inline' : 'font-body-md text-body-md')}>{title}</p>
        {detail && <p className="whitespace-pre-wrap font-code-inline text-code-inline text-on-surface-variant wrap-break-word">{detail}</p>}
      </div>
      {(meta || badge) && (
        <div className="flex shrink-0 items-center gap-space-xs">
          {meta && <span className="font-label-mono text-label-mono text-on-surface-variant">{meta}</span>}
          {badge}
        </div>
      )}
    </div>
  );
}
```

`src/components/CheckList.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import type { Tone } from '../internal/tones';
import { Icon } from './Icon';

export type CheckListProps = NativeProps<'ul', { items: ReactNode[]; icon?: string; tone?: Tone; children?: never }>;

export function CheckList({ items, icon = 'check', tone = 'success', ...rest }: CheckListProps) {
  return (
    <ul {...rest} className="flex min-w-0 flex-col gap-space-xs">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-space-xs font-body-md text-body-md text-on-surface">
          <Icon name={icon} size="sm" tone={tone} />
          <span className="min-w-0 wrap-break-word">{item}</span>
        </li>
      ))}
    </ul>
  );
}
```

`src/ide/MetricTile.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { TEXT_TONE, type Tone } from '../internal/tones';

const TONE = { success: 'text-fg-success', danger: 'text-fg-danger', warning: 'text-fg-warning', brand: 'text-fg-brand', neutral: 'text-ink' } as const;

export type MetricTileProps = NativeProps<'div', {
  label: ReactNode;
  value: ReactNode;
  tone?: keyof typeof TONE;
  icon?: string;
  hint?: ReactNode;
  hintTone?: Tone;
}>;

export function MetricTile({ label, value, tone = 'neutral', icon, hint, hintTone = 'muted', ...rest }: MetricTileProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-2xs rounded-lg border border-border-subtle bg-surface-subtle p-space-sm">
      <span className="flex min-w-0 items-center gap-space-2xs font-label-mono text-label-mono uppercase text-on-surface-variant">
        {icon && <Icon name={icon} size="sm" />}
        <span className="truncate">{label}</span>
      </span>
      <span className={cx('truncate font-display text-headline-sm', TONE[tone])}>{value}</span>
      {hint && <span className={cx('truncate font-body-sm text-body-sm', TEXT_TONE[hintTone])}>{hint}</span>}
    </div>
  );
}
```

`src/components/ProgressBar.tsx` (replace the whole file):

```tsx
import { useId, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const TONE = { brand: 'bg-brand-cobalt', success: 'bg-brand-emerald', warning: 'bg-brand-amber', danger: 'bg-brand-crimson' } as const;
const SIZE = { sm: 'h-1', md: 'h-1.5' } as const;

export type ProgressBarProps = NativeProps<'div', {
  value: number;
  max?: number;
  tone?: keyof typeof TONE;
  label: ReactNode;
  hideLabel?: boolean;
  /** Replaces the computed percentage (e.g. "7 of 12"). */
  valueLabel?: ReactNode;
  caption?: ReactNode;
  size?: keyof typeof SIZE;
}>;

export function ProgressBar({ value, max = 100, tone = 'brand', label, hideLabel, valueLabel, caption, size = 'md', ...rest }: ProgressBarProps) {
  const id = useId();
  const safeMax = max > 0 ? max : 0;
  const clamped = safeMax ? Math.min(safeMax, Math.max(0, value)) : 0;
  const pct = safeMax ? Math.round((clamped / safeMax) * 100) : 0;
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-2xs">
      <div className={cx('flex justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant', hideLabel && 'sr-only')}>
        <span id={id} className="min-w-0 truncate">{label}</span>
        <span className="shrink-0 tabular-nums">{valueLabel ?? `${pct}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        className={cx('w-full overflow-hidden rounded-full bg-surface-muted', SIZE[size])}
      >
        <div className={cx('h-full rounded-full transition-[width]', TONE[tone])} style={{ width: `${pct}%` }} />
      </div>
      {caption && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{caption}</p>}
    </div>
  );
}
```

In `src/index.ts`, replace the Card export line with:

```ts
export { Card, CardFooter, CardHeader, CardMedia, type CardFooterProps, type CardHeaderProps, type CardMediaProps, type CardProps } from './components/Card';
```

- [ ] **Step 4: Run the tests to verify they pass (plus the existing guards)**

Run: `npx vitest run src/components/variants-b.test.tsx src/components/card.test.tsx src/components/display.test.tsx src/ide/ide-small.test.tsx src/native-props.test.tsx && npm run typecheck`
Expected: PASS, with 6 new tests. The existing Card order test (`['media','body','foot']`) still passes, because there is no header in it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: card header/subtle/pattern, callout/result-row/checklist/metric/progress variants

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Typography and layout variants, and `AppBar`

**Files:**
- Modify (replace the whole file each): `src/primitives/Heading.tsx`, `src/primitives/Text.tsx`, `src/primitives/Eyebrow.tsx`, `src/components/SectionHeader.tsx`, `src/components/EmptyState.tsx`, `src/primitives/Box.tsx`, `src/primitives/Split.tsx`
- Create: `src/primitives/AppBar.tsx`
- Modify: `src/index.ts`
- Test: `src/primitives/layout-v2.test.tsx`

**Interfaces:**
- Consumes: `IconTile` (Task 3), `Badge` + `BadgeTone`, `Dot`.
- Produces:
  - `Heading` `tone` adds `success|danger|warning`. It gains `truncate?` and `align?: 'start'|'center'`.
  - `Text` gains `align?: 'start'|'center'|'end'` and `measure?: boolean`. `variant` adds `'inherit'`, and `uppercase?: boolean` defaults to true for `label` and false otherwise.
  - `Eyebrow` gains `pulse?` and `variant?: 'pill'|'plain'`.
  - `SectionHeader` gains `description?`, `icon?: string`, `accent?: StatusTone`, `tagTone?: BadgeTone` and `size?: 'sm'|'md'`.
  - `EmptyState` gains `media?`, `code?: string` and `tone?: 'default'|'danger'`.
  - `Box` gains `dimmed?: boolean`.
  - `Split` gains `start?: ReactNode` and `stickyOffset?: 'none'|'appbar'`.
  - `AppBar({ position?: 'sticky'|'fixed'|'static' = 'sticky', start?, center?, end?, blur?: boolean = true, height?: 'sm'|'md' = 'md', contained?: boolean = true })`

- [ ] **Step 1: Write the failing test**

`src/primitives/layout-v2.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppBar, Box, EmptyState, Eyebrow, Heading, SectionHeader, Split, Text } from '../index';

describe('Heading and Text variants', () => {
  it('Heading success tone, truncate and centre alignment', () => {
    render(<Heading level={1} tone="success" truncate align="center">Accepted</Heading>);
    expect(screen.getByRole('heading', { name: 'Accepted' })).toHaveClass('text-fg-success', 'truncate', 'text-center');
  });
  it('Text align, measure, inherit variant and a non-uppercase label', () => {
    render(
      <>
        <Text align="center" measure>lead</Text>
        <Text as="span" variant="inherit" tone="brand">word</Text>
        <Text variant="label" uppercase={false}>Mono</Text>
      </>,
    );
    expect(screen.getByText('lead')).toHaveClass('text-center', 'max-w-prose');
    expect(screen.getByText('word')).not.toHaveClass('text-body-md');
    expect(screen.getByText('word')).toHaveClass('text-fg-brand');
    expect(screen.getByText('Mono')).toHaveClass('font-label-mono');
    expect(screen.getByText('Mono')).not.toHaveClass('uppercase');
  });
});

describe('Eyebrow, SectionHeader, EmptyState, Box variants', () => {
  it('Eyebrow plain with a pulsing dot', () => {
    const { container } = render(<Eyebrow variant="plain" pulse>Live</Eyebrow>);
    expect(container.firstElementChild).not.toHaveClass('border');
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });
  it('SectionHeader description, icon, accent, tag tone and size', () => {
    const { container } = render(<SectionHeader title="Creational" icon="category" accent="warning" tag="4 patterns" tagTone="warning" size="md" description="Object creation" />);
    expect(container.firstElementChild).toHaveClass('border-b-2', 'border-b-brand-amber');
    expect(screen.getByRole('heading', { name: 'Creational' })).toHaveClass('text-headline-md');
    expect(screen.getByText('4 patterns').parentElement).toHaveClass('bg-badge-amber-bg');
    expect(screen.getByText('Object creation')).toBeInTheDocument();
    expect(screen.getByText('category')).toBeInTheDocument();
  });
  it('EmptyState code numeral, media and danger tone', () => {
    render(<><EmptyState code="404" title="Problem not found" /><EmptyState tone="danger" title="Failed" description="500" media={<svg data-testid="art" />} /></>);
    expect(screen.getByText('404')).toHaveClass('font-label-mono');
    expect(screen.getByTestId('art')).toBeInTheDocument();
    expect(screen.getByText('500')).toHaveClass('text-fg-danger');
  });
  it('Box dimmed is inert', () => {
    render(<Box dimmed data-testid="b"><button type="button">x</button></Box>);
    expect(screen.getByTestId('b')).toHaveClass('opacity-40');
    expect(screen.getByTestId('b')).toHaveAttribute('inert');
  });
});

describe('Split start rail and sticky offset', () => {
  it('renders three columns from lg with the start rail hidden below lg', () => {
    render(<Split start={<nav>toc</nav>} aside={<p>facts</p>} sticky stickyOffset="appbar">main</Split>);
    const start = screen.getByText('toc').parentElement!;
    expect(start).toHaveClass('hidden', 'lg:block', 'lg:col-span-3', 'lg:sticky');
    expect(screen.getByText('main')).toHaveClass('lg:col-span-9', 'xl:col-span-7');
    expect(screen.getByText('facts').closest('aside')).toHaveClass('xl:col-span-3', 'xl:top-[calc(var(--spacing-appbar)+1rem)]');
    expect(start.parentElement).toHaveClass('lg:grid-cols-12');
  });
});

describe('AppBar', () => {
  it('is a sticky, blurred header with start/center/end slots', () => {
    render(<AppBar start={<span>logo</span>} center={<span>search</span>} end={<span>me</span>} />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'backdrop-blur-md', 'z-40');
    expect(header.firstElementChild).toHaveClass('h-16', 'max-w-7xl');
    expect(header).toHaveTextContent('logosearchme');
  });
  it('fixed, small, opaque and full width', () => {
    render(<AppBar position="fixed" height="sm" blur={false} contained={false} start="x" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'bg-surface-elevated');
    expect(header.firstElementChild).toHaveClass('h-12');
    expect(header.firstElementChild).not.toHaveClass('max-w-7xl');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/primitives/layout-v2.test.tsx`
Expected: FAIL, because `AppBar` is undefined and the variant classes are missing.

- [ ] **Step 3: Implement**

`src/primitives/Heading.tsx` (replace the whole file):

```tsx
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { HEADING_SIZE, type HeadingSize } from '../internal/tables';

const TAG = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;
const DEFAULT_SIZE: Record<keyof typeof TAG, HeadingSize> = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'sm' };
const TONE = {
  default: 'text-ink',
  muted: 'text-on-surface-variant',
  brand: 'text-fg-brand',
  inverse: 'text-on-primary',
  success: 'text-fg-success',
  danger: 'text-fg-danger',
  warning: 'text-fg-warning',
} as const;
const ALIGN = { start: '', center: 'text-center' } as const;

export type HeadingProps = NativeProps<'h2', {
  level: keyof typeof TAG;
  size?: Responsive<HeadingSize>;
  tone?: keyof typeof TONE;
  truncate?: boolean;
  align?: keyof typeof ALIGN;
}>;

export function Heading({ level, size, tone = 'default', truncate, align = 'start', ...rest }: HeadingProps) {
  const C = TAG[level];
  return (
    <C
      {...rest}
      className={cx('min-w-0 font-display', truncate ? 'truncate' : 'text-balance wrap-break-word', responsive(HEADING_SIZE, size ?? DEFAULT_SIZE[level]), TONE[tone], ALIGN[align])}
    />
  );
}
```

`src/primitives/Text.tsx` (replace the whole file):

```tsx
import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { TEXT_TONE, type Tone } from '../internal/tones';

const VARIANT = {
  'body-lead': 'font-body-lead text-body-lead',
  'body-md': 'font-body-md text-body-md',
  'body-sm': 'font-body-sm text-body-sm',
  label: 'font-label-mono text-label-mono',
  code: 'font-code-inline text-code-inline',
  /** Inherits font and size from the parent (inline highlights inside a Heading). */
  inherit: '',
} as const;
const WEIGHT = { regular: '', medium: 'font-medium', semibold: 'font-semibold' } as const;
const CLAMP = { 1: 'line-clamp-1', 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4' } as const;
const ALIGN = { start: 'text-start', center: 'text-center', end: 'text-end' } as const;

type TextOwnProps = {
  variant?: keyof typeof VARIANT;
  tone?: Tone;
  weight?: keyof typeof WEIGHT;
  truncate?: boolean;
  clamp?: keyof typeof CLAMP;
  align?: keyof typeof ALIGN;
  /** Limit line length to a readable measure. */
  measure?: boolean;
  /** Defaults to true for `label`, false otherwise. */
  uppercase?: boolean;
};
export type TextProps<E extends ElementType = 'p'> = PolyProps<E, TextOwnProps>;

export function Text<E extends ElementType = 'p'>({
  as,
  variant = 'body-md',
  tone = 'default',
  weight = 'regular',
  truncate,
  clamp,
  align,
  measure,
  uppercase,
  ...rest
}: TextProps<E>) {
  const C: ElementType = as ?? 'p';
  const upper = uppercase ?? variant === 'label';
  return (
    <C
      {...rest}
      className={cx(
        'min-w-0 wrap-break-word',
        VARIANT[variant],
        TEXT_TONE[tone],
        WEIGHT[weight],
        truncate && 'truncate',
        clamp && CLAMP[clamp],
        align && ALIGN[align],
        measure && 'max-w-prose',
        upper && 'uppercase',
      )}
    />
  );
}
```

`src/primitives/Eyebrow.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { Dot } from '../components/Dot';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';

const VARIANT = {
  pill: 'rounded-full border border-border-subtle bg-surface-elevated px-space-sm py-space-2xs',
  plain: '',
} as const;

export type EyebrowProps = NativeProps<'span', { tone?: StatusTone; pulse?: boolean; variant?: keyof typeof VARIANT; children: ReactNode }>;

export function Eyebrow({ tone = 'brand', pulse, variant = 'pill', children, ...rest }: EyebrowProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-xs font-label-mono text-label-mono uppercase text-on-surface-variant', VARIANT[variant])}>
      <Dot tone={tone} pulse={pulse} />
      <span className="truncate">{children}</span>
    </span>
  );
}
```

`src/components/SectionHeader.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';
import { Heading } from '../primitives/Heading';
import { Badge, type BadgeTone } from './Badge';
import { Dot } from './Dot';
import { IconTile } from './IconTile';

const ACCENT: Record<StatusTone, string> = {
  neutral: 'border-b-2 border-b-border-strong',
  brand: 'border-b-2 border-b-brand-cobalt',
  success: 'border-b-2 border-b-brand-emerald',
  warning: 'border-b-2 border-b-brand-amber',
  danger: 'border-b-2 border-b-brand-crimson',
};

export type SectionHeaderProps = NativeProps<'div', {
  title: ReactNode;
  level?: 2 | 3;
  dot?: StatusTone;
  tag?: ReactNode;
  tagTone?: BadgeTone;
  meta?: ReactNode;
  description?: ReactNode;
  icon?: string;
  accent?: StatusTone;
  size?: 'sm' | 'md';
}>;

export function SectionHeader({ title, level = 2, dot, tag, tagTone = 'neutral', meta, description, icon, accent, size = 'sm', ...rest }: SectionHeaderProps) {
  return (
    <div {...rest} className={cx('flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-space-xs pb-space-sm', accent ? ACCENT[accent] : 'border-b border-border-subtle')}>
      {icon && <IconTile icon={icon} size="sm" tone={accent ?? 'neutral'} />}
      {dot && <Dot tone={dot} size="md" />}
      <Heading level={level} size={size}>{title}</Heading>
      {tag && <Badge tone={tagTone} uppercase>{tag}</Badge>}
      {meta && <span className="ml-auto min-w-0 max-w-full truncate font-label-mono text-label-mono uppercase text-on-surface-variant">{meta}</span>}
      {description && <p className="basis-full font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{description}</p>}
    </div>
  );
}
```

`src/components/EmptyState.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Heading } from '../primitives/Heading';
import { Icon } from './Icon';

const TONE = {
  default: { tile: 'bg-surface-muted text-on-surface-variant', text: 'text-on-surface-variant' },
  danger: { tile: 'bg-badge-advanced-bg text-badge-advanced-text', text: 'text-fg-danger' },
} as const;

export type EmptyStateProps = NativeProps<'div', {
  icon?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Illustration that replaces the icon. */
  media?: ReactNode;
  /** Large mono numeral such as "404"; replaces the icon. */
  code?: string;
  tone?: keyof typeof TONE;
}>;

export function EmptyState({ icon = 'inbox', title, description, action, media, code, tone = 'default', ...rest }: EmptyStateProps) {
  const t = TONE[tone];
  return (
    <div {...rest} className="flex min-w-0 flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
      {media ? (
        <div className="w-full min-w-0">{media}</div>
      ) : code ? (
        <p className="font-label-mono text-6xl font-semibold text-ink">{code}</p>
      ) : (
        <span className={cx('inline-flex size-12 items-center justify-center rounded-full', t.tile)}>
          <Icon name={icon} size="lg" />
        </span>
      )}
      <div className="w-full min-w-0">
        <Heading level={3} size="sm">{title}</Heading>
      </div>
      {description && <p className={cx('w-full min-w-0 max-w-prose font-body-sm text-body-sm wrap-break-word', t.text)}>{description}</p>}
      {action}
    </div>
  );
}
```

`src/primitives/Box.tsx` (replace the whole file):

```tsx
import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { PADDING, type Space } from '../internal/tables';

export type SurfaceTone = 'surface' | 'subtle' | 'elevated' | 'low' | 'inverse';

export const SURFACE_TONE: Record<SurfaceTone, string> = {
  surface: 'bg-surface text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface',
  elevated: 'bg-surface-elevated text-on-surface',
  low: 'bg-surface-container-low text-on-surface',
  inverse: 'bg-brand-obsidian text-on-primary',
};

const RADIUS = { none: '', sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl' } as const;
const BORDER = { none: '', subtle: 'border border-border-subtle', strong: 'border border-border-strong' } as const;
const SHADOW = { none: '', sm: 'shadow-sm', md: 'shadow-md' } as const;

type BoxOwnProps = {
  padding?: Responsive<Space>;
  radius?: keyof typeof RADIUS;
  tone?: SurfaceTone;
  border?: keyof typeof BORDER;
  shadow?: keyof typeof SHADOW;
  /** Greys out and disables the content (inert), e.g. a panel waiting on a runtime. */
  dimmed?: boolean;
};
export type BoxProps<E extends ElementType = 'div'> = PolyProps<E, BoxOwnProps>;

export function Box<E extends ElementType = 'div'>({ as, padding, radius = 'none', tone, border = 'none', shadow = 'none', dimmed, ...rest }: BoxProps<E>) {
  const C: ElementType = as ?? 'div';
  return (
    <C
      {...rest}
      inert={dimmed || undefined}
      className={cx(
        'min-w-0 max-w-full',
        tone && SURFACE_TONE[tone],
        responsive(PADDING, padding),
        RADIUS[radius],
        BORDER[border],
        SHADOW[shadow],
        dimmed && 'pointer-events-none select-none opacity-40',
      )}
    />
  );
}
```

`src/primitives/Split.tsx` (replace the whole file):

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { GAP, type Space } from '../internal/tables';

const MAIN = { '8/4': 'xl:col-span-8', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-9' } as const;
const ASIDE = { '8/4': 'xl:col-span-4', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-3' } as const;
const STICKY_ASIDE = {
  none: 'xl:sticky xl:top-space-lg xl:self-start',
  appbar: 'xl:sticky xl:top-[calc(var(--spacing-appbar)+1rem)] xl:self-start',
} as const;
const STICKY_START = {
  none: 'lg:sticky lg:top-space-lg lg:self-start',
  appbar: 'lg:sticky lg:top-[calc(var(--spacing-appbar)+1rem)] lg:self-start',
} as const;

export type SplitProps = NativeProps<'div', {
  ratio?: keyof typeof MAIN;
  aside: ReactNode;
  /** Leading rail (e.g. a table of contents) shown from lg; with it the layout is 3/7/2… columns and `ratio` is ignored. */
  start?: ReactNode;
  sticky?: boolean;
  /** Clear a sticky AppBar when sticking. */
  stickyOffset?: keyof typeof STICKY_ASIDE;
  gap?: Responsive<Space>;
  children: ReactNode;
}>;

/** Main + aside (stacked below xl); optional start rail from lg. */
export function Split({ ratio = '8/4', aside, start, sticky, stickyOffset = 'none', gap = 'lg', children, ...rest }: SplitProps) {
  if (start) {
    return (
      <div {...rest} className={cx('grid min-w-0 grid-cols-1 lg:grid-cols-12', responsive(GAP, gap))}>
        <div className={cx('hidden min-w-0 lg:col-span-3 lg:block xl:col-span-2', sticky && STICKY_START[stickyOffset])}>{start}</div>
        <div className="min-w-0 lg:col-span-9 xl:col-span-7">{children}</div>
        <aside className={cx('min-w-0 lg:col-span-9 lg:col-start-4 xl:col-span-3 xl:col-start-auto', sticky && STICKY_ASIDE[stickyOffset])}>{aside}</aside>
      </div>
    );
  }
  return (
    <div {...rest} className={cx('grid min-w-0 grid-cols-1 xl:grid-cols-12', responsive(GAP, gap))}>
      <div className={cx('min-w-0', MAIN[ratio])}>{children}</div>
      <aside className={cx('min-w-0', ASIDE[ratio], sticky && STICKY_ASIDE[stickyOffset])}>{aside}</aside>
    </div>
  );
}
```

`src/primitives/AppBar.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const POSITION = { sticky: 'sticky top-0', fixed: 'fixed inset-x-0 top-0', static: 'relative' } as const;
const HEIGHT = { sm: 'h-12', md: 'h-16' } as const;

export type AppBarProps = NativeProps<'header', {
  position?: keyof typeof POSITION;
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  blur?: boolean;
  /** md (64px) matches --spacing-appbar, which Split stickyOffset="appbar" clears. */
  height?: keyof typeof HEIGHT;
  /** Constrain the content to the 80rem page column. */
  contained?: boolean;
  children?: never;
}>;

export function AppBar({ position = 'sticky', start, center, end, blur = true, height = 'md', contained = true, ...rest }: AppBarProps) {
  return (
    <header {...rest} className={cx('z-40 w-full min-w-0 border-b border-border-subtle', POSITION[position], blur ? 'bg-surface-elevated/95 backdrop-blur-md' : 'bg-surface-elevated')}>
      <div className={cx('flex min-w-0 items-center gap-space-md px-gutter-fluid', HEIGHT[height], contained && 'mx-auto max-w-7xl')}>
        <div className="flex min-w-0 shrink-0 items-center gap-space-sm">{start}</div>
        <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
        <div className="flex shrink-0 items-center gap-space-xs">{end}</div>
      </div>
    </header>
  );
}
```

Append to `src/index.ts`:

```ts
export { AppBar, type AppBarProps } from './primitives/AppBar';
```

- [ ] **Step 4: Run the tests to verify they pass (plus the existing layout, typography and display guards)**

Run: `npx vitest run src/primitives src/components/display.test.tsx src/native-props.test.tsx && npm run typecheck`
Expected: PASS, with 9 new tests. The existing `Split` test still sees `xl:col-span-4 xl:sticky` and the parent `grid grid-cols-1 xl:grid-cols-12 gap-space-lg`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: app bar; heading/text/eyebrow/section-header/empty-state/box/split variants

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 7: `NavList` and `Pagination`

**Files:**
- Create: `src/components/NavList.tsx`, `src/components/Pagination.tsx`
- Modify: `src/index.ts`
- Test: `src/components/navigation.test.tsx`

**Interfaces:**
- Consumes: `Icon`, `IconButton` (variant `secondary`, Task 4), `cx`, `FOCUS_RING`, `TOUCH`, `TOUCH_ICON`.
- Produces:
  - `NavItem = { id: string; label: ReactNode; icon?: string; href?: string; as?: ElementType; count?: ReactNode; onSelect?: () => void }`
  - `NavList({ label, items, current?, heading?, variant?: 'sidebar'|'toc' = 'sidebar' })`
  - `pageRange(page, pageCount, siblingCount = 1): Array<number | 'gap'>`
  - `Pagination({ page, pageCount, onChange, siblingCount?, summary?, label? = 'Pagination' })`

- [ ] **Step 1: Write the failing test**

`src/components/navigation.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavList, Pagination } from '../index';
import { pageRange } from './Pagination';

describe('NavList', () => {
  it('renders links with aria-current on the current item, icons and counts', () => {
    render(
      <NavList
        label="Workspace"
        heading="Navigation"
        current="problems"
        items={[
          { id: 'home', label: 'Home', icon: 'home', href: '/' },
          { id: 'problems', label: 'Problems', icon: 'code', href: '/problems', count: 142 },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    const current = screen.getByRole('link', { name: /Problems/ });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('bg-surface-container-high', 'rounded-lg');
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
  it('toc variant uses a left accent; button items call onSelect', async () => {
    const onSelect = vi.fn();
    render(<NavList label="On this page" variant="toc" current="a" items={[{ id: 'a', label: 'Intent', href: '#a' }, { id: 'b', label: 'Structure', onSelect }]} />);
    expect(screen.getByRole('link', { name: 'Intent' })).toHaveClass('border-l-2', 'border-brand-cobalt');
    await userEvent.click(screen.getByRole('button', { name: 'Structure' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('pageRange', () => {
  it('lists every page when there are few', () => {
    expect(pageRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it('inserts gaps around the sibling window', () => {
    expect(pageRange(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12]);
    expect(pageRange(1, 12)).toEqual([1, 2, 'gap', 12]);
    expect(pageRange(12, 12)).toEqual([1, 'gap', 11, 12]);
  });
  it('clamps out-of-range pages', () => {
    expect(pageRange(0, 12)).toEqual(pageRange(1, 12));
    expect(pageRange(99, 12)).toEqual(pageRange(12, 12));
    expect(pageRange(1, 0)).toEqual([]);
  });
});

describe('Pagination', () => {
  it('marks the current page, disables prev on page 1 and moves with next', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} pageCount={12} onChange={onChange} summary="Showing 12 of 142" />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveTextContent('Showing 12 of 142');
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(2);
    await userEvent.click(screen.getByRole('button', { name: 'Page 12' }));
    expect(onChange).toHaveBeenCalledWith(12);
  });
  it('clamps out-of-range pages and renders nothing for a single page', () => {
    const { container, rerender } = render(<Pagination page={40} pageCount={3} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    rerender(<Pagination page={1} pageCount={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/navigation.test.tsx`
Expected: FAIL, because the import of `./Pagination` cannot be resolved.

- [ ] **Step 3: Implement**

`src/components/NavList.tsx`:

```tsx
import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type NavItem = { id: string; label: ReactNode; icon?: string; href?: string; as?: ElementType; count?: ReactNode; onSelect?: () => void };

const VARIANT = {
  sidebar: {
    item: 'rounded-lg px-space-sm py-space-xs font-body-md text-body-md',
    active: 'bg-surface-container-high font-medium text-ink',
    idle: 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
  },
  toc: {
    item: 'border-l-2 px-space-sm py-space-2xs font-body-sm text-body-sm',
    active: 'border-brand-cobalt bg-badge-intermediate-bg font-medium text-badge-intermediate-text',
    idle: 'border-transparent text-on-surface-variant hover:border-border-strong hover:text-on-surface',
  },
} as const;

export type NavListProps = NativeProps<'nav', {
  label: string;
  items: NavItem[];
  current?: string;
  heading?: ReactNode;
  variant?: keyof typeof VARIANT;
  children?: never;
}>;

/** Vertical navigation: app sidebar or in-page table of contents. */
export function NavList({ label, items, current, heading, variant = 'sidebar', ...rest }: NavListProps) {
  const v = VARIANT[variant];
  return (
    <nav {...rest} aria-label={label} className="min-w-0">
      {heading && <p className="px-space-sm pb-space-xs font-label-mono text-label-mono uppercase text-on-surface-variant">{heading}</p>}
      <ul className="flex min-w-0 flex-col gap-space-2xs">
        {items.map((item) => {
          const active = item.id === current;
          const C: ElementType = item.href ? (item.as ?? 'a') : 'button';
          return (
            <li key={item.id} className="min-w-0">
              <C
                {...(item.href ? { href: item.href } : { type: 'button' })}
                aria-current={active ? (item.href ? 'page' : 'true') : undefined}
                onClick={item.onSelect}
                className={cx('flex w-full min-w-0 items-center gap-space-sm text-left transition-colors', v.item, active ? v.active : v.idle, FOCUS_RING, TOUCH)}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.count !== undefined && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{item.count}</span>}
              </C>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

`src/components/Pagination.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { IconButton } from './IconButton';

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

/** Page numbers to show: first, last, a window of `siblingCount` around `page`, and gaps. */
export function pageRange(page: number, pageCount: number, siblingCount = 1): Array<number | 'gap'> {
  if (pageCount <= 0) return [];
  const p = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  if (pageCount <= 2 * siblingCount + 5) return range(1, pageCount);
  const left = Math.max(p - siblingCount, 2);
  const right = Math.min(p + siblingCount, pageCount - 1);
  const out: Array<number | 'gap'> = [1];
  if (left > 2) out.push('gap');
  out.push(...range(left, right));
  if (right < pageCount - 1) out.push('gap');
  out.push(pageCount);
  return out;
}

export type PaginationProps = NativeProps<'nav', {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  summary?: ReactNode;
  label?: string;
  children?: never;
}>;

/** Below md only the current page and "/ total" show between the arrows. */
export function Pagination({ page, pageCount, onChange, siblingCount = 1, summary, label = 'Pagination', ...rest }: PaginationProps) {
  if (pageCount <= 1) return null;
  const p = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  return (
    <nav {...rest} aria-label={label} className="flex min-w-0 flex-wrap items-center justify-between gap-space-sm">
      {summary && <p className="font-body-sm text-body-sm text-on-surface-variant">{summary}</p>}
      <ul className="flex items-center gap-space-2xs">
        <li>
          <IconButton icon="chevron_left" label="Previous page" variant="secondary" size="sm" disabled={p <= 1} onClick={() => onChange(p - 1)} />
        </li>
        {pageRange(p, pageCount, siblingCount).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-space-2xs text-on-surface-variant max-md:hidden">
              …
            </li>
          ) : (
            <li key={item} className={item === p ? '' : 'max-md:hidden'}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === p ? 'page' : undefined}
                onClick={() => onChange(item)}
                className={cx(
                  'inline-flex size-8 items-center justify-center rounded-lg font-label-mono text-label-mono transition-colors',
                  item === p ? 'bg-ink text-on-ink' : 'text-on-surface hover:bg-surface-muted',
                  FOCUS_RING,
                  TOUCH_ICON,
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li aria-hidden="true" className="font-label-mono text-label-mono text-on-surface-variant md:hidden">
          / {pageCount}
        </li>
        <li>
          <IconButton icon="chevron_right" label="Next page" variant="secondary" size="sm" disabled={p >= pageCount} onClick={() => onChange(p + 1)} />
        </li>
      </ul>
    </nav>
  );
}
```

Append to `src/index.ts`:

```ts
export { NavList, type NavItem, type NavListProps } from './components/NavList';
export { Pagination, pageRange, type PaginationProps } from './components/Pagination';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/navigation.test.tsx && npm run typecheck`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: nav list (sidebar and toc) and pagination

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: `Table` and `DescriptionList`

**Files:**
- Create: `src/components/Table.tsx`, `src/components/DescriptionList.tsx`
- Modify: `src/index.ts`
- Test: `src/components/data.test.tsx`

**Interfaces:**
- Produces:
  - `TableColumn = { key: string; header: ReactNode; align?: 'start'|'end'; mono?: boolean; width?: 'auto'|'min' }`
  - `Table({ caption: string, showCaption?, columns, rows: Record<string, ReactNode>[], rowKey?: (row, index) => string, density?: 'compact'|'normal', empty? })`: native div props go to the scroll region.
  - `DescriptionList({ items: { term, detail }[], layout?: 'stacked'|'inline', mono? })`

- [ ] **Step 1: Write the failing test**

`src/components/data.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DescriptionList, Table } from '../index';

const COLUMNS = [
  { key: 'name', header: 'Participant', mono: true },
  { key: 'role', header: 'Role' },
  { key: 'count', header: 'Count', align: 'end' as const, width: 'min' as const },
];

describe('Table', () => {
  it('renders a semantic table in a focusable, named scroll region', () => {
    render(<Table caption="Participants" columns={COLUMNS} rows={[{ name: 'Context', role: 'Holds a strategy', count: 1 }, { name: 'Strategy', role: 'Interface', count: 3 }]} rowKey={(r) => String(r.name)} />);
    const region = screen.getByRole('region', { name: 'Participants' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveClass('overflow-x-auto');
    const table = within(region).getByRole('table', { name: 'Participants' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Participant', 'Role', 'Count']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Context')).toHaveClass('font-code-inline');
    expect(screen.getByText('3')).toHaveClass('text-end');
    expect(screen.getByText('Participants', { selector: 'caption' })).toHaveClass('sr-only');
  });
  it('shows an empty row spanning every column', () => {
    render(<Table caption="Empty" columns={COLUMNS} rows={[]} empty="No participants" />);
    const cell = screen.getByText('No participants');
    expect(cell).toHaveAttribute('colspan', '3');
  });
});

describe('DescriptionList', () => {
  it('pairs terms and details', () => {
    render(<DescriptionList items={[{ term: 'Category', detail: 'Behavioral' }, { term: 'AKA', detail: 'Policy' }]} layout="inline" />);
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['Category', 'AKA']);
    expect(screen.getAllByRole('definition').map((d) => d.textContent)).toEqual(['Behavioral', 'Policy']);
    expect(screen.getByText('Category').parentElement).toHaveClass('sm:contents');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/data.test.tsx`
Expected: FAIL. `Table` and `DescriptionList` are undefined, so React throws "Element type is invalid".

- [ ] **Step 3: Implement**

`src/components/Table.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type TableColumn = { key: string; header: ReactNode; align?: 'start' | 'end'; mono?: boolean; width?: 'auto' | 'min' };

const PAD = { compact: 'px-space-sm py-space-xs', normal: 'px-space-md py-space-sm' } as const;
const ALIGN = { start: 'text-start', end: 'text-end' } as const;
const WIDTH = { auto: '', min: 'w-px whitespace-nowrap' } as const;

export type TableProps = NativeProps<'div', {
  caption: string;
  showCaption?: boolean;
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  rowKey?: (row: Record<string, ReactNode>, index: number) => string;
  density?: keyof typeof PAD;
  empty?: ReactNode;
  children?: never;
}>;

/** Semantic table inside a focusable horizontal scroller, so wide tables never widen the page. */
export function Table({ caption, showCaption, columns, rows, rowKey, density = 'normal', empty, ...rest }: TableProps) {
  return (
    <div
      {...rest}
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-border-subtle focus-visible:outline-2 focus-visible:outline-brand-cobalt"
    >
      <table className="w-full border-collapse font-body-sm text-body-sm text-on-surface">
        <caption className={showCaption ? 'caption-top px-space-md py-space-sm text-start font-label-mono text-label-mono uppercase text-on-surface-variant' : 'sr-only'}>
          {caption}
        </caption>
        <thead className="bg-surface-subtle">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cx('border-b border-border-subtle font-label-mono text-label-mono uppercase text-on-surface-variant', PAD[density], ALIGN[c.align ?? 'start'], WIDTH[c.width ?? 'auto'])}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {rows.length ? (
            rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i}>
                {columns.map((c) => (
                  <td key={c.key} className={cx('align-top wrap-break-word', PAD[density], ALIGN[c.align ?? 'start'], WIDTH[c.width ?? 'auto'], c.mono && 'font-code-inline text-code-inline')}>
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-space-md py-space-lg text-center text-on-surface-variant">
                {empty ?? 'No rows'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

`src/components/DescriptionList.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const LAYOUT = {
  stacked: 'flex flex-col gap-space-sm',
  inline: 'grid grid-cols-1 gap-x-space-md gap-y-space-xs sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)]',
} as const;

export type DescriptionListProps = NativeProps<'dl', {
  items: Array<{ term: ReactNode; detail: ReactNode }>;
  /** inline = term and detail side by side from sm. */
  layout?: keyof typeof LAYOUT;
  mono?: boolean;
  children?: never;
}>;

export function DescriptionList({ items, layout = 'stacked', mono, ...rest }: DescriptionListProps) {
  return (
    <dl {...rest} className={cx('min-w-0', LAYOUT[layout])}>
      {items.map((item, i) => (
        <div key={i} className={cx('min-w-0', layout === 'inline' && 'sm:contents')}>
          <dt className="font-label-mono text-label-mono uppercase text-on-surface-variant">{item.term}</dt>
          <dd className={cx('min-w-0 text-on-surface wrap-break-word', mono ? 'font-code-inline text-code-inline' : 'font-body-md text-body-md')}>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
```

Append to `src/index.ts`:

```ts
export { Table, type TableColumn, type TableProps } from './components/Table';
export { DescriptionList, type DescriptionListProps } from './components/DescriptionList';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/data.test.tsx && npm run typecheck`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: table and description list

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: `Timeline` and `Disclosure`

**Files:**
- Create: `src/components/Timeline.tsx`, `src/components/Disclosure.tsx`
- Modify: `src/index.ts`
- Test: `src/components/sequence.test.tsx`

**Interfaces:**
- Produces:
  - `TimelineStatus = 'done'|'current'|'locked'|'success'|'warning'|'danger'|'pending'`
  - `TimelineItem = { id, status, title, badge?, description?, meta? }`
  - `Timeline({ label, items })`
  - `Disclosure({ summary, children, open?, defaultOpen?, onOpenChange?, selected?, variant?: 'plain'|'row' })`

- [ ] **Step 1: Write the failing test**

`src/components/sequence.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Disclosure, Timeline } from '../index';

describe('Timeline', () => {
  it('is an ordered list with a spoken status for each item and aria-current on the current step', () => {
    render(
      <Timeline
        label="Learning track"
        items={[
          { id: '1', status: 'done', title: 'Parking lot' },
          { id: '2', status: 'current', title: 'Elevator', description: 'Next up' },
          { id: '3', status: 'locked', title: 'Rate limiter', meta: 'Unlocks after #2' },
        ]}
      />,
    );
    const list = screen.getByRole('list', { name: 'Learning track' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Completed: Parking lot');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).toHaveTextContent('Locked: Rate limiter');
    expect(screen.getByText('Unlocks after #2')).toBeInTheDocument();
  });
});

describe('Disclosure', () => {
  it('toggles an expandable region (uncontrolled)', async () => {
    render(<Disclosure summary="parks 100 cars concurrently">telemetry</Disclosure>);
    const button = screen.getByRole('button', { name: /parks 100 cars/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('telemetry')).not.toBeVisible();
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: /parks 100 cars/ })).toHaveTextContent('telemetry');
  });
  it('controlled mode reports changes without toggling itself; selected row style', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(<Disclosure summary="row" open={false} onOpenChange={onOpenChange} variant="row" selected>body</Disclosure>);
    await userEvent.click(screen.getByRole('button', { name: /row/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: /row/ })).toHaveAttribute('aria-expanded', 'false');
    expect(container.firstElementChild).toHaveClass('border-l-brand-cobalt');
  });
  it('can start open', () => {
    render(<Disclosure summary="s" defaultOpen>shown</Disclosure>);
    expect(screen.getByText('shown')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/sequence.test.tsx`
Expected: FAIL, because the components are undefined.

- [ ] **Step 3: Implement**

`src/components/Timeline.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type TimelineStatus = 'done' | 'current' | 'locked' | 'success' | 'warning' | 'danger' | 'pending';
export type TimelineItem = { id: string; status: TimelineStatus; title: ReactNode; badge?: ReactNode; description?: ReactNode; meta?: ReactNode };

// Marker pairs are the badge bg/text tokens inverted, AA in both scopes; `text` is spoken so colour is never the only signal.
const STATUS: Record<TimelineStatus, { icon: string; marker: string; text: string }> = {
  done: { icon: 'check', marker: 'bg-badge-beginner-text text-badge-beginner-bg', text: 'Completed' },
  current: { icon: 'radio_button_checked', marker: 'bg-badge-intermediate-text text-badge-intermediate-bg ring-4 ring-badge-intermediate-bg', text: 'Current' },
  locked: { icon: 'lock', marker: 'bg-surface-muted text-on-surface-variant', text: 'Locked' },
  success: { icon: 'check_circle', marker: 'bg-badge-beginner-text text-badge-beginner-bg', text: 'Passed' },
  warning: { icon: 'warning', marker: 'bg-badge-amber-text text-badge-amber-bg', text: 'Warning' },
  danger: { icon: 'close', marker: 'bg-badge-advanced-text text-badge-advanced-bg', text: 'Failed' },
  pending: { icon: 'schedule', marker: 'bg-surface-muted text-on-surface-variant', text: 'Pending' },
};

export type TimelineProps = NativeProps<'ol', { label: string; items: TimelineItem[]; children?: never }>;

export function Timeline({ label, items, ...rest }: TimelineProps) {
  return (
    <ol {...rest} aria-label={label} className="flex min-w-0 flex-col">
      {items.map((item, i) => {
        const s = STATUS[item.status];
        return (
          <li key={item.id} aria-current={item.status === 'current' ? 'step' : undefined} className="relative flex min-w-0 gap-space-sm pb-space-md last:pb-0">
            {i < items.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-3 top-7 w-px -translate-x-1/2 bg-border-subtle" />}
            <span aria-hidden="true" className={cx('relative inline-flex size-6 shrink-0 items-center justify-center rounded-full', s.marker)}>
              <Icon name={s.icon} size="sm" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex min-w-0 flex-wrap items-center gap-space-xs">
                <p className="font-body-md text-body-md font-medium text-on-surface wrap-break-word">
                  <span className="sr-only">{s.text}: </span>
                  {item.title}
                </p>
                {item.badge}
              </div>
              {item.description && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{item.description}</p>}
              {item.meta && <p className="font-label-mono text-label-mono text-on-surface-variant">{item.meta}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
```

`src/components/Disclosure.tsx`:

```tsx
import { useId, useState, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type DisclosureProps = NativeProps<'div', {
  /** Button content; keep it free of other interactive elements. */
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  selected?: boolean;
  variant?: 'plain' | 'row';
}>;

export function Disclosure({ summary, children, open, defaultOpen = false, onOpenChange, selected, variant = 'plain', ...rest }: DisclosureProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const row = variant === 'row';
  return (
    <div {...rest} className={cx('min-w-0', row && 'border-b border-border-subtle', selected && 'border-l-4 border-l-brand-cobalt')}>
      <button
        type="button"
        id={`${id}-button`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={toggle}
        className={cx('flex w-full min-w-0 items-center gap-space-sm text-left', row ? 'px-space-sm py-space-sm hover:bg-surface-subtle' : 'py-space-xs', FOCUS_RING, TOUCH)}
      >
        <span className="min-w-0 flex-1">{summary}</span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size="sm" tone="muted" />
      </button>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} hidden={!isOpen} className={cx('min-w-0', row ? 'px-space-sm pb-space-sm' : 'pb-space-xs')}>
        {children}
      </div>
    </div>
  );
}
```

Append to `src/index.ts`:

```ts
export { Timeline, type TimelineItem, type TimelineProps, type TimelineStatus } from './components/Timeline';
export { Disclosure, type DisclosureProps } from './components/Disclosure';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/sequence.test.tsx && npm run typecheck`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: timeline and disclosure

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: `Skeleton`, `TerminalOutput` and `VerdictBanner`

**Files:**
- Create: `src/components/Skeleton.tsx`, `src/components/TerminalOutput.tsx`, `src/components/VerdictBanner.tsx`
- Modify: `src/index.ts`
- Test: `src/components/states.test.tsx`

**Interfaces:**
- Consumes: `IconTile` (Task 3).
- Produces:
  - `Skeleton({ shape?: 'line'|'pill'|'rect'|'circle' = 'line', width?: 'full'|'3/4'|'1/2'|'1/3'|'1/4' = 'full', height?: 'xs'|'sm'|'md'|'lg'|'xl', lines? })`
  - `TerminalLine = { kind: 'command'|'plain'|'error'|'warning'|'hint'|'success'; text: string }`
  - `TerminalOutput({ lines, title?, status?, maxHeight?: 'sm'|'md'|'lg'|'none' = 'md' })`
  - `VerdictBanner({ tone: 'success'|'danger'|'warning', icon, title, badge?, meta?: ReactNode[], actions? })`

- [ ] **Step 1: Write the failing test**

`src/components/states.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/states.test.tsx`
Expected: FAIL, because the components are undefined.

- [ ] **Step 3: Implement**

`src/components/Skeleton.tsx`:

```tsx
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const SHAPE = { line: 'rounded', pill: 'rounded-full', rect: 'rounded-xl', circle: 'rounded-full aspect-square' } as const;
const WIDTH = { full: 'w-full', '3/4': 'w-3/4', '1/2': 'w-1/2', '1/3': 'w-1/3', '1/4': 'w-1/4' } as const;
const HEIGHT = { xs: 'h-2', sm: 'h-3', md: 'h-4', lg: 'h-8', xl: 'h-24' } as const;
const DEFAULT_HEIGHT: Record<keyof typeof SHAPE, keyof typeof HEIGHT> = { line: 'sm', pill: 'lg', rect: 'xl', circle: 'lg' };

export type SkeletonProps = NativeProps<'div', {
  shape?: keyof typeof SHAPE;
  width?: keyof typeof WIDTH;
  height?: keyof typeof HEIGHT;
  /** Render n text lines (the last one shorter). */
  lines?: number;
  children?: never;
}>;

/** Loading placeholder. Hidden from assistive tech: pair it with a <Message> saying what is loading. */
export function Skeleton({ shape = 'line', width = 'full', height, lines, ...rest }: SkeletonProps) {
  const h = HEIGHT[height ?? DEFAULT_HEIGHT[shape]];
  if (lines && lines > 1) {
    return (
      <div {...rest} aria-hidden="true" className="flex w-full min-w-0 flex-col gap-space-xs">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cx('skeleton-shimmer rounded', h, i === lines - 1 ? 'w-3/4' : 'w-full')} />
        ))}
      </div>
    );
  }
  return <div {...rest} aria-hidden="true" className={cx('skeleton-shimmer shrink-0', SHAPE[shape], h, shape !== 'circle' && WIDTH[width])} />;
}
```

`src/components/TerminalOutput.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type TerminalLine = { kind: 'command' | 'plain' | 'error' | 'warning' | 'hint' | 'success'; text: string };

// Always on the dark obsidian surface: these palette colours are AA on #0F172A.
const KIND: Record<TerminalLine['kind'], string> = {
  command: 'text-slate-100',
  plain: 'text-slate-300',
  error: 'border-l-2 border-red-400 bg-red-500/10 pl-space-sm text-red-300',
  warning: 'text-amber-300',
  hint: 'text-sky-300',
  success: 'text-emerald-300',
};
const MAX = { sm: 'max-h-40', md: 'max-h-72', lg: 'max-h-[32rem]', none: '' } as const;

export type TerminalOutputProps = NativeProps<'figure', {
  lines: TerminalLine[];
  title?: ReactNode;
  status?: ReactNode;
  maxHeight?: keyof typeof MAX;
  children?: never;
}>;

export function TerminalOutput({ lines, title, status, maxHeight = 'md', ...rest }: TerminalOutputProps) {
  return (
    <figure {...rest} className="min-w-0 max-w-full overflow-hidden rounded-xl bg-brand-obsidian">
      {(title || status) && (
        <figcaption className="flex min-w-0 items-center justify-between gap-space-sm border-b border-white/10 px-space-md py-space-xs font-label-mono text-label-mono uppercase text-slate-300">
          <span className="truncate">{title}</span>
          {status}
        </figcaption>
      )}
      <div
        role="log"
        aria-label={typeof title === 'string' ? title : 'Output'}
        tabIndex={0}
        className={cx('overflow-auto p-space-md font-code-inline text-code-inline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt', MAX[maxHeight])}
      >
        {lines.map((line, i) => (
          <div key={i} className={cx('whitespace-pre-wrap wrap-break-word', KIND[line.kind])}>
            {line.kind === 'command' && (
              <span aria-hidden="true" className="select-none text-slate-400">
                ${' '}
              </span>
            )}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
```

`src/components/VerdictBanner.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { IconTile } from './IconTile';

const TITLE = { success: 'text-fg-success', danger: 'text-fg-danger', warning: 'text-fg-warning' } as const;

export type VerdictBannerProps = NativeProps<'section', {
  tone: keyof typeof TITLE;
  icon: string;
  title: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode[];
  actions?: ReactNode;
  children?: never;
}>;

/** Result hero ("Accepted"): stacks below md, a row from md. */
export function VerdictBanner({ tone, icon, title, badge, meta, actions, ...rest }: VerdictBannerProps) {
  return (
    <section {...rest} className="flex min-w-0 flex-col gap-space-md rounded-xl border border-border-subtle bg-surface-elevated p-space-lg md:flex-row md:items-center">
      <IconTile icon={icon} tone={tone} size="xl" shape="circle" filled />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-space-sm">
          <h2 className={cx('min-w-0 font-display text-headline-xl wrap-break-word', TITLE[tone])}>{title}</h2>
          {badge}
        </div>
        {meta && meta.length > 0 && (
          <ul className="mt-space-xs flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-space-2xs font-body-sm text-body-sm text-on-surface-variant">
            {meta.map((m, i) => (
              <li key={i} className="flex items-center gap-space-sm">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-border-strong" />}
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-space-sm">{actions}</div>}
    </section>
  );
}
```

The test expects `listitem` text to be exactly `['41ms', 'attempt #3']`; the separator span is empty, so that holds.

Append to `src/index.ts`:

```ts
export { Skeleton, type SkeletonProps } from './components/Skeleton';
export { TerminalOutput, type TerminalLine, type TerminalOutputProps } from './components/TerminalOutput';
export { VerdictBanner, type VerdictBannerProps } from './components/VerdictBanner';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/states.test.tsx && npm run typecheck`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: skeleton, terminal output and verdict banner

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: `Checkbox`, `Switch`, `Overlay` and TextField variants

**Files:**
- Create: `src/components/Checkbox.tsx`, `src/components/Switch.tsx`, `src/components/Overlay.tsx`
- Modify (replace the whole file): `src/components/TextField.tsx`
- Modify: `src/index.ts`
- Test: `src/components/forms.test.tsx`

**Interfaces:**
- Consumes: `IconButton` (size `xs`, Task 4), `Icon`.
- Produces:
  - `Checkbox({ label, description?, strikeWhenChecked?, indeterminate?, ...input props })`
  - `Switch({ label, checked, onChange(checked), description?, ...button props })`
  - `Overlay({ children, overlay, blur? = true })`
  - `TextField` gains `labelEnd?`, `revealable?` and `size?: 'sm'|'md' = 'md'`.

- [ ] **Step 1: Write the failing test**

`src/components/forms.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/forms.test.tsx`
Expected: FAIL, because the components are undefined and the TextField props are missing.

- [ ] **Step 3: Implement**

`src/components/Checkbox.tsx`:

```tsx
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type CheckboxProps = NativeProps<'input', {
  label: ReactNode;
  description?: ReactNode;
  /** Strike the label through while checked (task lists). */
  strikeWhenChecked?: boolean;
  indeterminate?: boolean;
}>;

export function Checkbox({ label, description, strikeWhenChecked, indeterminate, id, ...rest }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descId = `${inputId}-desc`;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <div className={cx('group flex min-w-0 items-start gap-space-sm', TOUCH)}>
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-describedby={cx(rest['aria-describedby'], description && descId) || undefined}
          className={cx(
            'peer size-4 cursor-pointer appearance-none rounded border border-border-strong bg-surface-elevated checked:border-brand-cobalt checked:bg-brand-cobalt indeterminate:border-brand-cobalt indeterminate:bg-brand-cobalt disabled:cursor-not-allowed disabled:opacity-50',
            FOCUS_RING,
          )}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
          <Icon name="check" size="sm" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-indeterminate:flex">
          <Icon name="remove" size="sm" />
        </span>
      </span>
      <span className="min-w-0">
        <label htmlFor={inputId} className={cx('cursor-pointer font-body-md text-body-md text-on-surface wrap-break-word', strikeWhenChecked && 'group-has-checked:text-on-surface-variant group-has-checked:line-through')}>
          {label}
        </label>
        {description && (
          <p id={descId} className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">
            {description}
          </p>
        )}
      </span>
    </div>
  );
}
```

`src/components/Switch.tsx`:

```tsx
import { useId, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type SwitchProps = NativeProps<'button', {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: ReactNode;
  children?: never;
}>;

export function Switch({ label, checked, onChange, description, ...rest }: SwitchProps) {
  const id = useId();
  return (
    <div className={cx('flex min-w-0 items-start justify-between gap-space-md', TOUCH)}>
      <div className="min-w-0">
        <span id={`${id}-label`} className="font-body-md text-body-md text-on-surface">{label}</span>
        {description && <p id={`${id}-desc`} className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{description}</p>}
      </div>
      <button
        {...rest}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cx('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50', checked ? 'bg-brand-cobalt' : 'bg-border-strong', FOCUS_RING)}
      >
        <span aria-hidden="true" className={cx('inline-block size-5 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-5.5' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}
```

`src/components/Overlay.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type OverlayProps = NativeProps<'div', { children: ReactNode; overlay: ReactNode; blur?: boolean }>;

/** Covers content (e.g. a signed-out gate): covered content is inert and hidden from assistive tech. */
export function Overlay({ children, overlay, blur = true, ...rest }: OverlayProps) {
  return (
    <div {...rest} className="relative min-w-0 overflow-hidden rounded-xl">
      <div inert aria-hidden="true" className={cx('pointer-events-none select-none', blur && 'blur-sm')}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-surface/70 p-space-md">{overlay}</div>
    </div>
  );
}
```

`src/components/TextField.tsx` (replace the whole file):

```tsx
import { useId, useState, type ReactNode } from 'react';
import { cx, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

const SIZE = { sm: 'h-8', md: 'h-10' } as const;
const TEXT = { sm: 'font-body-sm text-body-sm', md: 'font-body-md text-body-md' } as const;

export type TextFieldProps = NativeProps<'input', {
  label: string;
  hideLabel?: boolean;
  icon?: string;
  hint?: ReactNode;
  error?: string;
  /** Content at the end of the label row (e.g. a "Forgot password?" link). */
  labelEnd?: ReactNode;
  /** Adds a show/hide toggle for password fields. */
  revealable?: boolean;
  size?: keyof typeof SIZE;
}>;

export function TextField({ label, hideLabel, icon, hint, error, labelEnd, revealable, size = 'md', id, type, ...rest }: TextFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const errorId = `${inputId}-error`;
  const [shown, setShown] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-space-2xs">
      <div className={cx('flex min-w-0 items-center justify-between gap-space-sm', hideLabel && !labelEnd && 'sr-only')}>
        <label htmlFor={inputId} className={cx('font-body-sm text-body-sm font-medium text-on-surface', hideLabel && 'sr-only')}>
          {label}
        </label>
        {labelEnd}
      </div>
      <div
        className={cx(
          'flex min-w-0 items-center gap-space-xs rounded-lg border bg-surface-subtle px-space-sm focus-within:ring-2 focus-within:ring-brand-cobalt',
          SIZE[size],
          error ? 'border-fg-danger' : 'border-border-subtle',
          TOUCH,
        )}
      >
        {icon && <Icon name={icon} size="sm" tone="muted" />}
        <input
          {...rest}
          id={inputId}
          type={revealable ? (shown ? 'text' : 'password') : type}
          aria-invalid={error ? true : rest['aria-invalid']}
          aria-describedby={cx(rest['aria-describedby'], error && errorId) || undefined}
          className={cx('h-full min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant', TEXT[size])}
        />
        {hint && <span className="shrink-0">{hint}</span>}
        {revealable && (
          <IconButton icon={shown ? 'visibility_off' : 'visibility'} label="Show password" aria-pressed={shown} size="xs" onClick={() => setShown((s) => !s)} />
        )}
      </div>
      {error && (
        <p id={errorId} className="font-body-sm text-body-sm text-fg-danger">
          {error}
        </p>
      )}
    </div>
  );
}
```

The existing `TextField` test checks `screen.getByText('Search')` has `sr-only`. That still holds, because the label element keeps `sr-only` when `hideLabel` is set.

Append to `src/index.ts`:

```ts
export { Checkbox, type CheckboxProps } from './components/Checkbox';
export { Switch, type SwitchProps } from './components/Switch';
export { Overlay, type OverlayProps } from './components/Overlay';
```

- [ ] **Step 4: Run the tests to verify they pass (plus the existing inputs and native-props guards)**

Run: `npx vitest run src/components/forms.test.tsx src/components/inputs.test.tsx src/native-props.test.tsx && npm run typecheck`
Expected: PASS, with 6 new tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: checkbox, switch, overlay; text field labelEnd, password reveal and compact size

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 12: Menu, Tabs, SegmentedControl and FileTree variants

**Files:**
- Modify (replace the whole file): `src/components/Menu.tsx`, `src/components/SegmentedControl.tsx`
- Modify (targeted edits): `src/components/Tabs.tsx`, `src/ide/tree.ts`, `src/ide/FileTree.tsx`
- Modify: `src/index.ts`
- Test: `src/components/variants-c.test.tsx`

**Interfaces:**
- Consumes: `Kbd`, `Dot`, `Icon`.
- Produces:
  - `MenuItem` gains `meta?: ReactNode` and `shortcut?: string`.
  - `MenuSeparator = { type: 'separator' }` and `MenuEntry = MenuItem | MenuSeparator`. `Menu` takes `items: MenuEntry[]`, `header?` and `footer?`.
  - `TabItem` gains `badge?: ReactNode`.
  - `SegmentedOption` gains `hideLabel?` and `dot?: StatusTone`.
  - `FileNode` gains `icon?`, `status?: 'success'|'warning'|'danger'|'info'` and `meta?: ReactNode`.

- [ ] **Step 1: Write the failing test**

`src/components/variants-c.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button, FileTree, Menu, SegmentedControl, Tabs } from '../index';

describe('Menu variants', () => {
  function setup() {
    render(
      <Menu
        label="Account"
        header={<p>Alex Lin</p>}
        footer={<p>Session #38291</p>}
        items={[
          { label: 'Submissions', meta: '28' },
          { type: 'separator' },
          { label: 'Settings', shortcut: '⌘,' },
          { type: 'separator' },
          { label: 'Sign out', tone: 'danger' },
        ]}
        trigger={(p) => <Button {...p}>Account</Button>}
      />,
    );
    return screen.getByRole('button', { name: 'Account' });
  }
  it('renders header, footer, separators, meta and shortcuts outside the menuitem role tree', async () => {
    await userEvent.click(setup());
    expect(screen.getByText('Alex Lin').closest('[role=menu]')).toBeNull();
    expect(screen.getByText('Session #38291')).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(2);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('⌘,').tagName).toBe('KBD');
  });
  it('skips separators with the keyboard', async () => {
    const trigger = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Submissions/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Submissions/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();
  });
});

describe('Tabs badge, SegmentedControl hideLabel/dot', () => {
  it('Tabs renders a badge node', () => {
    render(<Tabs label="Panel" value="t" items={[{ id: 't', label: 'Test Results', badge: <span>6/8 Passing</span> }]} />);
    expect(screen.getByRole('tab', { name: /Test Results/ })).toHaveTextContent('6/8 Passing');
  });
  it('icon-only options keep an accessible name; dots render', () => {
    const { container } = render(
      <SegmentedControl
        label="View"
        value="grid"
        onChange={() => {}}
        options={[
          { value: 'grid', label: 'Grid view', icon: 'grid_view', hideLabel: true },
          { value: 'go', label: 'Go', dot: 'success' },
        ]}
      />,
    );
    const grid = screen.getByRole('radio', { name: 'Grid view' });
    expect(grid).not.toHaveTextContent('Grid view');
    expect(grid).toHaveClass('max-md:min-w-11');
    expect(container.querySelector('.bg-brand-emerald')).not.toBeNull();
  });
});

describe('FileTree node variants', () => {
  it('uses a custom icon, a named status icon and meta', () => {
    render(
      <FileTree
        label="Files"
        onOpen={() => {}}
        nodes={[
          { path: 'parking_test.go', kind: 'file', status: 'success', meta: '42 lines' },
          { path: 'README.md', kind: 'file', icon: 'info' },
        ]}
      />,
    );
    expect(screen.getByRole('treeitem', { name: /parking_test\.go Passing/ })).toBeInTheDocument();
    expect(screen.getByText('42 lines')).toBeInTheDocument();
    expect(screen.getByText('info')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/variants-c.test.tsx`
Expected: FAIL. There is no separator or header support, no badge, hideLabel still renders the text, and there is no status icon.

- [ ] **Step 3: Implement**

`src/components/Menu.tsx` (replace the whole file):

```tsx
import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { cx, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { rovingIndex } from '../internal/roving';
import { Icon } from './Icon';
import { Kbd } from './Kbd';

export type MenuItem = {
  label: string;
  icon?: string;
  onSelect?: () => void;
  href?: string;
  as?: ElementType;
  tone?: 'default' | 'danger';
  meta?: ReactNode;
  shortcut?: string;
};
export type MenuSeparator = { type: 'separator' };
export type MenuEntry = MenuItem | MenuSeparator;

const isItem = (e: MenuEntry): e is MenuItem => !('type' in e);

export type MenuTriggerProps = {
  ref: RefObject<HTMLButtonElement | null>;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

export type MenuProps = NativeProps<'div', {
  label: string;
  trigger: (props: MenuTriggerProps) => ReactNode;
  items: MenuEntry[];
  align?: 'start' | 'end';
  /** Rendered above the menu items, outside the menu role (e.g. the signed-in user). */
  header?: ReactNode;
  footer?: ReactNode;
  children?: never;
}>;

export function Menu({ label, trigger, items, align = 'end', header, footer, ...rest }: MenuProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const pendingFocus = useRef<number | null>(null);
  const actions = items.filter(isItem);

  const openAt = (index: number | null) => {
    pendingFocus.current = index;
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    if (pendingFocus.current !== null) itemRefs.current[pendingFocus.current]?.focus();
    pendingFocus.current = null;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Open with focus on actionable item `index`, or move focus there if already open.
  const focusItem = (index: number) => (open ? itemRefs.current[index]?.focus() : openAt(index));

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(actions.length - 1);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      close(true);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key === 'Tab') {
      setOpen(false);
      return;
    }
    const current = itemRefs.current.indexOf(document.activeElement as HTMLElement);
    const next = rovingIndex(e.key, Math.max(0, current), actions.length);
    if (next === null) return;
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  let actionIndex = 0;
  return (
    <div {...rest} ref={rootRef} className="relative inline-flex">
      {trigger({
        ref: triggerRef,
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => (open ? close(false) : openAt(0)),
        onKeyDown: onTriggerKeyDown,
      })}
      {open && (
        <div
          className={cx(
            'absolute top-full z-40 mt-space-xs flex min-w-48 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {header && <div className="border-b border-border-subtle px-space-sm py-space-sm">{header}</div>}
          <div id={menuId} role="menu" aria-label={label} onKeyDown={onMenuKeyDown} className="flex flex-col p-space-2xs">
            {items.map((entry, i) => {
              if (!isItem(entry)) return <div key={`sep-${i}`} role="separator" className="my-space-2xs h-px bg-border-subtle" />;
              const index = actionIndex++;
              const C: ElementType = entry.href ? (entry.as ?? 'a') : 'button';
              return (
                <C
                  key={i}
                  ref={(el: HTMLElement | null) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  tabIndex={-1}
                  {...(entry.href ? { href: entry.href } : { type: 'button' })}
                  onClick={() => {
                    entry.onSelect?.();
                    close(!entry.href);
                  }}
                  className={cx(
                    'flex w-full items-center gap-space-sm rounded-lg px-space-sm py-space-xs text-left font-body-md text-body-md outline-none hover:bg-surface-muted focus:bg-surface-muted',
                    entry.tone === 'danger' ? 'text-fg-danger' : 'text-on-surface',
                    TOUCH,
                  )}
                >
                  {entry.icon && <Icon name={entry.icon} size="sm" />}
                  <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                  {entry.meta !== undefined && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{entry.meta}</span>}
                  {entry.shortcut && <Kbd>{entry.shortcut}</Kbd>}
                </C>
              );
            })}
          </div>
          {footer && <div className="border-t border-border-subtle bg-surface-subtle px-space-sm py-space-xs">{footer}</div>}
        </div>
      )}
    </div>
  );
}
```

`src/components/SegmentedControl.tsx` (replace the whole file):

```tsx
import { useRef, type KeyboardEvent } from 'react';
import { cx, FOCUS_RING, TOUCH, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { rovingIndex } from '../internal/roving';
import type { StatusTone } from '../internal/tones';
import { Dot } from './Dot';
import { Icon } from './Icon';

/** `hideLabel` shows only the icon; `label` stays the accessible name. */
export type SegmentedOption = { value: string; label: string; icon?: string; hideLabel?: boolean; dot?: StatusTone };
export type SegmentedControlProps = NativeProps<'div', { label: string; options: SegmentedOption[]; value: string; onChange: (value: string) => void; children?: never }>;

export function SegmentedControl({ label, options, value, onChange, ...rest }: SegmentedControlProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const checkedIndex = options.findIndex((o) => o.value === value);
  const tabbable = checkedIndex === -1 ? 0 : checkedIndex;
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const next = rovingIndex(e.key, index, options.length);
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(options[next].value);
  };
  return (
    <div {...rest} role="radiogroup" aria-label={label} className="inline-flex min-w-0 max-w-full gap-space-2xs overflow-x-auto rounded-lg border border-border-subtle bg-surface-subtle p-space-2xs [scrollbar-width:none]">
      {options.map((o, i) => {
        const checked = i === checkedIndex;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={o.hideLabel ? o.label : undefined}
            title={o.hideLabel ? o.label : undefined}
            tabIndex={i === tabbable ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              'inline-flex shrink-0 items-center justify-center gap-space-xs whitespace-nowrap rounded-md py-space-xs font-button-text text-button-text transition-colors',
              o.hideLabel ? 'px-space-xs' : 'px-space-sm',
              checked ? 'bg-surface-elevated text-ink shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
              FOCUS_RING,
              o.hideLabel ? TOUCH_ICON : TOUCH,
            )}
          >
            {o.dot && <Dot tone={o.dot} />}
            {o.icon && <Icon name={o.icon} size="sm" />}
            {!o.hideLabel && o.label}
          </button>
        );
      })}
    </div>
  );
}
```

`src/components/Tabs.tsx`, two targeted edits:
1. Replace the `TabItem` type line with:

```ts
export type TabItem = { id: string; label: ReactNode; count?: number; badge?: ReactNode; dot?: StatusTone; href?: string; as?: ElementType; panelId?: string };
```

2. In `TabBody`, after the `count` line, add `{item.badge}`, so the body becomes:

```tsx
    <>
      {item.label}
      {item.count !== undefined && <Badge>{item.count}</Badge>}
      {item.badge}
      {item.dot && <Dot tone={item.dot} />}
    </>
```

`src/ide/tree.ts`, targeted edits:
1. Add `import type { ReactNode } from 'react';` as the first line.
2. Replace the `FileNode` type with:

```ts
export type FileNode = {
  path: string;
  kind: 'file' | 'dir';
  readOnly?: boolean;
  modified?: boolean;
  /** Material Symbol overriding the extension icon. */
  icon?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  meta?: ReactNode;
};
```

3. In `TreeItem`, add `icon?: string; status?: FileNode['status']; meta?: ReactNode;` after `modified?: boolean;`.
4. In `ensure`, add `icon: extra?.icon, status: extra?.status, meta: extra?.meta,` after `modified: extra?.modified,`.

`src/ide/FileTree.tsx`, targeted edits:
1. After the `fileIcon` function, add:

```ts
const STATUS_ICON = {
  success: { name: 'check_circle', tone: 'success', label: 'Passing' },
  warning: { name: 'warning', tone: 'warning', label: 'Warning' },
  danger: { name: 'error', tone: 'danger', label: 'Failing' },
  info: { name: 'info', tone: 'brand', label: 'Info' },
} as const;
```

2. Replace `: fileIcon(item.name)}` with `: (item.icon ?? fileIcon(item.name))}`.
3. Directly after the `{item.modified && (…)}` block, before the closing `</div>` of the row, add:

```tsx
            {item.status && (
              <>
                {' '}
                <Icon name={STATUS_ICON[item.status].name} size="sm" tone={STATUS_ICON[item.status].tone} label={STATUS_ICON[item.status].label} />
              </>
            )}
            {item.meta !== undefined && <span className="ml-auto shrink-0 font-label-mono text-[11px] text-on-surface-variant">{item.meta}</span>}
```

In `src/index.ts`, replace the Menu export line with:

```ts
export { Menu, type MenuEntry, type MenuItem, type MenuProps, type MenuSeparator, type MenuTriggerProps } from './components/Menu';
```

- [ ] **Step 4: Run the tests to verify they pass (plus the existing Menu, Tabs and FileTree suites)**

Run: `npx vitest run src/components/variants-c.test.tsx src/components/menu.test.tsx src/components/menu-in-dialog.test.tsx src/components/tabs.test.tsx src/ide/filetree.test.tsx && npm run typecheck`
Expected: PASS, with 5 new tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: menu header/footer/separators/meta/shortcuts, tab badges, icon-only segments, file tree status/meta

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: CodeBlock highlighting and `CopyButton`

**Files:**
- Create: `src/internal/highlight.ts`, `src/components/CopyButton.tsx`
- Modify (replace the whole file): `src/primitives/CodeBlock.tsx`
- Modify: `src/index.ts`
- Test: `src/primitives/code.test.tsx`

**Interfaces:**
- Consumes: `prism-react-renderer` (`Prism`, `useTokenize`), `Button` (Task 4).
- Produces:
  - `resolveLanguage(lang?: string): string | undefined` and `tokenClass(types: string[]): string`
  - `CodeBlock({ language?, highlight?, title?, meta?, actions?, lineNumbers?, tone?: 'dark'|'subtle' = 'dark', children })`
  - `CopyButton({ value, label? = 'Copy', copiedLabel? = 'Copied', size?, variant? })`

- [ ] **Step 1: Write the failing test**

`src/primitives/code.test.tsx`:

```tsx
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
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CopyButton value="snippet" />);
    await userEvent.click(screen.getByRole('button', { name: /Copy/ }));
    expect(writeText).toHaveBeenCalledWith('snippet');
    expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
    vi.useFakeTimers();
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/primitives/code.test.tsx`
Expected: FAIL, because the import of `../internal/highlight` cannot be resolved.

- [ ] **Step 3: Implement**

`src/internal/highlight.ts`:

```ts
import { Prism } from 'prism-react-renderer';

// prism-react-renderer bundles no Java or Bash grammar; define small ones instead of adding prismjs.
if (!Prism.languages.java) {
  Prism.languages.java = Prism.languages.extend('clike', {
    keyword:
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|record|return|sealed|short|static|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|yield)\b/,
    'class-name': /\b[A-Z]\w*\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[dfl]?/i,
  });
  Prism.languages.insertBefore('java', 'keyword', { annotation: { pattern: /@\w+/, alias: 'punctuation' } });
}
if (!Prism.languages.bash) {
  Prism.languages.bash = {
    comment: { pattern: /(^|\s)#.*/, lookbehind: true },
    string: [/"(?:\\.|[^"\\])*"/, /'[^']*'/],
    variable: /\$(?:\w+|\{[^}]+\})/,
    function: /\b(?:cd|echo|export|go|npm|npx|node|python3?|pip|git|ls|cat|curl|make)\b/,
    operator: /&&|\|\||[|;<>]/,
    punctuation: /[{}()[\]]/,
  };
}

const ALIAS: Record<string, string> = {
  ts: 'typescript', typescript: 'typescript', tsx: 'tsx', js: 'javascript', javascript: 'javascript', jsx: 'jsx',
  py: 'python', python: 'python', go: 'go', golang: 'go', java: 'java', json: 'json', bash: 'bash', sh: 'bash', shell: 'bash',
};

/** Prism language id for an alias, or undefined when no grammar is available. */
export function resolveLanguage(lang?: string): string | undefined {
  const id = lang ? ALIAS[lang.toLowerCase()] : undefined;
  return id && Prism.languages[id] ? id : undefined;
}

const TOKEN_CLASS: Record<string, string> = {
  keyword: 'text-code-keyword', builtin: 'text-code-keyword', tag: 'text-code-keyword', important: 'text-code-keyword',
  boolean: 'text-code-number', number: 'text-code-number', constant: 'text-code-number',
  string: 'text-code-string', char: 'text-code-string', 'template-string': 'text-code-string', 'attr-value': 'text-code-string', regex: 'text-code-string',
  comment: 'text-code-comment italic', prolog: 'text-code-comment italic', doctype: 'text-code-comment italic',
  function: 'text-code-function', 'function-variable': 'text-code-function', variable: 'text-code-function',
  'class-name': 'text-code-type', 'maybe-class-name': 'text-code-type', 'attr-name': 'text-code-type', property: 'text-code-type',
  operator: 'text-code-punctuation', punctuation: 'text-code-punctuation',
};

/** Class for the most specific known Prism token type (types are ordered general → specific). */
export function tokenClass(types: string[]): string {
  for (let i = types.length - 1; i >= 0; i--) {
    const c = TOKEN_CLASS[types[i]];
    if (c) return c;
  }
  return '';
}

export { Prism };
```

The bash test expects `'# comment'` as one token. The `comment` pattern uses `lookbehind` on the preceding whitespace, so the token text is exactly `# comment`.

`src/primitives/CodeBlock.tsx` (replace the whole file):

```tsx
import { useTokenize } from 'prism-react-renderer';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Prism, resolveLanguage, tokenClass } from '../internal/highlight';
import type { NativeProps } from '../internal/poly';

const TONE = {
  dark: { root: 'bg-brand-obsidian', header: 'border-white/10 text-slate-300' },
  subtle: { root: 'code-subtle border border-border-subtle bg-code-bg-subtle', header: 'border-border-subtle text-on-surface-variant' },
} as const;

export type CodeBlockProps = NativeProps<'figure', {
  language?: string;
  /** Syntax-highlight string children (ts, tsx, js, jsx, python, go, java, json, bash). */
  highlight?: boolean;
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  lineNumbers?: boolean;
  tone?: keyof typeof TONE;
  children: ReactNode;
}>;

function Lines({ lines, numbered }: { lines: Array<Array<{ content: string; className: string }>>; numbered?: boolean }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="table-row">
          {numbered && (
            <span aria-hidden="true" className="table-cell select-none pr-space-md text-right text-code-comment">
              {i + 1}
            </span>
          )}
          <span className="table-cell">
            {line.map((t, j) => (
              <span key={j} className={t.className || undefined}>
                {t.content}
              </span>
            ))}
            {'\n'}
          </span>
        </span>
      ))}
    </>
  );
}

function Highlighted({ code, language, numbered }: { code: string; language: string; numbered?: boolean }) {
  const tokens = useTokenize({ prism: Prism, code, grammar: Prism.languages[language], language });
  return <Lines numbered={numbered} lines={tokens.map((line) => line.map((t) => ({ content: t.content, className: tokenClass(t.types) })))} />;
}

/** Code block; scrolls inside itself so long lines never widen the page. */
export function CodeBlock({ language, highlight, title, meta, actions, lineNumbers, tone = 'dark', children, ...rest }: CodeBlockProps) {
  const t = TONE[tone];
  const code = typeof children === 'string' ? children.replace(/\n$/, '') : null;
  const lang = highlight && code !== null ? resolveLanguage(language) : undefined;
  const heading = title ?? language;
  let body: ReactNode = children;
  if (code !== null && lang) body = <Highlighted code={code} language={lang} numbered={lineNumbers} />;
  else if (code !== null && lineNumbers) body = <Lines numbered lines={code.split('\n').map((l) => [{ content: l, className: '' }])} />;
  return (
    <figure {...rest} className={cx('min-w-0 max-w-full overflow-hidden rounded-xl', t.root)}>
      {(heading || meta || actions) && (
        <figcaption className={cx('flex min-w-0 flex-wrap items-center gap-space-sm border-b px-space-md py-space-xs font-label-mono text-label-mono', t.header)}>
          {heading && <span className={cx('min-w-0 truncate', !title && 'uppercase')}>{heading}</span>}
          {meta}
          {actions && <span className="ml-auto flex shrink-0 items-center gap-space-xs">{actions}</span>}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        className="overflow-x-auto p-space-md font-code-inline text-code-inline text-code-plain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt"
      >
        <code className={lineNumbers ? 'table' : undefined}>{body}</code>
      </pre>
    </figure>
  );
}
```

`src/components/CopyButton.tsx`:

```tsx
import { useEffect, useState } from 'react';
import type { NativeProps } from '../internal/poly';
import { Button, type ButtonVariant } from './Button';

export type CopyButtonProps = NativeProps<'button', {
  value: string;
  label?: string;
  copiedLabel?: string;
  size?: 'sm' | 'md';
  variant?: ButtonVariant;
  children?: never;
}>;

/** Copies `value` to the clipboard; shows success or failure for 2s. Never throws. */
export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', size = 'sm', variant = 'secondary', ...rest }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = setTimeout(() => setState('idle'), 2000);
    return () => clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  };
  return (
    <Button {...rest} variant={variant} size={size} icon={state === 'copied' ? 'check' : state === 'failed' ? 'error' : 'content_copy'} onClick={copy} aria-live="polite">
      {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
    </Button>
  );
}
```

Append to `src/index.ts`:

```ts
export { CopyButton, type CopyButtonProps } from './components/CopyButton';
```

- [ ] **Step 4: Run the tests to verify they pass (plus the existing typography suite that covers CodeBlock)**

Run: `npx vitest run src/primitives/code.test.tsx src/primitives/typography.test.tsx && npm run typecheck`
Expected: PASS, with 11 new tests. If Prism emits a token whose text differs from the test's expected token (for example, extra surrounding whitespace), change only the test's token text to the emitted one, and ledger it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: syntax-highlighted code blocks with titles and line numbers; copy button

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: `DiffViewer`

**Files:**
- Create: `src/internal/diff.ts`, `src/components/DiffViewer.tsx`
- Modify: `src/index.ts`
- Test: `src/components/diff.test.tsx`

**Interfaces:**
- Produces:
  - `DiffLine = { kind: 'same'|'add'|'del'; text: string; oldNo?: number; newNo?: number }`
  - `diffLines(a: string, b: string): DiffLine[]`
  - `splitRows(lines): { left?: DiffLine; right?: DiffLine }[]`
  - `DiffViewer({ oldValue, newValue, oldTitle?, newTitle?, mode?: 'unified'|'split' = 'unified' })`

- [ ] **Step 1: Write the failing test**

`src/components/diff.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiffViewer } from '../index';
import { diffLines, splitRows } from '../internal/diff';

describe('diffLines', () => {
  it('finds added and removed lines around common ones', () => {
    expect(diffLines('a\nb\nc', 'a\nx\nc').map((l) => `${l.kind}:${l.text}`)).toEqual(['same:a', 'del:b', 'add:x', 'same:c']);
  });
  it('handles identical and empty inputs', () => {
    expect(diffLines('a\nb', 'a\nb').every((l) => l.kind === 'same')).toBe(true);
    expect(diffLines('', 'a\nb').map((l) => l.kind)).toEqual(['add', 'add']);
    expect(diffLines('a', '').map((l) => l.kind)).toEqual(['del']);
  });
  it('numbers old and new lines', () => {
    const [same, del, add] = diffLines('a\nb', 'a\nc');
    expect([same.oldNo, same.newNo, del.oldNo, add.newNo]).toEqual([1, 1, 2, 2]);
  });
  it('pairs deletions with additions for split view', () => {
    const rows = splitRows(diffLines('a\nb\nc', 'a\nx\ny\nc'));
    expect(rows.map((r) => `${r.left?.text ?? '-'}|${r.right?.text ?? '-'}`)).toEqual(['a|a', 'b|x', '-|y', 'c|c']);
  });
});

describe('DiffViewer', () => {
  it('announces added and removed lines and scrolls inside itself', () => {
    const { container } = render(<DiffViewer oldTitle="naive.go" newTitle="staff.go" oldValue={'a\nb'} newValue={'a\nc'} />);
    expect(screen.getByText('naive.go')).toBeInTheDocument();
    expect(screen.getAllByText('removed:')).toHaveLength(1);
    expect(screen.getAllByText('added:')).toHaveLength(1);
    expect(screen.getByText('c').closest('div')).toHaveClass('bg-diff-add-bg');
    expect(container.querySelector('pre')).toHaveAttribute('tabindex', '0');
  });
  it('split mode renders a split grid from lg and a unified fallback below', () => {
    const { container } = render(<DiffViewer mode="split" oldValue="a" newValue="b" />);
    expect(container.querySelector('.lg\\:grid')).not.toBeNull();
    expect(container.querySelector('.lg\\:hidden')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/diff.test.tsx`
Expected: FAIL, because the import of `../internal/diff` cannot be resolved.

- [ ] **Step 3: Implement**

`src/internal/diff.ts`:

```ts
export type DiffLine = { kind: 'same' | 'add' | 'del'; text: string; oldNo?: number; newNo?: number };

const toLines = (s: string) => (s === '' ? [] : s.split('\n'));

/** Line diff via an LCS table. */
// ponytail: O(n·m) time and memory; fine for snippet-sized files (hundreds of lines). Switch to Myers for thousands.
export function diffLines(a: string, b: string): DiffLine[] {
  const x = toLines(a);
  const y = toLines(b);
  const n = x.length;
  const m = y.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) out.push({ kind: 'same', text: x[i], oldNo: ++i, newNo: ++j });
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ kind: 'del', text: x[i], oldNo: ++i });
    else out.push({ kind: 'add', text: y[j], newNo: ++j });
  }
  while (i < n) out.push({ kind: 'del', text: x[i], oldNo: ++i });
  while (j < m) out.push({ kind: 'add', text: y[j], newNo: ++j });
  return out;
}

/** Side-by-side rows: unchanged lines on both sides; each run of deletions paired with the following additions. */
export function splitRows(lines: DiffLine[]): Array<{ left?: DiffLine; right?: DiffLine }> {
  const rows: Array<{ left?: DiffLine; right?: DiffLine }> = [];
  let k = 0;
  while (k < lines.length) {
    if (lines[k].kind === 'same') {
      rows.push({ left: lines[k], right: lines[k] });
      k++;
      continue;
    }
    const dels: DiffLine[] = [];
    const adds: DiffLine[] = [];
    while (k < lines.length && lines[k].kind === 'del') dels.push(lines[k++]);
    while (k < lines.length && lines[k].kind === 'add') adds.push(lines[k++]);
    for (let t = 0; t < Math.max(dels.length, adds.length); t++) rows.push({ left: dels[t], right: adds[t] });
  }
  return rows;
}
```

The `x[i]` in `out.push({ kind: 'same', text: x[i], oldNo: ++i, newNo: ++j })` is evaluated before `++i`, because object literal properties evaluate left to right. So `text` is the current line, and `oldNo` is its 1-based number.

`src/components/DiffViewer.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { diffLines, splitRows, type DiffLine } from '../internal/diff';
import type { NativeProps } from '../internal/poly';

const KIND = { same: 'text-code-plain', add: 'bg-diff-add-bg text-diff-add-fg', del: 'bg-diff-del-bg text-diff-del-fg' } as const;
const SIGN = { same: ' ', add: '+', del: '−' } as const;
const SPOKEN = { same: '', add: 'added:', del: 'removed:' } as const;
const PRE = 'overflow-x-auto py-space-sm font-code-inline text-code-inline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt';

function Row({ line, gutters }: { line?: DiffLine; gutters: 'both' | 'old' | 'new' }) {
  if (!line) return <div className="min-h-5 bg-white/5" />;
  return (
    <div className={cx('flex min-w-0 px-space-sm', KIND[line.kind])}>
      {gutters !== 'new' && <span aria-hidden="true" className="w-8 shrink-0 select-none pr-space-xs text-right text-code-comment">{line.oldNo ?? ''}</span>}
      {gutters !== 'old' && <span aria-hidden="true" className="w-8 shrink-0 select-none pr-space-xs text-right text-code-comment">{line.newNo ?? ''}</span>}
      <span aria-hidden="true" className="w-4 shrink-0 select-none">{SIGN[line.kind]}</span>
      {SPOKEN[line.kind] && <span className="sr-only">{SPOKEN[line.kind]}</span>}
      <span className="min-w-0 whitespace-pre-wrap wrap-break-word">{line.text || ' '}</span>
    </div>
  );
}

export type DiffViewerProps = NativeProps<'figure', {
  oldValue: string;
  newValue: string;
  oldTitle?: ReactNode;
  newTitle?: ReactNode;
  /** split collapses to unified below lg. */
  mode?: 'unified' | 'split';
  children?: never;
}>;

export function DiffViewer({ oldValue, newValue, oldTitle, newTitle, mode = 'unified', ...rest }: DiffViewerProps) {
  const lines = diffLines(oldValue, newValue);
  const unified = (
    <pre tabIndex={0} className={cx(PRE, mode === 'split' && 'lg:hidden')}>
      {lines.map((l, i) => <Row key={i} line={l} gutters="both" />)}
    </pre>
  );
  return (
    <figure {...rest} className="min-w-0 max-w-full overflow-hidden rounded-xl bg-brand-obsidian">
      {(oldTitle || newTitle) && (
        <figcaption className="flex min-w-0 flex-wrap items-center gap-space-xs border-b border-white/10 px-space-md py-space-xs font-label-mono text-label-mono text-slate-300">
          {oldTitle && <span className="truncate">{oldTitle}</span>}
          {oldTitle && newTitle && <span aria-hidden="true">→</span>}
          {newTitle && <span className="truncate">{newTitle}</span>}
        </figcaption>
      )}
      {unified}
      {mode === 'split' && (
        <pre tabIndex={0} className={cx(PRE, 'hidden grid-cols-2 lg:grid')}>
          {splitRows(lines).map((r, i) => (
            <div key={i} className="contents">
              <Row line={r.left} gutters="old" />
              <Row line={r.right} gutters="new" />
            </div>
          ))}
        </pre>
      )}
    </figure>
  );
}
```

In split mode both `<pre>`s render. The `SPOKEN` spans would then be announced twice, but only one `<pre>` is visible at any width (`lg:hidden` / `hidden lg:grid`), and `display: none` removes the other from the accessibility tree. The unit test counts one `removed:` because it uses unified mode.

Append to `src/index.ts`:

```ts
export { DiffViewer, type DiffViewerProps } from './components/DiffViewer';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/diff.test.tsx && npm run typecheck`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: diff viewer (unified and split) with LCS line diff

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: `BarChart`

**Files:**
- Create: `src/components/BarChart.tsx`
- Modify: `src/index.ts`
- Test: `src/components/chart.test.tsx`

**Interfaces:**
- Produces: `BarChart({ label, bars: { value: number; label?: string }[], highlight?: number, highlightLabel?, axis?: [ReactNode, ReactNode, ReactNode], height?: 'sm'|'md' = 'md', tone?: 'brand'|'success' = 'brand' })`

- [ ] **Step 1: Write the failing test**

`src/components/chart.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from '../index';

const BARS = [{ value: 10, label: '0–10ms' }, { value: 40, label: '10–20ms' }, { value: 20, label: '20–30ms' }, { value: 0, label: '30–40ms' }];

describe('BarChart', () => {
  it('summarises the data for assistive tech and exposes the values as a hidden table', () => {
    render(<BarChart label="Runtime distribution" bars={BARS} highlight={1} highlightLabel="41ms" axis={['0ms', '20ms', '40ms']} />);
    expect(screen.getByRole('img', { name: 'Runtime distribution: 4 bars, highest 40; highlighted 10–20ms = 40' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'Runtime distribution' });
    expect(table).toHaveClass('sr-only');
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(screen.getByText('41ms')).toBeInTheDocument();
  });
  it('scales bar heights to the max and keeps a sliver for zero values', () => {
    const { container } = render(<BarChart label="x" bars={BARS} highlight={1} />);
    const fills = [...container.querySelectorAll<HTMLElement>('[data-bar]')];
    expect(fills.map((f) => f.style.height)).toEqual(['25%', '100%', '50%', '2%']);
    expect(fills[1]).toHaveClass('bg-brand-cobalt');
    expect(fills[0]).toHaveClass('bg-surface-container-high');
  });
  it('handles an empty or all-zero series', () => {
    const { container } = render(<BarChart label="empty" bars={[{ value: 0 }, { value: 0 }]} />);
    expect([...container.querySelectorAll<HTMLElement>('[data-bar]')].map((f) => f.style.height)).toEqual(['2%', '2%']);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chart.test.tsx`
Expected: FAIL, because `BarChart` is undefined.

- [ ] **Step 3: Implement**

`src/components/BarChart.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const HEIGHT = { sm: 'h-16', md: 'h-28' } as const;
const TONE = { brand: 'bg-brand-cobalt', success: 'bg-brand-emerald' } as const;

export type BarChartProps = NativeProps<'figure', {
  label: string;
  bars: Array<{ value: number; label?: string }>;
  highlight?: number;
  highlightLabel?: string;
  axis?: [ReactNode, ReactNode, ReactNode];
  height?: keyof typeof HEIGHT;
  tone?: keyof typeof TONE;
  children?: never;
}>;

/** CSS bar chart; the data is also available as a visually hidden table. */
export function BarChart({ label, bars, highlight, highlightLabel, axis, height = 'md', tone = 'brand', ...rest }: BarChartProps) {
  const max = Math.max(0, ...bars.map((b) => b.value));
  const name = (i: number) => bars[i].label ?? `Bar ${i + 1}`;
  const hl = highlight !== undefined && bars[highlight] ? `; highlighted ${name(highlight)} = ${bars[highlight].value}` : '';
  const summary = `${label}: ${bars.length} bars, highest ${max}${hl}`;
  return (
    <figure {...rest} className="flex min-w-0 flex-col gap-space-xs">
      <div role="img" aria-label={summary} className={cx('flex items-end gap-1', HEIGHT[height], highlightLabel && 'pt-space-lg')}>
        {bars.map((b, i) => {
          const pct = max > 0 ? Math.max(2, Math.round((Math.max(0, b.value) / max) * 100)) : 2;
          const strong = highlight === undefined || i === highlight;
          return (
            <div key={i} className="relative flex h-full min-w-0 flex-1 items-end">
              {i === highlight && highlightLabel && (
                <span className="absolute -top-space-lg left-1/2 -translate-x-1/2 whitespace-nowrap font-label-mono text-[10px] text-fg-brand">{highlightLabel}</span>
              )}
              <div data-bar="" className={cx('w-full rounded-t', strong ? TONE[tone] : 'bg-surface-container-high')} style={{ height: `${pct}%` }} />
            </div>
          );
        })}
      </div>
      {axis && (
        <div aria-hidden="true" className="flex justify-between font-label-mono text-[10px] text-on-surface-variant">
          <span>{axis[0]}</span>
          <span>{axis[1]}</span>
          <span>{axis[2]}</span>
        </div>
      )}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {bars.map((b, i) => (
            <tr key={i}>
              <th scope="row">{name(i)}</th>
              <td>{b.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
```

`-top-space-lg` is the negative spacing utility (`top: calc(var(--spacing-space-lg) * -1)`), and `pt-space-lg` reserves room for the label.

Append to `src/index.ts`:

```ts
export { BarChart, type BarChartProps } from './components/BarChart';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/chart.test.tsx && npm run typecheck`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: accessible CSS bar chart

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: `UmlClass` and `UmlDiagram`

**Files:**
- Create: `src/ide/UmlClass.tsx`, `src/ide/UmlDiagram.tsx`
- Modify: `src/index.ts`
- Test: `src/ide/uml.test.tsx`

**Interfaces:**
- Consumes: `@dagrejs/dagre` (dynamic import), `IconButton` (size `xs`, variant `secondary`).
- Produces:
  - `UmlClass({ name, stereotype?, attributes?, methods?, tag?, emphasis?: 'default'|'brand'|'strong', size?: 'sm'|'md', dashed? })`
  - `UmlNode = { id; name; stereotype?; attributes?; methods?; tag?; emphasis?; dashed? }`
  - `UmlEdgeKind = 'association'|'dependency'|'realization'|'inheritance'|'aggregation'|'composition'`
  - `UmlEdge = { from; to; kind; label?; fromMultiplicity?; toMultiplicity? }`
  - `describeDiagram(label, nodes, edges): string`
  - `UmlDiagram({ label, nodes, edges, direction?: 'TB'|'LR' = 'TB', zoomable? = true, compact?, pattern?: 'dots'|'none' = 'dots' })`
- Design:
  - Boxes are measured with `offsetWidth` and `offsetHeight`, which zoom transforms don't affect.
  - dagre lays the diagram out in an effect, loaded with a dynamic `import()`.
  - Nodes are positioned absolutely, and edges are drawn as an SVG overlay with UML markers.
  - Zoom runs from 50% to 200% in 25% steps.
  - Before layout, a `flex-wrap` fallback renders.
  - Wheel zoom is **not** implemented: React registers wheel listeners as passive, so `preventDefault` can't stop page scroll. The buttons plus the scrollable, focusable viewport (arrow keys pan) cover zoom and pan.

- [ ] **Step 1: Write the failing test**

`src/ide/uml.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UmlClass, UmlDiagram, type UmlEdge, type UmlNode } from '../index';
import { describeDiagram } from './UmlDiagram';

const NODES: UmlNode[] = [
  { id: 'ctx', name: 'PricingContext', attributes: ['- strategy: Strategy'], methods: ['+ price(): Money'] },
  { id: 'strat', name: 'Strategy', stereotype: 'interface', methods: ['+ compute(): Money'], emphasis: 'brand' },
  { id: 'hourly', name: 'HourlyStrategy' },
];
const EDGES: UmlEdge[] = [
  { from: 'ctx', to: 'strat', kind: 'aggregation', fromMultiplicity: '1', toMultiplicity: '1' },
  { from: 'hourly', to: 'strat', kind: 'realization' },
];

describe('UmlClass', () => {
  it('renders stereotype, name, attributes and methods', () => {
    const { container } = render(<UmlClass name="Strategy" stereotype="interface" attributes={['- id: int']} methods={['+ run()']} emphasis="brand" dashed />);
    expect(screen.getByText('«interface»')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toHaveClass('font-semibold');
    expect(screen.getByText('- id: int')).toBeInTheDocument();
    expect(screen.getByText('+ run()')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('border-2', 'border-brand-cobalt', 'border-dashed');
  });
});

describe('describeDiagram', () => {
  it('describes classes and relationships in words', () => {
    expect(describeDiagram('Strategy pattern', NODES, EDGES)).toBe(
      'Strategy pattern. Classes: PricingContext, Strategy (interface), HourlyStrategy. Relationships: PricingContext aggregates Strategy (1 to 1); HourlyStrategy implements Strategy.',
    );
  });
});

describe('UmlDiagram', () => {
  it('lays out nodes with dagre and draws one path per edge with UML markers', async () => {
    const { container } = render(<UmlDiagram label="Strategy pattern" nodes={NODES} edges={EDGES} />);
    await waitFor(() => expect(container.querySelectorAll('path[data-edge]')).toHaveLength(2));
    const boxes = [...container.querySelectorAll<HTMLElement>('[data-node]')];
    expect(boxes).toHaveLength(3);
    expect(boxes.every((b) => b.style.left !== '' && b.style.top !== '')).toBe(true);
    const [agg, real] = [...container.querySelectorAll('path[data-edge]')];
    expect(agg.getAttribute('marker-start')).toContain('diamond-hollow');
    expect(real.getAttribute('stroke-dasharray')).toBe('6 4');
    expect(real.getAttribute('marker-end')).toContain('triangle');
    expect(screen.getByRole('img', { name: 'Strategy pattern' })).toHaveAccessibleDescription(/PricingContext aggregates Strategy/);
  });
  it('zooms in 25% steps between 50% and 200%', async () => {
    render(<UmlDiagram label="d" nodes={NODES} edges={EDGES} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    for (let i = 0; i < 6; i++) await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('200%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Reset zoom' }));
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
  it('compact hides the zoom controls; the viewport is focusable for panning', () => {
    render(<UmlDiagram label="mini" nodes={NODES} edges={EDGES} compact />);
    expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    expect(screen.getByRole('region', { name: 'mini diagram' })).toHaveAttribute('tabindex', '0');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/ide/uml.test.tsx`
Expected: FAIL, because the import of `./UmlDiagram` cannot be resolved.

- [ ] **Step 3: Implement**

`src/ide/UmlClass.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const EMPHASIS = { default: 'border border-border-strong', brand: 'border-2 border-brand-cobalt', strong: 'border-2 border-ink' } as const;
const SIZE = { sm: { text: 'text-[11px] leading-4', pad: 'px-space-xs py-space-2xs' }, md: { text: 'text-code-inline', pad: 'px-space-sm py-space-xs' } } as const;

export type UmlClassProps = NativeProps<'div', {
  name: string;
  stereotype?: string;
  attributes?: string[];
  methods?: string[];
  tag?: ReactNode;
  emphasis?: keyof typeof EMPHASIS;
  size?: keyof typeof SIZE;
  dashed?: boolean;
  children?: never;
}>;

/** UML class box: name compartment, attributes, methods. */
export function UmlClass({ name, stereotype, attributes = [], methods = [], tag, emphasis = 'default', size = 'md', dashed, ...rest }: UmlClassProps) {
  const s = SIZE[size];
  return (
    <div {...rest} className={cx('inline-flex min-w-0 max-w-full flex-col overflow-hidden rounded-lg bg-surface-elevated font-code-inline text-on-surface shadow-sm', EMPHASIS[emphasis], dashed && 'border-dashed', s.text)}>
      <div className={cx('flex flex-col items-center text-center', s.pad)}>
        {stereotype && <span className="text-on-surface-variant">«{stereotype}»</span>}
        <span className="font-semibold text-ink">{name}</span>
        {tag}
      </div>
      {attributes.length > 0 && (
        <ul className={cx('border-t border-border-subtle', s.pad)}>
          {attributes.map((a, i) => <li key={i} className="whitespace-nowrap">{a}</li>)}
        </ul>
      )}
      {methods.length > 0 && (
        <ul className={cx('border-t border-border-subtle', s.pad)}>
          {methods.map((m, i) => <li key={i} className="whitespace-nowrap">{m}</li>)}
        </ul>
      )}
    </div>
  );
}
```

`src/ide/UmlDiagram.tsx`:

```tsx
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { IconButton } from '../components/IconButton';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { UmlClass } from './UmlClass';

export type UmlNode = {
  id: string;
  name: string;
  stereotype?: string;
  attributes?: string[];
  methods?: string[];
  tag?: ReactNode;
  emphasis?: 'default' | 'brand' | 'strong';
  dashed?: boolean;
};
export type UmlEdgeKind = 'association' | 'dependency' | 'realization' | 'inheritance' | 'aggregation' | 'composition';
export type UmlEdge = { from: string; to: string; kind: UmlEdgeKind; label?: string; fromMultiplicity?: string; toMultiplicity?: string };

const VERB: Record<UmlEdgeKind, string> = {
  association: 'is associated with',
  dependency: 'depends on',
  realization: 'implements',
  inheritance: 'extends',
  aggregation: 'aggregates',
  composition: 'composes',
};
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

/** Plain-language description of a diagram for screen readers. */
export function describeDiagram(label: string, nodes: UmlNode[], edges: UmlEdge[]): string {
  const byId = new Map(nodes.map((n) => [n.id, n.name]));
  const classes = nodes.map((n) => (n.stereotype ? `${n.name} (${n.stereotype})` : n.name)).join(', ');
  const rels = edges
    .filter((e) => byId.has(e.from) && byId.has(e.to))
    .map((e) => {
      const mult = e.fromMultiplicity || e.toMultiplicity ? ` (${e.fromMultiplicity ?? ''} to ${e.toMultiplicity ?? ''})` : '';
      return `${byId.get(e.from)} ${VERB[e.kind]} ${byId.get(e.to)}${mult}${e.label ? `, ${e.label}` : ''}`;
    })
    .join('; ');
  return `${label}. Classes: ${classes}.${rels ? ` Relationships: ${rels}.` : ''}`;
}

type Point = { x: number; y: number };
type Layout = { width: number; height: number; nodes: Record<string, Point>; edges: Array<Point[] | null> };

function edgeStyle(kind: UmlEdgeKind, id: string) {
  const dashed = kind === 'dependency' || kind === 'realization';
  const end = kind === 'association' || kind === 'dependency' ? `url(#${id}-arrow)` : kind === 'realization' || kind === 'inheritance' ? `url(#${id}-triangle)` : undefined;
  const start = kind === 'aggregation' ? `url(#${id}-diamond-hollow)` : kind === 'composition' ? `url(#${id}-diamond-filled)` : undefined;
  return { dashed, end, start };
}

export type UmlDiagramProps = NativeProps<'figure', {
  label: string;
  nodes: UmlNode[];
  edges: UmlEdge[];
  direction?: 'TB' | 'LR';
  zoomable?: boolean;
  /** Small inline diagram: no zoom controls, scaled to fit the width. */
  compact?: boolean;
  pattern?: 'dots' | 'none';
  children?: never;
}>;

export function UmlDiagram({ label, nodes, edges, direction = 'TB', zoomable = true, compact, pattern = 'dots', ...rest }: UmlDiagramProps) {
  // Marker ids go into url(#…), so keep only safe characters from React's generated id.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(1);
  const key = JSON.stringify({ n: nodes.map((n) => [n.id, n.name, n.stereotype, n.attributes, n.methods]), e: edges.map((e) => [e.from, e.to, e.kind]), direction });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { Graph, layout: runLayout } = await import('@dagrejs/dagre');
      const g = new Graph({ multigraph: true });
      g.setGraph({ rankdir: direction, nodesep: 48, ranksep: 64, marginx: 16, marginy: 16 });
      g.setDefaultEdgeLabel(() => ({}));
      for (const n of nodes) {
        const el = nodeRefs.current.get(n.id);
        // offsetWidth/Height ignore the zoom transform; jsdom reports 0, so fall back to a typical box size.
        g.setNode(n.id, { width: el?.offsetWidth || 160, height: el?.offsetHeight || 80 });
      }
      edges.forEach((e, i) => {
        if (g.hasNode(e.from) && g.hasNode(e.to)) g.setEdge(e.from, e.to, {}, `e${i}`);
      });
      runLayout(g);
      if (cancelled) return;
      const graph = g.graph();
      const positioned: Record<string, Point> = {};
      for (const n of nodes) {
        const v = g.node(n.id) as { x: number; y: number; width: number; height: number } | undefined;
        if (v) positioned[n.id] = { x: v.x - v.width / 2, y: v.y - v.height / 2 };
      }
      setLayout({
        width: graph.width ?? 0,
        height: graph.height ?? 0,
        nodes: positioned,
        edges: edges.map((e, i) => (g.edge({ v: e.from, w: e.to, name: `e${i}` }) as { points?: Point[] } | undefined)?.points ?? null),
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the diagram's content
  }, [key]);

  // Fit-to-width for compact diagrams (and the initial zoom on narrow screens).
  useEffect(() => {
    const vp = viewportRef.current;
    if (!layout || !vp || layout.width === 0) return;
    const measure = () => setFit(Math.min(1, vp.clientWidth / layout.width || 1));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [layout]);

  const scale = compact ? fit : zoom;
  const descId = `${id}-desc`;
  return (
    <figure {...rest} className="relative min-w-0 max-w-full overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle">
      <figcaption id={descId} className="sr-only">
        {describeDiagram(label, nodes, edges)}
      </figcaption>
      {zoomable && !compact && (
        <div className="absolute right-space-sm top-space-sm z-10 flex items-center gap-space-2xs rounded-lg bg-surface-elevated/90 p-space-2xs shadow-sm">
          <IconButton icon="zoom_out" label="Zoom out" size="xs" variant="secondary" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))} />
          <span aria-live="polite" className="w-10 text-center font-label-mono text-[11px] text-on-surface-variant">
            {Math.round(zoom * 100)}%
          </span>
          <IconButton icon="zoom_in" label="Zoom in" size="xs" variant="secondary" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))} />
          <IconButton icon="fit_screen" label="Reset zoom" size="xs" variant="secondary" onClick={() => setZoom(1)} />
        </div>
      )}
      <div
        ref={viewportRef}
        role="region"
        aria-label={`${label} diagram`}
        tabIndex={0}
        className={cx('min-h-40 overflow-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt', pattern === 'dots' && 'bg-pattern-dots', compact ? 'max-h-64' : 'max-h-[36rem]')}
      >
        <div
          role="img"
          aria-label={label}
          aria-describedby={descId}
          className={layout ? 'relative origin-top-left' : 'flex flex-wrap gap-space-md p-space-md'}
          style={layout ? { width: layout.width, height: layout.height, transform: `scale(${scale})` } : undefined}
        >
          {layout && (
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible text-on-surface-variant" width={layout.width} height={layout.height}>
              <defs>
                <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-triangle`} viewBox="0 0 12 12" refX="12" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 z" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-diamond-hollow`} viewBox="0 0 14 8" refX="14" refY="4" markerWidth="14" markerHeight="8" orient="auto-start-reverse">
                  <path d="M0,4 L7,0 L14,4 L7,8 z" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-diamond-filled`} viewBox="0 0 14 8" refX="14" refY="4" markerWidth="14" markerHeight="8" orient="auto-start-reverse">
                  <path d="M0,4 L7,0 L14,4 L7,8 z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const pts = layout.edges[i];
                if (!pts || pts.length < 2) return null;
                const s = edgeStyle(e.kind, id);
                const d = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                const mid = pts[Math.floor(pts.length / 2)];
                return (
                  <g key={i}>
                    <path
                      data-edge=""
                      d={d}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray={s.dashed ? '6 4' : undefined}
                      markerEnd={s.end}
                      markerStart={s.start}
                    />
                    {e.label && <text x={mid.x + 6} y={mid.y - 6} className="fill-on-surface-variant font-code-inline text-[10px]">{e.label}</text>}
                    {e.fromMultiplicity && <text x={pts[0].x + 6} y={pts[0].y + 14} className="fill-on-surface-variant font-code-inline text-[10px]">{e.fromMultiplicity}</text>}
                    {e.toMultiplicity && <text x={pts[pts.length - 1].x + 6} y={pts[pts.length - 1].y - 6} className="fill-on-surface-variant font-code-inline text-[10px]">{e.toMultiplicity}</text>}
                  </g>
                );
              })}
            </svg>
          )}
          {nodes.map((n) => (
            <div
              key={n.id}
              data-node=""
              ref={(el) => {
                if (el) nodeRefs.current.set(n.id, el);
                else nodeRefs.current.delete(n.id);
              }}
              className={layout ? 'absolute' : undefined}
              style={layout?.nodes[n.id] ? { left: layout.nodes[n.id].x, top: layout.nodes[n.id].y } : undefined}
            >
              <UmlClass name={n.name} stereotype={n.stereotype} attributes={n.attributes} methods={n.methods} tag={n.tag} emphasis={n.emphasis} dashed={n.dashed} size={compact ? 'sm' : 'md'} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
```

React renders `markerEnd` and `markerStart` as the SVG attributes `marker-end` and `marker-start`, and `strokeDasharray` as `stroke-dasharray`, which is what the tests read. The markers use `orient="auto-start-reverse"`, so the same diamond or arrow points outward at either end.

Append to `src/index.ts`:

```ts
export { UmlClass, type UmlClassProps } from './ide/UmlClass';
export { UmlDiagram, describeDiagram, type UmlDiagramProps, type UmlEdge, type UmlEdgeKind, type UmlNode } from './ide/UmlDiagram';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/ide/uml.test.tsx && npm run typecheck && npm run build && npm run size-check`
Expected:
- The tests pass: 5 tests.
- Typecheck exits 0.
- The size check stays under budget: `dist/index.js` does not inline dagre, because `@dagrejs/dagre` is external and imported dynamically. Confirm with `grep -c "@dagrejs/dagre" dist/index.js`, which prints 1 or more (the import specifier).

If TS rejects `g.graph().width` (the typings may mark it optional), keep the `?? 0` fallback as written. If `Graph`'s constructor typing lacks `multigraph`, cast the options object, and ledger it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: UML class box and auto-laid-out UML diagram (dagre, lazy-loaded)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 17: `Tooltip`

**Files:**
- Create: `src/components/Tooltip.tsx`
- Modify: `src/index.ts`
- Test: `src/components/tooltip.test.tsx`

**Interfaces:**
- Consumes: `useThemeTone`.
- Produces: `Tooltip({ content, children: ReactElement (the trigger), side?: 'top'|'bottom'|'left'|'right' = 'top', delay? = 400 })`.
  - It shows on pointer enter or focus of the trigger, after `delay`.
  - It hides on leave, on blur and on Escape.
  - While it is open, the trigger gets `aria-describedby` pointing at a `role="tooltip"` element.
  - The tooltip is rendered in a portal with fixed positioning. It flips to the opposite side when it would overflow the viewport, and is clamped horizontally with an 8px margin.
  - The trigger's own handlers and ref are preserved.
  - It is never used for interactive content. On touch devices it only shows on focus, so callers must not rely on it for essential information.

- [ ] **Step 1: Write the failing test**

`src/components/tooltip.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Theme, Tooltip } from '../index';

describe('Tooltip', () => {
  it('shows on hover, describes the trigger, and hides on leave', async () => {
    render(<Tooltip content="Reset zoom" delay={0}><button type="button">R</button></Tooltip>);
    const trigger = screen.getByRole('button', { name: 'R' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await userEvent.hover(trigger);
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Reset zoom');
    expect(trigger).toHaveAccessibleDescription('Reset zoom');
    await userEvent.unhover(trigger);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('shows on focus and hides on Escape and blur', async () => {
    render(<Tooltip content="Copy" delay={0}><button type="button">C</button></Tooltip>);
    await userEvent.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it("keeps the trigger's own handlers and ref, and inherits the theme", async () => {
    const onMouseEnter = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Theme tone="dark">
        <Tooltip content="tip" delay={0}>
          <button type="button" ref={ref} onMouseEnter={onMouseEnter}>T</button>
        </Tooltip>
      </Theme>,
    );
    await userEvent.hover(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalled();
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-theme', 'dark');
  });
  it('waits for the delay before showing', () => {
    vi.useFakeTimers();
    render(<Tooltip content="late" delay={400}><button type="button">L</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
    vi.advanceTimersByTime(400);
    vi.useRealTimers();
  });
});
```

The last test only guards that nothing shows before the delay. Showing after the delay is covered by the `delay={0}` tests.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/tooltip.test.tsx`
Expected: FAIL, because `Tooltip` is undefined.

- [ ] **Step 3: Implement**

`src/components/Tooltip.tsx`:

```tsx
import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { useThemeTone } from '../theme/Theme';

type TriggerProps = {
  'aria-describedby'?: string;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  ref?: Ref<HTMLElement>;
};

export type TooltipProps = {
  content: ReactNode;
  children: ReactElement<TriggerProps>;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
};

const GAP = 8;

/** Short, non-interactive hint for a trigger. Never put essential information only in a tooltip. */
export function Tooltip({ content, children, side = 'top', delay = 400 }: TooltipProps) {
  const id = useId();
  const theme = useThemeTone();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
    setPos(null);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const t = tipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let s = side;
    if (s === 'top' && r.top - t.height - GAP < 0) s = 'bottom';
    else if (s === 'bottom' && r.bottom + t.height + GAP > vh) s = 'top';
    else if (s === 'left' && r.left - t.width - GAP < 0) s = 'right';
    else if (s === 'right' && r.right + t.width + GAP > vw) s = 'left';
    let top = s === 'top' ? r.top - t.height - GAP : s === 'bottom' ? r.bottom + GAP : r.top + r.height / 2 - t.height / 2;
    let left = s === 'left' ? r.left - t.width - GAP : s === 'right' ? r.right + GAP : r.left + r.width / 2 - t.width / 2;
    left = Math.min(Math.max(GAP, left), Math.max(GAP, vw - t.width - GAP));
    top = Math.min(Math.max(GAP, top), Math.max(GAP, vh - t.height - GAP));
    setPos({ top, left });
  }, [open, side]);

  const own = children.props;
  const trigger = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      const r = own.ref;
      if (typeof r === 'function') r(el);
      else if (r && typeof r === 'object') (r as { current: HTMLElement | null }).current = el;
    },
    'aria-describedby': open ? [own['aria-describedby'], id].filter(Boolean).join(' ') : own['aria-describedby'],
    onMouseEnter: (e: MouseEvent) => {
      own.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent) => {
      own.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent) => {
      own.onFocus?.(e);
      show();
    },
    onBlur: (e: FocusEvent) => {
      own.onBlur?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            data-theme={theme}
            className="pointer-events-none fixed z-50 max-w-[min(20rem,calc(100vw-1rem))] rounded-lg bg-ink px-space-sm py-space-xs font-body-sm text-body-sm text-on-ink shadow-md wrap-break-word"
            style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
```

Append to `src/index.ts`:

```ts
export { Tooltip, type TooltipProps } from './components/Tooltip';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/tooltip.test.tsx && npm run lint && npm run typecheck`
Expected: PASS: 4 tests, and lint and typecheck exit 0. If `react-hooks/exhaustive-deps` warns on the Escape effect (`hide` isn't a dependency), that is a warning, not an error, and is acceptable. Ledger it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: accessible tooltip with viewport flipping

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: `Toaster` and `useToast`

**Files:**
- Create: `src/components/Toast.tsx`
- Modify: `src/index.ts`
- Test: `src/components/toast.test.tsx`

**Interfaces:**
- Consumes: `IconButton` (size `xs`).
- Produces:
  - `ToastOptions = { title: ReactNode; description?: ReactNode; tone?: 'default'|'success'|'danger'; action?: ReactNode; duration?: number }` (the default duration is 4000; `Infinity` means sticky)
  - `useToast(): { show(opts): number; dismiss(id): void }`
  - `Toaster({ label? = 'Notifications' })`
  - The store lives in the module, so toasts shown before the `Toaster` mounts still appear.
  - `toastStore.clear()` is exported from the module (not from the index) for tests.

- [ ] **Step 1: Write the failing test**

`src/components/toast.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster, useToast } from '../index';
import { toastStore } from './Toast';

function Trigger() {
  const { show } = useToast();
  return <button type="button" onClick={() => show({ title: 'Saved', description: 'Solution stored', tone: 'success' })}>save</button>;
}

beforeEach(() => {
  toastStore.clear();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('Toaster', () => {
  it('announces toasts in a polite live region and auto-dismisses', () => {
    render(<><Toaster /><Trigger /></>);
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.querySelector('[aria-live="polite"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'save' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Saved').closest('li')).toHaveClass('border-l-brand-emerald');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText('Saved')).toBeNull();
  });
  it('pauses while hovered and can be dismissed', () => {
    render(<Toaster />);
    act(() => void toastStore.show({ title: 'Hold', duration: 1000 }));
    const item = screen.getByText('Hold').closest('li')!;
    fireEvent.mouseEnter(item);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('Hold')).toBeInTheDocument();
    fireEvent.mouseLeave(item);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Hold')).toBeNull();
  });
  it('shows toasts queued before mount', () => {
    act(() => void toastStore.show({ title: 'Early' }));
    render(<Toaster />);
    expect(screen.getByText('Early')).toBeInTheDocument();
  });
  it('never auto-dismisses Infinity', () => {
    render(<Toaster />);
    act(() => void toastStore.show({ title: 'Sticky', duration: Infinity }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('Sticky')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/toast.test.tsx`
Expected: FAIL, because the import of `./Toast` cannot be resolved.

- [ ] **Step 3: Implement**

`src/components/Toast.tsx`:

```tsx
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import { IconButton } from './IconButton';

export type ToastOptions = { title: ReactNode; description?: ReactNode; tone?: 'default' | 'success' | 'danger'; action?: ReactNode; duration?: number };
type Toast = Required<Pick<ToastOptions, 'tone' | 'duration'>> & ToastOptions & { id: number };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const EMPTY: Toast[] = [];
const emit = () => listeners.forEach((l) => l());

/** Module-level store: toasts can be shown from anywhere, even before <Toaster /> mounts. */
export const toastStore = {
  show(options: ToastOptions): number {
    const toast: Toast = { tone: 'default', duration: 4000, ...options, id: nextId++ };
    toasts = [...toasts, toast];
    emit();
    return toast.id;
  },
  dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  clear() {
    toasts = [];
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => toasts,
};

export function useToast() {
  return { show: toastStore.show, dismiss: toastStore.dismiss };
}

const TONE = { default: 'border-l-ink', success: 'border-l-brand-emerald', danger: 'border-l-brand-crimson' } as const;

function ToastItem({ toast }: { toast: Toast }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || !Number.isFinite(toast.duration)) return;
    // ponytail: resuming restarts the full duration rather than the remainder.
    const t = setTimeout(() => toastStore.dismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [paused, toast]);
  return (
    <li
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cx('pointer-events-auto flex min-w-0 items-start gap-space-sm rounded-lg border border-l-4 border-border-subtle bg-surface-elevated p-space-sm text-on-surface shadow-md', TONE[toast.tone])}
    >
      <div className="min-w-0 flex-1">
        <p className="font-body-md text-body-md font-semibold wrap-break-word">{toast.title}</p>
        {toast.description && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{toast.description}</p>}
        {toast.action && <div className="mt-space-xs">{toast.action}</div>}
      </div>
      <IconButton icon="close" label="Dismiss notification" size="xs" onClick={() => toastStore.dismiss(toast.id)} />
    </li>
  );
}

export type ToasterProps = { label?: string };

/** Mount once at the app root. Bottom-right from md, full width below. */
export function Toaster({ label = 'Notifications' }: ToasterProps) {
  const list = useSyncExternalStore(toastStore.subscribe, toastStore.get, () => EMPTY);
  return (
    <section aria-label={label} className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-space-md md:inset-x-auto md:right-0 md:w-96">
      <div aria-live="polite" aria-relevant="additions">
        <ol className="flex flex-col gap-space-xs">
          {list.map((t) => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </ol>
      </div>
    </section>
  );
}
```

Append to `src/index.ts`:

```ts
export { Toaster, useToast, type ToasterProps, type ToastOptions } from './components/Toast';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/toast.test.tsx && npm run typecheck`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: toaster and useToast with pause-on-hover

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: `CommandPalette`

**Files:**
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/index.ts`
- Test: `src/components/command.test.tsx`

**Interfaces:**
- Consumes: `useModal` (Task 2), `Icon`, `useThemeTone`.
- Produces:
  - `CommandItem = { id: string; label: ReactNode; icon?: string; meta?: ReactNode; onSelect: () => void }`
  - `CommandGroup = { label: string; items: CommandItem[] }`
  - `CommandPalette({ open, onClose, query, onQueryChange, groups, placeholder? = 'Search…', emptyText? = 'No results', label? = 'Command palette' })`
  - It implements the APG combobox pattern: the input is `role="combobox"`, with `aria-controls` pointing at a listbox and `aria-activedescendant` pointing at the active option.
  - Up and Down wrap through the options, Enter selects the active option and closes, and Escape closes (through `useModal`).
  - Filtering is done by the caller.

- [ ] **Step 1: Write the failing test**

`src/components/command.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, type CommandGroup } from '../index';

function Harness({ onSelect = vi.fn(), onClose = vi.fn() }) {
  const [q, setQ] = useState('');
  const all: CommandGroup[] = [
    { label: 'Problems', items: [{ id: 'p1', label: 'Parking lot', icon: 'local_parking', onSelect }, { id: 'p2', label: 'Elevator', onSelect }] },
    { label: 'Patterns', items: [{ id: 'x1', label: 'Strategy', meta: 'Behavioral', onSelect }] },
  ];
  const groups = all.map((g) => ({ ...g, items: g.items.filter((i) => String(i.label).toLowerCase().includes(q.toLowerCase())) })).filter((g) => g.items.length);
  return <CommandPalette open onClose={onClose} query={q} onQueryChange={setQ} groups={groups} />;
}

describe('CommandPalette', () => {
  it('is a dialog with a focused combobox controlling a grouped listbox', () => {
    render(<Harness />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    const listbox = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(screen.getAllByRole('group').map((g) => g.getAttribute('aria-labelledby'))).toHaveLength(2);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0].id);
  });
  it('arrows move the active option (wrapping) and Enter selects and closes', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<Harness onSelect={onSelect} onClose={onClose} />);
    const input = screen.getByRole('combobox');
    await userEvent.keyboard('{ArrowUp}');
    const options = screen.getAllByRole('option');
    expect(input).toHaveAttribute('aria-activedescendant', options[2].id);
    expect(options[2]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('typing reports the query, results update, and an empty result shows the empty text', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByRole('combobox'), 'strat');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['StrategyBehavioral']);
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.queryByRole('option')).toBeNull();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/command.test.tsx`
Expected: FAIL, because `CommandPalette` is undefined.

- [ ] **Step 3: Implement**

`src/components/CommandPalette.tsx`:

```tsx
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { Icon } from './Icon';

export type CommandItem = { id: string; label: ReactNode; icon?: string; meta?: ReactNode; onSelect: () => void };
export type CommandGroup = { label: string; items: CommandItem[] };

export type CommandPaletteProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: ReactNode;
  label?: string;
  children?: never;
}>;

/** ⌘K palette: a dialog with an APG combobox over grouped results. The caller filters `groups`. */
export function CommandPalette({ open, onClose, query, onQueryChange, groups, placeholder = 'Search…', emptyText = 'No results', label = 'Command palette', ...rest }: CommandPaletteProps) {
  const base = useId();
  const theme = useThemeTone();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useModal({ open, onClose, panelRef, initialFocusRef: inputRef });

  const flat = groups.flatMap((g) => g.items);
  const active = flat.find((i) => i.id === activeId) ?? flat[0];
  const optionId = (id: string) => `${base}-opt-${id}`;

  useEffect(() => {
    if (active) document.getElementById(optionId(active.id))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scroll only when the active option changes
  }, [active?.id]);

  const select = (item: CommandItem) => {
    item.onSelect();
    onClose();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!flat.length) return;
    const i = active ? flat.indexOf(active) : 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length;
      setActiveId(flat[next].id);
    } else if (e.key === 'Enter' && active) {
      e.preventDefault();
      select(active);
    }
  };

  if (!open || typeof document === 'undefined') return null;
  const listId = `${base}-list`;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 flex items-start justify-center bg-brand-obsidian/40 p-space-md pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="flex max-h-[80vh] w-full min-w-0 max-w-xl flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated text-on-surface shadow-md outline-none"
      >
        <div className="flex items-center gap-space-sm border-b border-border-subtle px-space-md">
          <Icon name="search" tone="muted" />
          <input
            ref={inputRef}
            role="combobox"
            aria-label={label}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active ? optionId(active.id) : undefined}
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setActiveId(null);
            }}
            onKeyDown={onKeyDown}
            className="h-12 min-w-0 flex-1 bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>
        <div id={listId} role="listbox" aria-label={label} className="min-h-0 flex-1 overflow-y-auto p-space-2xs">
          {flat.length === 0 && <p className="px-space-sm py-space-md text-center font-body-sm text-body-sm text-on-surface-variant">{emptyText}</p>}
          {groups.map((g, gi) => (
            <div key={g.label} role="group" aria-labelledby={`${base}-g${gi}`}>
              <p id={`${base}-g${gi}`} className="px-space-sm pb-space-2xs pt-space-sm font-label-mono text-label-mono uppercase text-on-surface-variant">
                {g.label}
              </p>
              {g.items.map((item) => {
                const isActive = item === active;
                return (
                  <div
                    key={item.id}
                    id={optionId(item.id)}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActiveId(item.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(item)}
                    className={cx('flex min-w-0 cursor-pointer items-center gap-space-sm rounded-lg px-space-sm py-space-xs font-body-md text-body-md max-md:min-h-11', isActive ? 'bg-surface-muted text-ink' : 'text-on-surface')}
                  >
                    {item.icon && <Icon name={item.icon} size="sm" tone="muted" />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.meta && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{item.meta}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

Append to `src/index.ts`:

```ts
export { CommandPalette, type CommandGroup, type CommandItem, type CommandPaletteProps } from './components/CommandPalette';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/command.test.tsx && npm run lint && npm run typecheck`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: command palette (APG combobox over grouped results)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 20: `Show` (responsive visibility), and dark tokens inside inverse surfaces

Two gaps surfaced while composing the screens:
- **Visibility:** the addendum's §6 mobile pattern needs something visible only above or only below a breakpoint. That is impossible without `className`.
- **Inverse surfaces:** `Card`, `Box` and `Section` with `tone="inverse"` paint obsidian, but the components inside them keep light tokens. For example, a `Countdown`'s `text-on-surface` is dark on dark.

**Ruling (plan-level):**
- **`Show`:** add a `Show` component, rendered with `display: contents` so it doesn't affect layout.
- **Inverse surfaces:** set `data-theme="dark"` on those three components, so their contents use the dark palette automatically.
- **Cost if wrong:** a small API addition (`Show`), and inverse surfaces now also flip nested badge and callout colours, which is the intended effect.

**Files:**
- Create: `src/primitives/Show.tsx`
- Modify: `src/components/Card.tsx`, `src/primitives/Box.tsx`, `src/primitives/Section.tsx` (targeted edits), `src/index.ts`
- Test: `src/primitives/show.test.tsx`

**Interfaces:**
- Produces: `Show({ above?: 'sm'|'md'|'lg'|'xl', below?: 'sm'|'md'|'lg'|'xl', children })`. Give exactly one of `above` or `below`.
  - `above="md"` renders from `md` up.
  - `below="lg"` renders below `lg` only.
- Inverse `Card`, `Box` and `Section` carry `data-theme="dark"`.

- [ ] **Step 1: Write the failing test**

`src/primitives/show.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/primitives/show.test.tsx`
Expected: FAIL, because `Show` is undefined.

- [ ] **Step 3: Implement**

`src/primitives/Show.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const ABOVE = { sm: 'hidden sm:contents', md: 'hidden md:contents', lg: 'hidden lg:contents', xl: 'hidden xl:contents' } as const;
const BELOW = { sm: 'contents sm:hidden', md: 'contents md:hidden', lg: 'contents lg:hidden', xl: 'contents xl:hidden' } as const;

export type ShowProps = NativeProps<'div', { above?: keyof typeof ABOVE; below?: keyof typeof BELOW; children: ReactNode }>;

/** Render children only from `above` up, or only below `below`. Uses display: contents, so it adds no box. */
export function Show({ above, below, children, ...rest }: ShowProps) {
  return (
    <div {...rest} className={cx(above && ABOVE[above], below && BELOW[below])}>
      {children}
    </div>
  );
}
```

Targeted edits:
- `src/components/Card.tsx`: in `CardRoot`'s returned `<C …>`, add `data-theme={tone === 'inverse' ? 'dark' : undefined}` right after `data-tone={tone}`.
- `src/primitives/Box.tsx`: on the returned `<C …>`, add `data-theme={tone === 'inverse' ? 'dark' : undefined}` after `{...rest}`.
- `src/primitives/Section.tsx`: on the returned `<C …>`, add `data-theme={tone === 'inverse' ? 'dark' : undefined}` after `{...rest}`.

Append to `src/index.ts`:

```ts
export { Show, type ShowProps } from './primitives/Show';
```

- [ ] **Step 4: Run the tests to verify they pass (full unit suite)**

Run: `npm test && npm run typecheck`
Expected: every suite passes. The total grows by 2 from this task.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Show for responsive visibility; inverse surfaces scope the dark tokens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 21: Stories for the new components, the ten Stitch screens and the mobile header

**Files:**
- Modify: `src/stories/fixtures.ts` (UML fixtures)
- Create:
  - Component stories: `src/stories/chrome.stories.tsx`, `src/stories/data.stories.tsx`, `src/stories/feedback-v2.stories.tsx`, `src/stories/forms.stories.tsx`, `src/stories/code.stories.tsx`, `src/stories/uml.stories.tsx`
  - Screens: `src/stories/screens/shared.tsx`, `src/stories/screens/screens-a.stories.tsx`, `src/stories/screens/screens-b.stories.tsx`
- Test: `e2e/stories.spec.ts` (existing; picks up every new story automatically)

**Interfaces:**
- Consumes: every public export.
- Produces:
  - Ladle story ids under `chrome--*`, `data--*`, `feedback-v2--*`, `forms--*`, `code--*`, `uml--*` and `screens--*`.
  - The screen stories are `screens--homepage`, `screens--problems-directory`, `screens--problem-workspace`, `screens--problem-editor`, `screens--pattern-library`, `screens--pattern-detail`, `screens--submission-result`, `screens--auth`, `screens--system-states`, `screens--mobile-header` and `screens--mobile-nav-open`.
- **Rules for screen stories:** they compose **only** library components. No `className` or `style` on anything, with three exceptions:
  - a height wrapper `div` for the IDE (`h-[calc(100dvh-2rem)]`), because the Workbench needs a sized parent;
  - brand artwork (the Google "G" SVG);
  - `shared.tsx`, which is app-side composition, just like the frontend's domain components, and follows the same rule.

- [ ] **Step 1: Write the shared app-side helpers**

`src/stories/screens/shared.tsx` (not a `*.stories.tsx` file, so Ladle doesn't treat its exports as stories):

```tsx
import { useState } from 'react';
import {
  AppBar, Badge, Card, Code, Container, Divider, Drawer, Grid, Heading, Icon, IconButton, Kbd, NavList, Section, Show, Stack, Tabs, Text, TextField, TextLink,
  type BadgeTone, type NavItem, type TabItem,
} from '../../index';

export const NAV_TABS: TabItem[] = [
  { id: 'problems', label: 'Problems', href: '#problems' },
  { id: 'patterns', label: 'Patterns', href: '#patterns' },
  { id: 'workspace', label: 'Workspace', href: '#workspace' },
];
export const NAV_ITEMS: NavItem[] = [
  { id: 'problems', label: 'Problems', icon: 'code_blocks', href: '#problems', count: '150+' },
  { id: 'patterns', label: 'Patterns', icon: 'category', href: '#patterns', count: 23 },
  { id: 'workspace', label: 'Workspace', icon: 'terminal', href: '#workspace' },
];

export function SiteHeader({ current = 'problems' }: { current?: string }) {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <AppBar
        start={
          <Stack direction="row" gap="xs" align="center">
            <Icon name="deployed_code" tone="brand" />
            <Text as="span" weight="semibold" tone="strong">LLD Lab</Text>
          </Stack>
        }
        center={
          <Show above="lg">
            <Tabs label="Site" value={current} items={NAV_TABS} />
          </Show>
        }
        end={
          <>
            <Show above="md">
              <TextField label="Search" hideLabel icon="search" placeholder="Search 150+ problems" readOnly hint={<Kbd>⌘K</Kbd>} />
            </Show>
            <IconButton icon="notifications" label="Notifications, 3 unread" dot="danger" />
            <IconButton as="a" href="#profile" icon="person" label="Profile" variant="subtle" />
            <Show below="lg">
              <IconButton icon="menu" label="Open menu" onClick={() => setMenu(true)} />
            </Show>
          </>
        }
      />
      <Drawer open={menu} onClose={() => setMenu(false)} title="LLD Lab">
        <NavList label="Site" items={NAV_ITEMS} current={current} />
      </Drawer>
    </>
  );
}

export function SiteFooter() {
  return (
    <Section tone="subtle" padding="md">
      <Container>
        <Stack gap="md">
          <Grid cols={{ base: 2, md: 4 }} gap="lg">
            {['Platform', 'Patterns', 'Company', 'Legal'].map((col) => (
              <Stack key={col} gap="xs">
                <Heading level={2} size="sm">{col}</Heading>
                <Stack as="ul" gap="2xs">
                  {['Overview', 'Changelog', 'Status'].map((l) => (
                    <li key={l}><TextLink href={`#${l}`} tone="muted" size="sm">{l}</TextLink></li>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Grid>
          <Divider />
          <Stack direction={{ base: 'column', md: 'row' }} justify="between" gap="xs">
            <Badge tone="success" dot="success" pulse>All systems operational</Badge>
            <Text variant="body-sm" tone="muted">© 2026 LLD Lab</Text>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}

export type Problem = { slug: string; title: string; summary: string; category: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; tags: string[]; rating: string };
const DIFF: Record<Problem['difficulty'], BadgeTone> = { Beginner: 'success', Intermediate: 'info', Advanced: 'danger' };

export const PROBLEMS: Problem[] = [
  { slug: 'parking-lot', title: 'Design a Parking Lot', summary: 'Multi-floor parking with spot types, tickets and payments; concurrency-safe allocation.', category: 'System', difficulty: 'Beginner', tags: ['Singleton', 'Factory'], rating: '4.9' },
  { slug: 'rate-limiter', title: 'Rate Limiter', summary: 'Token bucket and sliding window limiters with pluggable storage.', category: 'Infra', difficulty: 'Intermediate', tags: ['Strategy'], rating: '4.8' },
  { slug: 'elevator', title: 'Elevator System', summary: 'Scheduling for N elevators with request queues and state transitions.', category: 'System', difficulty: 'Intermediate', tags: ['State', 'Observer'], rating: '4.7' },
  { slug: 'lru-cache', title: 'LRU Cache with TTL', summary: 'O(1) get/put with expiry and eviction callbacks under concurrent access.', category: 'Data', difficulty: 'Advanced', tags: ['Decorator'], rating: '4.9' },
  { slug: 'chess', title: 'Chess Engine Core', summary: 'Board, pieces and move validation with an extensible rule set.', category: 'Games', difficulty: 'Advanced', tags: ['Command', 'Strategy'], rating: '4.6' },
  { slug: 'vending', title: 'Vending Machine', summary: 'Inventory, coins and a state machine that never dispenses twice.', category: 'System', difficulty: 'Beginner', tags: ['State'], rating: '4.5' },
];

export function ProblemCard({ p, index }: { p: Problem; index: number }) {
  return (
    <Card as="a" href={`#${p.slug}`} interactive padding="md">
      <Stack direction="row" gap="xs" wrap align="center">
        <Text as="span" variant="label" tone="muted">System #{String(index + 1).padStart(2, '0')}</Text>
        <Badge tone={DIFF[p.difficulty]} uppercase>{p.difficulty}</Badge>
      </Stack>
      <Heading level={3} size="sm">{p.title}</Heading>
      <Text variant="body-sm" tone="muted" clamp={2}>{p.summary}</Text>
      <Stack direction="row" gap="xs" wrap>
        {p.tags.map((t) => <Code key={t}>{t}</Code>)}
      </Stack>
      <Card.Footer>
        <Stack direction="row" gap="2xs" align="center">
          <Icon name="star" size="sm" tone="warning" filled />
          <Text as="span" variant="body-sm">{p.rating}</Text>
        </Stack>
        <Text as="span" variant="body-sm" tone="brand" weight="medium">Blueprint →</Text>
      </Card.Footer>
    </Card>
  );
}
```

- [ ] **Step 2: Write the component stories**

`src/stories/chrome.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { useState } from 'react';
import { AppBar, Avatar, AvatarGroup, Badge, Button, Chip, CommandPalette, Divider, Drawer, Eyebrow, Icon, IconButton, IconTile, NavList, Pagination, Stack, Text, TextLink, type CommandGroup } from '../index';
import { NAV_ITEMS } from './screens/shared';

export default { title: 'Chrome' };

export const LinksDividersTiles: Story = () => (
  <Stack gap="md">
    <Stack direction="row" gap="md" wrap>
      <TextLink href="#a" iconRight="arrow_forward">Blueprint</TextLink>
      <TextLink href="#b" tone="muted" size="sm">Forgot password?</TextLink>
      <TextLink href="#c" tone="danger" underline="always">Report issue</TextLink>
    </Stack>
    <Divider label="or" />
    <Stack direction="row" gap="sm" align="center">
      <Text>Left</Text><Divider orientation="vertical" /><Text>Right</Text>
    </Stack>
    <Stack direction="row" gap="sm" wrap>
      {(['neutral', 'brand', 'success', 'warning', 'danger'] as const).map((t) => <IconTile key={t} icon="bolt" tone={t} />)}
      <IconTile icon="check" tone="success" size="xl" shape="circle" filled label="Accepted" />
    </Stack>
    <Stack direction="row" gap="sm" wrap align="center">
      <Button variant="brand" icon="bolt">Start Practicing</Button>
      <Button variant="accent">Start Free Practice</Button>
      <Button variant="secondary" icon="star" iconTone="warning" iconFilled>4.8k</Button>
      <IconButton icon="notifications" label="Notifications, 3 unread" dot="danger" />
      <IconButton icon="share" label="Share" variant="secondary" size="xs" />
      <Badge tone="success" dot="success" pulse>Runtime Ready</Badge>
      <Badge tone="info" icon="verified" size="md">GOF CLASSIC</Badge>
      <Chip tone="danger" dot="danger" onRemove={() => {}}>Advanced</Chip>
      <Chip dot="#00ADD8">Go 1.22</Chip>
      <Eyebrow variant="plain" pulse>Live</Eyebrow>
    </Stack>
    <Stack direction="row" gap="md" align="center">
      <Avatar name="Alex Lin" status="success" statusLabel="online" />
      <Avatar name="Sam Park" shape="square" tone="brand" />
      <AvatarGroup label="Solvers" max={3}>
        <Avatar name="A B" tone="brand" /><Avatar name="C D" tone="success" /><Avatar name="E F" tone="warning" /><Avatar name="G H" /><Avatar name="I J" />
      </AvatarGroup>
    </Stack>
  </Stack>
);

export const AppBarAndNav: Story = () => {
  const [page, setPage] = useState(3);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="lg">
      <AppBar position="static" start={<Text weight="semibold">LLD Lab</Text>} end={<IconButton icon="menu" label="Open menu" onClick={() => setOpen(true)} />} />
      <Drawer open={open} onClose={() => setOpen(false)} title="Navigation">
        <NavList label="Site" items={NAV_ITEMS} current="patterns" />
      </Drawer>
      <NavList label="Workspace" heading="Navigation" items={NAV_ITEMS} current="problems" />
      <NavList label="On this page" variant="toc" current="b" items={[{ id: 'a', label: '1. Intent', href: '#a' }, { id: 'b', label: '2. Structure', href: '#b' }, { id: 'c', label: '3. Participants', href: '#c' }]} />
      <Pagination page={page} pageCount={12} onChange={setPage} summary="Showing 12 of 142" />
    </Stack>
  );
};

export const Palette: Story = () => {
  const [q, setQ] = useState('');
  const groups: CommandGroup[] = [
    { label: 'Problems', items: [{ id: 'p', label: 'Parking lot', icon: 'local_parking', meta: 'Beginner', onSelect: () => {} }, { id: 'r', label: 'Rate limiter', icon: 'speed', onSelect: () => {} }] },
    { label: 'Patterns', items: [{ id: 's', label: 'Strategy', icon: 'category', meta: 'Behavioral', onSelect: () => {} }] },
  ].map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) }));
  return <CommandPalette open onClose={() => {}} query={q} onQueryChange={setQ} groups={groups.filter((g) => g.items.length)} />;
};

export const IconsXl: Story = () => <Icon name="lock" size="xl" label="Locked" />;
```

`src/stories/data.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { BarChart, Badge, DescriptionList, Disclosure, ResultRow, Stack, Table, Timeline } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Data' };

export const TablesAndLists: Story = () => (
  <Stack gap="lg">
    <Table
      caption="Participants"
      showCaption
      columns={[{ key: 'name', header: 'Participant', mono: true }, { key: 'role', header: 'Responsibility' }, { key: 'n', header: 'Count', align: 'end', width: 'min' }]}
      rows={[
        { name: 'PricingContext', role: 'Holds a reference to a Strategy', n: 1 },
        { name: 'Strategy', role: `Common interface ${LONG_WORD}`, n: 1 },
        { name: 'HourlyStrategy', role: 'Concrete strategy', n: 3 },
      ]}
    />
    <DescriptionList layout="inline" items={[{ term: 'Category', detail: 'Behavioral' }, { term: 'Also known as', detail: 'Policy' }, { term: 'Complexity', detail: LONG_WORD }]} />
  </Stack>
);

export const TimelineAndDisclosure: Story = () => (
  <Stack gap="lg">
    <Timeline
      label="Attempts"
      items={[
        { id: '1', status: 'danger', title: 'Attempt #1', badge: <Badge tone="danger">Failed</Badge>, meta: '2h ago' },
        { id: '2', status: 'warning', title: 'Attempt #2', description: 'Race detected in park()', meta: '1h ago' },
        { id: '3', status: 'success', title: 'Attempt #3', badge: <Badge tone="success">Accepted</Badge>, meta: 'now' },
        { id: '4', status: 'locked', title: 'Next: Elevator System' },
      ]}
    />
    <Disclosure variant="row" selected defaultOpen summary={<ResultRow status="pass" title="parks 100 cars concurrently" meta="12ms" />}>
      <ResultRow status="pending" title={`goroutines: 100 ${LONG_WORD}`} titleMono />
    </Disclosure>
    <BarChart label="Runtime distribution" bars={[3, 8, 14, 22, 30, 18, 9, 5, 2, 1].map((v, i) => ({ value: v, label: `${i * 10}ms` }))} highlight={4} highlightLabel="41ms" axis={['0ms', '50ms', '100ms']} />
  </Stack>
);
```

`src/stories/feedback-v2.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { Button, Message, Skeleton, Stack, TerminalOutput, Toaster, Tooltip, useToast, VerdictBanner, Badge } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Feedback v2' };

export const Loading: Story = () => (
  <Stack gap="md">
    <Message>Loading problems…</Message>
    <Stack direction="row" gap="xs"><Skeleton shape="pill" width="1/4" /><Skeleton shape="pill" width="1/4" /></Stack>
    <Skeleton shape="rect" />
    <Skeleton lines={3} />
    <Skeleton shape="circle" height="lg" />
  </Stack>
);

export const Terminal: Story = () => (
  <TerminalOutput
    title="Terminal"
    status={<Badge tone="danger">BUILD BROKEN</Badge>}
    lines={[
      { kind: 'command', text: 'go test ./...' },
      { kind: 'error', text: `./lot.go:24:8: undefined: ${LONG_WORD}` },
      { kind: 'plain', text: '    spot := SpotFactory.New(kind)' },
      { kind: 'hint', text: 'Did you mean spotFactory?' },
      { kind: 'success', text: 'ok  parking/internal/ticket 0.21s' },
    ]}
  />
);

export const Verdict: Story = () => (
  <VerdictBanner tone="success" icon="check" title="Accepted" badge={<Badge tone="success">8/8 tests</Badge>} meta={['41ms', '1.4 MB', 'attempt #3']} actions={<><Button variant="secondary">Back to Editor</Button><Button variant="brand">Next Problem</Button></>} />
);

export const TooltipAndToast: Story = () => {
  const { show } = useToast();
  return (
    <Stack direction="row" gap="sm">
      <Tooltip content="Resets the zoom to 100%" delay={0}>
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
      <Button onClick={() => show({ title: 'Solution saved', description: 'Stored as attempt #4', tone: 'success' })}>Show toast</Button>
      <Toaster />
    </Stack>
  );
};
```

`src/stories/forms.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Button, Checkbox, Overlay, Stack, Switch, TextField, TextLink, UmlClass } from '../index';

export default { title: 'Forms' };

export const Controls: Story = () => {
  const [race, setRace] = useState(true);
  return (
    <Stack gap="md">
      <Checkbox label="Read the intent" strikeWhenChecked defaultChecked />
      <Checkbox label="Implement one concrete strategy" description="Hourly or daily pricing" />
      <Checkbox label="Some tests passing" indeterminate />
      <Switch label="Race detector" description="Slower runs, catches data races" checked={race} onChange={setRace} />
      <TextField label="Password" type="password" revealable labelEnd={<TextLink href="#forgot" size="sm">Forgot password?</TextLink>} />
      <TextField label="Full name" size="sm" />
    </Stack>
  );
};

export const Gate: Story = () => (
  <Overlay
    overlay={
      <Stack gap="sm" align="center">
        <Button icon="login">Sign in to solve</Button>
      </Stack>
    }
  >
    <UmlClass name="ParkingLot" attributes={['- levels: Level[]']} methods={['+ park(car): Ticket']} />
  </Overlay>
);
```

`src/stories/code.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { Badge, CodeBlock, CopyButton, DiffViewer, Stack } from '../index';

export default { title: 'Code' };

const GO = `func (l *Lot) Park(c Car) (Ticket, error) {\n\tl.mu.Lock()\n\tdefer l.mu.Unlock()\n\t// find the nearest free spot\n\treturn l.assign(c, 42)\n}`;
const JAVA = `public class FeeCalculator {\n  public double fee(String type, int hours) {\n    if (type.equals("HOURLY")) return hours * 2.5;\n    return 20;\n  }\n}`;

export const Highlighting: Story = () => (
  <Stack gap="md">
    <CodeBlock language="go" highlight lineNumbers title="lot.go" actions={<CopyButton value={GO} />}>{GO}</CodeBlock>
    <CodeBlock language="java" highlight title="FeeCalculator.java (Anti-Pattern)" meta={<Badge tone="danger">BRITTLE</Badge>}>{JAVA}</CodeBlock>
    <CodeBlock language="ts" highlight tone="subtle">{`interface Strategy {\n  compute(hours: number): number; // price\n}`}</CodeBlock>
    <CodeBlock language="python" highlight>{`def price(hours: int) -> float:\n    return hours * 2.5  # hourly`}</CodeBlock>
    <CodeBlock language="bash" highlight>{`npm test && echo "$HOME" # done`}</CodeBlock>
  </Stack>
);

export const Diff: Story = () => (
  <DiffViewer mode="split" oldTitle="naive.go" newTitle="staff.go" oldValue={'type Lot struct {\n\tspots []Spot\n}\n\nfunc (l *Lot) Park(c Car) {}'} newValue={'type Lot struct {\n\tmu    sync.Mutex\n\tspots []Spot\n}\n\nfunc (l *Lot) Park(c Car) error { return nil }'} />
);
```

Append the UML fixtures to `src/stories/fixtures.ts`. Story files must only export stories, because Ladle lists every export.

```ts

import type { UmlEdge, UmlNode } from '../index';

export const STRATEGY_NODES: UmlNode[] = [
  { id: 'ctx', name: 'PricingContext', attributes: ['- strategy: Strategy'], methods: ['+ price(hours): Money'], emphasis: 'strong' },
  { id: 'strat', name: 'Strategy', stereotype: 'interface', methods: ['+ compute(hours): Money'], emphasis: 'brand' },
  { id: 'hourly', name: 'HourlyStrategy', methods: ['+ compute(hours): Money'] },
  { id: 'daily', name: 'DailyStrategy', methods: ['+ compute(hours): Money'] },
];
export const STRATEGY_EDGES: UmlEdge[] = [
  { from: 'ctx', to: 'strat', kind: 'aggregation', fromMultiplicity: '1', toMultiplicity: '1' },
  { from: 'hourly', to: 'strat', kind: 'realization' },
  { from: 'daily', to: 'strat', kind: 'realization' },
];
```

Merge the new `import type` line into the file's existing `import type { FileNode } from '../index';`, so the result is `import type { FileNode, UmlEdge, UmlNode } from '../index';`.

`src/stories/uml.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { Stack, UmlClass, UmlDiagram } from '../index';
import { STRATEGY_EDGES, STRATEGY_NODES } from './fixtures';

export default { title: 'UML' };

export const Classes: Story = () => (
  <Stack direction="row" gap="md" wrap>
    <UmlClass name="RateLimiter" stereotype="interface" methods={['+ allowRequest(id): bool']} emphasis="brand" />
    <UmlClass name="TokenBucket" attributes={['- tokens: int', '- rate: int']} methods={['+ allowRequest(id): bool']} />
    <UmlClass name="Draft" dashed size="sm" />
  </Stack>
);

export const Diagram: Story = () => <UmlDiagram label="Strategy pattern" nodes={STRATEGY_NODES} edges={STRATEGY_EDGES} />;

export const CompactDiagram: Story = () => (
  <UmlDiagram
    label="Parking lot schema"
    compact
    direction="LR"
    nodes={[{ id: 'lot', name: 'ParkingLot' }, { id: 'lvl', name: 'Level' }, { id: 'spot', name: 'Spot' }]}
    edges={[
      { from: 'lot', to: 'lvl', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' },
      { from: 'lvl', to: 'spot', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' },
    ]}
  />
);
```

- [ ] **Step 3: Write the screen stories**

`src/stories/screens/screens-a.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { useState } from 'react';
import {
  Avatar, AvatarGroup, Badge, Breadcrumbs, Button, Callout, Card, CheckList, Chip, CodeBlock, Container, Countdown, Disclosure, Divider, Dot,
  EditorTabs, Eyebrow, FileTree, Grid, Heading, Icon, IconButton, IconTile, Kbd, Menu, MetricTile, NavList, Pagination, ProgressBar, ResultRow,
  Section, SectionHeader, SegmentedControl, Select, Split, Stack, Stat, StatusBar, TabPanel, Tabs, TerminalOutput, Text, TextField, TextLink,
  Show, Theme, Timeline, UmlClass, UmlDiagram, Workbench, type BadgeTone, type StatusTone,
} from '../../index';
import { NAV_ITEMS, PROBLEMS, ProblemCard, SiteFooter, SiteHeader, type Problem } from './shared';

export default { title: 'Screens' };

const TIERS: Array<{ name: Problem['difficulty']; dot: StatusTone; tag: string; tagTone: BadgeTone }> = [
  { name: 'Beginner', dot: 'success', tag: 'Core', tagTone: 'success' },
  { name: 'Intermediate', dot: 'brand', tag: 'Applied', tagTone: 'info' },
  { name: 'Advanced', dot: 'danger', tag: 'Staff', tagTone: 'danger' },
];

export const Homepage: Story = () => {
  const [lang, setLang] = useState('java');
  const [filter, setFilter] = useState('popular');
  return (
    <Stack gap="none">
      <SiteHeader />
      <Section pattern="dots" padding="lg">
        <Container>
          <Split
            ratio="1/1"
            aside={
              <Card>
                <Grid cols={{ base: 3 }} gap="sm">
                  <MetricTile label="Engineers" value="25k+" />
                  <MetricTile label="Problems" value="150+" tone="brand" />
                  <MetricTile label="Patterns" value="23" tone="success" />
                </Grid>
                <Stack direction="row" gap="sm" align="center">
                  <AvatarGroup label="Recent solvers" max={4} size="sm">
                    <Avatar name="Ada L" tone="brand" /><Avatar name="Grace H" tone="success" /><Avatar name="Linus T" tone="warning" /><Avatar name="Barbara L" /><Avatar name="Ken T" />
                  </AvatarGroup>
                  <Text variant="body-sm" tone="muted">1.2k solved today</Text>
                </Stack>
              </Card>
            }
          >
            <Stack gap="md" align="start">
              <Eyebrow pulse>Low-level design lab</Eyebrow>
              <Heading level={1} size="display">
                Design software that <Text as="span" variant="inherit" tone="brand">scales</Text>
              </Heading>
              <Text variant="body-lead" tone="muted" measure>Practise object-oriented design with real problems, instant tests and a pattern library.</Text>
              <Stack direction="row" gap="sm" wrap>
                <Button as="a" href="#problems" iconRight="arrow_forward">Start practicing</Button>
                <Button as="a" href="#patterns" variant="secondary" icon="category">Browse patterns</Button>
              </Stack>
            </Stack>
          </Split>
        </Container>
      </Section>
      <Section padding="md">
        <Container>
          <Card tone="inverse" padding="md">
            <Stack direction="row" gap="xs" align="center"><Dot tone="danger" size="md" /><Dot tone="warning" size="md" /><Dot tone="success" size="md" /><Text variant="label" tone="muted">rate_limiter.java</Text></Stack>
            <Grid cols={{ md: 2 }} gap="md">
              <Stack gap="sm" align="start">
                <UmlClass name="RateLimiter" stereotype="interface" methods={['+ allowRequest(id): bool']} emphasis="brand" />
                <Stack direction="row" gap="xs" wrap><Badge tone="success">SRP: 100%</Badge><Badge tone="info">OCP: 96%</Badge></Stack>
              </Stack>
              <Stack gap="sm">
                <SegmentedControl label="Language" value={lang} onChange={setLang} options={[{ value: 'java', label: 'Java 21' }, { value: 'py', label: 'Python' }, { value: 'cpp', label: 'C++' }]} />
                <CodeBlock language="java" highlight>{`public boolean allowRequest(String id) {\n  return bucket(id).tryConsume(1);\n}`}</CodeBlock>
              </Stack>
            </Grid>
            <Callout tone="success" size="sm" action={<TextLink href="#ide" iconRight="open_in_new">Launch Full IDE</TextLink>}>Test Suite: 18/18 passing</Callout>
          </Card>
        </Container>
      </Section>
      <Section padding="md">
        <Container>
          <Stack gap="lg">
            <Stack gap="sm" align="center">
              <Eyebrow>Three pillars</Eyebrow>
              <Heading level={2} align="center">Everything you need to master LLD</Heading>
              <Text align="center" tone="muted" measure>From patterns to production-grade reviews.</Text>
            </Stack>
            <Grid cols={{ md: 3 }}>
              {[['category', 'Pattern library'], ['terminal', 'In-browser IDE'], ['fact_check', 'SOLID reviews']].map(([icon, title]) => (
                <Card key={title} interactive as="a" href={`#${title}`}>
                  <IconTile icon={icon} size="lg" />
                  <Heading level={3} size="sm">{title}</Heading>
                  <Text variant="body-sm" tone="muted">Short description of the pillar.</Text>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section padding="md">
        <Container>
          <Stack gap="md">
            <Tabs label="Filter problems" variant="pills" value={filter} onChange={setFilter} items={[{ id: 'popular', label: 'Popular' }, { id: 'faang', label: 'FAANG' }, { id: 'new', label: 'New' }]} />
            <Grid cols={{ md: 2, xl: 3 }}>{PROBLEMS.slice(0, 3).map((p, i) => <ProblemCard key={p.slug} p={p} index={i} />)}</Grid>
          </Stack>
        </Container>
      </Section>
      <Section padding="md">
        <Container>
          <Card tone="inverse" pattern="dots" padding="xl">
            <Heading level={2} tone="inverse">Ready to design?</Heading>
            <Text tone="inverse">Your first problem takes ten minutes.</Text>
            <Stack direction="row"><Button variant="accent" iconRight="arrow_forward">Start Free Practice</Button></Stack>
          </Card>
        </Container>
      </Section>
      <SiteFooter />
    </Stack>
  );
};

export const ProblemsDirectory: Story = () => {
  const [tier, setTier] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  return (
    <Stack gap="none">
      <SiteHeader current="problems" />
      <Section padding="md">
        <Container>
          <Stack gap="lg">
            <Stack gap="sm">
              <Eyebrow>/// 23 GoF patterns</Eyebrow>
              <Heading level={1}>Problems</Heading>
              <Text tone="muted" measure>Curated low-level design challenges, from beginner to staff.</Text>
              <Stack direction="row" gap="lg" wrap>
                <Stat icon="layers" label="Total" value="142" />
                <Stat icon="task_alt" label="Solved" value="12" />
                <Stat icon="local_fire_department" label="Streak" value="5 days" />
              </Stack>
            </Stack>
            <Tabs label="Tier" variant="pills" value={tier} onChange={setTier} items={[{ id: 'all', label: 'All Challenges', count: 142 }, { id: 'b', label: 'Beginner', count: 34, dot: 'success' }, { id: 'i', label: 'Intermediate', count: 58, dot: 'brand' }, { id: 'a', label: 'Advanced', count: 50, dot: 'danger' }]} />
            <Grid cols={{ md: 2, xl: 5 }} gap="sm">
              <TextField label="Search problems" hideLabel icon="search" placeholder="Search problems" hint={<Kbd>Esc</Kbd>} />
              <Select label="Difficulty" hideLabel options={[{ value: '', label: 'Any difficulty' }, { value: 'b', label: 'Beginner' }]} />
              <Select label="Pattern" hideLabel options={[{ value: '', label: 'Any pattern' }, { value: 's', label: 'Strategy' }]} />
              <Select label="Domain" hideLabel options={[{ value: '', label: 'Any domain' }, { value: 'sys', label: 'Systems' }]} />
              <SegmentedControl label="View" value={view} onChange={setView} options={[{ value: 'grid', label: 'Grid view', icon: 'grid_view', hideLabel: true }, { value: 'list', label: 'List view', icon: 'view_list', hideLabel: true }]} />
            </Grid>
            <Split
              sticky
              stickyOffset="appbar"
              aside={
                <Stack gap="md">
                  <Card tone="inverse">
                    <Stack direction="row" justify="between" align="center" wrap>
                      <Badge tone="warning" uppercase>Daily challenge</Badge>
                      <Countdown until={new Date(Date.now() + 5.4 * 3600_000)} label="Resets in" />
                    </Stack>
                    <Heading level={3} size="sm" tone="inverse">Thread-safe LRU cache</Heading>
                    <ProgressBar label="Solved today" valueLabel="324 Engineers" value={62} tone="success" />
                    <Button variant="brand" fullWidth iconRight="arrow_forward">Solve now</Button>
                  </Card>
                  <Card>
                    <Heading level={3} size="sm">Learning track</Heading>
                    <Timeline label="Learning track" items={[{ id: '1', status: 'done', title: 'Parking lot' }, { id: '2', status: 'current', title: 'Elevator', description: 'Next up' }, { id: '3', status: 'locked', title: 'Rate limiter' }]} />
                    <TextLink href="#path" iconRight="arrow_forward" size="sm">View Full Curated Path</TextLink>
                  </Card>
                  <Grid cols={{ base: 2 }} gap="sm">
                    {['Amazon', 'Uber', 'Stripe', 'Google'].map((c) => (
                      <Card key={c} tone="subtle" padding="sm" interactive as="a" href={`#${c}`}>
                        <Text weight="semibold">{c}</Text>
                        <Text variant="label" tone="muted">18 Qs</Text>
                      </Card>
                    ))}
                  </Grid>
                </Stack>
              }
            >
              <Stack gap="xl">
                {TIERS.map((t) => (
                  <Stack key={t.name} gap="md">
                    <SectionHeader title={`Tier: ${t.name}`} dot={t.dot} tag={t.tag} tagTone={t.tagTone} meta="2 Problems Listed" />
                    <Grid cols={{ md: 2 }}>{PROBLEMS.filter((p) => p.difficulty === t.name).map((p, i) => <ProblemCard key={p.slug} p={p} index={i} />)}</Grid>
                  </Stack>
                ))}
                <Pagination page={page} pageCount={12} onChange={setPage} summary="Showing 12 of 142" />
              </Stack>
            </Split>
          </Stack>
        </Container>
      </Section>
    </Stack>
  );
};

export const ProblemWorkspace: Story = () => {
  const [tab, setTab] = useState('spec');
  return (
    <Stack gap="none">
      <SiteHeader current="workspace" />
      <Section padding="md">
        <Container>
          <Split
            start={
              <Stack gap="md">
                <NavList label="Workspace" heading="Navigation" items={NAV_ITEMS} current="workspace" />
                <Card tone="subtle" padding="sm"><ProgressBar label="Mastery" value={64} size="sm" /></Card>
                <Stack direction="row" gap="sm" align="center"><Avatar name="Alex Lin" size="sm" status="success" statusLabel="online" /><Text truncate>Architect</Text><IconButton icon="settings" label="Settings" size="sm" /></Stack>
              </Stack>
            }
            aside={
              <Card>
                <Heading level={3} size="sm">Next step</Heading>
                <Text variant="body-sm" tone="muted">Submit for a SOLID review.</Text>
                <Button variant="brand" iconRight="arrow_forward">Submit Review</Button>
              </Card>
            }
          >
            <Stack gap="md">
              <Stack direction="row" gap="sm" align="center" wrap>
                <TextLink href="#problems" icon="arrow_back" size="sm" tone="muted">Problems</TextLink>
                <Badge tone="info" uppercase>Active session</Badge>
                <Countdown direction="up" seconds={2535} label="Session time" />
                <Badge tone="success" dot="success" pulse>Runtime Ready</Badge>
              </Stack>
              <Heading level={1} size="lg" truncate>#008 Design a Concurrent Multi-Floor Parking Complex</Heading>
              <Stack direction="row" gap="sm" wrap>
                <Button variant="subtle" icon="play_arrow" iconTone="brand">Run Tests</Button>
                <Button>Submit Review</Button>
              </Stack>
              <Tabs label="Specification" value={tab} onChange={setTab} items={[{ id: 'spec', label: 'Specification', panelId: 'ws-spec' }, { id: 'uml', label: 'UML', panelId: 'ws-uml' }]} />
              <TabPanel id="ws-spec" active={tab === 'spec'}>
                <Stack gap="md">
                  <Card>
                    <Heading level={2} size="sm">Problem Briefing</Heading>
                    <Grid cols={{ base: 2, md: 4 }} gap="sm">
                      <MetricTile label="Cache" value="LRU / TTL" tone="danger" />
                      <MetricTile label="Writes" value="Atomic" tone="success" />
                      <MetricTile label="Lookup" value="O(1)" />
                      <MetricTile label="Floors" value="3" />
                    </Grid>
                    <Stack direction="row" gap="xs" align="center"><Icon name="fact_check" /><Heading level={3} size="sm">Functional Requirements</Heading></Stack>
                    <CheckList items={[<><b>Park</b> any vehicle type</>, <><b>Release</b> spots atomically</>, <><b>Report</b> occupancy per floor</>]} />
                    <Divider />
                    <Text variant="body-sm" tone="muted">Concurrency contract: park() and leave() are safe for concurrent use.</Text>
                  </Card>
                  <Card padding="none">
                    <Card.Header start={<><Icon name="science" /><Text weight="semibold">Test Suite</Text></>} end={<Text variant="label" tone="muted">3 PASS • 0 FAIL</Text>} />
                    <Stack gap="none">
                      <ResultRow status="pass" title="parks a car" titleMono detail="happy path" meta="2.1ms" />
                      <ResultRow status="pass" title="rejects a full floor" titleMono meta="1.4ms" />
                      <ResultRow status="pass" title="releases spots atomically" titleMono meta="3.0ms" />
                    </Stack>
                    <Card.Footer><Text variant="label" tone="muted">Total execution 14.3ms</Text><Text variant="label" tone="muted">Heap 4.2MB</Text></Card.Footer>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel id="ws-uml" active={tab === 'uml'}>
                <UmlDiagram label="Parking lot" nodes={[{ id: 'lot', name: 'ParkingLot' }, { id: 'lvl', name: 'Level' }]} edges={[{ from: 'lot', to: 'lvl', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' }]} />
              </TabPanel>
            </Stack>
          </Split>
        </Container>
      </Section>
    </Stack>
  );
};

export const ProblemEditor: Story = () => {
  const [active, setActive] = useState('internal/lot/parking_lot.go');
  const [lang, setLang] = useState('go');
  const [panel, setPanel] = useState('tests');
  const [right, setRight] = useState('desc');
  return (
    <Theme tone="dark">
      <div className="h-[calc(100dvh-2rem)]">
        <Workbench
          persistKey="ladle-ide-v2"
          header={
            <>
              <Workbench.Toggle panel="left" />
              <Breadcrumbs items={[{ label: 'Problems', href: '#' }, { label: 'Parking lot' }]} />
              <Show above="md">
                <Badge tone="warning" uppercase>Intermediate</Badge>
                <SegmentedControl label="Language" value={lang} onChange={setLang} options={[{ value: 'go', label: 'Go', dot: 'success' }, { value: 'ts', label: 'TS' }]} />
                <Countdown direction="up" seconds={1453} label="Elapsed" />
                <Button size="sm" variant="secondary" icon="play_arrow">Run Tests <Kbd>⌘R</Kbd></Button>
              </Show>
              <Button size="sm" variant="brand">Submit Solution</Button>
              <Menu label="Account" items={[{ label: 'Profile', icon: 'person' }, { type: 'separator' }, { label: 'Sign out', icon: 'logout', tone: 'danger' }]} trigger={(p) => <Button {...p} size="sm" variant="ghost" iconRight="expand_more"><Avatar name="Alex Lin" size="sm" shape="square" /></Button>} />
              <Workbench.Toggle panel="right" />
            </>
          }
          left={
            <FileTree
              label="Files"
              activePath={active}
              onOpen={setActive}
              nodes={[
                { path: 'internal/lot/parking_lot.go', kind: 'file', modified: true },
                { path: 'internal/lot/level.go', kind: 'file' },
                { path: 'internal/lot/parking_lot_test.go', kind: 'file', readOnly: true, status: 'success' },
                { path: 'README.md', kind: 'file', readOnly: true, icon: 'info' },
              ]}
            />
          }
          main={
            <Stack gap="none">
              <EditorTabs tabs={[{ id: 'internal/lot/parking_lot.go', label: 'parking_lot.go', modified: true }, { id: 'internal/lot/level.go', label: 'level.go' }]} activeId={active} onSelect={setActive} onClose={() => {}} />
              <Breadcrumbs label="Symbol path" items={[{ label: 'internal' }, { label: 'lot' }, { label: 'parking_lot.go' }, { label: 'ParkingLot' }]} />
              <CodeBlock language="go" highlight lineNumbers>{`type ParkingLot struct {\n\tmu     sync.Mutex\n\tlevels []*Level\n}\n\nfunc (p *ParkingLot) Park(v Vehicle) (*Ticket, error) {\n\tp.mu.Lock()\n\tdefer p.mu.Unlock()\n\treturn nil, ErrFull\n}`}</CodeBlock>
              <StatusBar start={<><StatusBar.Item>Go 1.22</StatusBar.Item><StatusBar.Item tone="success" icon="check">Saved</StatusBar.Item></>} end={<StatusBar.Item>Ln 24, Col 8</StatusBar.Item>} />
            </Stack>
          }
          right={
            <Stack gap="md">
              <Tabs label="Details" value={right} onChange={setRight} items={[{ id: 'desc', label: 'Description' }, { id: 'subs', label: 'Submissions', count: 3 }]} />
              <Stack direction="row" gap="xs" wrap><Chip icon="bolt">O(1) park</Chip><Chip icon="lock">Thread-safe</Chip></Stack>
              <CheckList items={['Support 3 vehicle sizes', 'Atomic release']} />
              <UmlDiagram label="Class schema" compact direction="LR" nodes={[{ id: 'lot', name: 'ParkingLot' }, { id: 'lvl', name: 'Level' }]} edges={[{ from: 'lot', to: 'lvl', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' }]} />
              <CodeBlock language="go" highlight title="Expected interfaces">{`type Lot interface {\n\tPark(Vehicle) (*Ticket, error)\n}`}</CodeBlock>
            </Stack>
          }
          bottom={
            <Stack gap="sm">
              <Tabs label="Panel" value={panel} onChange={setPanel} items={[{ id: 'tests', label: 'Test Results', badge: <Badge tone="warning">6/8 Passing</Badge> }, { id: 'out', label: 'Terminal' }]} />
              <Grid cols={{ base: 2, md: 4 }} gap="sm">
                <MetricTile label="Passed" value="6" tone="success" /><MetricTile label="Failed" value="2" tone="danger" /><MetricTile label="Duration" value="1.2s" /><MetricTile label="Memory" value="3.1MB" />
              </Grid>
              <Disclosure variant="row" defaultOpen summary={<ResultRow status="fail" title="TestParkConcurrent" titleMono meta="0.4s" />}>
                <TerminalOutput maxHeight="sm" lines={[{ kind: 'command', text: 'go test -race ./internal/lot' }, { kind: 'error', text: 'WARNING: DATA RACE in (*Level).Assign' }]} />
              </Disclosure>
              <ResultRow status="pass" title="TestParkSingle" titleMono meta="3ms" />
            </Stack>
          }
        />
      </div>
    </Theme>
  );
};

export const PatternLibrary: Story = () => {
  const [cat, setCat] = useState('all');
  return (
    <Stack gap="none">
      <SiteHeader current="patterns" />
      <Section padding="md">
        <Container>
          <Split
            sticky
            stickyOffset="appbar"
            aside={
              <Stack gap="md">
                <Card>
                  <Stack direction="row" gap="sm" align="center"><IconTile icon="compare_arrows" tone="brand" size="sm" /><Heading level={2} size="sm">Compare Patterns</Heading></Stack>
                  <Divider />
                  {['Strategy vs State', 'Decorator vs Proxy', 'Factory vs Builder'].map((c) => (
                    <Card key={c} as="a" href={`#${c}`} tone="subtle" padding="sm" interactive>
                      <Stack direction="row" justify="between" align="center"><Text variant="body-sm" weight="medium">{c}</Text><Icon name="chevron_right" size="sm" /></Stack>
                    </Card>
                  ))}
                  <TextLink href="#compare" size="sm" iconRight="arrow_forward">View all 14 comparisons</TextLink>
                </Card>
                <Card tone="inverse">
                  <Stack direction="row" gap="xs" align="center"><Dot tone="success" pulse /><Text variant="label">SOLID axioms verifier</Text></Stack>
                  <Text variant="body-sm">Paste a class and get an instant SOLID report.</Text>
                  <Button variant="brand" fullWidth>Open verifier</Button>
                </Card>
              </Stack>
            }
          >
            <Stack gap="lg">
              <Stack gap="sm">
                <Eyebrow variant="plain">Pattern library</Eyebrow>
                <Heading level={1}>Every classic pattern</Heading>
                <Card tone="subtle" padding="md"><ProgressBar label="Mastery" valueLabel="7 of 12 practiced" caption="58% complete · 5 remaining" value={7} max={12} tone="success" /></Card>
              </Stack>
              <Tabs label="Category" variant="pills" value={cat} onChange={setCat} items={[{ id: 'all', label: 'All', count: 23 }, { id: 'c', label: 'Creational', dot: 'warning', count: 5 }, { id: 's', label: 'Structural', dot: 'brand', count: 7 }, { id: 'b', label: 'Behavioral', dot: 'success', count: 11 }]} />
              <SectionHeader title="Creational" icon="construction" accent="warning" tag="4 patterns" tagTone="warning" size="md" description="Patterns that control how objects are created." meta="3/4 Practiced" />
              <Grid cols={{ md: 2 }}>
                {['Singleton', 'Factory Method', 'Builder', 'Prototype'].map((name, i) => (
                  <Card key={name} as="a" href={`#${name}`} interactive padding="md">
                    <Card.Media height="md" caption="UML schema"><UmlClass name={name} size="sm" stereotype={i === 0 ? 'singleton' : undefined} /></Card.Media>
                    <Stack direction="row" justify="between" align="center"><Heading level={3} size="sm">{name}</Heading><Text variant="label" tone="muted">#{String(i + 1).padStart(2, '0')}</Text></Stack>
                    <Text variant="body-sm" tone="muted" clamp={2}>Ensure a class has only one instance and a global point of access.</Text>
                    <Card.Footer><Text variant="body-sm" tone="brand" weight="medium">Practice →</Text>{i < 3 ? <Badge tone="success" icon="check">Done</Badge> : <Badge>Not started</Badge>}</Card.Footer>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </Split>
        </Container>
      </Section>
      <SiteFooter />
    </Stack>
  );
};
```

`src/stories/screens/screens-b.stories.tsx`:

```tsx
import type { Story } from '@ladle/react';
import { useState } from 'react';
import {
  Avatar, Badge, Box, Breadcrumbs, Button, Callout, Card, CheckList, Checkbox, Chip, CodeBlock, Container, CopyButton, DescriptionList, DiffViewer,
  Disclosure, Divider, Drawer, EditorTabs, EmptyState, FileTree, Grid, Heading, Icon, Menu, Message, MetricTile, NavList, Overlay, ProgressBar, ResultRow,
  Section, SectionHeader, SegmentedControl, Skeleton, Split, Stack, StatusBar, Table, TerminalOutput, Text, TextField, TextLink, Theme, Timeline,
  UmlClass, UmlDiagram, VerdictBanner, BarChart,
} from '../../index';
import { STRATEGY_EDGES, STRATEGY_NODES } from '../fixtures';
import { NAV_ITEMS, SiteHeader } from './shared';

export default { title: 'Screens' };

const STRATEGY_GO = `type Strategy interface {\n\tCompute(hours int) Money\n}\n\ntype Hourly struct{ rate Money }\n\nfunc (h Hourly) Compute(hours int) Money { return h.rate * Money(hours) }`;

export const PatternDetail: Story = () => {
  const [lang, setLang] = useState('go');
  return (
    <Stack gap="none">
      <SiteHeader current="patterns" />
      <Section padding="md">
        <Container>
          <Split
            sticky
            stickyOffset="appbar"
            start={
              <Stack gap="md">
                <NavList label="On this page" variant="toc" current="intent" items={[{ id: 'intent', label: '1. Intent', href: '#intent' }, { id: 'structure', label: '2. Structure', href: '#structure' }, { id: 'participants', label: '3. Participants', href: '#participants' }, { id: 'code', label: '4. Implementation', href: '#code' }]} />
                <Card tone="subtle" padding="sm">
                  <Text variant="label" tone="muted">Mastery checklist</Text>
                  <Checkbox label="Read the intent" strikeWhenChecked defaultChecked />
                  <Checkbox label="Study the UML" strikeWhenChecked />
                  <ProgressBar label="Progress" value={1} max={2} size="sm" />
                </Card>
              </Stack>
            }
            aside={
              <Stack gap="md">
                <Card>
                  <Heading level={2} size="sm">Quick facts</Heading>
                  <DescriptionList items={[{ term: 'Category', detail: 'Behavioral' }, { term: 'Complexity', detail: 'Low' }, { term: 'Also known as', detail: 'Policy' }]} />
                  <ProgressBar label="Interview frequency" value={95} tone="success" />
                  <Button variant="subtle" fullWidth icon="download">Cheat Sheet PDF</Button>
                </Card>
                <Card tone="inverse"><Icon name="lightbulb" /><Text weight="semibold">Interview tip</Text><Text variant="body-sm">Name the axis of change before naming the pattern.</Text></Card>
              </Stack>
            }
          >
            <Stack gap="lg">
              <Breadcrumbs items={[{ label: 'Patterns', href: '#' }, { label: 'Behavioral', href: '#' }, { label: 'Strategy' }]} />
              <Stack direction="row" gap="xs" wrap><Badge tone="info" uppercase>Behavioral</Badge><Badge tone="success" icon="verified">GoF classic</Badge></Stack>
              <Heading level={1}>Strategy Pattern</Heading>
              <Text variant="body-lead" tone="muted" measure>Define a family of algorithms, encapsulate each one, and make them interchangeable.</Text>
              <Stack direction="row" gap="sm" wrap><Button variant="brand" icon="bolt">Start Practicing</Button><Button variant="secondary" icon="bookmark">Bookmark</Button><Button variant="secondary" icon="share">Share</Button></Stack>
              <SectionHeader title="1. The problem it solves" size="md" meta="Violation: Open/Closed" description="Pricing rules hard-coded in one method." />
              <Callout tone="warning" title="Anti-pattern" live={false}>
                <Stack gap="sm">
                  <Text variant="body-sm">Every new rate type edits <b>fee()</b>.</Text>
                  <CodeBlock language="java" highlight title="FeeCalculator.java (Anti-Pattern)" meta={<Badge tone="danger">BRITTLE</Badge>}>{`public double fee(String type, int h) {\n  if (type.equals("HOURLY")) return h * 2.5;\n  return 20;\n}`}</CodeBlock>
                </Stack>
              </Callout>
              <SectionHeader title="2. Structure" size="md" />
              <UmlDiagram label="Strategy pattern" nodes={STRATEGY_NODES} edges={STRATEGY_EDGES} />
              <SectionHeader title="3. Participants" size="md" />
              <Table caption="Participants" columns={[{ key: 'p', header: 'Participant', mono: true }, { key: 'r', header: 'Responsibility' }]} rows={[{ p: 'PricingContext', r: 'Delegates pricing to a Strategy' }, { p: 'Strategy', r: 'Common interface' }, { p: 'HourlyStrategy', r: 'Concrete algorithm' }]} />
              <SectionHeader title="4. Implementation" size="md" />
              <Card tone="inverse" padding="none">
                <Card.Header start={<SegmentedControl label="Language" value={lang} onChange={setLang} options={[{ value: 'go', label: 'Go' }, { value: 'ts', label: 'TS' }]} />} end={<CopyButton value={STRATEGY_GO} label="Copy Snippet" />} />
                <EditorTabs tabs={[{ id: 's', label: 'strategy.go', modified: true }, { id: 'h', label: 'hourly.go' }]} activeId="s" onSelect={() => {}} />
                <CodeBlock language="go" highlight lineNumbers>{STRATEGY_GO}</CodeBlock>
                <StatusBar start={<StatusBar.Item tone="success" icon="check">compiles</StatusBar.Item>} end={<StatusBar.Item>bench 12ns/op</StatusBar.Item>} />
              </Card>
              <Grid cols={{ md: 2 }}>
                <Callout tone="success" live={false} title="Pros"><CheckList items={['Open for extension', 'Easy to test']} /></Callout>
                <Callout tone="danger" live={false} title="Cons" icon="thumb_down"><CheckList icon="close" tone="danger" items={['More classes', 'Clients must know strategies']} /></Callout>
              </Grid>
              <TextLink href="#problems" iconRight="arrow_forward">View all 150+ problems</TextLink>
            </Stack>
          </Split>
        </Container>
      </Section>
    </Stack>
  );
};

export const SubmissionResult: Story = () => (
  <Stack gap="none">
    <SiteHeader current="workspace" />
    <Section padding="md">
      <Container>
        <Stack gap="lg">
          <Breadcrumbs items={[{ label: 'Problems', href: '#' }, { label: 'Parking lot', href: '#' }, { label: 'Submission #38291' }]} />
          <Stack direction="row" gap="sm" align="center" wrap>
            <Heading level={1} size="lg">Design a Concurrent Multi-Floor Parking Complex</Heading>
            <Chip dot="#00ADD8">Go 1.22</Chip>
          </Stack>
          <Stack direction="row" gap="sm" align="center" wrap>
            <Text variant="body-sm" tone="muted">UML State: Verified</Text><Divider orientation="vertical" /><Text variant="body-sm" tone="muted">Race Detector: Clean</Text>
          </Stack>
          <VerdictBanner tone="success" icon="check" title="Accepted" badge={<Badge tone="success">8/8</Badge>} meta={['41ms', '1.4 MB', 'attempt #3']} actions={<><Button variant="secondary">Back to Editor</Button><Button variant="brand">Next Problem</Button></>} />
          <Split
            aside={
              <Stack gap="md">
                <Grid cols={{ base: 2 }} gap="sm">
                  <MetricTile label="Latency" value="41ms" hint="Beats 82.4%" hintTone="success" />
                  <MetricTile label="Heap" value="1.4MB" hint="Beats 67%" hintTone="success" />
                </Grid>
                <Card><BarChart label="Runtime distribution" bars={[2, 5, 9, 14, 20, 12, 7, 3].map((v, i) => ({ value: v, label: `${i * 10}ms` }))} highlight={4} highlightLabel="41ms" axis={['0ms', '40ms', '80ms']} /></Card>
                <Card><Heading level={2} size="sm">Attempts</Heading><Timeline label="Attempts" items={[{ id: '1', status: 'danger', title: 'Attempt #1', meta: '2h ago' }, { id: '2', status: 'warning', title: 'Attempt #2', meta: '1h ago' }, { id: '3', status: 'success', title: 'Attempt #3', meta: 'now' }]} /></Card>
                <Card>
                  <Heading level={2} size="sm">Staff solution</Heading>
                  <UmlClass name="ParkingLot" size="sm" methods={['+ Park(v): *Ticket']} />
                  <Disclosure summary={<Text weight="medium">View Staff Diff</Text>}>
                    <DiffViewer oldValue={'func Park(v Vehicle) {}'} newValue={'func (p *Lot) Park(v Vehicle) error {\n\treturn nil\n}'} />
                  </Disclosure>
                </Card>
              </Stack>
            }
          >
            <Stack gap="md">
              <Card padding="none">
                <Card.Header start={<><Icon name="science" /><Heading level={2} size="sm">Tests</Heading></>} end={<><Badge tone="success">8/8 Passed</Badge><Text variant="label" tone="muted">41ms execution</Text></>} />
                <Disclosure variant="row" selected defaultOpen summary={<ResultRow status="pass" title="parks 100 cars concurrently" meta="12ms" badge={<Badge>100 goroutines</Badge>} />}>
                  <TerminalOutput maxHeight="sm" title="parking_lot_test.go:42" lines={[{ kind: 'command', text: 'go test -run TestConcurrent -v' }, { kind: 'plain', text: '=== RUN   TestConcurrent' }, { kind: 'success', text: '--- PASS: TestConcurrent (0.01s)' }]} />
                </Disclosure>
                <Disclosure variant="row" summary={<ResultRow status="pass" title="rejects a full floor" meta="1ms" />}>details</Disclosure>
              </Card>
              <Card>
                <Stack direction="row" justify="between" align="center" wrap><Heading level={2} size="sm">Design review</Heading><Badge tone="success" icon="workspace_premium" size="md">Staff grade 93.8%</Badge></Stack>
                <ResultRow status="pass" title="Level encapsulates spot allocation" badge={<Badge tone="info">SRP</Badge>} />
                <ResultRow status="warning" variant="boxed" title="Pricing lives in ParkingLot; extract a Strategy" badge={<Badge tone="warning">OCP</Badge>} />
                {[['S', 96], ['O', 84], ['L', 100], ['I', 92], ['D', 98]].map(([l, v]) => <ProgressBar key={l} label={`${l} principle`} value={Number(v)} tone={Number(v) < 90 ? 'warning' : 'success'} />)}
              </Card>
              <Card>
                <Heading level={2} size="sm">Submitted files</Heading>
                <FileTree label="Submitted files" onOpen={() => {}} nodes={[{ path: 'internal/lot/parking_lot.go', kind: 'file', meta: '214 lines' }, { path: 'internal/lot/level.go', kind: 'file', meta: '98 lines' }]} />
              </Card>
            </Stack>
          </Split>
        </Stack>
      </Container>
    </Section>
  </Stack>
);

function GoogleG() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.7 6.9l7.3 5.7c4.3-4 7.1-9.9 7.1-17.1z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export const Auth: Story = () => (
  <Container>
    <Grid cols={{ md: 2, xl: 3 }} gap="lg">
      <Card>
        <Breadcrumbs items={[{ label: 'Problems', href: '#' }, { label: '#002 Design a Parking Lot' }]} />
        <Overlay overlay={<Stack gap="xs" align="center"><Icon name="lock" size="xl" label="Locked" /><Text variant="label">Code & AST compiler locked</Text></Stack>}>
          <UmlClass name="ParkingLot" methods={['+ park(car): Ticket']} />
        </Overlay>
        <Heading level={2} size="md" align="center">Sign in to solve this problem</Heading>
        <Text variant="body-sm" tone="muted" align="center">Your progress and submissions are saved to your account.</Text>
        <Stack direction="row" gap="sm" justify="center" wrap><Button icon="login">Sign in</Button><Button variant="secondary">Browse problems</Button></Stack>
      </Card>
      <Card>
        <Heading level={2} size="md">Sign in</Heading>
        <Text variant="body-sm" tone="muted">Sign in to run tests and save solutions.</Text>
        <Button variant="secondary" fullWidth leading={<GoogleG />}>Continue with Google</Button>
        <Divider label="or" />
        <TextField label="Email" type="email" defaultValue="alex@architect.dev" hint={<Icon name="mail" size="sm" tone="muted" />} />
        <TextField label="Password" revealable labelEnd={<TextLink href="#forgot" size="sm">Forgot password?</TextLink>} error="Invalid email or password" />
        <Callout tone="danger" size="sm">Invalid email or password</Callout>
        <Button type="submit" fullWidth>Sign in</Button>
        <Divider />
        <Text variant="body-sm" tone="muted" align="center">No account? <TextLink href="#signup" size="sm">Create one</TextLink></Text>
      </Card>
      <Card>
        <Stack direction="row" justify="end" gap="sm" align="center">
          <Badge tone="success" icon="local_fire_department">4.8k XP</Badge>
          <Menu
            label="Account"
            header={<Stack direction="row" gap="sm" align="center"><Avatar name="Alex Lin" status="success" statusLabel="online" /><Stack gap="none"><Text weight="semibold">Alex Lin</Text><Text variant="body-sm" tone="muted">alex@architect.dev</Text></Stack></Stack>}
            footer={<Text variant="label" tone="muted">Session #38291 · GoF v2.4</Text>}
            items={[{ label: 'My submissions', icon: 'history', meta: '28' }, { label: 'Progress', icon: 'insights', meta: '58%' }, { label: 'Settings', icon: 'settings', shortcut: '⌘,' }, { type: 'separator' }, { label: 'Sign out', icon: 'logout', tone: 'danger' }]}
            trigger={(p) => <Button {...p} variant="ghost" size="sm" iconRight="expand_more"><Avatar name="Alex Lin" size="sm" status="success" statusLabel="online" /></Button>}
          />
        </Stack>
        <Heading level={2} size="sm">Create account</Heading>
        <Grid cols={{ base: 1, sm: 2 }} gap="sm">
          <TextField label="Full name" size="sm" />
          <TextField label="Email" type="email" size="sm" />
        </Grid>
        <TextField label="New password" revealable size="sm" />
        <Button loading fullWidth>Create account</Button>
      </Card>
    </Grid>
  </Container>
);

export const SystemStates: Story = () => (
  <Container>
    <Stack gap="lg">
      <Grid cols={{ md: 3 }} gap="md">
        <Card>
          <Message>Loading problems…</Message>
          <Stack direction="row" gap="xs"><Skeleton shape="pill" width="1/3" /><Skeleton shape="pill" width="1/3" /></Stack>
          <Grid cols={{ base: 2 }} gap="sm"><Skeleton shape="rect" /><Skeleton shape="rect" /></Grid>
          <Skeleton lines={3} />
        </Card>
        <Card>
          <Stack direction="row" gap="xs" wrap>
            <Chip tone="danger" dot="danger" onRemove={() => {}}>Advanced</Chip>
            <Chip tone="info" dot="brand" onRemove={() => {}}>Concurrency</Chip>
            <Chip icon="search" onRemove={() => {}}>trending</Chip>
          </Stack>
          <TextField label="Search" hideLabel icon="search" disabled placeholder="Search" />
          <EmptyState title="No problems match these filters" description="Try removing a filter or clearing the search." media={<UmlClass name="?" dashed size="sm" />} action={<Button size="sm" variant="secondary" icon="filter_alt_off">Clear filters</Button>} />
        </Card>
        <Card>
          <Callout tone="danger" accent title="Ingestion pipeline fault" action={<Button size="sm" variant="secondary" icon="refresh">Retry</Button>}>Could not load problems. Check your connection.</Callout>
          <DescriptionList mono items={[{ term: 'Endpoint', detail: 'GET /problem' }, { term: 'Status', detail: '503 Service Unavailable' }]} />
        </Card>
      </Grid>
      <Grid cols={{ md: 3 }} gap="md">
        <Card><Message>Loading problem…</Message><Icon name="progress_activity" spin label="Loading" /></Card>
        <Card><EmptyState code="404" title="Problem not found" description="The requested challenge does not exist." action={<Button fullWidth>Browse problems</Button>} /></Card>
        <Card><EmptyState tone="danger" icon="error" title="Failed to load problem" description="Server responded with 500." action={<Button size="sm" variant="secondary" icon="refresh">Try again</Button>} /></Card>
      </Grid>
      <Theme tone="dark">
        <Box padding="md" radius="lg">
          <Grid cols={{ md: 3 }} gap="md">
            <Stack gap="sm">
              <Badge>parking_lot.go</Badge>
              <CodeBlock language="go" highlight>{`func (p *Lot) Park() {}`}</CodeBlock>
              <StatusBar start={<StatusBar.Item tone="warning" icon="hourglass_top">Loading Go runtime (yaegi)…</StatusBar.Item>} />
            </Stack>
            <Stack gap="sm">
              <Callout tone="danger" action={<Button size="sm" variant="danger">Reload runtime</Button>}>Runtime failed to load.</Callout>
              <Box dimmed>
                <ResultRow status="pending" title="TestPark" meta="-- ms" />
                <ResultRow status="pending" title="TestLeave" meta="-- ms" />
              </Box>
            </Stack>
            <Stack gap="sm">
              <TerminalOutput title="Terminal" status={<Badge tone="danger">BUILD BROKEN</Badge>} lines={[{ kind: 'command', text: 'go build ./...' }, { kind: 'error', text: './lot.go:24:8: undefined: SpotFactory' }, { kind: 'hint', text: 'did you mean spotFactory?' }]} />
              <Stack direction="row" gap="sm" wrap><Button disabled>Submit</Button><Button variant="secondary">Inspect Diff</Button></Stack>
              <Message tone="danger">Not submitted: fix the error above first.</Message>
            </Stack>
          </Grid>
        </Box>
      </Theme>
    </Stack>
  </Container>
);

export const MobileHeader: Story = () => <SiteHeader />;

export const MobileNavOpen: Story = () => (
  <>
    <SiteHeader />
    <Drawer open onClose={() => {}} title="LLD Lab">
      <NavList label="Site" heading="Navigation" items={NAV_ITEMS} current="problems" />
    </Drawer>
  </>
);
```

- [ ] **Step 4: Typecheck, lint, build the gallery and run the e2e sweep**

Run: `npm run typecheck && npm run lint && npm run ladle:build && node -e "const m=require('./build/meta.json'); const k=Object.keys(m.stories); console.log(k.length); console.log(k.filter(s=>s.startsWith('screens--')).join(' '))"`
Expected: the typecheck and lint exit 0, and the story count is at least 43: 15 existing plus 17 component stories plus 11 screens. The `screens--` ids listed are the eleven named in the Interfaces block.

Run: `npm run e2e`
Expected: PASS: 1 plus 5 × (story count) tests.

Every overflow or axe failure is a library finding. For each one:
1. Locate the offending element with the `find-overflow` technique from the base plan (list the elements whose `getBoundingClientRect().right > innerWidth`).
2. Fix the component with a unit test that fails first.
3. Ledger it as `Task 21: fixed <finding> — <test>`.

Rerun until green.

Then look at the screenshots at 390px and 1440px for each `screens--*` story next to its Stitch PNG, at `/private/tmp/claude-502/-Users-utkarsh-nigam-Desktop-CP-BE-lldlab-monorepo/b7dfbc5f-b3ac-456e-a847-41dd5d626d8c/scratchpad/stitch/v3/`. Note visible deviations in the ledger as `Task 21: visual: <screen> — <difference>`. Only fix a deviation when it is a library defect (a wrong token or variant). Layout approximations in stories are fine.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: stories for new components and all ten Stitch screens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22: README and PR #2

**Files:**
- Modify: `README.md`
- Test: `npm test`, `npm run package-check`

**Interfaces:**
- Consumes: everything.
- Produces: an updated README, and PR #2 on `UtkarshNigam1221/lldlab-ui`.

- [ ] **Step 1: Update the README**

Edit `README.md`:
1. In **Contents** and **Components**, add the new components to their groups:
   - **Chrome:** `AppBar`, `Drawer`, `NavList`, `Pagination`, `TextLink`, `Divider`, `IconTile`, `Show`, `CommandPalette`, `Tooltip`, `Toaster`/`useToast`
   - **Data:** `Table`, `DescriptionList`, `Timeline`, `Disclosure`, `BarChart`, `DiffViewer`, `CopyButton`
   - **States:** `Skeleton`, `TerminalOutput`, `VerdictBanner`, `Overlay`
   - **Forms:** `Checkbox`, `Switch`
   - **UML:** `UmlClass`, `UmlDiagram`
   - **Avatars:** `AvatarGroup`
2. For **each** new component, add a props table and a one-line example in the same format as the existing sections. The prop names and defaults are exactly those in this plan's Interfaces blocks.
3. Extend the existing component tables with the new variants:
   - Button `brand`, `accent`, `leading`, `iconTone`, `iconFilled`
   - IconButton `as`, `secondary`, `xs`, `dot`, `badge`
   - Badge `icon`, `dot`, `pulse`
   - Chip tones and `dot`
   - Avatar `status`, `statusLabel`, `shape`, `tone`
   - Card `Card.Header`, `subtle`, `pattern`, and `Card.Media caption`/`height`
   - Callout `live`, `icon`, `size`, `accent`
   - ResultRow `warning`, `badge`, `variant`, `selected`, `titleMono`
   - CheckList `icon`, `tone`
   - MetricTile `brand`, `warning`, `hint`, `hintTone`
   - ProgressBar `label: ReactNode`, `valueLabel`, `caption`, `size`
   - Heading `success`/`danger`/`warning`, `truncate`, `align`
   - Text `align`, `measure`, `inherit`, `uppercase`
   - Eyebrow `pulse`, `variant`
   - SectionHeader `description`, `icon`, `accent`, `tagTone`, `size`
   - EmptyState `media`, `code`, `tone`
   - Box `dimmed`
   - Split `start`, `stickyOffset`
   - Menu `header`, `footer`, `meta`, `shortcut`, separators
   - TabItem `badge`
   - SegmentedOption `hideLabel`, `dot`
   - FileNode `icon`, `status`, `meta`
   - TextField `labelEnd`, `revealable`, `size`
   - CodeBlock `highlight` (languages: ts, tsx, js, jsx, python, go, java, json, bash), `title`, `meta`, `actions`, `lineNumbers`, `tone`
4. Add a **Mobile navigation** section with this snippet:

```tsx
<AppBar
  start={<Logo />}
  center={<Show above="lg"><Tabs label="Site" value={current} items={navTabs} /></Show>}
  end={<Show below="lg"><IconButton icon="menu" label="Open menu" onClick={() => setOpen(true)} /></Show>}
/>
<Drawer open={open} onClose={() => setOpen(false)} title="LLD Lab">
  <NavList label="Site" items={navItems} current={current} />
</Drawer>
```

5. Add these points to **Design tokens**: the `code-*`, `diff-*`, `code-bg-subtle` and `--spacing-appbar` tokens; the fact that `Card`, `Box` and `Section` with `tone="inverse"` scope the dark tokens; and `Toaster` mounting ("mount `<Toaster />` once at the root").
6. Under **Install**, list the runtime dependencies `prism-react-renderer` and `@dagrejs/dagre`, and note that dagre is loaded only when a `UmlDiagram` renders.

- [ ] **Step 2: Full verification**

Run: `npm run lint && npm run typecheck && npm test && npm run build && npm run size-check && npm run ladle:build && npm run e2e && npm run package-check`
Expected: every command exits 0, and `size-check` reports under 150 KB gzip.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "docs: document every new component and variant; mobile navigation pattern

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin feat/stitch-coverage
```

- [ ] **Step 4: Open PR #2**

The addendum's §8 (approved by the user) specifies PR #2 stacked on `feat/v0.1`. Set the base with `gh pr create --base <base>`, choosing it by PR #1's state:
- **If PR #1 is already merged into `main`:** first rebase `feat/stitch-coverage` onto `origin/main` (`git fetch origin && git rebase origin/main`), resolve any conflicts, run the full suite again, then `git push --force-with-lease` (this is the feature branch only). Use base `main`.
- **Otherwise:** use base `feat/v0.1`.

```bash
gh pr view 1 --repo UtkarshNigam1221/lldlab-ui --json state -q .state
gh pr create --repo UtkarshNigam1221/lldlab-ui --base <base> --head feat/stitch-coverage --title "lldlab-ui: full Stitch coverage (26 components, ~25 variants, 10 screen stories)" --body-file <body file>
```

The PR body lists the new components and variants with their props, in the same compact table format as PR #1's description. It then covers:
- the new dependencies
- the verification numbers
- the two rulings: `Show`, and the inverse dark scope

It ends with the attribution line `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

Run: `gh pr checks <number> --repo UtkarshNigam1221/lldlab-ui --watch`
Expected: the `check`, `e2e` and `package` jobs pass.
