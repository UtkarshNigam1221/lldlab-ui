import type { Story } from '@ladle/react';
import { Stack, UmlClass, UmlDiagram } from '../index';
import { STRATEGY_EDGES, STRATEGY_NODES } from './fixtures';

export default { title: 'UML' };

export const Classes: Story = () => (
  <Stack direction="row" gap="md" wrap>
    <UmlClass name="RateLimiter" stereotype="interface" methods={['+ allowRequest(id): bool']} emphasis="brand" />
    <UmlClass name="TokenBucket" attributes={['- tokens: int', '- rate: int']} methods={['+ allowRequest(id): bool']} />
    <UmlClass name="Draft" dashed size="sm" />
  </Stack>
);

export const Diagram: Story = () => <UmlDiagram label="Strategy pattern" nodes={STRATEGY_NODES} edges={STRATEGY_EDGES} />;

export const CompactDiagram: Story = () => (
  <UmlDiagram
    label="Parking lot schema"
    compact
    direction="LR"
    nodes={[{ id: 'lot', name: 'ParkingLot' }, { id: 'lvl', name: 'Level' }, { id: 'spot', name: 'Spot' }]}
    edges={[
      { from: 'lot', to: 'lvl', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' },
      { from: 'lvl', to: 'spot', kind: 'composition', fromMultiplicity: '1', toMultiplicity: '*' },
    ]}
  />
);
