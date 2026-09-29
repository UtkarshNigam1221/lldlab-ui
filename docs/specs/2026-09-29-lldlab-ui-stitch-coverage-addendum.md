# lldlab-ui — Addendum 1: full Stitch coverage

Date: 2026-09-29
Status: draft, awaiting review
Extends: `docs/specs/2026-09-29-lldlab-ui-library-design.md` (the base spec). Everything here follows its rules: no `className`/`style`, literal Tailwind classes, responsive props, dark scope, APG accessibility, native-prop forwarding.

## 1. Why

An audit of all ten Stitch screens found that about half of the UI can be built from `lldlab-ui` 0.1 as it stands. The ten screens are Homepage, Problems Directory, Problem Workspace, Problem Editor (multi-file IDE), Pattern Library, Pattern Detail: Strategy, Submission Result, Auth (sign-in modal, signed-out gate, user menu), and System States (loading, empty, error).

This addendum adds everything the audit found missing, so every screen can be built with zero raw classes in the app.

**Success criteria**

1. Each of the ten screens has a Ladle "page" story built only from library components. Brand artwork (logos, the Google "G") is the one exception and comes in as `ReactNode`. Each story passes the existing e2e bar: no horizontal overflow at 390, 768, 1024 and 1440 px, and no critical or serious axe violations in light or dark.
2. Every new component and variant has unit tests for its behaviour and its class mapping, and is documented in the README.
3. The package check still passes, and `dist` stays under 150 KB minified plus gzip, excluding peer dependencies.

## 2. Scope changes to the base spec

