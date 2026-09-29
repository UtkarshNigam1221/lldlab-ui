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
