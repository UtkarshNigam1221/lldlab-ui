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
