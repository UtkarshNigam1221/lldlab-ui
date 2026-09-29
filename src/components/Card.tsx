import { Children, isValidElement, type ElementType, type ReactNode } from 'react';
import { cx, FOCUS_RING } from '../internal/cx';
import type { NativeProps, PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { GAP, PADDING, type Space } from '../internal/tables';

// Stitch surfaces are separated by shadow, not borders; `outlined` adds the hairline where a mockup uses one.
const TONE = {
  default: 'bg-surface-elevated text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface',
  inverse: 'bg-brand-obsidian text-on-primary',
} as const;
const SHADOW = { none: '', sm: 'shadow-sm', md: 'shadow-md', xl: 'shadow-xl' } as const;
const BAR_TONE = { default: 'bg-surface-subtle', slate: 'bg-brand-slate', none: '' } as const;
const BAR_DENSITY = { md: 'px-space-lg py-space-sm', sm: 'px-space-md py-space-sm' } as const;
const PATTERN = { none: '', dots: 'bg-pattern-dots', grid: 'bg-pattern-grid' } as const;
const ASPECT = { video: 'aspect-video', wide: 'aspect-[21/9]', square: 'aspect-square' } as const;
const HEIGHT = { sm: 'h-30', md: 'h-35' } as const;
const INVERSE_BAR = 'group-data-[tone=inverse]/card:border-white/10 group-data-[tone=inverse]/card:bg-brand-slate';

type BarProps = {
  /** Hairline between the bar and the body (default false: Stitch bars are tinted, not ruled). */
  divider?: boolean;
  /** md: 24px sides; sm: 16px sides. */
  density?: keyof typeof BAR_DENSITY;
  /** slate: the #1E293B toolbar used on dark workbench cards. */
  tone?: keyof typeof BAR_TONE;
};
export type CardHeaderProps = NativeProps<'div', BarProps & { start?: ReactNode; end?: ReactNode; children?: ReactNode }>;
export type CardMediaProps = NativeProps<'div', {
  pattern?: keyof typeof PATTERN;
  aspect?: keyof typeof ASPECT;
  /** Fixed height instead of an aspect ratio (120px / 140px). */
  height?: keyof typeof HEIGHT;
  caption?: ReactNode;
  children?: ReactNode;
}>;
export type CardFooterProps = NativeProps<'div', BarProps & { children: ReactNode }>;

export function CardHeader({ start, end, children, divider = false, density = 'md', tone = 'default', ...rest }: CardHeaderProps) {
  return (
    <div
      {...rest}
      className={cx('flex min-w-0 flex-wrap items-center justify-between gap-space-sm', BAR_TONE[tone], BAR_DENSITY[density], divider && 'border-b border-border-subtle', tone === 'default' && INVERSE_BAR)}
    >
      <div className="flex min-w-0 items-center gap-space-sm">{start ?? children}</div>
      {end && <div className="flex shrink-0 flex-wrap items-center gap-space-sm">{end}</div>}
    </div>
  );
}

export function CardMedia({ pattern = 'dots', aspect = 'video', height, caption, children, ...rest }: CardMediaProps) {
  return (
    <div
      {...rest}
      className={cx('relative flex min-w-0 items-center justify-center border-b border-border-subtle bg-surface-subtle', INVERSE_BAR, PATTERN[pattern], height ? HEIGHT[height] : ASPECT[aspect])}
    >
      {caption && <span className="absolute left-space-sm top-space-sm font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{caption}</span>}
      {children}
    </div>
  );
}

export function CardFooter({ children, divider = false, density = 'md', tone = 'default', ...rest }: CardFooterProps) {
  return (
    <div
      {...rest}
      className={cx('flex min-w-0 flex-wrap items-center justify-between gap-space-sm', BAR_TONE[tone], BAR_DENSITY[density], divider && 'border-t border-border-subtle', tone === 'default' && INVERSE_BAR)}
    >
      {children}
    </div>
  );
}

type CardOwnProps = {
  padding?: Responsive<Space>;
  interactive?: boolean;
  tone?: keyof typeof TONE;
  pattern?: keyof typeof PATTERN;
  /** Resting shadow (default sm). */
  shadow?: keyof typeof SHADOW;
  /** Adds a 1px border-subtle hairline. */
  outlined?: boolean;
  /** Gap between body children (default sm, 8px). */
  gap?: Responsive<Space>;
  children?: ReactNode;
};
export type CardProps<E extends ElementType = 'div'> = PolyProps<E, CardOwnProps>;

function CardRoot<E extends ElementType = 'div'>({ as, padding = 'lg', interactive, tone = 'default', pattern = 'none', shadow = 'sm', outlined, gap = 'sm', children, ...rest }: CardProps<E>) {
  const C: ElementType = as ?? 'div';
  const parts = Children.toArray(children);
  const isType = (t: unknown) => (p: ReactNode) => isValidElement(p) && p.type === t;
  const header = parts.filter(isType(CardHeader));
  const media = parts.filter(isType(CardMedia));
  const footer = parts.filter(isType(CardFooter));
  const body = parts.filter((p) => !header.includes(p) && !media.includes(p) && !footer.includes(p));
  return (
    <C
      {...rest}
      data-tone={tone}
      data-theme={tone === 'inverse' ? 'dark' : undefined}
      className={cx('group/card flex min-w-0 flex-col overflow-hidden rounded-xl', TONE[tone], SHADOW[shadow], outlined && 'border border-border-subtle', PATTERN[pattern], interactive && cx('transition-shadow hover:shadow-md', FOCUS_RING))}
    >
      {header}
      {media}
      <div className={cx('flex min-w-0 flex-1 flex-col', responsive(GAP, gap), responsive(PADDING, padding))}>{body}</div>
      {footer}
    </C>
  );
}

export const Card = Object.assign(CardRoot, { Header: CardHeader, Media: CardMedia, Footer: CardFooter });
