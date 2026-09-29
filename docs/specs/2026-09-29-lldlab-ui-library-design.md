# lldlab-ui component library — design (Project A)

Date: 2026-09-29
Status: approved in conversation (Sections 1–3); awaiting written-spec review
Repo: `UtkarshNigam1221/lldlab-ui` (new, public, MIT) · npm package: `lldlab-ui` (unscoped)

## 1. Goal and context

The frontend (`lldlab-frontend`) currently styles every element with inline Tailwind class strings. The goal is to
separate styling from logic: all visual decisions live in a reusable, customizable component library published to npm,
and the app composes those components without writing any classes.

This spec covers **Project A only** — the library. Follow-up projects, each with its own spec:

| # | Project | Depends on |
|---|---|---|
| A | `lldlab-ui` library (this spec) | — |
| B | Frontend migration to `lldlab-ui`, no-`className` lint rule, Patterns page in the Pattern Library design | A |
| C | Multi-file problems (problem format, Problem Service, runners, `lldlab-yaegi-runtime` 0.2.0) | — |
| D | IDE workspace (dark 3-column Problem Editor) | A, B, C |

**Success criteria for A**

1. `lldlab-ui@0.1.0` is on npm and a scratch Next.js 16 + Tailwind v4 app that installs it builds and renders every
   component with the Stitch design tokens.
2. Every component listed in §4 exists, is typed, has unit tests for its variants/behaviour, and a Ladle story in light
   and dark scope.
3. Every story passes the responsive check (no horizontal overflow at 390/768/1024/1440 px) and axe (no critical or
   serious violations).
4. No component exposes a `className` or `style` prop.

**Sources of truth for visuals:** the Stitch project `11306194258113371738` — screens Home, Problems, Workspace,
Pattern Library, Problem Editor (Multi-file Repo IDE) — and the current `lldlab-frontend/app/globals.css` token set.

## 2. Package architecture

```
lldlab-ui/
  src/
    tokens/theme.css        Stitch tokens (@theme), fluid type scale, dark scope overrides
    internal/cx.ts          join classes; variant → class lookup helper (no dependency)
    internal/responsive.ts  Responsive<T> type + literal breakpoint class tables
    primitives/             Box, Stack, Grid, Container, Section, Split, Text, Heading, Eyebrow, Code, CodeBlock
    components/             Button, Badge, Card, Tabs, Dialog, Menu, … (one folder per component: .tsx, .test.tsx, .stories.tsx)
    ide/                    Workbench, FileTree, EditorTabs, Breadcrumbs, StatusBar, MetricTile, SegmentedControl, Avatar, Countdown
    theme/Theme.tsx         <Theme tone="light|dark">
    index.ts                public exports
  e2e/                      Playwright responsive + axe pass over Ladle stories
  consumer-check/           scratch Next.js + Tailwind v4 app used by CI package check
  .ladle/                   Ladle config (imports theme.css + fonts)
```

- **Build:** `tsup` → ESM + `.d.ts` in `dist/`; `theme.css` copied to `dist/theme.css`. Bundle carries a
  `'use client'` banner.
- **package.json:** `"type": "module"`, `exports` for `"."` (types + import) and `"./theme.css"`,
  `"sideEffects": ["*.css"]`, `"files": ["dist"]`, `peerDependencies` `react` and `react-dom` `^19`.
- **Runtime dependency:** `react-markdown` (+ `remark-gfm`) for `Markdown`. No other runtime dependencies. No Next.js
  dependency.
- **Styling approach:** components use Tailwind utility classes internally as literal strings. The library ships no
  compiled CSS for components; the consuming app's Tailwind scans `dist/` and generates only the classes in use. One
  token source (`theme.css`).

**Consumer setup (`app/globals.css`):**

```css
@import "tailwindcss";
@import "lldlab-ui/theme.css";
@source "../node_modules/lldlab-ui/dist";
```

- **Font contract:** the app loads fonts (e.g. `next/font`) and sets CSS variables `--font-space-grotesk`,
  `--font-inter`, `--font-jetbrains-mono`. `theme.css` references only those names (`@theme inline`).
- **Icons:** `Icon` renders Material Symbols Outlined by ligature; the app loads the font. Documented in README.
- **Links:** link-like components (`Button`, `Card`, `Breadcrumbs` items, `Tabs` items) accept `as` (any component,
  e.g. Next `Link`) and forward remaining props.

## 3. Cross-cutting rules

