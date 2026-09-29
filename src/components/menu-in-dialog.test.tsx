import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Dialog, Menu } from '../index';

describe('Menu inside Dialog', () => {
  it('Escape closes only the menu', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Settings">
        <Menu label="More" items={[{ label: 'Rename' }]} trigger={(p) => <Button {...p}>More</Button>} />
      </Dialog>,
    );
    screen.getByRole('button', { name: 'More' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
