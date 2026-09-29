import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Avatar, Breadcrumbs, Countdown, EditorTabs, FileTree, Grid, MetricTile, Stack, StatusBar } from '../index';
import { FILES } from './fixtures';

export default { title: 'IDE' };

export const Tree: Story = () => {
  const [active, setActive] = useState('src/ParkingLot.ts');
  return <FileTree label="Files" nodes={FILES} activePath={active} onOpen={setActive} />;
};

export const Tabs: Story = () => {
  const [tabs, setTabs] = useState([
    { id: 'a', label: 'ParkingLot.ts', modified: true },
    { id: 'b', label: 'Car.ts' },
    { id: 'c', label: 'parking.test.ts', readOnly: true },
    { id: 'd', label: 'AbstractSingletonProxyFactoryBean.ts' },
  ]);
  const [active, setActive] = useState('a');
  return <EditorTabs tabs={tabs} activeId={active} onSelect={setActive} onClose={(id) => setTabs((t) => t.filter((x) => x.id !== id))} />;
};

export const Chrome: Story = () => (
  <Stack gap="md">
    <Breadcrumbs items={[{ label: 'Problems', href: '#' }, { label: 'Creational', href: '#' }, { label: 'Singleton logger with a very long problem title' }]} />
    <Grid cols={{ base: 2, md: 4 }} gap="sm">
      <MetricTile label="Passed" value="8/10" tone="success" icon="check_circle" />
      <MetricTile label="Failed" value="2" tone="danger" icon="cancel" />
      <MetricTile label="Runtime" value="14ms" icon="speed" />
      <MetricTile label="Memory" value="2.1MB" icon="memory" />
    </Grid>
    <Stack direction="row" gap="md" align="center" wrap>
      <Avatar name="Ada Lovelace" badge="42" />
      <Avatar name="Grace Hopper" size="lg" />
      <Avatar name="Linus" size="sm" />
      <Countdown seconds={1500} warnAt={300} />
      <Countdown direction="up" label="Elapsed" />
    </Stack>
    <StatusBar
      start={<><StatusBar.Item icon="check_circle" tone="success">Ready</StatusBar.Item><StatusBar.Item icon="commit">main</StatusBar.Item></>}
      end={<><StatusBar.Item>TypeScript</StatusBar.Item><StatusBar.Item>UTF-8</StatusBar.Item></>}
    />
  </Stack>
);
