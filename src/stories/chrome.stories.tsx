import type { Story } from '@ladle/react';
import { useState } from 'react';
import { AppBar, Avatar, AvatarGroup, Badge, Button, Chip, CommandPalette, Divider, Drawer, Eyebrow, Icon, IconButton, IconTile, NavList, Pagination, Stack, Text, TextLink, type CommandGroup } from '../index';
import { NAV_ITEMS } from './screens/shared';

export default { title: 'Chrome' };

export const LinksDividersTiles: Story = () => (
  <Stack gap="md">
    <Stack direction="row" gap="md" wrap>
      <TextLink href="#a" iconRight="arrow_forward">Blueprint</TextLink>
      <TextLink href="#b" tone="muted" size="sm">Forgot password?</TextLink>
      <TextLink href="#c" tone="danger" underline="always">Report issue</TextLink>
    </Stack>
    <Divider label="or" />
    <Stack direction="row" gap="sm" align="center">
      <Text>Left</Text><Divider orientation="vertical" /><Text>Right</Text>
    </Stack>
    <Stack direction="row" gap="sm" wrap>
      {(['neutral', 'brand', 'success', 'warning', 'danger'] as const).map((t) => <IconTile key={t} icon="bolt" tone={t} />)}
      <IconTile icon="check" tone="success" size="xl" shape="circle" filled label="Accepted" />
    </Stack>
    <Stack direction="row" gap="sm" wrap align="center">
      <Button variant="brand" icon="bolt">Start Practicing</Button>
      <Button variant="accent">Start Free Practice</Button>
      <Button variant="secondary" icon="star" iconTone="warning" iconFilled>4.8k</Button>
      <IconButton icon="notifications" label="Notifications, 3 unread" dot="danger" />
      <IconButton icon="share" label="Share" variant="secondary" size="xs" />
      <Badge tone="success" dot="success" pulse>Runtime Ready</Badge>
      <Badge tone="info" icon="verified" size="md">GOF CLASSIC</Badge>
      <Chip tone="danger" dot="danger" onRemove={() => {}}>Advanced</Chip>
      <Chip dot="#00ADD8">Go 1.22</Chip>
      <Eyebrow variant="plain" pulse>Live</Eyebrow>
    </Stack>
    <Stack direction="row" gap="md" align="center">
      <Avatar name="Alex Lin" status="success" statusLabel="online" />
      <Avatar name="Sam Park" shape="square" tone="brand" />
      <AvatarGroup label="Solvers" max={3}>
        <Avatar name="A B" tone="brand" /><Avatar name="C D" tone="success" /><Avatar name="E F" tone="warning" /><Avatar name="G H" /><Avatar name="I J" />
      </AvatarGroup>
    </Stack>
  </Stack>
);

export const AppBarAndNav: Story = () => {
  const [page, setPage] = useState(3);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="lg">
      <AppBar position="static" start={<Text weight="semibold">LLD Lab</Text>} end={<IconButton icon="menu" label="Open menu" onClick={() => setOpen(true)} />} />
      <Drawer open={open} onClose={() => setOpen(false)} title="Navigation">
        <NavList label="Site" items={NAV_ITEMS} current="patterns" />
      </Drawer>
      <NavList label="Workspace" heading="Navigation" items={NAV_ITEMS} current="problems" />
      <NavList label="On this page" variant="toc" current="b" items={[{ id: 'a', label: '1. Intent', href: '#a' }, { id: 'b', label: '2. Structure', href: '#b' }, { id: 'c', label: '3. Participants', href: '#c' }]} />
      <Pagination page={page} pageCount={12} onChange={setPage} summary="Showing 12 of 142" />
    </Stack>
  );
};

export const Palette: Story = () => {
  const [q, setQ] = useState('');
  const groups: CommandGroup[] = [
    { label: 'Problems', items: [{ id: 'p', label: 'Parking lot', icon: 'local_parking', meta: 'Beginner', onSelect: () => {} }, { id: 'r', label: 'Rate limiter', icon: 'speed', onSelect: () => {} }] },
    { label: 'Patterns', items: [{ id: 's', label: 'Strategy', icon: 'category', meta: 'Behavioral', onSelect: () => {} }] },
  ].map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) }));
  return <CommandPalette open onClose={() => {}} query={q} onQueryChange={setQ} groups={groups.filter((g) => g.items.length)} />;
};

export const IconsXl: Story = () => <Icon name="lock" size="xl" label="Locked" />;
