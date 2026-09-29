import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';
import { Dot } from './Dot';
import { Icon } from './Icon';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-on-surface-variant',
  brand: 'bg-ink text-on-ink',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
  info: 'bg-badge-intermediate-bg text-badge-intermediate-text',
};
const SIZE = { sm: 'px-space-xs py-space-2xs', md: 'px-space-sm py-space-xs' } as const;

export type BadgeProps = NativeProps<'span', {
  tone?: BadgeTone;
  uppercase?: boolean;
  size?: keyof typeof SIZE;
  icon?: string;
  dot?: StatusTone;
  pulse?: boolean;
  children: ReactNode;
}>;

export function Badge({ tone = 'neutral', uppercase, size = 'sm', icon, dot, pulse, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-2xs whitespace-nowrap rounded font-label-mono text-label-mono', TONE[tone], SIZE[size], uppercase && 'uppercase tracking-wider')}>
      {dot && <Dot tone={dot} pulse={pulse} />}
      {icon && <Icon name={icon} size="sm" />}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}
