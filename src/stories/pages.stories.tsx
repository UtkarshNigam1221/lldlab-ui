import type { Story } from '@ladle/react';
import { useState } from 'react';
import {
  Avatar, Badge, Box, Breadcrumbs, Button, Card, Chip, CodeBlock, Container, Countdown, EditorTabs, Eyebrow, FileTree, Grid, Heading,
  Icon, MetricTile, ProgressBar, ResultRow, Section, SegmentedControl, Stack, StatusBar, Tabs, Text, TextField, Theme, Workbench,
} from '../index';
import { FILES } from './fixtures';

export default { title: 'Pages' };

const PATTERNS = [
  { name: 'Singleton', family: 'Creational', level: 'Beginner', tone: 'success' as const },
  { name: 'Strategy', family: 'Behavioral', level: 'Intermediate', tone: 'info' as const },
  { name: 'Decorator', family: 'Structural', level: 'Intermediate', tone: 'info' as const },
  { name: 'Visitor', family: 'Behavioral', level: 'Advanced', tone: 'danger' as const },
];

export const PatternLibrary: Story = () => (
  <Stack gap="none">
    <Section pattern="dots" padding="lg">
      <Container>
        <Stack gap="md" align="start">
          <Eyebrow>Pattern library</Eyebrow>
          <Heading level={1} size="display">Every classic pattern, practised in code</Heading>
          <Text variant="body-lead" tone="muted">Browse the Gang of Four catalogue by family and difficulty.</Text>
          <Stack direction="row" gap="xs" wrap>
            <Chip icon="category">Creational</Chip><Chip icon="account_tree">Structural</Chip><Chip icon="sync_alt">Behavioral</Chip>
          </Stack>
        </Stack>
      </Container>
    </Section>
    <Section padding="md">
      <Container>
        <Grid cols={{ md: 2, xl: 4 }}>
          {PATTERNS.map((p) => (
            <Card key={p.name} interactive as="a" href={`#${p.name}`}>
              <Card.Media><Icon name="deployed_code" size="lg" tone="muted" /></Card.Media>
              <Stack direction="row" gap="xs"><Badge tone={p.tone} uppercase>{p.level}</Badge><Badge>{p.family}</Badge></Stack>
              <Heading level={3} size="sm">{p.name}</Heading>
              <ProgressBar label="Completed" value={p.name.length % 4} max={4} tone="success" />
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
    <Section padding="md">
      <Container>
        <Card tone="inverse" padding="xl">
          <Heading level={2} tone="inverse">Ready to design?</Heading>
          <Text tone="inverse">Pick a pattern and start with the starter code.</Text>
          <Stack direction="row"><Button variant="secondary" iconRight="arrow_forward">Start practising</Button></Stack>
        </Card>
      </Container>
    </Section>
  </Stack>
);

export const IdeShell: Story = () => {
  const [active, setActive] = useState('src/ParkingLot.ts');
  const [lang, setLang] = useState('ts');
  const [bottomTab, setBottomTab] = useState('tests');
  return (
    <Theme tone="dark">
      <div className="flex h-[calc(100dvh-2rem)] flex-col">
        <div className="min-h-0 flex-1">
        <Workbench
          persistKey="ladle-ide"
          header={
            <>
              <Workbench.Toggle panel="left" />
              <Breadcrumbs items={[{ label: 'Problems', href: '#' }, { label: 'Creational', href: '#' }, { label: 'Parking lot' }]} />
              <Stack direction="row" gap="sm" align="center">
                <Countdown seconds={1500} warnAt={300} />
                <Button size="sm" icon="play_arrow">Run</Button>
                <Avatar name="Ada Lovelace" size="sm" />
              </Stack>
              <Workbench.Toggle panel="right" />
            </>
          }
          left={<FileTree label="Files" nodes={FILES} activePath={active} onOpen={setActive} />}
          main={
            <Stack gap="none">
              <EditorTabs tabs={[{ id: 'src/ParkingLot.ts', label: 'ParkingLot.ts', modified: true }, { id: 'tests/parking.test.ts', label: 'parking.test.ts', readOnly: true }]} activeId={active} onSelect={setActive} />
              <CodeBlock>{`export class ParkingLot {\n  park(car: Car): Spot {\n    // TODO\n  }\n}`}</CodeBlock>
            </Stack>
          }
          right={
            <Box padding="md">
              <Stack gap="md">
                <SegmentedControl label="Language" value={lang} onChange={setLang} options={[{ value: 'ts', label: 'TS' }, { value: 'py', label: 'Py' }, { value: 'go', label: 'Go' }]} />
                <Heading level={2} size="sm">Parking lot</Heading>
                <Text variant="body-sm" tone="muted">Design a parking lot with spots of different sizes.</Text>
                <TextField label="Search docs" hideLabel icon="search" placeholder="Search docs" />
              </Stack>
            </Box>
          }
          bottom={
            <Box padding="sm">
            <Stack gap="sm">
              <Tabs label="Output" variant="underline" value={bottomTab} onChange={setBottomTab} items={[{ id: 'tests', label: 'Test results', count: 3 }, { id: 'output', label: 'Output' }]} />
              <Grid cols={{ base: 2, md: 3 }} gap="sm">
                <MetricTile label="Passed" value="2/3" tone="success" />
                <MetricTile label="Failed" value="1" tone="danger" />
                <MetricTile label="Runtime" value="14ms" />
              </Grid>
              <ResultRow status="pass" title="parks a car" meta="2ms" />
              <ResultRow status="fail" title="rejects a full lot" detail={'expected: true\nactual: false'} meta="1ms" />
            </Stack>
            </Box>
          }
        />
        </div>
        <StatusBar start={<StatusBar.Item icon="check_circle" tone="success">Ready</StatusBar.Item>} end={<StatusBar.Item>TypeScript</StatusBar.Item>} />
      </div>
    </Theme>
  );
};
