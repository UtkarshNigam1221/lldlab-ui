import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';

const SIZE = { md: 'max-w-3xl', lg: 'max-w-5xl', xl: 'max-w-7xl' } as const;

export type ContainerProps<E extends ElementType = 'div'> = PolyProps<E, { size?: keyof typeof SIZE }>;

export function Container<E extends ElementType = 'div'>({ as, size = 'xl', ...rest }: ContainerProps<E>) {
  const C: ElementType = as ?? 'div';
  return <C {...rest} className={cx('mx-auto w-full min-w-0 px-gutter-fluid', SIZE[size])} />;
}
