import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Workbench } from '../index';
import { readSizes } from './Workbench';

const DEFAULTS = { left: 240, right: 380, bottom: 30 };
const LIMITS = { left: [160, 480], right: [260, 640], bottom: [15, 70] } as const;

function Full(props: { persistKey?: string }) {
  return (
    <Workbench
      persistKey={props.persistKey}
      header={<><Workbench.Toggle panel="left" /><Workbench.Toggle panel="right" /></>}
      left={<p>files</p>}
      main={<p>editor</p>}
      right={<p>details</p>}
      bottom={<p>output</p>}
    />
  );
}

const sep = (name: string) => screen.getByRole('separator', { name });

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('readSizes', () => {
  it('keeps valid values and replaces invalid or out-of-range ones with defaults', () => {
    expect(readSizes('{"left":"x","right":9999,"bottom":40}', DEFAULTS, LIMITS as never)).toEqual({ left: 240, right: 380, bottom: 40 });
    expect(readSizes('not json', DEFAULTS, LIMITS as never)).toEqual(DEFAULTS);
    expect(readSizes(null, DEFAULTS, LIMITS as never)).toEqual(DEFAULTS);
  });
});

describe('Workbench', () => {
  it('renders labelled regions and separators with default sizes', () => {
    render(<Full />);
    for (const name of ['Explorer', 'Editor', 'Details', 'Panel']) expect(screen.getByRole('region', { name })).toBeInTheDocument();
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '240');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-orientation', 'vertical');
    expect(sep('Resize Details')).toHaveAttribute('aria-valuenow', '380');
    expect(sep('Resize Panel')).toHaveAttribute('aria-valuenow', '30');
    expect(sep('Resize Panel')).toHaveAttribute('aria-orientation', 'horizontal');
  });
  it('resizes with the keyboard within limits', async () => {
    render(<Full />);
    sep('Resize Explorer').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '256');
    await userEvent.keyboard('{Home}');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '160');
    await userEvent.keyboard('{ArrowLeft}');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '160');
    await userEvent.keyboard('{End}');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '480');
    sep('Resize Details').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(sep('Resize Details')).toHaveAttribute('aria-valuenow', '396');
    sep('Resize Panel').focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(sep('Resize Panel')).toHaveAttribute('aria-valuenow', '35');
  });
  it('resizes by pointer drag only while the pointer is down', () => {
    render(<Full />);
    const s = sep('Resize Explorer');
    fireEvent.pointerDown(s, { clientX: 100, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(s, { clientX: 140, clientY: 0, pointerId: 1 });
    expect(s).toHaveAttribute('aria-valuenow', '280');
    fireEvent.pointerUp(s, { clientX: 140, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(s, { clientX: 300, clientY: 0, pointerId: 1 });
    expect(s).toHaveAttribute('aria-valuenow', '280');
  });
  it('persists sizes and restores them on the next mount', async () => {
    const { unmount } = render(<Full persistKey="wb" />);
    sep('Resize Explorer').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(JSON.parse(localStorage.getItem('wb')!)).toMatchObject({ left: 256 });
    unmount();
    render(<Full persistKey="wb" />);
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '256');
  });
  it('ignores corrupt persisted sizes', () => {
    localStorage.setItem('wb', '{"left":"x","right":9999,"bottom":40}');
    render(<Full persistKey="wb" />);
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '240');
    expect(sep('Resize Details')).toHaveAttribute('aria-valuenow', '380');
    expect(sep('Resize Panel')).toHaveAttribute('aria-valuenow', '40');
  });
  it('keeps working when storage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    render(<Full persistKey="wb" />);
    sep('Resize Explorer').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep('Resize Explorer')).toHaveAttribute('aria-valuenow', '256');
  });
  it('opens and closes a side panel as a drawer on small screens', async () => {
    render(<Full />);
    const toggle = screen.getByRole('button', { name: 'Show Explorer' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('region', { name: 'Explorer' })).toHaveClass('max-lg:hidden');
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide Explorer' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Explorer' })).not.toHaveClass('max-lg:hidden');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Show Explorer' })).toBeInTheDocument();
  });
  it('switches between main and bottom on phones', async () => {
    render(<Full />);
    expect(screen.getByRole('region', { name: 'Panel' })).toHaveClass('max-md:hidden');
    await userEvent.click(screen.getByRole('radio', { name: 'Panel' }));
    expect(screen.getByRole('region', { name: 'Editor' })).toHaveClass('max-md:hidden');
    expect(screen.getByRole('region', { name: 'Panel' })).not.toHaveClass('max-md:hidden');
  });
  it('renders only the panels it is given', () => {
    render(<Workbench main={<p>editor</p>} />);
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByRole('region', { name: 'Editor' })).toBeInTheDocument();
  });
});
