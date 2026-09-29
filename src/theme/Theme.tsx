import type { ElementType } from 'react';
import type { PolyProps } from '../internal/poly';

export type ThemeProps<E extends ElementType = 'div'> = PolyProps<E, { tone?: 'light' | 'dark' }>;

/** Scopes the colour tokens: everything inside renders in `tone`. */
export function Theme<E extends ElementType = 'div'>({ as, tone = 'light', ...rest }: ThemeProps<E>) {
  const C: ElementType = as ?? 'div';
  // color-scheme is set by the [data-theme] rules in theme.css.
  return <C {...rest} data-theme={tone} className="bg-surface text-on-surface" />;
}
