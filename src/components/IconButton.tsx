import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';
import { Icon } from './Icon';

const VARIANT = {
  ghost: 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  secondary: 'border border-border-subtle bg-surface-elevated text-on-surface hover:bg-surface-muted',
  primary: 'bg-ink text-on-ink hover:bg-ink-hover',
} as const;
const SIZE = { xs: 'size-6', sm: 'size-8', ms: 'size-9', md: 'size-10' } as const;

type IconButtonOwnProps = {
  icon: string;
  /** Accessible name and tooltip. Include what `dot`/`badge` mean (e.g. "Notifications, 3 unread"). */
  label: string;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  dot?: StatusTone;
  badge?: ReactNode;
  children?: never;
};
export type IconButtonProps<E extends ElementType = 'button'> = PolyProps<E, IconButtonOwnProps>;

export function IconButton<E extends ElementType = 'button'>({ as, icon, label, variant = 'ghost', size = 'md', dot, badge, ...rest }: IconButtonProps<E>) {
  const C: ElementType = as ?? 'button';
  const native = C === 'button';
  const typeProp = native ? { type: (rest as unknown as { type?: string }).type ?? 'button' } : {};
  return (
    <C
      {...rest}
      {...typeProp}
      aria-label={label}
      title={label}
      className={cx(
        'relative inline-flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50',
        VARIANT[variant],
        SIZE[size],
        FOCUS_RING,
        TOUCH_ICON,
      )}
    >
      <Icon name={icon} size={size === 'md' ? 'md' : size === 'ms' ? 'ms' : 'sm'} />
      {dot && <span aria-hidden="true" className={cx('absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-surface-elevated', DOT_TONE[dot])} />}
      {badge && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 min-w-4 rounded-full bg-brand-crimson-hover px-1 text-center font-label-mono text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </C>
  );
}
