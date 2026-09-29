# lldlab-ui

Design-system components for [LLD Lab](https://lldlab.com), built for React 19 and Tailwind CSS v4.

- **Design tokens:** colour, spacing and type come from the LLD Lab Stitch design. Display and headline sizes and page gutters scale fluidly with the viewport.
- **Responsive by default:** layout props accept one value per breakpoint, and every component is checked for horizontal overflow at 390, 768, 1024 and 1440 px.
- **Light and dark scopes:** wrap any subtree in `<Theme tone="dark">`.
- **Accessible:** keyboard support and ARIA semantics follow the WAI-ARIA Authoring Practices, and every story is checked with axe.
- **No styling escape hatch:** components don't accept `className` or `style`. All visual variation goes through typed props.

---

## Contents

- [Install](#install)
- [Setup](#setup)
- [Core concepts](#core-concepts)
- [Components](#components)
  - [Layout](#layout): Theme, Box, Stack, Grid, Container, Section, Split
  - [Typography](#typography): Text, Heading, Eyebrow, Code, CodeBlock, Markdown
  - [Display](#display): Icon, Dot, Badge, Chip, Stat, ProgressBar, SectionHeader, Callout, ResultRow, Message, EmptyState, CheckList, Card
  - [Inputs and interaction](#inputs-and-interaction): Button, IconButton, Kbd, TextField, Select, Tabs, SegmentedControl, Dialog, Menu
  - [IDE shell](#ide-shell): Workbench, FileTree, EditorTabs, Breadcrumbs, StatusBar, MetricTile, Avatar, Countdown
- [Design tokens](#design-tokens)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Releasing](#releasing)

---

## Install

```bash
npm install lldlab-ui
```

| Requirement | Version |
|---|---|
| `react`, `react-dom` (peer dependencies) | 19 |
| Tailwind CSS in the app | v4 |

The package is ESM-only and ships TypeScript types.

## Setup

### 1. Styles

Add these three lines to the app's global stylesheet, for example `app/globals.css`:

```css
@import "tailwindcss";
@import "lldlab-ui/theme.css";
@source "../node_modules/lldlab-ui/dist";
```

- `lldlab-ui/theme.css` defines the design tokens (`--color-*`, `--spacing-*`, `--text-*`), the dark and light scopes, and three utilities: `bg-pattern-dots`, `bg-pattern-grid` and `icon-filled`.
- `@source` tells the app's Tailwind to scan the library's compiled components. The library ships Tailwind class names, not CSS, so the app generates exactly the classes the components use from the same tokens.
- **Resolve the `@source` path relative to the CSS file.** If the stylesheet is at `src/app/globals.css`, use `@source "../../node_modules/lldlab-ui/dist";`.

Recommended base styles, in the same file:

```css
body {
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### 2. Fonts

The library reads three CSS variables. The app loads the fonts and sets them:

| Variable | Font | Used for |
|---|---|---|
| `--font-space-grotesk` | Space Grotesk | display text and headlines |
| `--font-inter` | Inter | body text and buttons |
| `--font-jetbrains-mono` | JetBrains Mono | labels, code and timers |

With Next.js:

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Icons

`Icon` and every component that takes an `icon` prop render [Material Symbols Outlined](https://fonts.google.com/icons) by ligature. Load the font once, as in the `<link>` above, and pass icon names such as `"play_arrow"`, `"check_circle"` or `"search"`.

### 4. Use it

```tsx
import { Button, Card, Grid, Heading, Stack, Text } from 'lldlab-ui';

export function Example() {
  return (
    <Stack gap="lg">
      <Heading level={1} size="display">Master low-level design</Heading>
      <Grid cols={{ base: 1, md: 2, xl: 3 }}>
        <Card>
          <Heading level={3} size="sm">Singleton</Heading>
          <Text tone="muted">One instance, global access.</Text>
          <Button icon="play_arrow">Start</Button>
        </Card>
      </Grid>
    </Stack>
  );
}
```

The bundle starts with `'use client'`, so any component can be imported from a Next.js server component. Event-handler props still need a client component, as usual.

---

## Core concepts

### No `className`, no `style`

No component accepts `className` or `style`, and TypeScript rejects them. To change how something looks:

1. Use an existing variant prop (`tone`, `variant`, `size`, `padding` and so on).
2. If none fits, add a variant or a new component to this library.

This keeps every visual decision in one place, so pages stay pure composition.

### Passing through native props

Apart from `className` and `style`, most components forward the props of their root element: `id`, `aria-*`, `data-*`, event handlers and `ref`. For example, `<TextField>` forwards every `<input>` prop, and `<Button>` forwards every `<button>` prop.

### `as`: render a different element or component

Components marked **polymorphic** below take an `as` prop, which changes the rendered element or plugs in a router link:

```tsx
import Link from 'next/link';

<Button as={Link} href="/problems" iconRight="arrow_forward">Browse problems</Button>
<Card as={Link} href="/problem/singleton" interactive>…</Card>
<Stack as="ul" gap="xs">…</Stack>
<Text as="span" variant="label">New</Text>
```

When `as` is set, the component accepts that element's or component's props (for example `href` for a link).

### Responsive props

Props typed `Responsive<T>` accept either one value or one value per breakpoint (min-width, as in Tailwind):

```tsx
<Stack direction={{ base: 'column', md: 'row' }} gap={{ base: 'sm', lg: 'lg' }} />
<Grid cols={{ base: 1, md: 2, xl: 4 }} />
<Heading level={1} size={{ base: 'lg', md: 'display' }} />
```

| Breakpoint | Min width |
|---|---|
| `base` | 0 |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

Sensible collapsing is built in. `Grid` is one column below `md` unless you set `base`. `Split` stacks its aside below `xl`. `Tabs` and `EditorTabs` scroll sideways instead of wrapping. Below `md`, interactive controls grow to at least 44px tall for touch.

### Shared value types

These types are exported from the package.

| Type | Values |
|---|---|
| `Space` | `none` (0) · `2xs` (0.125rem) · `xs` (0.25rem) · `sm` (0.5rem) · `md` (1rem) · `lg` (1.5rem) · `xl` (2.5rem) · `2xl` (4rem) |
| `Direction` | `row` · `column` |
| `Align` | `start` · `center` · `end` · `stretch` · `baseline` |
| `Justify` | `start` · `center` · `end` · `between` |
| `Cols` | `1` – `6` |
| `HeadingSize` | `display` · `xl` · `lg` · `md` · `sm` |
| `Tone` (text and icons) | `default` · `muted` · `strong` · `brand` · `success` · `warning` · `danger` · `inverse` |
| `StatusTone` (dots, eyebrows, section headers) | `neutral` · `brand` · `success` · `warning` · `danger` |
| `SurfaceTone` (backgrounds) | `surface` · `subtle` · `elevated` · `low` · `inverse` |
| `BadgeTone` | `neutral` · `brand` · `success` · `warning` · `danger` · `info` |
| `ButtonVariant` | `primary` · `secondary` · `subtle` · `ghost` · `danger` |

### Light and dark scopes

```tsx
<Theme tone="dark">
  <Workbench … />       {/* everything inside uses the dark palette */}
  <Theme tone="light">…</Theme>   {/* nested scopes reset */}
</Theme>
```

Components use semantic tokens only, so every component works in both scopes. A `Dialog` renders in a portal, and still takes the theme of the element that opened it.

---

## Components

In the tables, **Req.** marks required props, and the default is given where one exists. Every component also forwards the native props of its root element, except `className` and `style`.

### Layout

#### `Theme`

Scopes the colour tokens for its subtree. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `tone` | `'light' \| 'dark'` | `'light'` |
| `as` | element or component | `'div'` |

```tsx
<Theme tone="dark"><App /></Theme>
```

#### `Box`

A generic surface. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `padding` | `Responsive<Space>` | none |
| `tone` | `SurfaceTone` | none (transparent) |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'none'` |
| `border` | `'none' \| 'subtle' \| 'strong'` | `'none'` |
| `shadow` | `'none' \| 'sm' \| 'md'` | `'none'` |

```tsx
<Box tone="elevated" border="subtle" radius="lg" padding={{ base: 'md', lg: 'lg' }}>…</Box>
```

#### `Stack`

A flex row or column. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `direction` | `Responsive<Direction>` | `'column'` |
| `gap` | `Responsive<Space>` | `'md'` |
| `align` | `Responsive<Align>` | none |
| `justify` | `Responsive<Justify>` | none |
| `wrap` | `boolean` | `false` |

```tsx
<Stack direction={{ base: 'column', md: 'row' }} gap="sm" align="center" justify="between" wrap>…</Stack>
```

#### `Grid`

A CSS grid. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `cols` | `Responsive<Cols>` | `1` |
| `gap` | `Responsive<Space>` | `'md'` |

- A single number is treated as `{ base: 1, md: n }`, so `cols={3}` is one column on phones and three from `md`.
- A breakpoint object without `base` gets `base: 1`.

```tsx
<Grid cols={{ md: 2, xl: 4 }} gap="lg">…</Grid>
```

#### `Container`

A centred, max-width page column with fluid side gutters (1rem up to 2rem). Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `size` | `'md' \| 'lg' \| 'xl'`: 48rem, 64rem, 80rem max width | `'xl'` |

#### `Section`

A full-width page band with fluid vertical padding. Polymorphic, default `section`.

| Prop | Type | Default |
|---|---|---|
| `tone` | `SurfaceTone` | none |
| `padding` | `'md' \| 'lg' \| 'xl'`: fluid, about 2–4rem, 3–6rem and 4–8rem | `'lg'` |
| `pattern` | `'none' \| 'dots' \| 'grid'` | `'none'` |

```tsx
<Section tone="subtle" pattern="dots" padding="xl">
  <Container>…</Container>
</Section>
```

#### `Split`

Main content plus an aside, side by side from `xl` and stacked below it.

| Prop | Type | Default |
|---|---|---|
| `aside` **Req.** | `ReactNode` | none |
| `children` **Req.** | `ReactNode` (main content) | none |
| `ratio` | `'8/4' \| '1/1' \| '9/3'` (out of 12 columns) | `'8/4'` |
| `sticky` | `boolean`: the aside sticks while scrolling (xl+) | `false` |
| `gap` | `Responsive<Space>` | `'lg'` |

```tsx
<Split aside={<ProgressCard />} sticky>
  <ProblemList />
</Split>
```

### Typography

#### `Text`

Body text. Polymorphic, default `p`.

| Prop | Type | Default |
|---|---|---|
| `variant` | `'body-lead' \| 'body-md' \| 'body-sm' \| 'label' \| 'code'` | `'body-md'` |
| `tone` | `Tone` | `'default'` |
| `weight` | `'regular' \| 'medium' \| 'semibold'` | `'regular'` |
| `truncate` | `boolean`: a single line with an ellipsis | `false` |
| `clamp` | `1 \| 2 \| 3 \| 4`: the number of lines before an ellipsis | none |

`label` is JetBrains Mono in uppercase. Long words wrap instead of overflowing.

```tsx
<Text variant="body-sm" tone="muted" clamp={2}>{summary}</Text>
```

#### `Heading`

| Prop | Type | Default |
|---|---|---|
| `level` **Req.** | `1 \| 2 \| 3 \| 4`: which element (`h1`–`h4`) | none |
| `size` | `Responsive<HeadingSize>` | from the level: 1→`xl`, 2→`lg`, 3→`md`, 4→`sm` |
| `tone` | `'default' \| 'muted' \| 'brand' \| 'inverse'` | `'default'` |

`display`, `xl` and `lg` scale fluidly with the viewport. `level` sets the document outline and `size` sets the look, so they are independent.

```tsx
<Heading level={1} size={{ base: 'lg', md: 'display' }}>Pattern library</Heading>
```

#### `Eyebrow`

A small uppercase pill with a status dot, used above hero headings.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `StatusTone` (the dot colour) | `'brand'` |

#### `Code`

Inline code. Props: `children`.

#### `CodeBlock`

A dark code block. It scrolls horizontally inside itself, so long lines never widen the page. It is keyboard-focusable so the scroll area can be reached.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` (the code) | none |
| `language` | `string`: shown as a caption, with no highlighting | none |

#### `Markdown`

Renders GitHub-flavoured Markdown with library styles: headings, lists, task lists as check icons, inline and block code, tables in a horizontal scroller, links and blockquotes.

| Prop | Type |
|---|---|
| `children` **Req.** | `string` (the markdown source) |

Raw HTML in the source is **not** rendered, and `javascript:` links are stripped. That makes it safe for user- or admin-authored content.

```tsx
<Markdown>{problem.statement}</Markdown>
```

### Display

#### `Icon`

| Prop | Type | Default |
|---|---|---|
| `name` **Req.** | `string`: a Material Symbols name | none |
| `size` | `'sm' \| 'md' \| 'lg'` (16, 20, 24px) | `'md'` |
| `tone` | `Tone \| 'inherit'` | `'inherit'` |
| `filled` | `boolean` | `false` |
| `spin` | `boolean` | `false` |
| `label` | `string` | none |

Without `label` the icon is decorative (`aria-hidden`). With a `label`, screen readers announce it as an image.

#### `Dot`

A small coloured status dot, always decorative.

| Prop | Type | Default |
|---|---|---|
| `tone` | `StatusTone` | `'neutral'` |
| `size` | `'sm' \| 'md'` | `'sm'` |
| `pulse` | `boolean` | `false` |

#### `Badge`

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `BadgeTone` | `'neutral'` |
| `size` | `'sm' \| 'md'` | `'sm'` |
| `uppercase` | `boolean` | `false` |

```tsx
<Badge tone="success" uppercase>Beginner</Badge>
```

#### `Chip`

An outlined tag, such as a pattern category. It can be removable.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `string` | none |
| `tone` | `'neutral' \| 'brand'` | `'neutral'` |
| `icon` | `string` | none |
| `onRemove` | `() => void`: shows a remove button named "Remove {children}" | none |

#### `Stat`

An icon with a small label above a large value.

| Prop | Type |
|---|---|
| `icon` **Req.** | `string` |
| `label` **Req.** | `ReactNode` |
| `value` **Req.** | `ReactNode` |

#### `ProgressBar`

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string`: the visible label, which also names the bar | none |
| `value` **Req.** | `number` | none |
| `max` | `number` | `100` |
| `tone` | `'brand' \| 'success' \| 'warning' \| 'danger'` | `'brand'` |
| `hideLabel` | `boolean`: keeps the label for screen readers only | `false` |

`value` is clamped to `0…max`. A `max` of 0 or less shows 0%.

```tsx
<ProgressBar label="Creational" value={3} max={5} tone="success" />
```

#### `SectionHeader`

A header row for a group of items: dot, heading, tag and a right-aligned meta line.

| Prop | Type | Default |
|---|---|---|
| `title` **Req.** | `ReactNode` | none |
| `level` | `2 \| 3` | `2` |
| `dot` | `StatusTone` | none |
| `tag` | `ReactNode`: shown as an uppercase badge | none |
| `meta` | `ReactNode` | none |

#### `Callout`

A tinted notice box. `danger` is announced as an alert, and the other tones as a status.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| `title` | `ReactNode` | none |
| `action` | `ReactNode`, such as a `Button` | none |

#### `ResultRow`

One test result or submission row. The status icon carries an accessible name: "Passed", "Failed" or "Pending".

| Prop | Type |
|---|---|
| `status` **Req.** | `'pass' \| 'fail' \| 'pending'` |
| `title` **Req.** | `ReactNode` |
| `detail` | `ReactNode`: monospace, keeps line breaks |
| `meta` | `ReactNode`, such as a duration |

#### `Message`

A one-line loading, empty or error message. `danger` is announced as an alert, and the default as a status.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `'default' \| 'danger'` | `'default'` |

#### `EmptyState`

| Prop | Type | Default |
|---|---|---|
| `title` **Req.** | `ReactNode` | none |
| `icon` | `string` | `'inbox'` |
| `description` | `ReactNode` | none |
| `action` | `ReactNode` | none |

#### `CheckList`

| Prop | Type |
|---|---|
| `items` **Req.** | `ReactNode[]`, each rendered with a check icon |

#### `Card`

A bordered, rounded surface. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `padding` | `Responsive<Space>`: the body padding | `'lg'` |
| `tone` | `'default' \| 'inverse'` (dark obsidian card) | `'default'` |
| `interactive` | `boolean`: hover shadow and focus ring, for link cards | `false` |

Sub-components:

- **`Card.Media`** is always rendered first, edge to edge.

  | Prop | Type | Default |
  |---|---|---|
  | `pattern` | `'none' \| 'dots' \| 'grid'` | `'dots'` |
  | `aspect` | `'video' \| 'wide' \| 'square'` | `'video'` |
  | `children` | `ReactNode` (centred overlay) | none |

- **`Card.Footer`** is always rendered last as a tinted footer bar. It takes only `children`.

All other children go into the padded body, whatever their order in the JSX.

```tsx
<Card as={Link} href="/problem/singleton" interactive>
  <Card.Media pattern="dots"><Icon name="deployed_code" size="lg" tone="muted" /></Card.Media>
  <Badge tone="success" uppercase>Beginner</Badge>
  <Heading level={3} size="sm">Singleton logger</Heading>
  <Card.Footer><Text variant="label" tone="muted">4 languages</Text></Card.Footer>
</Card>
```

### Inputs and interaction

#### `Button`

Polymorphic, default `button`.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` (the label) | none |
| `variant` | `ButtonVariant` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` (32, 40, 48px tall) | `'md'` |
| `icon` | `string`: an icon before the label | none |
| `iconRight` | `string`: an icon after the label | none |
| `fullWidth` | `boolean` | `false` |
| `loading` | `boolean`: disables the button, shows a spinner and sets `aria-busy` | `false` |
| `disabled` | `boolean` | `false` |

As a native button it defaults to `type="button"`; pass `type="submit"` for forms. When rendered through `as` (for example as a link), `disabled` sets `aria-disabled` and blocks pointer events. `ref` is forwarded.

```tsx
<Button variant="secondary" size="sm" icon="play_arrow" onClick={run}>Run</Button>
<Button type="submit" loading={saving}>Save</Button>
```

#### `IconButton`

A square, icon-only button. All `<button>` props are forwarded.

| Prop | Type | Default |
|---|---|---|
| `icon` **Req.** | `string` | none |
| `label` **Req.** | `string`: the accessible name and tooltip | none |
| `variant` | `'ghost' \| 'subtle' \| 'primary'` | `'ghost'` |
| `size` | `'sm' \| 'md'` (32, 40px) | `'md'` |

#### `Kbd`

A keyboard hint, e.g. `<Kbd>⌘K</Kbd>`. Props: `children`.

#### `TextField`

A labelled text input. All `<input>` props are forwarded, so it works controlled or uncontrolled.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `hideLabel` | `boolean`: keeps the label for screen readers only | `false` |
| `icon` | `string`: a leading icon | none |
| `hint` | `ReactNode`: trailing content, such as `<Kbd>⌘K</Kbd>` | none |
| `error` | `string`: sets `aria-invalid` and links the message as the description | none |

```tsx
<TextField label="Search problems" hideLabel icon="search" hint={<Kbd>⌘K</Kbd>} value={q} onChange={(e) => setQ(e.target.value)} />
```

#### `Select`

A styled native `<select>`. All `<select>` props (`value`, `defaultValue`, `onChange` and so on) are forwarded.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `options` **Req.** | `{ value: string; label: string }[]` | none |
| `hideLabel` | `boolean` | `false` |

#### `Tabs`

A tab strip that scrolls horizontally when it doesn't fit.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string`: the accessible name of the group | none |
| `items` **Req.** | `TabItem[]` | none |
| `value` **Req.** | `string`: the active item `id` | none |
| `onChange` | `(id: string) => void` | none |
| `variant` | `'underline' \| 'pills'` | `'underline'` |

`TabItem`: `{ id: string; label: ReactNode; count?: number; dot?: StatusTone; href?: string; as?: ElementType }`

It has two modes:

- **Tablist** (no item has `href`): an ARIA tablist. Arrow keys, Home and End move between tabs and select them. Render the panel yourself based on `value`.
- **Navigation** (any item has `href`): a `<nav>` of links. The active link gets `aria-current="page"`. Use `as` for your router's link component.

```tsx
<Tabs label="Filter" value={tab} onChange={setTab} items={[{ id: 'all', label: 'All', count: 40 }, { id: 'solved', label: 'Solved', dot: 'success' }]} />
<Tabs label="Site" value="problems" items={[{ id: 'problems', label: 'Problems', href: '/problems', as: Link }]} />
```

#### `SegmentedControl`

A single-choice pill group, such as a language picker. It is an ARIA radio group: arrow keys move and select.

| Prop | Type |
|---|---|
| `label` **Req.** | `string` |
| `options` **Req.** | `{ value: string; label: string; icon?: string }[]` |
| `value` **Req.** | `string` |
| `onChange` **Req.** | `(value: string) => void` |

#### `Dialog`

A modal dialog rendered in a portal.

| Prop | Type | Default |
|---|---|---|
| `open` **Req.** | `boolean` | none |
| `onClose` **Req.** | `() => void`: called on Escape, a backdrop click or the close button | none |
| `title` **Req.** | `ReactNode` (names the dialog) | none |
| `description` | `ReactNode` (describes the dialog) | none |
| `footer` | `ReactNode`: actions, right-aligned | none |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `children` | `ReactNode` (the body) | none |

- **Focus:** focus moves to the first focusable element in the body, Tab and Shift+Tab stay inside the dialog, and on close focus returns to the element that opened it.
- **Page:** the page behind can't scroll while the dialog is open.
- **Theme:** the dialog inherits the opener's `<Theme>`.
- On small screens it docks to the bottom of the viewport.

```tsx
<Dialog open={open} onClose={() => setOpen(false)} title="Sign in" description="Save your progress." footer={<Button type="submit" form="login">Sign in</Button>}>
  <form id="login">…</form>
</Dialog>
```

#### `Menu`

A menu button, such as an account menu.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string`: the menu's accessible name | none |
| `trigger` **Req.** | `(props: MenuTriggerProps) => ReactNode`: spread `props` onto a `Button` | none |
| `items` **Req.** | `MenuItem[]` | none |
| `align` | `'start' \| 'end'`: which edge of the trigger the menu aligns to | `'end'` |

`MenuItem`: `{ label: string; icon?: string; onSelect?: () => void; href?: string; as?: ElementType; tone?: 'default' | 'danger' }`

Keyboard and pointer behaviour:
- Click toggles the menu.
- On the trigger, ArrowDown, Enter or Space opens the menu at the first item, and ArrowUp opens it at the last.
- Inside the menu, arrows, Home and End move between items.
- Escape closes and refocuses the trigger. Tab or a click outside closes.

```tsx
<Menu
  label="Account"
  items={[{ label: 'Profile', icon: 'person', href: '/me', as: Link }, { label: 'Sign out', icon: 'logout', tone: 'danger', onSelect: signOut }]}
  trigger={(p) => <Button {...p} variant="ghost" icon="account_circle">Account</Button>}
/>
```

### IDE shell

#### `Workbench`

An IDE layout: an optional header, a left panel, the main area, a right panel and a bottom panel, with resizable separators.

| Prop | Type | Default |
|---|---|---|
| `main` **Req.** | `ReactNode` | none |
| `header` | `ReactNode` | none |
| `left` | `ReactNode` | none |
| `right` | `ReactNode` | none |
| `bottom` | `ReactNode` | none |
| `labels` | `Partial<{ left; main; right; bottom }>` (region names) | `Explorer`, `Editor`, `Details`, `Panel` |
| `defaultSizes` | `Partial<{ left: px; right: px; bottom: % }>` | `{ left: 240, right: 380, bottom: 30 }` |
| `limits` | `Partial<{ left: [min, max]; right: [min, max]; bottom: [min, max] }>` | `left [160, 480]`, `right [260, 640]`, `bottom [15, 70]` |
| `persistKey` | `string`: remembers sizes in `localStorage` under this key | none |

- **Resizing:** drag a separator, or focus it and use the arrow keys (16px steps, or 5% for the bottom panel). Home and End jump to the minimum and maximum.
- **Saved sizes:** they are read after mount, so server rendering is safe. Corrupt or out-of-range values are ignored, and blocked storage is tolerated.
- **Below `lg`:** the left and right panels become slide-over drawers. Open them with `<Workbench.Toggle panel="left" />` or `<Workbench.Toggle panel="right" />`, placed anywhere inside `header`. Escape or a backdrop click closes them.
- **Below `md`:** a switch toggles between the main area and the bottom panel.
- **Height:** give the Workbench a parent with a fixed height, e.g. `h-dvh` or a flex child.

```tsx
<Workbench
  persistKey="ide"
  header={<><Workbench.Toggle panel="left" /><Breadcrumbs items={crumbs} /><Workbench.Toggle panel="right" /></>}
  left={<FileTree label="Files" nodes={files} activePath={active} onOpen={setActive} />}
  main={<Editor />}
  right={<Statement />}
  bottom={<TestResults />}
/>
```

#### `FileTree`

A keyboard-navigable file tree, built from flat paths.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `nodes` **Req.** | `FileNode[]` | none |
| `onOpen` **Req.** | `(path: string) => void`: called when a file is opened | none |
| `activePath` | `string`: the selected file | none |
| `defaultExpanded` | `string[] \| 'all'` (directory paths) | `'all'` |

`FileNode`: `{ path: string; kind: 'file' | 'dir'; readOnly?: boolean; modified?: boolean }`

- **Building the tree:** paths are `/`-separated, missing parent directories are created, and duplicate paths keep the first entry. Directories sort first, then names alphabetically.
- **Keyboard:** Up and Down move between items. Right expands a directory or enters it, and Left collapses it or goes to the parent. Home and End jump to the ends. Enter opens a file or toggles a directory.
- **Markers:** read-only files show a lock, and modified files show a dot. Both are announced to screen readers.

#### `EditorTabs`

Tabs for open files. They scroll horizontally, and a middle-click closes a tab.

| Prop | Type | Default |
|---|---|---|
| `tabs` **Req.** | `{ id: string; label: string; modified?: boolean; readOnly?: boolean }[]` | none |
| `activeId` **Req.** | `string` | none |
| `onSelect` **Req.** | `(id: string) => void` | none |
| `onClose` | `(id: string) => void`: shows close buttons | none |
| `label` | `string` | `'Open files'` |

#### `Breadcrumbs`

| Prop | Type | Default |
|---|---|---|
| `items` **Req.** | `{ label: string; href?: string; as?: ElementType }[]` | none |
| `label` | `string` | `'Breadcrumb'` |

The last item is the current page. With three or more items, the middle ones collapse to `…` below `md`.

#### `StatusBar`

A thin bar at the bottom of the IDE.

| Prop | Type | Default |
|---|---|---|
| `start` | `ReactNode` (left side) | none |
| `end` | `ReactNode` (right side) | none |
| `label` | `string` | `'Status'` |

`StatusBar.Item` takes `children` (required), `icon?: string`, and `tone?: 'default' | 'success' | 'danger' | 'warning' | 'brand'`.

```tsx
<StatusBar start={<StatusBar.Item icon="check_circle" tone="success">Ready</StatusBar.Item>} end={<StatusBar.Item>TypeScript</StatusBar.Item>} />
```

#### `MetricTile`

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `ReactNode` | none |
| `value` **Req.** | `ReactNode` | none |
| `tone` | `'neutral' \| 'success' \| 'danger'` | `'neutral'` |
| `icon` | `string` | none |

#### `Avatar`

| Prop | Type | Default |
|---|---|---|
| `name` **Req.** | `string`: used for the initials and the accessible name | none |
| `src` | `string`: the image. If it's missing or fails to load, initials show instead | none |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `badge` | `ReactNode`, such as a score, shown at the corner | none |

#### `Countdown`

A timer that counts down, or up.

| Prop | Type | Default |
|---|---|---|
| `seconds` | `number`: the duration (down), or the starting offset (up) | `0` |
| `until` | `Date`: the deadline (down only; overrides `seconds`) | none |
| `direction` | `'down' \| 'up'` | `'down'` |
| `warnAt` | `number`: switches to the danger colour at or below this many seconds | none |
| `onExpire` | `() => void`: fired once when a countdown reaches 0 | none |
| `label` | `string` (accessible name) | `'Time remaining'` |

It shows `mm:ss`, or `h:mm:ss` from one hour. A deadline already in the past shows `00:00` and fires `onExpire` right away. Unmounting stops the timer, and `onExpire` won't fire afterwards.

---

## Design tokens

`theme.css` registers every token as a Tailwind v4 theme variable, so it is available both as a utility (`bg-surface`) and as a CSS variable (`var(--color-surface)`). Use the variables in the app's own CSS when you need them outside components.

| Group | Tokens |
|---|---|
| Surfaces | `--color-surface`, `-surface-subtle`, `-surface-elevated`, `-surface-muted`, `-surface-container-low` |
| Text | `--color-on-surface`, `-on-surface-variant` (muted), `-ink` (strong), `-on-ink` |
| Status text (meets AA contrast in both themes) | `--color-fg-brand`, `-fg-success`, `-fg-warning`, `-fg-danger` |
| Brand fills | `--color-brand-cobalt`, `-brand-emerald`, `-brand-amber`, `-brand-crimson`, `-brand-obsidian`, `-brand-slate` |
| Borders | `--color-border-subtle`, `-border-strong` |
| Badges | `--color-badge-{beginner,intermediate,amber,advanced}-{bg,text}` |
| Spacing | `--spacing-space-{2xs,xs,sm,md,lg,xl,2xl}`, `--spacing-gutter-fluid`, `--spacing-section-{md,lg,xl}` |
| Type | `--text-{display,headline-xl,headline-lg,headline-md,headline-sm,body-lead,body-md,body-sm,label-mono,code-inline,button-text}` |

Every token under Surfaces, Text, Status text, Borders and Badges changes inside `[data-theme="dark"]`, which is what `<Theme tone="dark">` renders.

## Accessibility

- **Interactive widgets:** they follow the WAI-ARIA Authoring Practices.
  - `Tabs` is a tablist, `SegmentedControl` a radio group, and `Menu` a menu button.
  - `FileTree` is a tree view, and the `Workbench` resize handles are separators with values.
  - `Dialog` is a modal dialog.
- **Accessible names:** icon-only controls require a `label` (`IconButton`), and status icons have names (`ResultRow`).
- **Focus and touch:** focus rings are visible on keyboard focus, and touch targets are at least 44px below `md`.
- **Contrast:** status text colours meet WCAG AA in both themes.
- **CI checks:** every gallery story runs through axe, and critical or serious violations fail the build.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Components render unstyled, or some classes are missing | The `@source` path is wrong: resolve it relative to the CSS file. Also check that the app uses Tailwind **v4**. |
| Icons show as words (`play_arrow`) | Load the Material Symbols Outlined stylesheet. |
| Wrong fonts | Set `--font-space-grotesk`, `--font-inter` and `--font-jetbrains-mono`, for example on `<html>` through `next/font`'s `variable` option. |
| TypeScript error on `className` | This is intentional: use a variant prop, or add a variant to the library. |
| `Workbench` has no height | Give its parent an explicit height, e.g. `h-dvh`, or make it a flex child with `min-h-0 flex-1`. |

## Development

```bash
npm install
npm test               # unit tests (vitest + jsdom)
npm run typecheck      # includes the type test that forbids className/style
npm run lint
npm run build          # tsup → dist/ (ESM + .d.ts + theme.css)
npm run ladle          # component gallery on http://localhost:61000
npm run ladle:build && npm run e2e   # every story at 390/768/1024/1440px (light) + 1024px dark, overflow + axe
npm run package-check  # pack the tarball and build a real Next.js 16 + Tailwind v4 consumer
```

Source layout: `src/primitives` (layout and typography), `src/components`, `src/ide`, `src/tokens/theme.css`, `src/internal` (class tables and helpers), and `src/stories` (the Ladle gallery).

When adding a component:
1. Write every Tailwind class as a complete literal string, never built with template strings, or the app's Tailwind scan won't see it.
2. Keep `className` and `style` out of its props.
3. Add a unit test and a story.

## Releasing

```bash
npm version patch      # or minor; 0.x minors may break
git push --follow-tags # the v* tag runs .github/workflows/release.yml
```

The release workflow checks that the tag matches `package.json`, runs the tests, builds, and publishes through **npm Trusted Publishing** (GitHub OIDC) with provenance. No npm token is stored.

## License

MIT
