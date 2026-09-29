import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { ALIGN, DIRECTION, GAP, JUSTIFY, type Align, type Direction, type Justify, type Space } from '../internal/tables';

type StackOwnProps = {
  direction?: Responsive<Direction>;
  gap?: Responsive<Space>;
  align?: Responsive<Align>;
  justify?: Responsive<Justify>;
  wrap?: boolean;
};
export type StackProps<E extends ElementType = 'div'> = PolyProps<E, StackOwnProps>;

export function Stack<E extends ElementType = 'div'>({ as, direction = 'column', gap = 'md', align, justify, wrap, ...rest }: StackProps<E>) {
  const C: ElementType = as ?? 'div';
  return (
    <C
      {...rest}
      className={cx(
        'flex min-w-0',
        responsive(DIRECTION, direction),
        responsive(GAP, gap),
        responsive(ALIGN, align),
        responsive(JUSTIFY, justify),
        wrap && 'flex-wrap',
      )}
    />
  );
}
