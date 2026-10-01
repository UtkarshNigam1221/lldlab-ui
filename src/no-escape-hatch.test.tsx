import { describe, expect, it } from 'vitest';
import { Badge, Box, Button, Card, Dialog, FullScreen, Grid, Heading, Icon, IconButton, Select, Stack, Tabs, Text, TextField, Workbench } from './index';

// Checked by `npm run typecheck`: every line below must be a type error. Never rendered.
export function typeAssertions() {
  return (
    <>
      {/* @ts-expect-error no className */}
      <Box className="x" />
      {/* @ts-expect-error no style */}
      <Box style={{ color: 'red' }} />
      {/* @ts-expect-error no className */}
      <Stack className="x" />
      {/* @ts-expect-error no className */}
      <Grid className="x" />
      {/* @ts-expect-error no className */}
      <Text className="x">x</Text>
      {/* @ts-expect-error no className */}
      <Heading level={1} className="x">x</Heading>
      {/* @ts-expect-error no className */}
      <Button className="x">x</Button>
      {/* @ts-expect-error no className even through as */}
      <Button as="a" href="/" className="x">x</Button>
      {/* @ts-expect-error no className */}
      <IconButton icon="close" label="Close" className="x" />
      {/* @ts-expect-error no className */}
      <Card className="x">x</Card>
      {/* @ts-expect-error no className */}
      <TextField label="x" className="x" />
      {/* @ts-expect-error no className */}
      <Select label="x" options={[]} className="x" />
      {/* @ts-expect-error no className */}
      <Icon name="x" className="x" />
      {/* @ts-expect-error no className */}
      <Badge className="x">x</Badge>
      {/* @ts-expect-error no className */}
      <Tabs label="x" items={[]} value="x" className="x" />
      {/* @ts-expect-error no className */}
      <Dialog open={false} onClose={() => {}} title="x" className="x" />
      {/* @ts-expect-error no className */}
      <FullScreen open={false} onClose={() => {}} label="x" className="x" />
      {/* @ts-expect-error no style */}
      <FullScreen open={false} onClose={() => {}} label="x" style={{ color: 'red' }} />
      {/* @ts-expect-error no className */}
      <Workbench main={null} className="x" />
    </>
  );
}

describe('no escape hatch', () => {
  it('is enforced by the type checker (npm run typecheck)', () => {
    expect(typeof typeAssertions).toBe('function');
  });
});
