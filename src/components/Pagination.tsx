import type { ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { IconButton } from './IconButton';

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

/** Page numbers to show: first, last, a window of `siblingCount` around `page`, and gaps. */
export function pageRange(page: number, pageCount: number, siblingCount = 1): Array<number | 'gap'> {
  if (pageCount <= 0) return [];
  const p = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  if (pageCount <= 2 * siblingCount + 5) return range(1, pageCount);
  const left = Math.max(p - siblingCount, 2);
  const right = Math.min(p + siblingCount, pageCount - 1);
  const out: Array<number | 'gap'> = [1];
  if (left > 2) out.push('gap');
  out.push(...range(left, right));
  if (right < pageCount - 1) out.push('gap');
  out.push(pageCount);
  return out;
}

export type PaginationProps = NativeProps<'nav', {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  summary?: ReactNode;
  label?: string;
  children?: never;
}>;

/** Below md only the current page and "/ total" show between the arrows. */
export function Pagination({ page, pageCount, onChange, siblingCount = 1, summary, label = 'Pagination', ...rest }: PaginationProps) {
  if (pageCount <= 1) return null;
  const p = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  return (
    <nav {...rest} aria-label={label} className="flex min-w-0 flex-wrap items-center justify-between gap-space-sm">
      {summary && <p className="font-body-sm text-body-sm text-on-surface-variant">{summary}</p>}
      <ul className="flex items-center gap-space-2xs">
        <li>
          <IconButton icon="chevron_left" label="Previous page" variant="secondary" size="sm" disabled={p <= 1} onClick={() => onChange(p - 1)} />
        </li>
        {pageRange(p, pageCount, siblingCount).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-space-2xs text-on-surface-variant max-md:hidden">
              …
            </li>
          ) : (
            <li key={item} className={item === p ? '' : 'max-md:hidden'}>
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === p ? 'page' : undefined}
                onClick={() => onChange(item)}
                className={cx(
                  'inline-flex size-8 items-center justify-center rounded-lg font-label-mono text-label-mono transition-colors',
                  item === p ? 'bg-ink text-on-ink' : 'text-on-surface hover:bg-surface-muted',
                  FOCUS_RING,
                  TOUCH_ICON,
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li aria-hidden="true" className="font-label-mono text-label-mono text-on-surface-variant md:hidden">
          / {pageCount}
        </li>
        <li>
          <IconButton icon="chevron_right" label="Next page" variant="secondary" size="sm" disabled={p >= pageCount} onClick={() => onChange(p + 1)} />
        </li>
      </ul>
    </nav>
  );
}
