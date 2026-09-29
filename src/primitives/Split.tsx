import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { GAP, type Space } from '../internal/tables';

type Ratio = '8/4' | '1/1' | '9/3' | '7/5' | '5/7';
const MAIN: Record<'lg' | 'xl', Record<Ratio, string>> = {
  lg: { '8/4': 'lg:col-span-8', '1/1': 'lg:col-span-6', '9/3': 'lg:col-span-9', '7/5': 'lg:col-span-7', '5/7': 'lg:col-span-5' },
  xl: { '8/4': 'xl:col-span-8', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-9', '7/5': 'xl:col-span-7', '5/7': 'xl:col-span-5' },
};
const ASIDE: Record<'lg' | 'xl', Record<Ratio, string>> = {
  lg: { '8/4': 'lg:col-span-4', '1/1': 'lg:col-span-6', '9/3': 'lg:col-span-3', '7/5': 'lg:col-span-5', '5/7': 'lg:col-span-7' },
  xl: { '8/4': 'xl:col-span-4', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-3', '7/5': 'xl:col-span-5', '5/7': 'xl:col-span-7' },
};
const GRID = { lg: 'lg:grid-cols-12', xl: 'xl:grid-cols-12' } as const;
const STICKY_ASIDE = {
  none: 'xl:sticky xl:top-space-lg xl:self-start',
  appbar: 'xl:sticky xl:top-[calc(var(--spacing-appbar)+1rem)] xl:self-start',
} as const;
const STICKY_ASIDE_LG = {
  none: 'lg:sticky lg:top-space-lg lg:self-start',
  appbar: 'lg:sticky lg:top-[calc(var(--spacing-appbar)+1rem)] lg:self-start',
} as const;
const STICKY_START = {
  none: 'lg:sticky lg:top-space-lg lg:self-start',
  appbar: 'lg:sticky lg:top-[calc(var(--spacing-appbar)+1rem)] lg:self-start',
} as const;

export type SplitProps = NativeProps<'div', {
  ratio?: Ratio;
  /** Where the two columns stop stacking (default xl). */
  breakpoint?: 'lg' | 'xl';
  /** Render the side column as a plain div when it isn't complementary content (e.g. a hero stats card). */
  asideAs?: 'aside' | 'div';
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
export function Split({ ratio = '8/4', breakpoint = 'xl', asideAs = 'aside', aside, start, sticky, stickyOffset = 'none', gap = 'lg', children, ...rest }: SplitProps) {
  if (start) {
    return (
      <div {...rest} className={cx('grid min-w-0 grid-cols-1 lg:grid-cols-12', responsive(GAP, gap))}>
        <div className={cx('hidden min-w-0 lg:col-span-3 lg:block xl:col-span-2', sticky && STICKY_START[stickyOffset])}>{start}</div>
        <div className="min-w-0 lg:col-span-9 xl:col-span-7">{children}</div>
        <aside className={cx('min-w-0 lg:col-span-9 lg:col-start-4 xl:col-span-3 xl:col-start-auto', sticky && STICKY_ASIDE[stickyOffset])}>{aside}</aside>
      </div>
    );
  }
  const Side = asideAs;
  return (
    <div {...rest} className={cx('grid min-w-0 grid-cols-1', GRID[breakpoint], responsive(GAP, gap))}>
      <div className={cx('min-w-0', MAIN[breakpoint][ratio])}>{children}</div>
      <Side className={cx('min-w-0', ASIDE[breakpoint][ratio], sticky && (breakpoint === 'lg' ? STICKY_ASIDE_LG : STICKY_ASIDE)[stickyOffset])}>{aside}</Side>
    </div>
  );
}
