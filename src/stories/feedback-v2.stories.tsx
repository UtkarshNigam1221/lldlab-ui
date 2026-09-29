import type { Story } from '@ladle/react';
import { Button, Message, Skeleton, Stack, TerminalOutput, Toaster, Tooltip, useToast, VerdictBanner, Badge } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Feedback v2' };

export const Loading: Story = () => (
  <Stack gap="md">
    <Message>Loading problems…</Message>
    <Stack direction="row" gap="xs"><Skeleton shape="pill" width="1/4" /><Skeleton shape="pill" width="1/4" /></Stack>
    <Skeleton shape="rect" />
    <Skeleton lines={3} />
    <Skeleton shape="circle" height="lg" />
  </Stack>
);

export const Terminal: Story = () => (
  <TerminalOutput
    title="Terminal"
    status={<Badge tone="danger">BUILD BROKEN</Badge>}
    lines={[
      { kind: 'command', text: 'go test ./...' },
      { kind: 'error', text: `./lot.go:24:8: undefined: ${LONG_WORD}` },
      { kind: 'plain', text: '    spot := SpotFactory.New(kind)' },
      { kind: 'hint', text: 'Did you mean spotFactory?' },
      { kind: 'success', text: 'ok  parking/internal/ticket 0.21s' },
    ]}
  />
);

export const Verdict: Story = () => (
  <VerdictBanner tone="success" icon="check" title="Accepted" badge={<Badge tone="success">8/8 tests</Badge>} meta={['41ms', '1.4 MB', 'attempt #3']} actions={<><Button variant="secondary">Back to Editor</Button><Button variant="brand">Next Problem</Button></>} />
);

export const TooltipAndToast: Story = () => {
  const { show } = useToast();
  return (
    <Stack direction="row" gap="sm">
      <Tooltip content="Resets the zoom to 100%" delay={0}>
        <Button variant="secondary">Hover me</Button>
      </Tooltip>
      <Button onClick={() => show({ title: 'Solution saved', description: 'Stored as attempt #4', tone: 'success' })}>Show toast</Button>
      <Toaster />
    </Stack>
  );
};
