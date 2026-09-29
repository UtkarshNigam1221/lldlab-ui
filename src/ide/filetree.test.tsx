import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileTree, type FileNode } from '../index';
import { buildTree, flattenVisible } from './tree';

const NODES: FileNode[] = [
  { path: 'src/main.ts', kind: 'file', modified: true },
  { path: 'src/models/car.ts', kind: 'file' },
  { path: 'README.md', kind: 'file', readOnly: true },
  { path: 'src/main.ts', kind: 'file' },
];

describe('buildTree / flattenVisible', () => {
  it('creates implicit dirs, dedupes (first wins), sorts dirs first, sets levels and parents', () => {
    const roots = buildTree(NODES);
    expect(roots.map((r) => r.path)).toEqual(['src', 'README.md']);
    const src = roots[0];
    expect(src.kind).toBe('dir');
    expect(src.children.map((c) => c.path)).toEqual(['src/models', 'src/main.ts']);
    expect(src.children[1].modified).toBe(true);
    expect(src.children[0].children[0]).toMatchObject({ path: 'src/models/car.ts', level: 3, parent: 'src/models' });
  });
  it('lists only items under expanded dirs', () => {
    const roots = buildTree(NODES);
    expect(flattenVisible(roots, new Set(['src'])).map((i) => i.path)).toEqual(['src', 'src/models', 'src/main.ts', 'README.md']);
    expect(flattenVisible(roots, new Set()).map((i) => i.path)).toEqual(['src', 'README.md']);
  });
});

describe('FileTree', () => {
  it('renders a named tree with levels, expanded state, selection and badges', () => {
    render(<FileTree label="Files" nodes={NODES} activePath="src/main.ts" onOpen={() => {}} />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    const src = screen.getByRole('treeitem', { name: /^src$/ });
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(src).toHaveAttribute('aria-level', '1');
    const main = screen.getByRole('treeitem', { name: /main\.ts/ });
    expect(main).toHaveAttribute('aria-selected', 'true');
    expect(main).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('img', { name: 'Read-only' })).toBeInTheDocument();
    expect(screen.getByText('(modified)')).toHaveClass('sr-only');
  });
  it('navigates with arrows, Home and End and opens files with Enter', async () => {
    const onOpen = vi.fn();
    render(<FileTree label="Files" nodes={NODES} onOpen={onOpen} />);
    const src = screen.getByRole('treeitem', { name: /^src$/ });
    src.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /^models$/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: /car\.ts/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith('src/models/car.ts');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /^models$/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /^models$/ })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('treeitem', { name: /README/ })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(src).toHaveFocus();
  });
  it('collapsing hides children; clicking a dir toggles, clicking a file opens', async () => {
    const onOpen = vi.fn();
    render(<FileTree label="Files" nodes={NODES} onOpen={onOpen} defaultExpanded={[]} />);
    expect(screen.queryByRole('treeitem', { name: /main\.ts/ })).toBeNull();
    await userEvent.click(screen.getByText('src'));
    await userEvent.click(screen.getByText('main.ts'));
    expect(onOpen).toHaveBeenCalledWith('src/main.ts');
  });
  it('renders nothing for no nodes', () => {
    const { container } = render(<FileTree label="Files" nodes={[]} onOpen={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('FileTree (review fixes)', () => {
  it("expands directories that arrive after mount when defaultExpanded is 'all'", () => {
    const { rerender } = render(<FileTree label="Files" nodes={[]} onOpen={() => {}} />);
    rerender(<FileTree label="Files" nodes={[{ path: 'src/a.ts', kind: 'file' }]} onOpen={() => {}} />);
    expect(screen.getByRole('treeitem', { name: /^src$/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: /a\.ts/ })).toBeInTheDocument();
  });
});
