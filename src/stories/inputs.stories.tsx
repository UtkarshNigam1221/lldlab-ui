import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Button, Dialog, IconButton, Kbd, Menu, SegmentedControl, Select, Stack, Tabs, TextField } from '../index';

export default { title: 'Inputs' };

export const Buttons: Story = () => (
  <Stack gap="md">
    <Stack direction="row" gap="sm" wrap>
      {(['primary', 'secondary', 'subtle', 'ghost', 'danger'] as const).map((v) => <Button key={v} variant={v}>{v}</Button>)}
    </Stack>
    <Stack direction="row" gap="sm" wrap align="center">
      <Button size="sm" icon="play_arrow">Run</Button>
      <Button size="lg" iconRight="arrow_forward">Start practicing</Button>
      <Button loading>Submitting</Button>
      <Button disabled>Disabled</Button>
      <IconButton icon="settings" label="Settings" />
      <IconButton icon="close" label="Close" variant="subtle" size="sm" />
    </Stack>
    <Button fullWidth>Full width</Button>
  </Stack>
);

export const Fields: Story = () => (
  <Stack gap="md">
    <TextField label="Search problems" hideLabel icon="search" placeholder="Search problems" hint={<Kbd>⌘K</Kbd>} />
    <TextField label="Email" type="email" placeholder="you@example.com" error="Enter a valid email" />
    <Select label="Language" options={[{ value: 'ts', label: 'TypeScript' }, { value: 'py', label: 'Python' }, { value: 'go', label: 'Go' }]} defaultValue="ts" />
  </Stack>
);

export const TabsAndSegments: Story = () => {
  const [tab, setTab] = useState('all');
  const [pill, setPill] = useState('description');
  const [lang, setLang] = useState('ts');
  return (
    <Stack gap="lg">
      <Tabs label="Filter" value={tab} onChange={setTab} items={[{ id: 'all', label: 'All', count: 40 }, { id: 'solved', label: 'Solved', dot: 'success' }, { id: 'todo', label: 'Todo' }, { id: 'creational', label: 'Creational' }, { id: 'structural', label: 'Structural' }, { id: 'behavioral', label: 'Behavioral' }]} />
      <Tabs label="Workspace" variant="pills" value={pill} onChange={setPill} items={[{ id: 'description', label: 'Description' }, { id: 'submissions', label: 'Submissions', count: 3 }]} />
      <Tabs label="Site" value="problems" items={[{ id: 'home', label: 'Home', href: '#home' }, { id: 'problems', label: 'Problems', href: '#problems' }, { id: 'patterns', label: 'Patterns', href: '#patterns' }]} />
      <SegmentedControl label="Language" value={lang} onChange={setLang} options={[{ value: 'ts', label: 'TypeScript' }, { value: 'js', label: 'JavaScript' }, { value: 'py', label: 'Python' }, { value: 'go', label: 'Go' }]} />
    </Stack>
  );
};

export const Overlays: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <Stack direction="row" gap="sm" justify="between">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Menu
        label="Account"
        items={[{ label: 'Profile', icon: 'person' }, { label: 'Settings', icon: 'settings' }, { label: 'Sign out', icon: 'logout', tone: 'danger' }]}
        trigger={(p) => <Button {...p} variant="ghost" icon="account_circle">Account</Button>}
      />
      <Dialog open={open} onClose={() => setOpen(false)} title="Sign in" description="Sign in to run and save solutions." footer={<Button onClick={() => setOpen(false)}>Continue</Button>}>
        <TextField label="Email" type="email" />
        <TextField label="Password" type="password" />
      </Dialog>
    </Stack>
  );
};
