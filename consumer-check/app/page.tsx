import { Badge, Button, Card, Container, Grid, Heading, Stack, Text } from 'lldlab-ui';

export default function Page() {
  return (
    <Container>
      <Stack gap="md">
        <Heading level={1} size="display">Consumer check</Heading>
        <Grid cols={{ md: 2 }}>
          <Card>
            <Badge tone="success">ok</Badge>
            <Text>Rendered from lldlab-ui</Text>
          </Card>
          <Card>
            <Button>Server-rendered button</Button>
          </Card>
        </Grid>
      </Stack>
    </Container>
  );
}
