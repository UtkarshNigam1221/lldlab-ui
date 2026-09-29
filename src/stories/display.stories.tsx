import type { Story } from '@ladle/react';
import { Badge, Button, Callout, Card, CheckList, Chip, Dot, EmptyState, Grid, Heading, Icon, Markdown, Message, ProgressBar, ResultRow, SectionHeader, Stack, Stat, Text } from '../index';
import { LONG_WORD } from './fixtures';

export default { title: 'Display' };

export const BadgesChipsDots: Story = () => (
  <Stack gap="md">
    <Stack direction="row" gap="xs" wrap>
      {(['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const).map((t) => <Badge key={t} tone={t} uppercase>{t}</Badge>)}
    </Stack>
    <Stack direction="row" gap="xs" wrap>
      <Chip icon="category">Creational</Chip>
      <Chip tone="brand" onRemove={() => {}}>Structural</Chip>
      <Chip>{LONG_WORD}</Chip>
    </Stack>
    <Stack direction="row" gap="sm" align="center">
      <Dot /><Dot tone="brand" /><Dot tone="success" size="md" pulse /><Dot tone="warning" /><Dot tone="danger" />
      <Icon name="bolt" tone="brand" /><Icon name="check_circle" tone="success" filled label="Done" />
    </Stack>
  </Stack>
);

export const Cards: Story = () => (
  <Grid cols={{ md: 2, xl: 3 }}>
    <Card interactive as="a" href="#singleton">
      <Card.Media pattern="dots"><Icon name="deployed_code" size="lg" tone="muted" /></Card.Media>
      <Stack direction="row" gap="xs"><Badge tone="success" uppercase>Beginner</Badge><Badge>Creational</Badge></Stack>
      <Heading level={3} size="sm">Singleton logger</Heading>
      <Text variant="body-sm" tone="muted" clamp={2}>Ensure a class has only one instance and provide a global point of access to it. {LONG_WORD}</Text>
      <Card.Footer><Text variant="label" tone="muted">4 languages</Text><Icon name="arrow_forward" size="sm" /></Card.Footer>
    </Card>
    <Card tone="inverse">
      <Heading level={3} size="sm" tone="inverse">Inverse card</Heading>
      <Text tone="inverse">Used for CTAs on the Pattern Library.</Text>
      <Card.Footer><Button size="sm" variant="secondary">Start</Button></Card.Footer>
    </Card>
    <Card padding="md">
      <Stat icon="task_alt" label="Solved" value="12 / 40" />
      <ProgressBar label="Creational" value={3} max={5} tone="success" />
      <ProgressBar label="Behavioral" value={1} max={11} />
    </Card>
  </Grid>
);

export const Feedback: Story = () => (
  <Stack gap="md">
    <SectionHeader title="Tier 1 · Core patterns" dot="success" tag="Core" meta="4 Problems Listed" />
    <Callout tone="danger" title="Execution timed out" action={<Button size="sm" variant="secondary">Retry</Button>}>Your code ran longer than 5 seconds.</Callout>
    <Callout tone="success">All tests passed.</Callout>
    <Callout tone="warning">Unsaved changes.</Callout>
    <Callout>{LONG_WORD}</Callout>
    <Stack gap="none">
      <ResultRow status="pass" title="parks a car" meta="2ms" />
      <ResultRow status="fail" title={`rejects a full lot ${LONG_WORD}`} detail={`expected: true\nactual:   false ${LONG_WORD}`} meta="1ms" />
      <ResultRow status="pending" title="leaves the lot" />
    </Stack>
    <Message>Loading problems…</Message>
    <Message tone="danger">Could not load problems.</Message>
    <EmptyState title="No problems match" description="Try clearing the filters." action={<Button size="sm" variant="secondary">Clear filters</Button>} />
    <CheckList items={['Single responsibility', 'Open for extension', LONG_WORD]} />
  </Stack>
);

export const LongText: Story = () => (
  <Stack gap="md">
    <Markdown>{`- ${LONG_WORD}\n- short item\n\n> ${LONG_WORD}`}</Markdown>
    <Message tone="danger">{`Could not load /problems/${LONG_WORD}`}</Message>
    <Callout tone="warning" title={LONG_WORD}>Body</Callout>
    <EmptyState title={LONG_WORD} description={LONG_WORD} />
    <Stack direction="row" gap="xs" wrap><Badge>{LONG_WORD}</Badge></Stack>
    <SectionHeader title="Tier" tag="Core" meta={LONG_WORD} />
  </Stack>
);
