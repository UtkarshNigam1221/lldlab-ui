import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type TableColumn = { key: string; header: ReactNode; align?: 'start' | 'end'; mono?: boolean; width?: 'auto' | 'min' };

const PAD = { compact: 'px-space-sm py-space-xs', normal: 'px-space-md py-space-sm' } as const;
const ALIGN = { start: 'text-start', end: 'text-end' } as const;
const WIDTH = { auto: '', min: 'w-px whitespace-nowrap' } as const;

export type TableProps = NativeProps<'div', {
  caption: string;
  showCaption?: boolean;
  columns: TableColumn[];
  rows: Array<Record<string, ReactNode>>;
  rowKey?: (row: Record<string, ReactNode>, index: number) => string;
  density?: keyof typeof PAD;
  empty?: ReactNode;
  children?: never;
}>;

/** Semantic table inside a focusable horizontal scroller, so wide tables never widen the page. */
export function Table({ caption, showCaption, columns, rows, rowKey, density = 'normal', empty, ...rest }: TableProps) {
  return (
    <div
      {...rest}
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-border-subtle focus-visible:outline-2 focus-visible:outline-brand-cobalt"
    >
      <table className="w-full border-collapse font-body-sm text-body-sm text-on-surface">
        <caption className={showCaption ? 'caption-top px-space-md py-space-sm text-start font-label-mono text-label-mono uppercase text-on-surface-variant' : 'sr-only'}>
          {caption}
        </caption>
        <thead className="bg-surface-subtle">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cx('border-b border-border-subtle font-label-mono text-label-mono uppercase text-on-surface-variant', PAD[density], ALIGN[c.align ?? 'start'], WIDTH[c.width ?? 'auto'])}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {rows.length ? (
            rows.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i}>
                {columns.map((c) => (
                  <td key={c.key} className={cx('align-top wrap-break-word', PAD[density], ALIGN[c.align ?? 'start'], WIDTH[c.width ?? 'auto'], c.mono && 'font-code-inline text-code-inline')}>
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-space-md py-space-lg text-center text-on-surface-variant">
                {empty ?? 'No rows'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
