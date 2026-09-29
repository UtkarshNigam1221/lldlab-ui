import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { Icon } from './Icon';

const TONE = {
  brand: 'text-fg-brand hover:text-brand-cobalt-hover',
  default: 'text-on-surface hover:text-ink',
  muted: 'text-on-surface-variant hover:text-on-surface',
  danger: 'text-fg-danger',
  success: 'text-fg-success',
  warning: 'text-fg-warning',
} as const;
const SIZE = { sm: 'font-body-sm text-body-sm', md: 'font-body-md text-body-md' } as const;
const UNDERLINE = { hover: 'underline-offset-2 hover:underline', always: 'underline underline-offset-2', none: '' } as const;

type TextLinkOwnProps = {
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
  icon?: string;
  iconRight?: string;
  underline?: keyof typeof UNDERLINE;
  children: ReactNode;
};
export type TextLinkProps<E extends ElementType = 'a'> = PolyProps<E, TextLinkOwnProps>;

export function TextLink<E extends ElementType = 'a'>({ as, tone = 'brand', size = 'md', icon, iconRight, underline = 'hover', children, ...rest }: TextLinkProps<E>) {
  const C: ElementType = as ?? 'a';
  return (
    <C
      {...rest}
      className={cx('inline-flex max-w-full items-center gap-space-2xs rounded font-medium wrap-break-word transition-colors', TONE[tone], SIZE[size], UNDERLINE[underline], FOCUS_RING)}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span className="min-w-0">{children}</span>
      {iconRight && <Icon name={iconRight} size="sm" />}
    </C>
  );
}
