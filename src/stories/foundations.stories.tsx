import type { Story } from '@ladle/react';
import { Box, Code, CodeBlock, Container, Eyebrow, Grid, Heading, Markdown, Section, Split, Stack, Text, Theme } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Foundations' };

export const Typography: Story = () => (
  <Stack gap="md">
    <Eyebrow>Low-level design</Eyebrow>
    <Heading level={1} size="display">Master object-oriented design</Heading>
    <Heading level={2}>Headline large</Heading>
    <Heading level={3}>Headline medium</Heading>
    <Heading level={4}>Headline small</Heading>
    <Heading level={2} size="md">{LONG_WORD}</Heading>
    <Text variant="body-lead">Lead paragraph for hero sections.</Text>
    <Text>Body text with <Code>inline()</Code> code and a {LONG_WORD} word.</Text>
    <Text variant="body-sm" tone="muted">Small muted text.</Text>
    <Text variant="label" tone="brand">Label mono</Text>
    <Stack direction="row" gap="sm" wrap>
      {(['success', 'warning', 'danger', 'brand'] as const).map((t) => <Text key={t} tone={t} weight="semibold">{t}</Text>)}
    </Stack>
    <CodeBlock language="ts">{`class ParkingLot {\n  private readonly spots = new Map<string, Spot>(); // ${LONG_WORD}\n}`}</CodeBlock>
  </Stack>
);

export const Layout: Story = () => (
  <Stack gap="lg">
    <Stack direction={{ base: 'column', md: 'row' }} gap="sm">
      <Box tone="elevated" border="subtle" radius="md" padding="md">Stack item 1</Box>
      <Box tone="elevated" border="subtle" radius="md" padding="md">Stack item 2</Box>
    </Stack>
    <Grid cols={{ md: 2, xl: 4 }}>
      {[1, 2, 3, 4].map((n) => <Box key={n} tone="subtle" radius="md" padding="md">Grid {n}</Box>)}
    </Grid>
    <Split aside={<Box tone="low" radius="md" padding="md">Aside</Box>} sticky>
      <Box tone="elevated" border="subtle" radius="md" padding="lg">Main content</Box>
    </Split>
    <Section tone="subtle" pattern="dots" padding="md">
      <Container size="lg"><Heading level={2}>Section with dots</Heading></Container>
    </Section>
    <Section tone="inverse" pattern="grid" padding="md">
      <Container><Heading level={2} tone="inverse">Inverse section</Heading></Container>
    </Section>
    <Theme tone="dark">
      <Box padding="md"><Text>Nested dark scope</Text></Box>
    </Theme>
  </Stack>
);

export const MarkdownStatement: Story = () => (
  <Markdown>{`# Parking lot\n\nDesign a **parking lot** that supports ${LONG_WORD}.\n\n## Requirements\n\n- [x] Park a car\n- [ ] Leave the lot\n\n1. First\n2. Second\n\n> Keep classes small.\n\n\`\`\`go\nfunc (l *Lot) Park(c Car) error { return nil } // ${LONG_WORD}\n\`\`\`\n\n| Spot | Size |\n|---|---|\n| A1 | ${LONG_WORD} |\n\n[Docs](https://example.com)`}</Markdown>
);
