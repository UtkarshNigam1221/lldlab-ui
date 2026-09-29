import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Button, Checkbox, Overlay, Stack, Switch, TextField, TextLink, UmlClass } from '../index';

export default { title: 'Forms' };

export const Controls: Story = () => {
  const [race, setRace] = useState(true);
  return (
    <Stack gap="md">
      <Checkbox label="Read the intent" strikeWhenChecked defaultChecked />
      <Checkbox label="Implement one concrete strategy" description="Hourly or daily pricing" />
      <Checkbox label="Some tests passing" indeterminate />
      <Switch label="Race detector" description="Slower runs, catches data races" checked={race} onChange={setRace} />
      <TextField label="Password" type="password" revealable labelEnd={<TextLink href="#forgot" size="sm">Forgot password?</TextLink>} />
      <TextField label="Full name" size="sm" />
    </Stack>
  );
};

export const Gate: Story = () => (
  <Overlay
    overlay={
      <Stack gap="sm" align="center">
        <Button icon="login">Sign in to solve</Button>
      </Stack>
    }
  >
    <UmlClass name="ParkingLot" attributes={['- levels: Level[]']} methods={['+ park(car): Ticket']} />
  </Overlay>
);