### 3.1 No escape hatch

No component accepts `className` or `style`. All visual variation goes through typed variant props that map to tokens.
A new visual need becomes a new variant or component in the library. Components forward `ref`, `id`, `aria-*`,
`data-*` and event handlers to their root element.

### 3.2 Responsive props

Any prop affecting size or layout (`gap`, `padding`, `cols`, `direction`, `align`, `justify`, `size`, `ratio`) accepts
`Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T }`. Breakpoints match Tailwind: sm 640, md 768,
lg 1024, xl 1280.

Implementation: `internal/responsive.ts` holds, per prop, a complete literal table
`Record<Breakpoint, Record<Value, string>>` (e.g. `md: { md: 'md:gap-space-md', … }`), because Tailwind only generates
classes it sees written in full. A unit test enumerates every table and asserts every breakpoint × value cell is a
non-empty string with the correct prefix.

### 3.3 Fluid defaults

- **Type:** display and headline sizes use `clamp()` from the mockup's mobile size to its desktop size, defined in
  `theme.css` (e.g. `--text-display: clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem)`; headline-xl `clamp(1.75rem, …, 2.5rem)`).
  This replaces the separate `-mobile` tokens.
- **Gutters/section padding:** `Container` gutter `clamp(1rem, …, 2rem)`; `Section` padding scales similarly.
- **Collapsing defaults:** `Split` stacks aside below main under `xl`; `Grid` is 1 column under `md` unless `cols` says
  otherwise; `Tabs` and `EditorTabs` scroll horizontally instead of wrapping; `Breadcrumbs` collapses middle items to
  `…` under `md`.
- **No fixed widths:** roots are `min-w-0 max-w-full`; long text truncates or wraps; `CodeBlock` scrolls internally.
- **Touch targets:** interactive components are at least 44×44 px under `md` (`min-h-11 min-w-11`).

### 3.4 Dark scope

