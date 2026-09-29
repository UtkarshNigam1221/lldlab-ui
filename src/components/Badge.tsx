import type { ReactNode } from 'react';
import { cx } from '../internal/cx';

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

export type BadgeProps = { tone?: BadgeTone; uppercase?: boolean; size?: keyof typeof SIZE; children: ReactNode };

export function Badge({ tone = 'neutral', uppercase, size = 'sm', children }: BadgeProps) {
  return (
    <span className={cx('inline-flex items-center gap-space-2xs whitespace-nowrap rounded font-label-mono text-label-mono', TONE[tone], SIZE[size], uppercase && 'uppercase tracking-wider')}>
      {children}
    </span>
  );
}
