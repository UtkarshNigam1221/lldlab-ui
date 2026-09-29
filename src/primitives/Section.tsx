import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { PADDING_BOTTOM, PADDING_TOP, type Space } from '../internal/tables';
import { SURFACE_TONE, type SurfaceTone } from './Box';

const PADDING = { none: '', md: 'py-section-md', lg: 'py-section-lg', xl: 'py-section-xl' } as const;
const PATTERN = { none: '', dots: 'bg-pattern-dots', 'dots-brand': 'bg-pattern-dots-brand', grid: 'bg-pattern-grid' } as const;

export type SectionProps<E extends ElementType = 'section'> = PolyProps<
  E,
  {
    tone?: SurfaceTone;
    /** Fluid section rhythm; ignored on a side when paddingTop/paddingBottom is set. */
    padding?: keyof typeof PADDING;
    /** Fixed spacing-scale padding, for mockup-exact rhythm (e.g. 40px top, 64px bottom). */
    paddingTop?: Responsive<Space>;
    paddingBottom?: Responsive<Space>;
    pattern?: keyof typeof PATTERN;
  }
>;

export function Section<E extends ElementType = 'section'>({ as, tone, padding = 'lg', paddingTop, paddingBottom, pattern = 'none', ...rest }: SectionProps<E>) {
  const fixed = paddingTop !== undefined || paddingBottom !== undefined;
  const C: ElementType = as ?? 'section';
  return <C {...rest} data-theme={tone === 'inverse' ? 'dark' : undefined} className={cx('w-full min-w-0', tone && SURFACE_TONE[tone], fixed ? cx(responsive(PADDING_TOP, paddingTop), responsive(PADDING_BOTTOM, paddingBottom)) : PADDING[padding], PATTERN[pattern])} />;
}
