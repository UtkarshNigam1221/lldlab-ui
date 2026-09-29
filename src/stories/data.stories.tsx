import type { Story } from '@ladle/react';
import { BarChart, Badge, DescriptionList, Disclosure, ResultRow, Stack, Table, Timeline } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Data' };

export const TablesAndLists: Story = () => (
  <Stack gap="lg">
    <Table
      caption="Participants"
      showCaption
      columns={[{ key: 'name', header: 'Participant', mono: true }, { key: 'role', header: 'Responsibility' }, { key: 'n', header: 'Count', align: 'end', width: 'min' }]}
      rows={[
        { name: 'PricingContext', role: 'Holds a reference to a Strategy', n: 1 },
        { name: 'Strategy', role: `Common interface ${LONG_WORD}`, n: 1 },
        { name: 'HourlyStrategy', role: 'Concrete strategy', n: 3 },
      ]}
    />
    <DescriptionList layout="inline" items={[{ term: 'Category', detail: 'Behavioral' }, { term: 'Also known as', detail: 'Policy' }, { term: 'Complexity', detail: LONG_WORD }]} />
  </Stack>
);

export const TimelineAndDisclosure: Story = () => (
  <Stack gap="lg">
    <Timeline
      label="Attempts"
      items={[
        { id: '1', status: 'danger', title: 'Attempt #1', badge: <Badge tone="danger">Failed</Badge>, meta: '2h ago' },
        { id: '2', status: 'warning', title: 'Attempt #2', description: 'Race detected in park()', meta: '1h ago' },
        { id: '3', status: 'success', title: 'Attempt #3', badge: <Badge tone="success">Accepted</Badge>, meta: 'now' },
        { id: '4', status: 'locked', title: 'Next: Elevator System' },
      ]}
    />
    <Disclosure variant="row" selected defaultOpen summary={<ResultRow status="pass" title="parks 100 cars concurrently" meta="12ms" />}>
      <ResultRow status="pending" title={`goroutines: 100 ${LONG_WORD}`} titleMono />
    </Disclosure>
    <BarChart label="Runtime distribution" bars={[3, 8, 14, 22, 30, 18, 9, 5, 2, 1].map((v, i) => ({ value: v, label: `${i * 10}ms` }))} highlight={4} highlightLabel="41ms" axis={['0ms', '50ms', '100ms']} />
  </Stack>
);
