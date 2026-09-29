import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { diffLines, splitRows, type DiffLine } from '../internal/diff';
import type { NativeProps } from '../internal/poly';

const KIND = { same: 'text-code-plain', add: 'bg-diff-add-bg text-diff-add-fg', del: 'bg-diff-del-bg text-diff-del-fg' } as const;
const SIGN = { same: ' ', add: '+', del: '−' } as const;
const SPOKEN = { same: '', add: 'added:', del: 'removed:' } as const;
const PRE = 'overflow-x-auto py-space-sm font-code-inline text-code-inline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt';

function Row({ line, gutters }: { line?: DiffLine; gutters: 'both' | 'old' | 'new' }) {
  if (!line) return <div className="min-h-5 bg-white/5" />;
  return (
    <div className={cx('flex min-w-0 px-space-sm', KIND[line.kind])}>
      {gutters !== 'new' && <span aria-hidden="true" className="w-8 shrink-0 select-none pr-space-xs text-right text-code-comment">{line.oldNo ?? ''}</span>}
      {gutters !== 'old' && <span aria-hidden="true" className="w-8 shrink-0 select-none pr-space-xs text-right text-code-comment">{line.newNo ?? ''}</span>}
      <span aria-hidden="true" className="w-4 shrink-0 select-none">{SIGN[line.kind]}</span>
      {SPOKEN[line.kind] && <span className="sr-only">{SPOKEN[line.kind]}</span>}
      <span className="min-w-0 whitespace-pre-wrap wrap-break-word">{line.text || ' '}</span>
    </div>
  );
}

export type DiffViewerProps = NativeProps<'figure', {
  oldValue: string;
  newValue: string;
  oldTitle?: ReactNode;
  newTitle?: ReactNode;
  /** split collapses to unified below lg. */
  mode?: 'unified' | 'split';
  children?: never;
}>;

export function DiffViewer({ oldValue, newValue, oldTitle, newTitle, mode = 'unified', ...rest }: DiffViewerProps) {
  const lines = diffLines(oldValue, newValue);
  const unified = (
    <pre tabIndex={0} className={cx(PRE, mode === 'split' && 'lg:hidden')}>
      {lines.map((l, i) => <Row key={i} line={l} gutters="both" />)}
    </pre>
  );
  return (
    <figure {...rest} className="min-w-0 max-w-full overflow-hidden rounded-xl bg-brand-obsidian">
      {(oldTitle || newTitle) && (
        <figcaption className="flex min-w-0 flex-wrap items-center gap-space-xs border-b border-white/10 px-space-md py-space-xs font-label-mono text-label-mono text-slate-300">
          {oldTitle && <span className="truncate">{oldTitle}</span>}
          {oldTitle && newTitle && <span aria-hidden="true">→</span>}
          {newTitle && <span className="truncate">{newTitle}</span>}
        </figcaption>
      )}
      {unified}
      {mode === 'split' && (
        <pre tabIndex={0} className={cx(PRE, 'hidden grid-cols-2 lg:grid')}>
          {splitRows(lines).map((r, i) => (
            <div key={i} className="contents">
              <Row line={r.left} gutters="old" />
              <Row line={r.right} gutters="new" />
            </div>
          ))}
        </pre>
      )}
    </figure>
  );
}
