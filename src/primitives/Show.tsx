import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const ABOVE = { sm: 'hidden sm:contents', md: 'hidden md:contents', lg: 'hidden lg:contents', xl: 'hidden xl:contents' } as const;
const BELOW = { sm: 'contents sm:hidden', md: 'contents md:hidden', lg: 'contents lg:hidden', xl: 'contents xl:hidden' } as const;

export type ShowProps = NativeProps<'div', { above?: keyof typeof ABOVE; below?: keyof typeof BELOW; children: ReactNode }>;

/** Render children only from `above` up, or only below `below`. Uses display: contents, so it adds no box. */
export function Show({ above, below, children, ...rest }: ShowProps) {
  return (
    <div {...rest} className={cx(above && ABOVE[above], below && BELOW[below])}>
      {children}
    </div>
  );
}
