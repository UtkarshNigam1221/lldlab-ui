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
