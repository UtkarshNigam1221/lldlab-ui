import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { SURFACE_TONE, type SurfaceTone } from './Box';

const PADDING = { md: 'py-section-md', lg: 'py-section-lg', xl: 'py-section-xl' } as const;
const PATTERN = { none: '', dots: 'bg-pattern-dots', grid: 'bg-pattern-grid' } as const;

export type SectionProps<E extends ElementType = 'section'> = PolyProps<
  E,
  { tone?: SurfaceTone; padding?: keyof typeof PADDING; pattern?: keyof typeof PATTERN }
>;

export function Section<E extends ElementType = 'section'>({ as, tone, padding = 'lg', pattern = 'none', ...rest }: SectionProps<E>) {
  const C: ElementType = as ?? 'section';
  return <C {...rest} data-theme={tone === 'inverse' ? 'dark' : undefined} className={cx('w-full min-w-0', tone && SURFACE_TONE[tone], PADDING[padding], PATTERN[pattern])} />;
}
