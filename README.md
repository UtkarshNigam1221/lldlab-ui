# lldlab-ui

Design-system components for [LLD Lab](https://lldlab.com), built for React 19 and Tailwind CSS v4.

- **Design tokens:** colour, spacing and type come from the LLD Lab Stitch design. Display and headline sizes and page gutters scale fluidly with the viewport.
- **Responsive by default:** layout props accept one value per breakpoint, and every component is checked for horizontal overflow at 390, 768, 1024 and 1440 px.
- **Light and dark scopes:** wrap any subtree in `<Theme tone="dark">`.
- **Accessible:** keyboard support and ARIA semantics follow the WAI-ARIA Authoring Practices, and every story is checked with axe.
- **No styling escape hatch:** components don't accept `className` or `style`. All visual variation goes through typed props.

---

## Table of contents

**Quick links:** [What's new in 0.3.0](#whats-new-in-030) · [Install](#install) · [Setup](#setup) · [Component index](#component-index) · [Mobile navigation](#mobile-navigation) · [Design tokens](#design-tokens) · [Troubleshooting](#troubleshooting)

1. [What's new in 0.3.0](#whats-new-in-030)
1. [Install](#install)
2. [Setup](#setup)
   - [1. Styles](#1-styles) · [2. Fonts](#2-fonts) · [3. Icons](#3-icons) · [4. Use it](#4-use-it)
3. [Core concepts](#core-concepts)
   - [No className, no style](#no-classname-no-style) · [Passing through native props](#passing-through-native-props) · [as: render a different element or component](#as-render-a-different-element-or-component) · [Responsive props](#responsive-props) · [Shared value types](#shared-value-types) · [Light and dark scopes](#light-and-dark-scopes)
4. [Components](#components)
   - [Component index](#component-index)
   - **[Layout](#layout):** [`Theme`](#theme) · [`Box`](#box) · [`Stack`](#stack) · [`Grid`](#grid) · [`Container`](#container) · [`Section`](#section) · [`Split`](#split) · [`AppBar`](#appbar) · [`Show`](#show) · [`Divider`](#divider)
   - **[Typography](#typography):** [`Text`](#text) · [`Heading`](#heading) · [`Eyebrow`](#eyebrow) · [`Code`](#code) · [`CodeBlock`](#codeblock) · [`TextLink`](#textlink) · [`Markdown`](#markdown)
   - **[Display](#display):** [`Icon`](#icon) · [`Dot`](#dot) · [`Badge`](#badge) · [`Chip`](#chip) · [`Stat`](#stat) · [`ProgressBar`](#progressbar) · [`SectionHeader`](#sectionheader) · [`Callout`](#callout) · [`ResultRow`](#resultrow) · [`Message`](#message) · [`EmptyState`](#emptystate) · [`CheckList`](#checklist) · [`Card`](#card) · [`IconTile`](#icontile) · [`Skeleton`](#skeleton) · [`Table`](#table) · [`DescriptionList`](#descriptionlist) · [`Timeline`](#timeline) · [`BarChart`](#barchart) · [`VerdictBanner`](#verdictbanner) · [`TerminalOutput`](#terminaloutput) · [`DiffViewer`](#diffviewer) · [`Overlay`](#overlay)
   - **[Inputs and interaction](#inputs-and-interaction):** [`Button`](#button) · [`IconButton`](#iconbutton) · [`Kbd`](#kbd) · [`TextField`](#textfield) · [`Select`](#select) · [`Tabs`](#tabs) · [`SegmentedControl`](#segmentedcontrol) · [`Dialog`](#dialog) · [`Menu`](#menu) · [`Checkbox`](#checkbox) · [`Switch`](#switch) · [`Disclosure`](#disclosure) · [`CopyButton`](#copybutton) · [`Tooltip`](#tooltip)
   - **[Navigation and overlays](#navigation-and-overlays):** [`NavList`](#navlist) · [`Pagination`](#pagination) · [`Drawer`](#drawer) · [`CommandPalette`](#commandpalette) · [`Toaster`](#toaster)
   - **[IDE shell](#ide-shell):** [`Workbench`](#workbench) · [`FileTree`](#filetree) · [`EditorTabs`](#editortabs) · [`Breadcrumbs`](#breadcrumbs) · [`StatusBar`](#statusbar) · [`MetricTile`](#metrictile) · [`Avatar`](#avatar) · [`AvatarGroup`](#avatargroup) · [`Countdown`](#countdown) · [`UmlClass`](#umlclass) · [`UmlDiagram`](#umldiagram)
5. [Mobile navigation](#mobile-navigation)
6. [Design tokens](#design-tokens)
7. [Accessibility](#accessibility)
8. [Troubleshooting](#troubleshooting)
9. [Development](#development)
10. [Releasing](#releasing)
11. [License](#license)

---

## What's new in 0.3.0

A fidelity pass against the Stitch mockups. **Visual defaults changed**; the API only grew.

**Changed defaults**

- Surfaces separate by shadow, not borders: `Card` is `shadow-sm` with no border (add `outlined` for the hairline); `Card.Header` / `Card.Footer` are tinted bars with no rule (add `divider`).
- `AppBar` floats on a soft shadow (`divider="border"` restores the hairline).
- Tokens: `rounded` is 2px; `shadow-sm/md/lg/xl` use the lighter Tailwind v3 scale; `fg-brand` is `#2563EB`.
- `MetricTile`, boxed `ResultRow` and `Badge uppercase` drop their border / extra tracking; `Eyebrow` text takes its tone colour.
- Nav `Tabs` keep one font weight so the active item never shifts its neighbours.

**New props**

| Component | Added |
|---|---|
| `Card` | `shadow` (none/sm/md/xl), `outlined`, `gap`; `Card.Header`/`Footer`: `divider`, `density` (md/sm), `tone` (default/slate/none) |
| `AppBar` | `divider` (shadow/border) |
| `Section` | `paddingTop`, `paddingBottom` (spacing scale), `padding="none"`, `pattern="dots-brand"` |
| `Split` | `ratio` `7/5`, `5/7`; `breakpoint` (lg/xl); `asideAs` (aside/div) |
| `GridItem` | new: `span` (responsive column span) |
| `Show` | `above` / `below` `2xl` |
| `Heading` | `balance`, `leading="none"` |
| `Text` | `underline="wavy"` |
| `Eyebrow` | `variant` `tinted`, `dot` |
| `Tabs` | `variant` `nav` / `solid` / `label`; item `icon`, `countTone`, `disabled`, `title`, `hideBelow` |
| `SegmentedControl` | `variant="label"` (compact mono, for toolbars) |
| `Button` | `size` `xs` / `ms`; `variant` `raised` / `slate` |
| `IconButton` | `size="ms"` (36px) |
| `Badge` | `shape="pill"`, `outlined`, `size="xs"`, tones `subtle` / `container` |
| `TextField` | `variant` (outline/filled/raised), `size` `ms` / `lg`, `width` (auto/full/sm/md/lg), `iconPosition` |
| `Select` | `variant="raised"`, `size="lg"` |
| `Kbd` | `variant="raised"` |
| `Stat` | `variant="tile"`, `iconTone` |
| `MetricTile` | `variant="centered"` |
| `Box` | `tone="container"` |
| `Dot` / `Icon` | `size="lg"` (12px) / `size` `xs` (14px), `ms` (18px) |
| `Avatar` | `size` `ms` (32px), `ml` (40px) |
| `SectionHeader` | `divider`, `metaUppercase` |
| `EmptyState` | `headingLevel` (1–3) |
| `Checkbox` | `size="sm"` |
| `CodeBlock` | `bare`; dark blocks are now a dark theme scope |
| `Countdown` | `variant="chip"` |
| `StatusBar` | `tone="raised"` |
| `UmlClass` | `variant="tinted"`, `headerTone`, `columns` |

<sub>[↑ Back to top](#table-of-contents)</sub>

## Install

```bash
npm install lldlab-ui
```

| Requirement | Version |
|---|---|
| `react`, `react-dom` (peer dependencies) | 19 |
| Tailwind CSS in the app | v4 |

The package is ESM-only and ships TypeScript types.

Runtime dependencies (installed automatically): `react-markdown` and `remark-gfm` (for `Markdown`), `prism-react-renderer` (for `CodeBlock highlight`), and `@dagrejs/dagre` (for `UmlDiagram`). dagre is loaded with a dynamic `import()` only when a `UmlDiagram` renders, so apps that never show a diagram never download it.

<sub>[↑ Back to top](#table-of-contents)</sub>

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

<sub>[↑ Back to top](#table-of-contents)</sub>

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
| `ButtonVariant` | `primary` · `secondary` · `subtle` · `ghost` · `danger` · `brand` (cobalt) · `accent` (crimson call to action, not destructive) |

### Light and dark scopes

```tsx
<Theme tone="dark">
  <Workbench … />       {/* everything inside uses the dark palette */}
  <Theme tone="light">…</Theme>   {/* nested scopes reset */}
</Theme>
```

Components use semantic tokens only, so every component works in both scopes. A `Dialog` renders in a portal, and still takes the theme of the element that opened it.

---

<sub>[↑ Back to top](#table-of-contents)</sub>

## Components

In the tables, **Req.** marks required props, and the default is given where one exists. Every component also forwards the native props of its root element, except `className` and `style`.

### Component index

| Component | Group | Use it for |
|---|---|---|
| [`Theme`](#theme) | Layout | Scope light/dark tokens for a subtree |
| [`Box`](#box) | Layout | Generic surface: padding, tone, radius, border |
| [`Stack`](#stack) | Layout | Flex row/column with gaps |
| [`Grid`](#grid) | Layout | Responsive CSS grid |
| [`Container`](#container) | Layout | Centred page column with fluid gutters |
| [`Section`](#section) | Layout | Full-width page band |
| [`Split`](#split) | Layout | Main content + aside (+ optional start rail) |
| [`AppBar`](#appbar) | Layout | Sticky site/app header |
| [`Show`](#show) | Layout | Show only above/below a breakpoint |
| [`Divider`](#divider) | Layout | Horizontal/vertical rule, "or" divider |
| [`Text`](#text) | Typography | Body, label and code text |
| [`Heading`](#heading) | Typography | h1–h4 with fluid sizes |
| [`Eyebrow`](#eyebrow) | Typography | Pill label above a heading |
| [`Code`](#code) | Typography | Inline code |
| [`CodeBlock`](#codeblock) | Typography | Code block with highlighting |
| [`TextLink`](#textlink) | Typography | Inline text link |
| [`Markdown`](#markdown) | Typography | Safe markdown rendering |
| [`Icon`](#icon) | Display | Material Symbols icon |
| [`Dot`](#dot) | Display | Status dot |
| [`Badge`](#badge) | Display | Small status/label pill |
| [`Chip`](#chip) | Display | Removable tag |
| [`Stat`](#stat) | Display | Icon + label + value |
| [`ProgressBar`](#progressbar) | Display | Labelled progress |
| [`SectionHeader`](#sectionheader) | Display | Header row for a group |
| [`Callout`](#callout) | Display | Tinted notice box |
| [`ResultRow`](#resultrow) | Display | Test result / review row |
| [`Message`](#message) | Display | Loading/empty/error line |
| [`EmptyState`](#emptystate) | Display | Empty, 404 and error blocks |
| [`CheckList`](#checklist) | Display | List with check (or cross) icons |
| [`Card`](#card) | Display | Card with header/media/footer slots |
| [`IconTile`](#icontile) | Display | Icon in a tinted tile |
| [`Skeleton`](#skeleton) | Display | Loading placeholder |
| [`Table`](#table) | Display | Semantic, scrollable table |
| [`DescriptionList`](#descriptionlist) | Display | Term / detail pairs |
| [`Timeline`](#timeline) | Display | Steps and events with status |
| [`BarChart`](#barchart) | Display | Small accessible bar chart |
| [`VerdictBanner`](#verdictbanner) | Display | Result hero ("Accepted") |
| [`TerminalOutput`](#terminaloutput) | Display | Toned log output |
| [`DiffViewer`](#diffviewer) | Display | Unified/split line diff |
| [`Overlay`](#overlay) | Display | Blur and lock content (gates) |
| [`Button`](#button) | Inputs and interaction | Buttons and link buttons |
| [`IconButton`](#iconbutton) | Inputs and interaction | Icon-only button or link |
| [`Kbd`](#kbd) | Inputs and interaction | Keyboard hint |
| [`TextField`](#textfield) | Inputs and interaction | Labelled text input |
| [`Select`](#select) | Inputs and interaction | Native select |
| [`Tabs`](#tabs) | Inputs and interaction | Tablist or nav tabs |
| [`SegmentedControl`](#segmentedcontrol) | Inputs and interaction | Single-choice pills |
| [`Dialog`](#dialog) | Inputs and interaction | Modal dialog |
| [`Menu`](#menu) | Inputs and interaction | Menu button |
| [`Checkbox`](#checkbox) | Inputs and interaction | Labelled checkbox |
| [`Switch`](#switch) | Inputs and interaction | On/off switch |
| [`Disclosure`](#disclosure) | Inputs and interaction | Expandable region |
| [`CopyButton`](#copybutton) | Inputs and interaction | Copy text to clipboard |
| [`Tooltip`](#tooltip) | Inputs and interaction | Short hover/focus hint |
| [`NavList`](#navlist) | Navigation and overlays | Sidebar / table of contents |
| [`Pagination`](#pagination) | Navigation and overlays | Page navigation |
| [`Drawer`](#drawer) | Navigation and overlays | Slide-over panel (mobile nav) |
| [`CommandPalette`](#commandpalette) | Navigation and overlays | ⌘K search palette |
| [`Toaster`](#toaster) | Navigation and overlays | Toast notifications (useToast) |
| [`Workbench`](#workbench) | IDE shell | Resizable IDE layout |
| [`FileTree`](#filetree) | IDE shell | Keyboard file tree |
| [`EditorTabs`](#editortabs) | IDE shell | Open-file tabs |
| [`Breadcrumbs`](#breadcrumbs) | IDE shell | Breadcrumb trail |
| [`StatusBar`](#statusbar) | IDE shell | IDE status bar |
| [`MetricTile`](#metrictile) | IDE shell | Label + big value |
| [`Avatar`](#avatar) | IDE shell | User avatar |
| [`AvatarGroup`](#avatargroup) | IDE shell | Overlapping avatars |
| [`Countdown`](#countdown) | IDE shell | Countdown / elapsed timer |
| [`UmlClass`](#umlclass) | IDE shell | UML class box |
| [`UmlDiagram`](#umldiagram) | IDE shell | Auto-laid-out class diagram |

<sub>[↑ Back to top](#table-of-contents)</sub>

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
| `dimmed` | `boolean`: greys the content out and makes it `inert` (for example, a panel waiting on a runtime) | `false` |

`tone="inverse"` also switches its contents to the dark tokens (`data-theme="dark"`), so text and badges inside stay readable.

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

`tone="inverse"` scopes the dark tokens for its contents, like `Box`.

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
| `sticky` | `boolean`: the aside (and `start`) stick while scrolling | `false` |
| `stickyOffset` | `'none' \| 'appbar'`: `appbar` sticks below a 64px `AppBar` | `'none'` |
| `start` | `ReactNode`: a leading rail (e.g. a table of contents), shown from `lg`. With it the layout is 3 / 9 columns from `lg` and 2 / 7 / 3 from `xl`, and `ratio` is ignored | none |
| `gap` | `Responsive<Space>` | `'lg'` |

```tsx
<Split aside={<ProgressCard />} sticky>
  <ProblemList />
</Split>
```

#### `AppBar`

A site or app header bar with `start`, `center` and `end` slots.

| Prop | Type | Default |
|---|---|---|
| `start` | `ReactNode` (logo) | none |
| `center` | `ReactNode` (navigation, search) | none |
| `end` | `ReactNode` (actions, account) | none |
| `position` | `'sticky' \| 'fixed' \| 'static'` | `'sticky'` |
| `height` | `'sm' \| 'md'` (48px / 64px) | `'md'` |
| `blur` | `boolean`: translucent background with backdrop blur | `true` |
| `contained` | `boolean`: constrain the content to the 80rem page column | `true` |

```tsx
<AppBar start={<Logo />} center={<Tabs label="Site" value="problems" items={navTabs} />} end={<IconButton icon="notifications" label="Notifications" />} />
```

#### `Show`

Renders its children only above or only below a breakpoint. It uses `display: contents`, so it adds no box to the layout. Pass exactly one of `above` or `below`.

| Prop | Type |
|---|---|
| `above` | `'sm' \| 'md' \| 'lg' \| 'xl'`: render from this breakpoint up |
| `below` | `'sm' \| 'md' \| 'lg' \| 'xl'`: render only below this breakpoint |
| `children` **Req.** | `ReactNode` |

```tsx
<Show above="lg"><Tabs … /></Show>
<Show below="lg"><IconButton icon="menu" label="Open menu" onClick={openDrawer} /></Show>
```

#### `Divider`

A horizontal or vertical rule, optionally with a centred label (the "or" divider).

| Prop | Type | Default |
|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `label` | `ReactNode` (horizontal only) | none |
| `spacing` | `Space`: margin on both sides of the rule | `'none'` |

```tsx
<Divider label="or" spacing="md" />
```

<sub>[↑ Back to top](#table-of-contents)</sub>

### Typography

#### `Text`

Body text. Polymorphic, default `p`.

| Prop | Type | Default |
|---|---|---|
| `variant` | `'body-lead' \| 'body-md' \| 'body-sm' \| 'label' \| 'code' \| 'inherit'` (`inherit` keeps the parent's font and size, e.g. a highlighted word inside a `Heading`) | `'body-md'` |
| `tone` | `Tone` | `'default'` |
| `weight` | `'regular' \| 'medium' \| 'semibold'` | `'regular'` |
| `truncate` | `boolean`: a single line with an ellipsis | `false` |
| `clamp` | `1 \| 2 \| 3 \| 4`: the number of lines before an ellipsis | none |
| `align` | `'start' \| 'center' \| 'end'` | none |
| `measure` | `boolean`: limit the line length to a readable width | `false` |
| `uppercase` | `boolean` | `true` for `label`, `false` otherwise |

`label` is JetBrains Mono in uppercase. Long words wrap instead of overflowing.

```tsx
<Text variant="body-sm" tone="muted" clamp={2}>{summary}</Text>
```

#### `Heading`

| Prop | Type | Default |
|---|---|---|
| `level` **Req.** | `1 \| 2 \| 3 \| 4`: which element (`h1`–`h4`) | none |
| `size` | `Responsive<HeadingSize>` | from the level: 1→`xl`, 2→`lg`, 3→`md`, 4→`sm` |
| `tone` | `'default' \| 'muted' \| 'brand' \| 'inverse' \| 'success' \| 'danger' \| 'warning'` | `'default'` |
| `truncate` | `boolean`: a single line with an ellipsis | `false` |
| `align` | `'start' \| 'center'` | `'start'` |

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
| `pulse` | `boolean`: pulsing dot | `false` |
| `variant` | `'pill' \| 'plain'` (`plain` has no border or background) | `'pill'` |

#### `Code`

Inline code. Props: `children`.

#### `CodeBlock`

A code block. It scrolls horizontally inside itself, so long lines never widen the page, and it is keyboard-focusable so the scroll area can be reached.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` (the code; a `string` for `highlight` and `lineNumbers`) | none |
| `language` | `string`: the language, shown as the caption when there's no `title` | none |
| `highlight` | `boolean`: syntax highlighting for `ts`, `tsx`, `js`, `jsx`, `python`, `go`, `java`, `json` and `bash`. Unknown languages and non-string children fall back to plain text | `false` |
| `title` | `ReactNode`: header text, such as a file name | none |
| `meta` | `ReactNode`: next to the title, such as a `Badge` | none |
| `actions` | `ReactNode`: right side of the header, such as a `CopyButton` | none |
| `lineNumbers` | `boolean` | `false` |
| `tone` | `'dark' \| 'subtle'` (`subtle` is a light surface in the light theme) | `'dark'` |

```tsx
<CodeBlock language="go" highlight lineNumbers title="lot.go" actions={<CopyButton value={code} />}>{code}</CodeBlock>
```

#### `TextLink`

An inline text link. Polymorphic, default `a`.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `'brand' \| 'default' \| 'muted' \| 'danger' \| 'success' \| 'warning'` | `'brand'` |
| `size` | `'sm' \| 'md'` | `'md'` |
| `icon` / `iconRight` | `string` | none |
| `underline` | `'hover' \| 'always' \| 'none'` | `'hover'` |

```tsx
<TextLink as={Link} href="/patterns" iconRight="arrow_forward">View all patterns</TextLink>
```

#### `Markdown`

Renders GitHub-flavoured Markdown with library styles: headings, lists, task lists as check icons, inline and block code, tables in a horizontal scroller, links and blockquotes.

| Prop | Type |
|---|---|
| `children` **Req.** | `string` (the markdown source) |

Raw HTML in the source is **not** rendered, and `javascript:` links are stripped. That makes it safe for user- or admin-authored content.

```tsx
<Markdown>{problem.statement}</Markdown>
```

<sub>[↑ Back to top](#table-of-contents)</sub>

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
| `icon` | `string`: a leading icon | none |
| `dot` | `StatusTone`: a leading status dot | none |
| `pulse` | `boolean`: pulses the dot | `false` |

```tsx
<Badge tone="success" uppercase>Beginner</Badge>
```

#### `Chip`

An outlined tag, such as a pattern category. It can be removable.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `string` | none |
| `tone` | `'neutral' \| 'brand' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `icon` | `string` | none |
| `dot` | `StatusTone` or any CSS colour (e.g. a language's brand colour `"#00ADD8"`) | none |
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
| `label` **Req.** | `ReactNode`: the visible label, which also names the bar | none |
| `value` **Req.** | `number` | none |
| `max` | `number` | `100` |
| `tone` | `'brand' \| 'success' \| 'warning' \| 'danger'` | `'brand'` |
| `hideLabel` | `boolean`: keeps the label for screen readers only | `false` |
| `valueLabel` | `ReactNode`: replaces the percentage, e.g. "7 of 12" | the percentage |
| `caption` | `ReactNode`: a line below the bar | none |
| `size` | `'sm' \| 'md'` (4px / 6px bar) | `'md'` |

`value` is clamped to `0…max`. A `max` of 0 or less shows 0%.

```tsx
<ProgressBar label="Creational" value={3} max={5} tone="success" />
```

#### `SectionHeader`

A header row for a group of items: icon, dot, heading, tag, a right-aligned meta line and an optional description.

| Prop | Type | Default |
|---|---|---|
| `title` **Req.** | `ReactNode` | none |
| `level` | `2 \| 3` | `2` |
| `size` | `'sm' \| 'md'` (the heading size) | `'sm'` |
| `dot` | `StatusTone` | none |
| `icon` | `string`: shown in an `IconTile` | none |
| `tag` | `ReactNode`: shown as an uppercase badge | none |
| `tagTone` | `BadgeTone` | `'neutral'` |
| `meta` | `ReactNode` | none |
| `description` | `ReactNode`: a full-width line below | none |
| `accent` | `StatusTone`: a 2px coloured underline instead of the hairline | none |

#### `Callout`

A tinted notice box. By default `danger` is announced as an alert, and the other tones as a status. Set `live={false}` for static content such as pros and cons.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` | none |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| `title` | `ReactNode` | none |
| `action` | `ReactNode`, such as a `Button` | none |
| `live` | `boolean`: announce as alert/status | `true` |
| `icon` | `string`: overrides the tone's icon | tone icon |
| `size` | `'sm' \| 'md'` (`sm` suits inline form errors) | `'md'` |
| `accent` | `boolean`: a thick left border | `false` |

#### `ResultRow`

One test result, review item or submission row. The status icon carries an accessible name: "Passed", "Failed", "Warning" or "Pending".

| Prop | Type | Default |
|---|---|---|
| `status` **Req.** | `'pass' \| 'fail' \| 'warning' \| 'pending'` | none |
| `title` **Req.** | `ReactNode` | none |
| `detail` | `ReactNode`: monospace, keeps line breaks | none |
| `meta` | `ReactNode`, such as a duration | none |
| `badge` | `ReactNode`: trailing, such as a category `Badge` | none |
| `variant` | `'plain' \| 'boxed'` | `'plain'` |
| `selected` | `boolean`: a cobalt left accent | `false` |
| `titleMono` | `boolean`: monospace title (test names) | `false` |

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
| `media` | `ReactNode`: an illustration that replaces the icon | none |
| `code` | `string`: a large mono numeral such as `"404"`, replacing the icon | none |
| `tone` | `'default' \| 'danger'` | `'default'` |

#### `CheckList`

| Prop | Type |
|---|---|
| `items` **Req.** | `ReactNode[]`, each rendered with the icon |
| `icon` | `string` (default `'check'`; use `'close'` for a cons list) |
| `tone` | `Tone` (default `'success'`) |

#### `Card`

A bordered, rounded surface. Polymorphic, default `div`.

| Prop | Type | Default |
|---|---|---|
| `padding` | `Responsive<Space>`: the body padding | `'lg'` |
| `tone` | `'default' \| 'subtle' \| 'inverse'` (`inverse` is a dark obsidian card that also switches its contents to the dark tokens) | `'default'` |
| `pattern` | `'none' \| 'dots' \| 'grid'`: background pattern | `'none'` |
| `interactive` | `boolean`: hover shadow and focus ring, for link cards | `false` |

Sub-components:

- **`Card.Header`** is always rendered first, as a tinted header bar with `start` and `end` slots (or `children` in place of `start`).
- **`Card.Media`** comes next, edge to edge.

  | Prop | Type | Default |
  |---|---|---|
  | `pattern` | `'none' \| 'dots' \| 'grid'` | `'dots'` |
  | `aspect` | `'video' \| 'wide' \| 'square'` | `'video'` |
  | `height` | `'sm' \| 'md'` (120px / 140px), instead of `aspect` | none |
  | `caption` | `ReactNode`: a small corner label, e.g. "UML schema" | none |
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

#### `IconTile`

An icon in a tinted square or circle.

| Prop | Type | Default |
|---|---|---|
| `icon` **Req.** | `string` | none |
| `tone` | `'neutral' \| 'brand' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` (32, 40, 48, 56px) | `'md'` |
| `shape` | `'square' \| 'circle'` | `'square'` |
| `filled` | `boolean`: a solid tile with inverted colours | `false` |
| `label` | `string`: makes it an image with this name (otherwise decorative) | none |

#### `Skeleton`

A shimmering loading placeholder. It is hidden from assistive tech: pair it with a `Message` that says what is loading. The shimmer stops under `prefers-reduced-motion`.

| Prop | Type | Default |
|---|---|---|
| `shape` | `'line' \| 'pill' \| 'rect' \| 'circle'` | `'line'` |
| `width` | `'full' \| '3/4' \| '1/2' \| '1/3' \| '1/4'` (ignored for circles) | `'full'` |
| `height` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | per shape |
| `lines` | `number`: render that many text lines, the last one shorter | none |

```tsx
<Message>Loading problems…</Message>
<Skeleton lines={3} />
```

#### `Table`

A semantic table inside a focusable horizontal scroller, so wide tables never widen the page.

| Prop | Type | Default |
|---|---|---|
| `caption` **Req.** | `string`: names the table and its scroll region | none |
| `columns` **Req.** | `{ key: string; header: ReactNode; align?: 'start' \| 'end'; mono?: boolean; width?: 'auto' \| 'min' }[]` | none |
| `rows` **Req.** | `Record<string, ReactNode>[]` (keyed by column `key`) | none |
| `rowKey` | `(row, index) => string` | the index |
| `showCaption` | `boolean`: show the caption visually (it is always read by screen readers) | `false` |
| `density` | `'compact' \| 'normal'` | `'normal'` |
| `empty` | `ReactNode`: shown when `rows` is empty | `'No rows'` |

```tsx
<Table caption="Participants" columns={[{ key: 'name', header: 'Participant', mono: true }, { key: 'role', header: 'Responsibility' }]} rows={participants} />
```

#### `DescriptionList`

Term and detail pairs (`<dl>`).

| Prop | Type | Default |
|---|---|---|
| `items` **Req.** | `{ term: ReactNode; detail: ReactNode }[]` | none |
| `layout` | `'stacked' \| 'inline'` (`inline` puts term and detail side by side from `sm`) | `'stacked'` |
| `mono` | `boolean`: monospace details | `false` |

#### `Timeline`

A vertical list of steps or events with status markers. Each status is also spoken ("Completed:", "Locked:"…), so colour is never the only signal. The `current` item gets `aria-current="step"`.

| Prop | Type |
|---|---|
| `label` **Req.** | `string` |
| `items` **Req.** | `{ id: string; status: 'done' \| 'current' \| 'locked' \| 'success' \| 'warning' \| 'danger' \| 'pending'; title: ReactNode; badge?: ReactNode; description?: ReactNode; meta?: ReactNode }[]` |

```tsx
<Timeline label="Learning track" items={[{ id: '1', status: 'done', title: 'Parking lot' }, { id: '2', status: 'current', title: 'Elevator' }]} />
```

#### `BarChart`

A small CSS bar chart. The chart is an image with a summary as its name, and the values are also in a visually hidden table.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `bars` **Req.** | `{ value: number; label?: string }[]` | none |
| `highlight` | `number`: index of the bar to emphasise (others are greyed) | none |
| `highlightLabel` | `string`: shown above the highlighted bar | none |
| `axis` | `[ReactNode, ReactNode, ReactNode]`: start, middle and end labels | none |
| `height` | `'sm' \| 'md'` | `'md'` |
| `tone` | `'brand' \| 'success'` | `'brand'` |

#### `VerdictBanner`

A result hero, such as "Accepted". It stacks below `md` and becomes a row from `md`.

| Prop | Type |
|---|---|
| `tone` **Req.** | `'success' \| 'danger' \| 'warning'` |
| `icon` **Req.** | `string` |
| `title` **Req.** | `ReactNode` |
| `badge` | `ReactNode` |
| `meta` | `ReactNode[]`: short facts separated by dividers |
| `actions` | `ReactNode` |

```tsx
<VerdictBanner tone="success" icon="check" title="Accepted" meta={['41ms', '1.4 MB', 'attempt #3']} actions={<Button variant="brand">Next Problem</Button>} />
```

#### `TerminalOutput`

A dark, focusable log (`role="log"`) with toned lines. It scrolls inside itself and wraps long lines.

| Prop | Type | Default |
|---|---|---|
| `lines` **Req.** | `{ kind: 'command' \| 'plain' \| 'error' \| 'warning' \| 'hint' \| 'success'; text: string }[]` | none |
| `title` | `ReactNode` | none |
| `status` | `ReactNode`: right side of the header, e.g. a `Badge` | none |
| `maxHeight` | `'sm' \| 'md' \| 'lg' \| 'none'` | `'md'` |

#### `DiffViewer`

A line diff of two strings. Added and removed lines are coloured, carry a +/− sign and are announced as "added:" or "removed:".

| Prop | Type | Default |
|---|---|---|
| `oldValue` **Req.** | `string` | none |
| `newValue` **Req.** | `string` | none |
| `oldTitle` / `newTitle` | `ReactNode` | none |
| `mode` | `'unified' \| 'split'` (`split` falls back to unified below `lg`) | `'unified'` |

#### `Overlay`

Covers content with a blurred, dimmed layer, for example a signed-out gate. The covered content is `inert` and hidden from assistive tech.

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `ReactNode` (the covered content) | none |
| `overlay` **Req.** | `ReactNode` (what shows on top) | none |
| `blur` | `boolean` | `true` |

<sub>[↑ Back to top](#table-of-contents)</sub>

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
| `iconTone` | `Tone`: colour of `icon` | none |
| `iconFilled` | `boolean`: filled `icon` | `false` |
| `leading` | `ReactNode`: custom leading content, such as a brand logo; replaces `icon` | none |
| `fullWidth` | `boolean` | `false` |
| `loading` | `boolean`: disables the button, shows a spinner and sets `aria-busy` | `false` |
| `disabled` | `boolean` | `false` |

As a native button it defaults to `type="button"`; pass `type="submit"` for forms. When rendered through `as` (for example as a link), `disabled` sets `aria-disabled` and blocks pointer events. `ref` is forwarded.

```tsx
<Button variant="secondary" size="sm" icon="play_arrow" onClick={run}>Run</Button>
<Button type="submit" loading={saving}>Save</Button>
```

#### `IconButton`

A square, icon-only button. Polymorphic, default `button`, so it can also be a link (`as={Link} href=…`).

| Prop | Type | Default |
|---|---|---|
| `icon` **Req.** | `string` | none |
| `label` **Req.** | `string`: the accessible name and tooltip. Include what `dot`/`badge` mean, e.g. "Notifications, 3 unread" | none |
| `variant` | `'ghost' \| 'subtle' \| 'secondary' \| 'primary'` | `'ghost'` |
| `size` | `'xs' \| 'sm' \| 'md'` (24, 32, 40px; at least 44px below `md`) | `'md'` |
| `dot` | `StatusTone`: a small corner dot | none |
| `badge` | `ReactNode`: a corner count | none |

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
| `labelEnd` | `ReactNode`: at the end of the label row, e.g. a "Forgot password?" `TextLink` | none |
| `revealable` | `boolean`: a password field with a show/hide toggle | `false` |
| `size` | `'sm' \| 'md'` (32px / 40px) | `'md'` |

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

`TabItem`: `{ id: string; label: ReactNode; count?: number; badge?: ReactNode; dot?: StatusTone; href?: string; as?: ElementType; panelId?: string }`

`badge` shows a non-numeric count such as `<Badge tone="warning">6/8 Passing</Badge>`.

It has two modes:

- **Tablist** (no item has `href`): an ARIA tablist. Arrow keys, Home and End move between tabs and select them. Give each item a `panelId` and render `<TabPanel id={panelId} active={value === item.id}>` for its content; the tab and panel are linked with `aria-controls` / `aria-labelledby`.
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
| `options` **Req.** | `{ value: string; label: string; icon?: string; hideLabel?: boolean; dot?: StatusTone }[]` (`hideLabel` shows only the icon; `label` stays the accessible name) |
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
- **Theme:** the dialog uses the tone of the `<Theme>` it is rendered inside, even though it portals to `document.body`.
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
| `items` **Req.** | `(MenuItem \| { type: 'separator' })[]` | none |
| `header` | `ReactNode`: above the items, e.g. the signed-in user | none |
| `footer` | `ReactNode`: below the items | none |
| `align` | `'start' \| 'end'`: which edge of the trigger the menu aligns to | `'end'` |

`MenuItem`: `{ label: string; icon?: string; onSelect?: () => void; href?: string; as?: ElementType; tone?: 'default' | 'danger'; meta?: ReactNode; shortcut?: string }`

Separators are skipped by the keyboard.

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

#### `Checkbox`

A labelled native checkbox. All `<input>` props are forwarded (`checked`, `defaultChecked`, `onChange`…).

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `ReactNode` | none |
| `description` | `ReactNode` | none |
| `strikeWhenChecked` | `boolean`: strike the label through when checked (task lists) | `false` |
| `indeterminate` | `boolean` | `false` |

#### `Switch`

An on/off switch (`role="switch"`).

| Prop | Type |
|---|---|
| `label` **Req.** | `string` |
| `checked` **Req.** | `boolean` |
| `onChange` **Req.** | `(checked: boolean) => void` |
| `description` | `ReactNode` |

#### `Disclosure`

A button that shows and hides a region, for example an expandable test row.

| Prop | Type | Default |
|---|---|---|
| `summary` **Req.** | `ReactNode`: the button content (keep it free of other interactive elements) | none |
| `children` **Req.** | `ReactNode` (the revealed content) | none |
| `open` / `onOpenChange` | controlled state | none |
| `defaultOpen` | `boolean` (uncontrolled) | `false` |
| `variant` | `'plain' \| 'row'` | `'plain'` |
| `selected` | `boolean`: a cobalt left accent | `false` |

```tsx
<Disclosure variant="row" summary={<ResultRow status="fail" title="TestParkConcurrent" titleMono />}>
  <TerminalOutput lines={log} />
</Disclosure>
```

#### `CopyButton`

Copies text to the clipboard and confirms for 2 seconds. A failure shows "Copy failed" and never throws.

| Prop | Type | Default |
|---|---|---|
| `value` **Req.** | `string` | none |
| `label` | `string` | `'Copy'` |
| `copiedLabel` | `string` | `'Copied'` |
| `size` | `'sm' \| 'md'` | `'sm'` |
| `variant` | `ButtonVariant` | `'secondary'` |

#### `Tooltip`

A short, non-interactive hint for its child (the trigger). It shows on hover or focus after `delay`, hides on leave, blur or Escape, and flips to stay on screen. Never put essential information only in a tooltip.

| Prop | Type | Default |
|---|---|---|
| `content` **Req.** | `ReactNode` | none |
| `children` **Req.** | one element (the trigger) | none |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `delay` | `number` (ms) | `400` |

```tsx
<Tooltip content="Reset zoom to 100%"><IconButton icon="fit_screen" label="Reset zoom" /></Tooltip>
```

<sub>[↑ Back to top](#table-of-contents)</sub>

### Navigation and overlays

#### `NavList`

Vertical navigation: an app sidebar or an in-page table of contents. The current item gets `aria-current`.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `items` **Req.** | `{ id: string; label: ReactNode; icon?: string; href?: string; as?: ElementType; count?: ReactNode; onSelect?: () => void }[]` | none |
| `current` | `string`: the current item `id` | none |
| `heading` | `ReactNode`: a small label above the list | none |
| `variant` | `'sidebar' \| 'toc'` | `'sidebar'` |

```tsx
<NavList label="On this page" variant="toc" current="structure" items={[{ id: 'intent', label: '1. Intent', href: '#intent' }, { id: 'structure', label: '2. Structure', href: '#structure' }]} />
```

#### `Pagination`

Page navigation with first/last pages, a window around the current page and `…` gaps. Out-of-range pages are clamped, and nothing renders for a single page. Below `md` it shows "‹ 3 / 12 ›".

| Prop | Type | Default |
|---|---|---|
| `page` **Req.** | `number` (1-based) | none |
| `pageCount` **Req.** | `number` | none |
| `onChange` **Req.** | `(page: number) => void` | none |
| `siblingCount` | `number`: pages shown on each side of the current one | `1` |
| `summary` | `ReactNode`, e.g. "Showing 12 of 142" | none |
| `label` | `string` | `'Pagination'` |

#### `Drawer`

A modal slide-over panel, for example the mobile navigation. It has the same focus trap, Escape, scroll lock, focus restore and theme behaviour as `Dialog`.

| Prop | Type | Default |
|---|---|---|
| `open` **Req.** | `boolean` | none |
| `onClose` **Req.** | `() => void` | none |
| `title` **Req.** | `ReactNode` | none |
| `side` | `'left' \| 'right'` | `'left'` |
| `size` | `'sm' \| 'md'` | `'sm'` |
| `children` | `ReactNode` | none |

#### `CommandPalette`

A ⌘K search palette: a dialog with a combobox over grouped results. You do the filtering: pass the matching `groups` for the current `query`. Up and Down move through results, Enter selects and closes, and Escape closes.

| Prop | Type | Default |
|---|---|---|
| `open` **Req.** | `boolean` | none |
| `onClose` **Req.** | `() => void` | none |
| `query` **Req.** | `string` | none |
| `onQueryChange` **Req.** | `(query: string) => void` | none |
| `groups` **Req.** | `{ label: string; items: { id: string; label: ReactNode; icon?: string; meta?: ReactNode; onSelect: () => void }[] }[]` | none |
| `placeholder` | `string` | `'Search…'` |
| `emptyText` | `ReactNode` | `'No results'` |
| `label` | `string` | `'Command palette'` |

#### `Toaster`

Notification toasts. Mount `<Toaster />` once at the app root, then call `useToast().show(…)` from anywhere; toasts shown before the Toaster mounts appear once it does. Toasts are announced politely, pause while hovered or focused, and can be dismissed.

`useToast()` returns `{ show(options): number, dismiss(id) }`, where `options` is `{ title: ReactNode; description?: ReactNode; tone?: 'default' | 'success' | 'danger'; action?: ReactNode; duration?: number }` (default 4000ms; `Infinity` stays until dismissed).

```tsx
const { show } = useToast();
show({ title: 'Solution saved', tone: 'success' });
```

<sub>[↑ Back to top](#table-of-contents)</sub>

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

`FileNode`: `{ path: string; kind: 'file' | 'dir'; readOnly?: boolean; modified?: boolean; icon?: string; status?: 'success' | 'warning' | 'danger' | 'info'; meta?: ReactNode }`

`icon` overrides the extension icon, `status` adds a named status icon ("Passing", "Failing"…), and `meta` shows trailing text such as a line count.

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
| `tone` | `'neutral' \| 'brand' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `icon` | `string` | none |
| `hint` | `ReactNode`: a line under the value, e.g. "Beats 82.4%" | none |
| `hintTone` | `Tone` | `'muted'` |

#### `Avatar`

| Prop | Type | Default |
|---|---|---|
| `name` **Req.** | `string`: used for the initials and the accessible name | none |
| `src` | `string`: the image. If it's missing or fails to load, initials show instead | none |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `badge` | `ReactNode`, such as a score, shown at the corner | none |
| `shape` | `'circle' \| 'square'` | `'circle'` |
| `tone` | `'ink' \| 'brand' \| 'success' \| 'warning' \| 'danger'` (initials background) | `'ink'` |
| `status` | `StatusTone`: a presence dot | none |
| `statusLabel` | `string`: added to the name, e.g. "online", so the dot isn't colour-only | none |

#### `AvatarGroup`

Overlapping avatars, with any beyond `max` collapsed into "+N".

| Prop | Type | Default |
|---|---|---|
| `children` **Req.** | `Avatar` elements | none |
| `max` | `number` | all |
| `size` | `'sm' \| 'md' \| 'lg'` (applied to every avatar) | `'md'` |
| `label` | `string`: the group's accessible name | none |

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

#### `UmlClass`

A UML class box: name (with an optional «stereotype»), attributes and methods.

| Prop | Type | Default |
|---|---|---|
| `name` **Req.** | `string` | none |
| `stereotype` | `string`, e.g. `'interface'` | none |
| `attributes` | `string[]` | `[]` |
| `methods` | `string[]` | `[]` |
| `tag` | `ReactNode`: under the name | none |
| `emphasis` | `'default' \| 'brand' \| 'strong'` (border weight and colour) | `'default'` |
| `size` | `'sm' \| 'md'` | `'md'` |
| `dashed` | `boolean` | `false` |

#### `UmlDiagram`

A class diagram laid out automatically (dagre), with UML relationship arrows, zoom and pan. Screen readers get a text description of every class and relationship.

| Prop | Type | Default |
|---|---|---|
| `label` **Req.** | `string` | none |
| `nodes` **Req.** | `{ id: string; name: string; stereotype?; attributes?; methods?; tag?; emphasis?; dashed? }[]` | none |
| `edges` **Req.** | `{ from: string; to: string; kind: 'association' \| 'dependency' \| 'realization' \| 'inheritance' \| 'aggregation' \| 'composition'; label?: string; fromMultiplicity?: string; toMultiplicity?: string }[]` | none |
| `direction` | `'TB' \| 'LR'` | `'TB'` |
| `zoomable` | `boolean`: zoom buttons (50–200%) | `true` |
| `compact` | `boolean`: small inline diagram, no zoom controls, scaled to fit the width | `false` |
| `pattern` | `'dots' \| 'none'` | `'dots'` |

- **Layout:** the class boxes are measured, then laid out after mount (safe with server rendering). A simple wrapped grid shows until the layout is ready.
- **Pan:** the diagram scrolls inside itself; focus it and use the arrow keys, or scroll.
- **Arrows:** association and dependency use an open arrow (dependency dashed), inheritance and realization a hollow triangle (realization dashed), aggregation a hollow diamond and composition a filled diamond at the `from` end.

```tsx
<UmlDiagram
  label="Strategy pattern"
  nodes={[{ id: 'ctx', name: 'PricingContext' }, { id: 's', name: 'Strategy', stereotype: 'interface' }, { id: 'h', name: 'HourlyStrategy' }]}
  edges={[{ from: 'ctx', to: 's', kind: 'aggregation' }, { from: 'h', to: 's', kind: 'realization' }]}
/>
```

---

<sub>[↑ Back to top](#table-of-contents)</sub>

## Mobile navigation

Every header hides its navigation below a breakpoint and opens a `Drawer` instead. With `Show` this needs no custom CSS:

```tsx
const [open, setOpen] = useState(false);

<AppBar
  start={<Logo />}
  center={<Show above="lg"><Tabs label="Site" value={current} items={navTabs} /></Show>}
  end={<Show below="lg"><IconButton icon="menu" label="Open menu" onClick={() => setOpen(true)} /></Show>}
/>
<Drawer open={open} onClose={() => setOpen(false)} title="LLD Lab">
  <NavList label="Site" items={navItems} current={current} />
</Drawer>
```

For sticky side rails under a sticky `AppBar`, use `Split sticky stickyOffset="appbar"`.

<sub>[↑ Back to top](#table-of-contents)</sub>

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
| Code (syntax highlighting) | `--color-code-{keyword,string,number,comment,function,type,punctuation,plain}`, `--color-code-bg-subtle`; the `code-subtle` utility swaps them for a light surface |
| Diff | `--color-diff-{add,del}-{bg,fg}` |
| App bar | `--spacing-appbar` (4rem, the md `AppBar` height used by `stickyOffset="appbar"`) |
| Utilities | `bg-pattern-dots`, `bg-pattern-grid`, `icon-filled`, `skeleton-shimmer` |

Every token under Surfaces, Text, Status text, Borders and Badges changes inside `[data-theme="dark"]`. `<Theme tone="dark">` renders that attribute, and so do `Card`, `Box` and `Section` with `tone="inverse"`.

<sub>[↑ Back to top](#table-of-contents)</sub>

## Accessibility

- **Interactive widgets:** they follow the WAI-ARIA Authoring Practices.
  - `Tabs` is a tablist, `SegmentedControl` a radio group, and `Menu` a menu button.
  - `FileTree` is a tree view, and the `Workbench` resize handles are separators with values.
  - `Dialog`, `Drawer` and `CommandPalette` are modal dialogs; `CommandPalette` uses the combobox pattern.
  - `Disclosure` is a disclosure button, `Switch` a switch, `Tooltip` a tooltip, and `Timeline` marks the current step.
- **Accessible names:** icon-only controls require a `label` (`IconButton`), and status icons have names (`ResultRow`).
- **Focus and touch:** focus rings are visible on keyboard focus, and touch targets are at least 44px below `md`.
- **Contrast:** status text colours meet WCAG AA in both themes.
- **CI checks:** every gallery story runs through axe, and critical or serious violations fail the build.

<sub>[↑ Back to top](#table-of-contents)</sub>

## Troubleshooting

| Symptom | Fix |
|---|---|
| Components render unstyled, or some classes are missing | The `@source` path is wrong: resolve it relative to the CSS file. Also check that the app uses Tailwind **v4**. |
| Icons show as words (`play_arrow`) | Load the Material Symbols Outlined stylesheet. |
| Wrong fonts | Set `--font-space-grotesk`, `--font-inter` and `--font-jetbrains-mono`, for example on `<html>` through `next/font`'s `variable` option. |
| TypeScript error on `className` | This is intentional: use a variant prop, or add a variant to the library. |
| Toasts never appear | Mount `<Toaster />` once at the app root. |
| `UmlDiagram` shows boxes in a plain grid | The layout runs after mount; if it never arrives, check that `@dagrejs/dagre` is installed (it's a dependency of `lldlab-ui`). |
| `Workbench` has no height | Give its parent an explicit height, e.g. `h-dvh`, or make it a flex child with `min-h-0 flex-1`. |

<sub>[↑ Back to top](#table-of-contents)</sub>

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

<sub>[↑ Back to top](#table-of-contents)</sub>

## Releasing

```bash
npm version patch      # or minor; 0.x minors may break
git push --follow-tags # the v* tag runs .github/workflows/release.yml
```

The release workflow checks that the tag matches `package.json`, runs the tests, builds, and publishes through **npm Trusted Publishing** (GitHub OIDC) with provenance. No npm token is stored.

<sub>[↑ Back to top](#table-of-contents)</sub>

## License

MIT

<sub>[↑ Back to top](#table-of-contents)</sub>