**Base spec §8 (out of scope), revised:**
- **Syntax highlighting** moves into scope, via `prism-react-renderer`.
- **UML class boxes and diagrams** move into scope as display components (`UmlClass`, `UmlDiagram`), laid out with `@dagrejs/dagre`.
- **Still out of scope:** "Patterns detected" / AST analysis (#47, #50), because that is data, not UI.

**New runtime dependencies.** The base spec allowed `react-markdown` and `remark-gfm`; the additions are:

| Package | Why | Loaded |
|---|---|---|
| `prism-react-renderer` ^2.4 | Tokenises code for `CodeBlock highlight` | bundled with `CodeBlock` |
| `prismjs` (only the Java grammar, if `prism-react-renderer` lacks Java) | The homepage shows Java | registered on import |
| `@dagrejs/dagre` ^3.1 | Auto-layout for `UmlDiagram` | dynamic `import()` inside `UmlDiagram`, so apps that never render a diagram don't load it |

Highlight colours come from new theme tokens (§4), not from a Prism theme, so they follow the light and dark scopes.

## 3. New components

Every component below is exported from `lldlab-ui`, forwards native props to its root element, and gets a unit test and a story.

### 3.1 Navigation and chrome

| Component | Props | Behaviour |
|---|---|---|
| `TextLink` (polymorphic, `a`) | `tone: 'brand'\|'default'\|'muted'\|'danger'\|'success'\|'warning' = 'brand'`, `size: 'sm'\|'md' = 'md'`, `icon?`, `iconRight?`, `underline: 'hover'\|'always'\|'none' = 'hover'` | An inline link with `wrap-break-word`. The focus ring comes from `FOCUS_RING`. |
| `AppBar` | `position: 'sticky'\|'fixed'\|'static' = 'sticky'`, `start?`, `center?`, `end?`, `blur: boolean = true`, `height: 'sm'\|'md' = 'md'` (48px or 64px) | `<header>` at `z-40`, `border-b`, `bg-surface-elevated/95` with `backdrop-blur` when `blur` is set. It exposes `--appbar-height`, which `Split stickyOffset="appbar"` reads. |
| `Drawer` | `open`, `onClose`, `side: 'left'\|'right' = 'left'`, `title`, `children`, `size: 'sm'\|'md' = 'sm'` | A modal slide-over. It shares Dialog's focus trap, Escape handling, scroll lock, focus restore and theme inheritance; these move to an internal `useModal` hook that both use. |
| `NavList` | `label`, `items: NavItem[]`, `current?: string`, `heading?: ReactNode`, `variant: 'sidebar'\|'toc' = 'sidebar'` | `<nav><ul>` of links or buttons. `NavItem = { id, label, icon?, href?, as?, count?, onSelect? }`. The current item gets `aria-current="page"`. `toc` has a left accent bar and a tinted current item; `sidebar` has an icon and a filled current item. |
| `Pagination` | `page`, `pageCount`, `onChange(page)`, `siblingCount = 1`, `summary?: ReactNode`, `label = 'Pagination'` | `<nav>` with previous and next buttons, numbered buttons and `…` gaps. The current page gets `aria-current="page"`. Below `md` it collapses to "‹ 3 / 12 ›". |
| `CommandPalette` | `open`, `onClose`, `query`, `onQueryChange`, `groups: { label, items: { id, label, icon?, meta?, onSelect } }[]`, `placeholder`, `emptyText` | A dialog (built on `useModal`) with a combobox input and a listbox of results (APG combobox): Up/Down move the active option, Enter selects, Escape closes. Filtering is done by the caller. |
| `Tooltip` | `content: ReactNode`, `children: ReactElement` (the trigger), `side: 'top'\|'bottom'\|'left'\|'right' = 'top'`, `delay = 400` | Shown on hover or focus of the trigger, hidden on Escape, blur or leave. It gets `role="tooltip"`, and the trigger gets `aria-describedby`. It renders in a portal positioned from `getBoundingClientRect` and is flipped if it would overflow. It never contains interactive content. |
| `Toaster` + `useToast()` | `useToast().show({ title, description?, tone: 'default'\|'success'\|'danger', action?, duration = 4000 })` | A `role="status"` live region. Toasts stack bottom-right, or full width below `md`. They pause while hovered or focused and can be dismissed. `<Toaster />` is mounted once, at the app root. |

### 3.2 Structure and data display

| Component | Props | Behaviour |
|---|---|---|
| `Divider` | `orientation: 'horizontal'\|'vertical' = 'horizontal'`, `label?: ReactNode`, `spacing: Space = 'none'` | `role="separator"` with `aria-orientation`. With `label` it renders a centred mono label between two rules (the "or" divider). |
| `Table` | `caption: string` (rendered visually hidden unless `showCaption`), `columns: { key, header: ReactNode, align?: 'start'\|'end', mono?: boolean, width?: 'auto'\|'min' }[]`, `rows: Record<string, ReactNode>[]`, `rowKey`, `density: 'compact'\|'normal' = 'normal'`, `empty?: ReactNode` | A semantic `<table>` inside a focusable horizontal scroller (the same pattern as Markdown). It has a header row, divided rows and `wrap-break-word` cells. |
| `DescriptionList` | `items: { term: ReactNode, detail: ReactNode }[]`, `layout: 'stacked'\|'inline' = 'stacked'`, `mono?: boolean` | `<dl>`. The `inline` layout collapses to `stacked` below `sm`. |
| `Timeline` | `items: { id, status: 'done'\|'current'\|'locked'\|'success'\|'warning'\|'danger'\|'pending', title, badge?, description?, meta? }[]`, `label` | `<ol>` with a vertical rule and a toned, ringed dot or icon per status (✓ done, ◉ current, 🔒 locked). Each status also carries a visually hidden word, so colour is never the only signal. |
| `Disclosure` | `summary: ReactNode`, `children`, `open?`, `defaultOpen?`, `onOpenChange?`, `selected?: boolean`, `variant: 'plain'\|'row' = 'plain'` | A `<button aria-expanded aria-controls>` plus a region. The `row` variant matches ResultRow rows; `selected` adds a left cobalt accent. |
| `IconTile` | `icon`, `tone: 'neutral'\|'brand'\|'success'\|'warning'\|'danger' = 'neutral'`, `size: 'sm'\|'md'\|'lg'\|'xl' = 'md'` (32, 40, 48, 56px), `shape: 'square'\|'circle' = 'square'`, `filled?: boolean` | A decorative icon in a tinted tile, `aria-hidden` unless `label` is given. |
| `Skeleton` | `shape: 'line'\|'pill'\|'rect'\|'circle' = 'line'`, `width: 'full'\|'3/4'\|'1/2'\|'1/3'\|'1/4' = 'full'`, `height: 'xs'\|'sm'\|'md'\|'lg'\|'xl'`, `lines?: number` | A shimmer that uses the surface tokens, so it works in the dark scope. It is `aria-hidden`, and the caller pairs it with a `Message` for screen readers. It respects `prefers-reduced-motion`, falling back to a static tint. |
| `TerminalOutput` | `lines: { kind: 'command'\|'plain'\|'error'\|'warning'\|'hint'\|'success', text: string }[]`, `title?`, `status?: ReactNode`, `maxHeight: 'sm'\|'md'\|'lg'\|'none' = 'md'` | A dark mono log. Lines are toned by kind: `$` prefix for commands, left accent for errors. It scrolls inside itself (focusable) and wraps long lines. |
| `VerdictBanner` | `tone: 'success'\|'danger'\|'warning'`, `icon`, `title`, `badge?`, `meta?: ReactNode[]`, `actions?` | A hero for results ("Accepted"): a large `IconTile` (circle, filled), a big toned title, meta items separated by dividers, and actions that wrap below the text under `md`. |
| `BarChart` | `label: string`, `bars: { value: number, label?: string }[]`, `highlight?: number` (index), `highlightLabel?: string`, `axis?: [start, middle, end]`, `height: 'sm'\|'md' = 'md'`, `tone: 'brand'\|'success' = 'brand'` | CSS bars, no chart library. It gets `role="img"` with an `aria-label` summarising the data, plus a visually hidden `<table>` of the values. |
| `UmlClass` | `name`, `stereotype?`, `attributes?: string[]`, `methods?: string[]`, `tag?: ReactNode`, `emphasis: 'default'\|'brand'\|'strong' = 'default'`, `size: 'sm'\|'md' = 'md'`, `dashed?: boolean` | A three-part class box (name, fields, methods) in mono type. `stereotype` renders as «…». |
| `UmlDiagram` | `label: string`, `nodes: ({ id } & UmlClassProps)[]`, `edges: { from, to, kind: 'association'\|'dependency'\|'realization'\|'inheritance'\|'aggregation'\|'composition', label?, fromMultiplicity?, toMultiplicity? }[]`, `direction: 'TB'\|'LR' = 'TB'`, `zoomable: boolean = true`, `compact?: boolean`, `pattern: 'dots'\|'none' = 'dots'` | See §3.3. |
| `CopyButton` | `value: string`, `label = 'Copy'`, `copiedLabel = 'Copied'`, `size`, `variant` (Button variants) | Calls `navigator.clipboard.writeText` inside try/catch and shows the copied state for 2s. A failure shows "Copy failed" and never throws. |
| `DiffViewer` | `oldValue: string`, `newValue: string`, `oldTitle?`, `newTitle?`, `mode: 'unified'\|'split' = 'unified'`, `language?` | A line diff (the LCS lives in `internal/diff.ts`, with no dependency). Added and removed lines are toned and carry a +/− gutter plus visually hidden "added"/"removed" text. `split` collapses to `unified` below `lg`. It scrolls inside itself. |
| `AvatarGroup` | `children` (Avatars), `max?: number`, `size` | Overlapping avatars; anything over `max` becomes a "+N" avatar. |
| `Checkbox` | `label: ReactNode`, `description?`, `strikeWhenChecked?: boolean`, plus native `<input type="checkbox">` props | A native checkbox with a custom visual, a 44px row target below `md`, and `indeterminate` support through a ref effect. |
| `Switch` | `label`, `checked`, `onChange(checked)`, `description?`, `disabled?` | A `<button role="switch" aria-checked>`. |
| `Overlay` | `children` (content), `overlay: ReactNode`, `blur: boolean = true` | Covers content with a blurred, dimmed layer. The covered content is `inert` and `aria-hidden` (used for the signed-out gate). |

### 3.3 `UmlDiagram` design

- **Layout:** dagre runs in a `useEffect`, loaded with a dynamic `import('@dagrejs/dagre')`. Node sizes are measured from the rendered `UmlClass` boxes with `getBoundingClientRect`, so the first paint shows boxes in a CSS grid fallback and the layout then applies. There is no layout during render, so it is SSR-safe. The layout re-runs whenever nodes, edges or direction change, keyed on a stable JSON of their ids.
- **Rendering:** the class boxes are absolutely positioned HTML. Edges are an SVG overlay with `<marker>`s: open arrow (association), dashed arrow (dependency), dashed hollow triangle (realization), hollow triangle (inheritance), hollow diamond (aggregation), filled diamond (composition). Multiplicities and labels are drawn at the ends and the midpoint.
- **Zoom:** `+`, `−` and reset `IconButton`s (and ⌘/Ctrl + wheel) scale a transform wrapper from 50% to 200%. It pans with drag, or with the arrow keys while the canvas is focused. `compact` hides the zoom controls and scales to fit the width.
- **Accessibility:** the canvas has `role="img"` with `aria-label={label}` and a visually hidden list describing each class and each relationship ("ParkingLot composes Level, 1 to many").
- **Responsive:** the canvas scrolls inside itself. Below `md`, `zoomable` diagrams start at fit-to-width.

## 4. New theme tokens (theme.css)

- **Syntax** (light and dark values for each): `--color-code-keyword`, `-string`, `-number`, `-comment`, `-function`, `-type`, `-punctuation`, `-plain`, `--color-code-bg-subtle`.
- **Diff:** `--color-diff-add-bg`, `--color-diff-add-fg`, `--color-diff-del-bg`, `--color-diff-del-fg`.
- **Skeleton:** a `@utility skeleton-shimmer` with a keyframe, plus a reduced-motion override.
- **Every new text or fill colour** is checked against its background: AA for text and 3:1 for UI.

## 5. Variants on existing components

| Component | Additions |
|---|---|
| `Button` | `variant: 'brand'` (cobalt) and `'accent'` (crimson, not destructive). `leading?: ReactNode` (for brand icons such as the Google G; wins over `icon`). `iconTone?: Tone` and `iconFilled?`. A `Kbd` child is allowed inside the label. |
| `IconButton` | `as` (links), `variant: 'secondary'` (bordered), `dot?: StatusTone` (unread indicator), `badge?: ReactNode`, `size: 'xs'` (24px, which still grows to 44px under `md`). |
| `Card` | `Card.Header` (a tinted header bar with `start` and `end` slots), `tone: 'subtle'`, `pattern: 'none'\|'dots'\|'grid'` on the root, `Card.Media caption` (a corner label) and `height: 'sm'\|'md'` (120px or 140px) as an alternative to `aspect`. |
| `Badge` | `icon?`, `dot?: StatusTone`, `pulse?` |
| `Chip` | `tone: 'neutral'\|'brand'\|'success'\|'warning'\|'danger'\|'info'`, `dot?: StatusTone \| string` (a CSS colour for language brand dots, applied through an inline style internally) |
| `Avatar` | `status?: StatusTone` (presence dot), `shape: 'circle'\|'square' = 'circle'`, `tone: 'ink'\|'brand'\|'success'\|'warning'\|'danger' = 'ink'`, and `failed` resets when `src` changes |
| `Menu` | `header?`, `footer?`. `MenuItem.meta?: ReactNode` and `shortcut?: string`, plus `{ type: 'separator' }` entries. Keys use an index, so duplicate labels are safe. |
| `TextField` | `labelEnd?: ReactNode` (for example a "Forgot password?" `TextLink`), `revealable?: boolean` (a password show/hide `IconButton` with `aria-pressed`), `size: 'sm'\|'md' = 'md'` |
| `Heading` | `tone` adds `success`, `danger` and `warning`; `truncate?`, `align: 'start'\|'center'` |
| `Text` | `align: 'start'\|'center'\|'end'`, `measure?: boolean` (`max-w-prose`), `variant: 'inherit'` (inherits size and font; used for inline highlights inside a Heading), `uppercase?` (so a label can be mono without uppercase) |
| `SectionHeader` | `description?`, `icon?` (an `IconTile`), `accent?: StatusTone` (a 2px underline), `tagTone?: BadgeTone`, `size: 'sm'\|'md' = 'sm'` |
| `Split` | `start?: ReactNode` (a leading rail for three-column docs; `start` shows from `lg`, the right aside from `xl`), `stickyOffset: 'none'\|'appbar' = 'none'` |
| `EmptyState` | `media?: ReactNode` (an illustration that replaces the icon), `code?: string` (a large mono numeral such as "404"), `tone: 'default'\|'danger'` |
| `Callout` | `live?: boolean = true` (`false` removes `role` for static pros/cons content), `icon?` override, `size: 'sm'\|'md' = 'md'` (compact inline form error), `accent?: boolean` (left bar) |
| `ResultRow` | `status: 'warning'`, `badge?: ReactNode`, `variant: 'plain'\|'boxed'`, `selected?`, `titleMono?` |
| `CheckList` | `icon?: string` and `tone?: Tone` per list (✓ vs ✗) |
| `MetricTile` | `tone` adds `brand` and `warning`; `hint?: ReactNode` and `hintTone?` (e.g. "Beats 82.4%") |
| `ProgressBar` | `label: ReactNode`, `valueLabel?: ReactNode` (replaces the %), `caption?: ReactNode`, `size: 'sm'\|'md'` |
| `FileTree` (`FileNode`) | `icon?`, `status?: 'success'\|'warning'\|'danger'\|'info'`, `meta?: ReactNode` |
| `SegmentedControl` | Per option: `hideLabel?` (icon-only; the label becomes `aria-label`) and `dot?: StatusTone` |
| `TabItem` | `badge?: ReactNode` (a non-numeric count such as "6/8 Passing") |
| `Eyebrow` | `pulse?`, `variant: 'pill'\|'plain' = 'pill'` |
| `Box` | `dimmed?: boolean` (reduces opacity and makes the content `inert`) |
| `CodeBlock` | `highlight?: boolean` (uses `language`: ts, tsx, js, jsx, python, go, java, json, bash), `title?`, `meta?`, `actions?` (a header bar with, e.g., a `CopyButton`), `lineNumbers?`, `tone: 'dark'\|'subtle' = 'dark'` |

## 6. Mobile navigation pattern (documented, not a component)

On phones, the site header is `AppBar` with the logo in `start`, the ⌘K trigger in `center` from `md`, and in `end` an `IconButton icon="menu"` that opens `<Drawer side="left">` containing a `NavList`. The README shows this pattern, and a "Mobile header" story covers it at 390px.

## 7. Testing

Tests follow the base spec §6.

- **Unit tests for behaviour:**
  - `useModal` (shared by Dialog and Drawer)
  - CommandPalette combobox keys
  - Tooltip show and hide
  - Toast timing, pause and dismiss
  - Pagination ranges
  - Disclosure
  - Checkbox `indeterminate`
  - Switch
  - Timeline status text
  - Table empty state
  - DiffViewer LCS output
  - CopyButton success and failure
  - `UmlDiagram`: the layout is applied (dagre mocked in unit tests), the accessible description, and zoom bounds
- **Highlighting:** a snapshot of the token classes for one snippet per language.
- **Ten page stories** (§1): the existing e2e sweep picks them up automatically.
- **Size budget:** a CI step fails if `dist/index.js` exceeds 150 KB minified plus gzip (dagre is excluded because it is loaded dynamically).

## 8. Delivery

- **Branch and PR:** a branch `feat/stitch-coverage`, stacked on `feat/v0.1`, as PR #2 with its base set to `feat/v0.1`.
- **Release:** `0.1.0` is published once both PRs are merged, so the first npm release is complete.
- **README:** every new component and variant is added to the README, along with the mobile navigation pattern.
