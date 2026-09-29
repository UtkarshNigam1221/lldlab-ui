import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'ghost' | 'danger';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-on-ink shadow-sm hover:bg-ink-hover',
  secondary: 'border border-border-subtle bg-surface-elevated text-ink shadow-sm hover:bg-surface-muted',
  subtle: 'bg-surface-subtle text-on-surface hover:bg-surface-muted',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-muted',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover',
};
const SIZE = { sm: 'h-8 px-space-md', md: 'h-10 px-space-lg', lg: 'h-12 px-space-lg' } as const;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE;
  icon?: string;
  iconRight?: string;
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
      {loading ? <Icon name="progress_activity" size="sm" spin /> : icon && <Icon name={icon} size="sm" />}
      <span className="truncate">{children}</span>
      {iconRight && <Icon name={iconRight} size="sm" />}
    </C>
  );
}