`<Theme tone="dark">` renders a wrapper with `data-theme="dark"`. `theme.css` redefines the semantic colour tokens
inside `[data-theme="dark"]` (surface, surface-subtle/elevated/muted, on-surface, on-surface-variant, border-subtle,
border-strong, badge bg/text pairs) using the obsidian/slate palette from the IDE mockup. Tailwind v4 utilities
reference `var(--color-*)`, so every component renders correctly in either scope with no per-component dark variants.
`tone="light"` resets to the defaults (for nesting). Site-wide dark mode (#57) later = wrapping the app.

### 3.5 Accessibility

Every interactive component is keyboard operable with visible focus (`focus-visible` ring token). `IconButton.label`
is required. Dialog, Menu, Tabs, SegmentedControl, FileTree and Workbench separators follow the WAI-ARIA APG patterns
named in §4.

## 4. Components

### 4.1 Layout

| Component | Props |
|---|---|
| `Box` | `as`, `padding`, `radius` (`none\|sm\|md\|lg`), `tone` (`surface\|subtle\|elevated\|low\|inverse`), `border` (`none\|subtle\|strong`), `shadow` (`none\|sm\|md`) |
| `Stack` | `as`, `direction` (`row\|column`), `gap` (`none\|2xs\|xs\|sm\|md\|lg\|xl\|2xl`), `align`, `justify`, `wrap` |
| `Grid` | `as`, `cols` (1–6), `gap` |
| `Container` | `as`, `size` (`md\|lg\|xl`; default `xl` = max-w-7xl), fluid gutters |
| `Section` | `as`, `tone`, `padding` (`md\|lg\|xl`), `pattern` (`none\|dots\|grid`) |
| `Split` | `ratio` (`8/4\|1/1\|9/3`), `aside` (node), `sticky` (aside sticks on `xl+`), `gap` |

### 4.2 Typography

| Component | Props |
|---|---|
| `Text` | `as`, `variant` (`body-lead\|body-md\|body-sm\|label\|code`), `tone` (`default\|muted\|brand\|danger\|success\|warning\|inverse`), `weight` (`regular\|medium\|semibold`), `truncate`, `clamp` (1–4 lines) |
| `Heading` | `level` (1–4, sets element), `size` (`display\|xl\|lg\|md\|sm`, defaults from level), `tone` |
| `Eyebrow` | mono uppercase pill with a leading `Dot`; `tone` |
| `Code` | inline code |
| `CodeBlock` | dark `<pre>` block; `language` (label only, no highlighting) |
| `Markdown` | renders markdown (GFM) with library styles for headings, lists, task-list check items, inline/blocked code, tables, links; untrusted HTML is not rendered (`react-markdown` default, no `rehype-raw`) |

### 4.3 Display

| Component | Props |
|---|---|
| `Card` | `as`, `padding`, `interactive` (hover shadow + focus ring when link), `tone` (`default\|inverse`); subcomponents `Card.Media` (`pattern`: `dots\|grid\|none`, `aspect`: `video\|wide\|square`, children overlay) and `Card.Footer` (subtle footer bar) |
| `Badge` | `tone` (`neutral\|brand\|success\|warning\|danger\|info`), `uppercase`, `size` (`sm\|md`) |
| `Chip` | small outlined tag (Pattern Library category chips); `tone`, `icon`, optional `onRemove` |
| `Dot` | `tone`, `size` (`sm\|md`), `pulse` |
| `Icon` | `name`, `size` (`sm\|md\|lg`), `tone`, `filled`; `aria-hidden` unless `label` given |
| `Stat` | `icon`, `label`, `value` |
| `ProgressBar` | `value`, `max` (default 100), `tone`, `label` (visible or sr-only); `role="progressbar"` with aria values |
| `SectionHeader` | `title`, `dot` (tone), `tag` (badge text), `meta` |
| `Callout` | `tone` (`danger\|info\|success\|warning`), `title`, children, `action` (node) |
| `ResultRow` | `status` (`pass\|fail\|pending`), `title`, `detail`, `meta` |
| `Message` | `tone` (`default\|danger`), children — loading/error/empty lines; `role="status"` (default) or `role="alert"` (danger) |
| `EmptyState` | `icon`, `title`, `description`, `action` |
| `CheckList` | `items` (nodes) rendered with check icons |

### 4.4 Inputs and interaction

| Component | Props / behaviour |
|---|---|
| `Button` | `as`, `variant` (`primary\|secondary\|subtle\|ghost\|danger`), `size` (`sm\|md\|lg`), `icon`, `iconRight`, `fullWidth`, `loading` (disables + spinner), `whitespace-nowrap` built in |
| `IconButton` | `icon`, `label` (required; aria-label + tooltip title), `variant`, `size` |
| `TextField` | `label`, `hideLabel`, `type`, `icon`, `hint` (trailing `Kbd`), `error`; controlled or uncontrolled |
| `Select` | native `<select>` styled; `label`, `hideLabel`, `options: {value,label}[]` |
| `Tabs` | `variant` (`underline\|pills`), `items: {id,label,count?,dot?,as?,href?}[]`, `value`, `onChange`; APG Tabs (roving tabindex, arrow keys) when not links |
| `Dialog` | `open`, `onClose`, `title`, `description`, children, `footer`; focus trap, Escape, scroll lock, focus restore, `aria-modal`; rendered in a portal |
| `Menu` | `trigger` (render prop receiving button props), `items: {label,icon?,onSelect?,as?,href?,tone?}[]`; APG Menu Button (arrow keys, Escape, outside click closes, focus returns to trigger) |
| `Kbd` | keyboard hint |

### 4.5 IDE shell (from the Problem Editor mockup)

| Component | Props / behaviour |
|---|---|
| `Workbench` | slots `left`, `main`, `right`, `bottom`, `header`; resizable separators (pointer drag + arrow keys, `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`); defaults left 240 px, right 380 px, bottom 30 %; per-panel `min`/`max`; `persistKey` stores sizes in `localStorage` (wrapped in try/catch; defaults on failure). Under `lg`, left/right become drawers toggled by buttons in `header` (exposed via `Workbench.Toggle panel="left\|right"`); under `md`, bottom becomes a tab alongside main. Hand-built, no dependency |
| `FileTree` | `nodes: {path, kind:'file'\|'dir', readOnly?, modified?}[]` (flat, `/`-separated paths; tree derived), `activePath`, `onOpen(path)`, `defaultExpanded`; APG Tree View (`role="tree"`, arrow keys, Home/End, Enter opens); icons by extension; lock icon for `readOnly`, dot for `modified` |
| `EditorTabs` | `tabs: {id,label,modified?,readOnly?}[]`, `activeId`, `onSelect`, `onClose?`; horizontal scroll on overflow; middle-click closes |
| `Breadcrumbs` | `items: {label, href?, as?}[]`; last item `aria-current="page"`; middle items collapse to `…` under `md` |
| `StatusBar` | `start`, `end` (nodes); `StatusBar.Item` (`icon`, children, `tone`) |
| `MetricTile` | `label`, `value`, `tone` (`success\|danger\|neutral`), optional `icon` |
| `SegmentedControl` | `options: {value,label,icon?}[]`, `value`, `onChange`, `label` (group name); APG Radio Group (arrow keys move and select) |
| `Avatar` | `name` (initials fallback), `src`, `size` (`sm\|md\|lg`), `badge` (node, e.g. score) |
| `Countdown` | `seconds` (duration) or `until` (Date), `direction` (`down\|up`), `warnAt` (seconds; tone switches to danger), `onExpire`; renders `mm:ss` / `h:mm:ss` in mono; `role="timer"`; stops at 0; clears its interval on unmount |

### 4.6 Theme

`Theme` — `tone` (`light\|dark`), children; renders `<div data-theme>` (or `as`).

### 4.7 Not in the library

Domain components stay in the app and are built only from library parts: `ProblemCard`, `ProgressCard`,
`TestSuitePanel`, `EditorCard` (Monaco inside `Box tone="inverse"`), `TopBar`, `SiteHeader`, `SiteFooter`, `Logo`,
`DifficultyBadge`. Monaco itself is not wrapped by the library.

## 5. Error handling and edge cases

- Components never throw on unexpected-but-typed input: `ProgressBar` clamps `value` to `[0,max]`; `Countdown` with a
  past `until` renders `00:00` and fires `onExpire` once; `FileTree` with duplicate paths renders the first; empty
  `Tabs`/`EditorTabs`/`FileTree` render nothing (no crash).
- `Workbench` ignores malformed or out-of-range persisted sizes and falls back to defaults.
- `Dialog` restores focus to the previously focused element even if it was removed (falls back to `document.body`).
- SSR-safe: nothing touches `window`/`localStorage` during render; effects only.

## 6. Testing

- **Unit** (vitest + jsdom + @testing-library/react + user-event):
  - every variant prop maps to the expected classes;
  - responsive table completeness test (§3.2);
  - no component type accepts `className`/`style` (type-level test with `// @ts-expect-error`);
  - behaviour: Dialog (focus trap, Escape, restore, scroll lock), Menu, Tabs, SegmentedControl, FileTree keyboard nav,
    Workbench keyboard resize + persistence fallback, Countdown (fake timers, expire once, cleanup), ProgressBar clamp.
- **Gallery:** Ladle stories per component in light and dark scope; a full-page IDE shell story and a Pattern Library
  story mirroring the Stitch screens.
- **Responsive + a11y (Playwright over built Ladle):** every story at 390/768/1024/1440 px; fail if
  `document.documentElement.scrollWidth > innerWidth`; run axe, fail on critical/serious; screenshots uploaded as CI
  artifact. No pixel-diff baselines.
- **Package check:** `npm pack` → install tarball into `consumer-check/` (Next.js 16 + Tailwind v4 using the three CSS
  lines) → `next build` must succeed and the built CSS must contain a sample of classes used by the library (e.g.
  `gap-space-md`, `md:grid-cols-2`).

## 7. Repo, CI and release

- **Repo:** `UtkarshNigam1221/lldlab-ui`, public, MIT, created with `gh` after the user confirms.
- **`ci.yml`** (PRs + main): install, lint (ESLint flat config), typecheck, unit tests, build, Ladle build, Playwright
  responsive + axe, package check.
- **`release.yml`** (on `v*` tags): verify tag matches `package.json` version, build, test, `npm publish --provenance
  --access public` via npm Trusted Publishing (GitHub OIDC, `id-token: write`). No npm token stored.
- **First release:** npm only allows a trusted publisher on an existing package, so the user publishes `0.1.0` from a
  terminal (`npx -y npm@11 publish --access public --auth-type=web`), then links the repo as trusted publisher on
  npmjs.com. Later releases: `npm version <patch|minor> && git push --follow-tags`.
- **Versioning:** semver; pre-1.0 minor bumps may break. No changesets.
- **README:** install, the three CSS lines, font-variable and icon-font contract, component list, the no-`className`
  rule, link to Ladle usage.

## 8. Out of scope

- Migrating the frontend (Project B), multi-file problems (C), the IDE workspace page (D).
- Pixel-diff visual regression, a hosted Ladle site, syntax highlighting, a Monaco wrapper, site-wide dark mode toggle.
- "Patterns detected" and class-schema IDE panels (#47, #50).
