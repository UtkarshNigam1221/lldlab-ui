import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { GAP, type Space } from '../internal/tables';

const MAIN = { '8/4': 'xl:col-span-8', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-9' } as const;
const ASIDE = { '8/4': 'xl:col-span-4', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-3' } as const;
const STICKY_ASIDE = {
  none: 'xl:sticky xl:top-space-lg xl:self-start',
  appbar: 'xl:sticky xl:top-[calc(var(--spacing-appbar)+1rem)] xl:self-start',
} as const;
const STICKY_START = {
  none: 'lg:sticky lg:top-space-lg lg:self-start',
  appbar: 'lg:sticky lg:top-[calc(var(--spacing-appbar)+1rem)] lg:self-start',
} as const;

export type SplitProps = NativeProps<'div', {
  ratio?: keyof typeof MAIN;
  aside: ReactNode;
  /** Leading rail (e.g. a table of contents) shown from lg; with it the layout is 3/7/2… columns and `ratio` is ignored. */
  start?: ReactNode;
  sticky?: boolean;
  /** Clear a sticky AppBar when sticking. */
  stickyOffset?: keyof typeof STICKY_ASIDE;
  gap?: Responsive<Space>;
  children: ReactNode;
}>;

/** Main + aside (stacked below xl); optional start rail from lg. */
export function Split({ ratio = '8/4', aside, start, sticky, stickyOffset = 'none', gap = 'lg', children, ...rest }: SplitProps) {
  if (start) {
    return (
      <div {...rest} className={cx('grid min-w-0 grid-cols-1 lg:grid-cols-12', responsive(GAP, gap))}>
        <div className={cx('hidden min-w-0 lg:col-span-3 lg:block xl:col-span-2', sticky && STICKY_START[stickyOffset])}>{start}</div>
        <div className="min-w-0 lg:col-span-9 xl:col-span-7">{children}</div>
        <aside className={cx('min-w-0 lg:col-span-9 lg:col-start-4 xl:col-span-3 xl:col-start-auto', sticky && STICKY_ASIDE[stickyOffset])}>{aside}</aside>
      </div>
    );
  }
  return (
    <div {...rest} className={cx('grid min-w-0 grid-cols-1 xl:grid-cols-12', responsive(GAP, gap))}>
      <div className={cx('min-w-0', MAIN[ratio])}>{children}</div>
      <aside className={cx('min-w-0', ASIDE[ratio], sticky && STICKY_ASIDE[stickyOffset])}>{aside}</aside>
    </div>
  );
}
