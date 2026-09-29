import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { GAP, type Space } from '../internal/tables';

const MAIN = { '8/4': 'xl:col-span-8', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-9' } as const;
const ASIDE = { '8/4': 'xl:col-span-4', '1/1': 'xl:col-span-6', '9/3': 'xl:col-span-3' } as const;

export type SplitProps = NativeProps<'div', {
  ratio?: keyof typeof MAIN;
  aside: ReactNode;
  sticky?: boolean;
  gap?: Responsive<Space>;
  children: ReactNode;
}>;

/** Main + aside; the aside stacks below the main content under xl. */
export function Split({ ratio = '8/4', aside, sticky, gap = 'lg', children, ...rest }: SplitProps) {
  return (
    <div {...rest} className={cx('grid min-w-0 grid-cols-1 xl:grid-cols-12', responsive(GAP, gap))}>
      <div className={cx('min-w-0', MAIN[ratio])}>{children}</div>
      <aside className={cx('min-w-0', ASIDE[ratio], sticky && 'xl:sticky xl:top-space-lg xl:self-start')}>{aside}</aside>
    </div>
  );
}
