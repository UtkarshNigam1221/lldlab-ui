import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { COLS, GAP, type Cols, type Space } from '../internal/tables';

export type GridProps<E extends ElementType = 'div'> = PolyProps<E, { cols?: Responsive<Cols>; gap?: Responsive<Space> }>;

/** Single column below md unless `cols` sets `base` explicitly. */
export function Grid<E extends ElementType = 'div'>({ as, cols = 1, gap = 'md', ...rest }: GridProps<E>) {
  const C: ElementType = as ?? 'div';
  const c = typeof cols === 'object' ? { base: 1 as Cols, ...cols } : { base: 1 as Cols, md: cols };
  return <C {...rest} className={cx('grid min-w-0', responsive(COLS, c), responsive(GAP, gap))} />;
}
