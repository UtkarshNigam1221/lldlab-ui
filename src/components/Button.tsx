import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import type { Tone } from '../internal/tones';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'raised' | 'subtle' | 'ghost' | 'slate' | 'danger' | 'brand' | 'accent';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-on-ink shadow-sm hover:bg-ink-hover',
  secondary: 'border border-border-subtle bg-surface-elevated text-ink shadow-sm hover:bg-surface-muted',
  // Stitch's white button: lifted by shadow, no border.
  raised: 'bg-surface-elevated text-ink shadow-sm hover:bg-surface-container',
  subtle: 'bg-surface-subtle text-on-surface hover:bg-surface-container',
  // Secondary action on a dark surface.
  slate: 'bg-brand-slate text-white hover:bg-surface-tint',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-muted',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover',
  brand: 'bg-brand-cobalt text-white shadow-sm hover:bg-brand-cobalt-hover',
  // Crimson call to action (not destructive): #DC2626 keeps white text at AA.
  accent: 'bg-brand-crimson-hover text-white shadow-sm hover:bg-danger',
};
// xs is Stitch's compact action (py 4px, px 16px); the touch target is kept by TOUCH.
const SIZE = { xs: 'px-space-md py-space-xs', sm: 'h-8 px-space-md', md: 'h-10 px-space-lg', lg: 'h-12 px-space-lg' } as const;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE;
  icon?: string;
  iconRight?: string;
  iconTone?: Tone;
  iconFilled?: boolean;
  /** Custom leading content (e.g. a brand logo); replaces `icon`. */
  leading?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
};
export type ButtonProps<E extends ElementType = 'button'> = PolyProps<E, ButtonOwnProps>;

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  iconTone,
  iconFilled,
  leading,
  fullWidth,
  loading,
  disabled,
  children,
  ...rest
}: ButtonProps<E>) {
  const C: ElementType = as ?? 'button';
  const native = C === 'button';
  const off = Boolean(disabled || loading);
  const state = native
    ? { type: (rest as unknown as { type?: string }).type ?? 'button', disabled: off }
    : { 'aria-disabled': off || undefined };
  const start = loading ? (
    <Icon name="progress_activity" size="sm" spin />
  ) : leading ? (
    <span className="inline-flex shrink-0 items-center">{leading}</span>
  ) : (
    icon && <Icon name={icon} size="sm" tone={iconTone} filled={iconFilled} />
  );
  return (
    <C
      {...rest}
      {...state}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex max-w-full items-center justify-center gap-space-xs whitespace-nowrap rounded-lg font-button-text text-button-text transition-colors',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        VARIANT[variant],
        SIZE[size],
        FOCUS_RING,
        TOUCH,
        fullWidth && 'w-full',
      )}
    >
      {start}
      <span className="inline-flex min-w-0 items-center gap-space-xs truncate">{children}</span>
      {iconRight && <Icon name={iconRight} size="sm" />}
    </C>
  );
}
