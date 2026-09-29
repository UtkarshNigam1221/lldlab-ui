import type { Story } from '@ladle/react';
import { Badge, CodeBlock, CopyButton, DiffViewer, Stack } from '../index';

export default { title: 'Code' };

const GO = `func (l *Lot) Park(c Car) (Ticket, error) {\n\tl.mu.Lock()\n\tdefer l.mu.Unlock()\n\t// find the nearest free spot\n\treturn l.assign(c, 42)\n}`;
const JAVA = `public class FeeCalculator {\n  public double fee(String type, int hours) {\n    if (type.equals("HOURLY")) return hours * 2.5;\n    return 20;\n  }\n}`;

export const Highlighting: Story = () => (
  <Stack gap="md">
    <CodeBlock language="go" highlight lineNumbers title="lot.go" actions={<CopyButton value={GO} />}>{GO}</CodeBlock>
    <CodeBlock language="java" highlight title="FeeCalculator.java (Anti-Pattern)" meta={<Badge tone="danger">BRITTLE</Badge>}>{JAVA}</CodeBlock>
    <CodeBlock language="ts" highlight tone="subtle">{`interface Strategy {\n  compute(hours: number): number; // price\n}`}</CodeBlock>
    <CodeBlock language="python" highlight>{`def price(hours: int) -> float:\n    return hours * 2.5  # hourly`}</CodeBlock>
    <CodeBlock language="bash" highlight>{`npm test && echo "$HOME" # done`}</CodeBlock>
  </Stack>
);

export const Diff: Story = () => (
  <DiffViewer mode="split" oldTitle="naive.go" newTitle="staff.go" oldValue={'type Lot struct {\n\tspots []Spot\n}\n\nfunc (l *Lot) Park(c Car) {}'} newValue={'type Lot struct {\n\tmu    sync.Mutex\n\tspots []Spot\n}\n\nfunc (l *Lot) Park(c Car) error { return nil }'} />
);
