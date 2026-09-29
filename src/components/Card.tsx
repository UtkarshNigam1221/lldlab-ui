import { Children, isValidElement, type ElementType, type ReactNode } from 'react';
import { cx, FOCUS_RING } from '../internal/cx';
import type { NativeProps, PolyProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { PADDING, type Space } from '../internal/tables';

const TONE = {
  default: 'bg-surface-elevated border border-border-subtle text-on-surface',
  inverse: 'bg-brand-obsidian border border-brand-slate text-on-primary',
} as const;
const PATTERN = { none: '', dots: 'bg-pattern-dots', grid: 'bg-pattern-grid' } as const;
const ASPECT = { video: 'aspect-video', wide: 'aspect-[21/9]', square: 'aspect-square' } as const;

export type CardMediaProps = NativeProps<'div', { pattern?: keyof typeof PATTERN; aspect?: keyof typeof ASPECT; children?: ReactNode }>;
export type CardFooterProps = NativeProps<'div', { children: ReactNode }>;

export function CardMedia({ pattern = 'dots', aspect = 'video', children, ...rest }: CardMediaProps) {
  return (
    <div {...rest} className={cx('relative flex min-w-0 items-center justify-center border-b border-border-subtle bg-surface-subtle group-data-[tone=inverse]/card:border-white/10 group-data-[tone=inverse]/card:bg-white/5', PATTERN[pattern], ASPECT[aspect])}>
      {children}
    </div>
  );
}

export function CardFooter({ children, ...rest }: CardFooterProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-wrap items-center justify-between gap-space-sm border-t border-border-subtle bg-surface-subtle px-space-lg py-space-sm group-data-[tone=inverse]/card:border-white/10 group-data-[tone=inverse]/card:bg-white/5">
      {children}
    </div>
  );
}

type CardOwnProps = { padding?: Responsive<Space>; interactive?: boolean; tone?: keyof typeof TONE; children?: ReactNode };
export type CardProps<E extends ElementType = 'div'> = PolyProps<E, CardOwnProps>;

function CardRoot<E extends ElementType = 'div'>({ as, padding = 'lg', interactive, tone = 'default', children, ...rest }: CardProps<E>) {
  const C: ElementType = as ?? 'div';
  const parts = Children.toArray(children);
  const isType = (t: unknown) => (p: ReactNode) => isValidElement(p) && p.type === t;
  const media = parts.filter(isType(CardMedia));
  const footer = parts.filter(isType(CardFooter));
  const body = parts.filter((p) => !media.includes(p) && !footer.includes(p));
  return (
    <C
      {...rest}
      data-tone={tone}
      className={cx('group/card flex min-w-0 flex-col overflow-hidden rounded-xl', TONE[tone], interactive && cx('transition-shadow hover:shadow-md', FOCUS_RING))}
    >
      {media}
      <div className={cx('flex min-w-0 flex-1 flex-col gap-space-sm', responsive(PADDING, padding))}>{body}</div>
      {footer}
    </C>
  );
}

export const Card = Object.assign(CardRoot, { Media: CardMedia, Footer: CardFooter });
