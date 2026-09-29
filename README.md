# lldlab-ui

Design-system components for [LLD Lab](https://lldlab.com): React 19 + Tailwind CSS v4, Stitch design tokens, light and dark scopes, responsive by default.

## Install

```bash
npm install lldlab-ui
```

Peer dependencies: `react` and `react-dom` 19. The app must use Tailwind CSS v4.

## Setup

In the app's global stylesheet (e.g. `app/globals.css`):

```css
@import "tailwindcss";
@import "lldlab-ui/theme.css";
@source "../node_modules/lldlab-ui/dist";
```

The components ship Tailwind class names, not CSS. The `@source` line lets the app's Tailwind generate exactly the classes they use, from the same tokens.

### Fonts and icons

The app loads fonts and sets these CSS variables (e.g. with `next/font`'s `variable` option):

| Variable | Font |
|---|---|
| `--font-space-grotesk` | Space Grotesk (display, headlines) |
| `--font-inter` | Inter (body, buttons) |
| `--font-jetbrains-mono` | JetBrains Mono (labels, code) |

`Icon` uses the **Material Symbols Outlined** font by ligature. Load it once, e.g. `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block">`.

## Rules

- **No `className` or `style` props.** Styling changes only through typed variant props. If a page needs a new look, add a variant or a component here.
- **Responsive props.** Layout and size props take one value or a per-breakpoint object: `<Grid cols={{ base: 1, md: 2, xl: 4 }} />`. The breakpoints are `sm` 640, `md` 768, `lg` 1024 and `xl` 1280.
- **Links.** Link-like components take `as`: `<Button as={Link} href="/problems">`.
- **Dark scope.** `<Theme tone="dark">…</Theme>` switches every component inside it. A `Dialog` opened from inside a dark scope stays dark.

## Components

- **Layout:** `Box`, `Stack`, `Grid`, `Container`, `Section`, `Split`, `Theme`
- **Typography:** `Text`, `Heading`, `Eyebrow`, `Code`, `CodeBlock`, `Markdown`
- **Display:** `Card` (`Card.Media`, `Card.Footer`), `Badge`, `Chip`, `Dot`, `Icon`, `Stat`, `ProgressBar`, `SectionHeader`, `Callout`, `ResultRow`, `Message`, `EmptyState`, `CheckList`
- **Inputs:** `Button`, `IconButton`, `TextField`, `Select`, `Tabs`, `SegmentedControl`, `Dialog`, `Menu`, `Kbd`
- **IDE:** `Workbench` (`Workbench.Toggle`), `FileTree`, `EditorTabs`, `Breadcrumbs`, `StatusBar` (`StatusBar.Item`), `MetricTile`, `Avatar`, `Countdown`

Browse them all with `npm run ladle`.

## Development

```bash
npm install
npm test               # unit tests (vitest + jsdom)
npm run typecheck      # includes the no-className type test
npm run ladle          # component gallery on http://localhost:61000
npm run ladle:build && npm run e2e   # every story at 390/768/1024/1440px + axe
npm run package-check  # pack + build a real Next.js consumer
```

## Releasing

```bash
npm version patch      # or minor
git push --follow-tags # the v* tag runs .github/workflows/release.yml (npm Trusted Publishing, with provenance)
```

## License

MIT
