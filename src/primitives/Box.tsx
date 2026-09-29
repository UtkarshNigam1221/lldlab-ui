import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { PADDING, type Space } from '../internal/tables';

export type SurfaceTone = 'surface' | 'subtle' | 'elevated' | 'low' | 'inverse';

export const SURFACE_TONE: Record<SurfaceTone, string> = {
  surface: 'bg-surface text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface',
  elevated: 'bg-surface-elevated text-on-surface',
  low: 'bg-surface-container-low text-on-surface',
  inverse: 'bg-brand-obsidian text-on-primary',
};

const RADIUS = { none: '', sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl' } as const;
const BORDER = { none: '', subtle: 'border border-border-subtle', strong: 'border border-border-strong' } as const;
const SHADOW = { none: '', sm: 'shadow-sm', md: 'shadow-md' } as const;

type BoxOwnProps = {
  padding?: Responsive<Space>;
  radius?: keyof typeof RADIUS;
  tone?: SurfaceTone;
  border?: keyof typeof BORDER;
  shadow?: keyof typeof SHADOW;
  /** Greys out and disables the content (inert), e.g. a panel waiting on a runtime. */
  dimmed?: boolean;
};
export type BoxProps<E extends ElementType = 'div'> = PolyProps<E, BoxOwnProps>;

export function Box<E extends ElementType = 'div'>({ as, padding, radius = 'none', tone, border = 'none', shadow = 'none', dimmed, ...rest }: BoxProps<E>) {
  const C: ElementType = as ?? 'div';
  return (
    <C
      {...rest}
      inert={dimmed || undefined}
      className={cx(
        'min-w-0 max-w-full',
        tone && SURFACE_TONE[tone],
        responsive(PADDING, padding),
        RADIUS[radius],
        BORDER[border],
        SHADOW[shadow],
        dimmed && 'pointer-events-none select-none opacity-40',
      )}
    />
  );
}
