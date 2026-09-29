import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DiffViewer } from '../index';
import { diffLines, splitRows } from '../internal/diff';

describe('diffLines', () => {
  it('finds added and removed lines around common ones', () => {
    expect(diffLines('a\nb\nc', 'a\nx\nc').map((l) => `${l.kind}:${l.text}`)).toEqual(['same:a', 'del:b', 'add:x', 'same:c']);
  });
  it('handles identical and empty inputs', () => {
    expect(diffLines('a\nb', 'a\nb').every((l) => l.kind === 'same')).toBe(true);
    expect(diffLines('', 'a\nb').map((l) => l.kind)).toEqual(['add', 'add']);
    expect(diffLines('a', '').map((l) => l.kind)).toEqual(['del']);
  });
  it('numbers old and new lines', () => {
    const [same, del, add] = diffLines('a\nb', 'a\nc');
    expect([same.oldNo, same.newNo, del.oldNo, add.newNo]).toEqual([1, 1, 2, 2]);
  });
  it('pairs deletions with additions for split view', () => {
    const rows = splitRows(diffLines('a\nb\nc', 'a\nx\ny\nc'));
    expect(rows.map((r) => `${r.left?.text ?? '-'}|${r.right?.text ?? '-'}`)).toEqual(['a|a', 'b|x', '-|y', 'c|c']);
  });
});

describe('DiffViewer', () => {
  it('announces added and removed lines and scrolls inside itself', () => {
    const { container } = render(<DiffViewer oldTitle="naive.go" newTitle="staff.go" oldValue={'a\nb'} newValue={'a\nc'} />);
    expect(screen.getByText('naive.go')).toBeInTheDocument();
    expect(screen.getAllByText('removed:')).toHaveLength(1);
    expect(screen.getAllByText('added:')).toHaveLength(1);
    expect(screen.getByText('c').closest('div')).toHaveClass('bg-diff-add-bg');
    expect(container.querySelector('pre')).toHaveAttribute('tabindex', '0');
  });
  it('split mode renders a split grid from lg and a unified fallback below', () => {
    const { container } = render(<DiffViewer mode="split" oldValue="a" newValue="b" />);
    expect(container.querySelector('.lg\\:grid')).not.toBeNull();
    expect(container.querySelector('.lg\\:hidden')).not.toBeNull();
  });
});
