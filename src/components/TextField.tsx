import { useId, useState, type ReactNode } from 'react';
import { cx, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

const SIZE = { sm: 'h-8 px-space-sm', ms: 'h-9 px-space-sm', md: 'h-10 px-space-sm', lg: 'h-11 px-space-md' } as const;
const TEXT = { sm: 'font-body-sm text-body-sm', ms: 'font-body-sm text-body-sm', md: 'font-body-md text-body-md', lg: 'font-body-sm text-body-sm' } as const;
// outline: bordered field; filled: borderless tint (header search); raised: white on a shadow (filter bars).
const VARIANT = {
  outline: 'border bg-surface-subtle focus-within:ring-2',
  filled: 'bg-surface-subtle hover:bg-surface-container/40 focus-within:ring-1',
  raised: 'bg-surface-elevated shadow-sm focus-within:ring-2',
} as const;

export type TextFieldProps = NativeProps<'input', {
  label: string;
  hideLabel?: boolean;
  icon?: string;
  hint?: ReactNode;
  error?: string;
  /** Content at the end of the label row (e.g. a "Forgot password?" link). */
  labelEnd?: ReactNode;
  /** Adds a show/hide toggle for password fields. */
  revealable?: boolean;
  size?: keyof typeof SIZE;
  variant?: keyof typeof VARIANT;
  /** Put the icon after the input instead of before it. */
  iconPosition?: 'start' | 'end';
}>;

export function TextField({ label, hideLabel, icon, hint, error, labelEnd, revealable, size = 'md', variant = 'outline', iconPosition = 'start', id, type, ...rest }: TextFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const errorId = `${inputId}-error`;
  const [shown, setShown] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-space-2xs">
      <div className={cx('flex min-w-0 items-center justify-between gap-space-sm', hideLabel && !labelEnd && 'sr-only')}>
        <label htmlFor={inputId} className={cx('font-body-sm text-body-sm font-medium text-on-surface', hideLabel && 'sr-only')}>
          {label}
        </label>
        {labelEnd}
      </div>
      <div
        className={cx(
          'flex min-w-0 items-center gap-space-xs rounded-lg focus-within:ring-brand-cobalt',
          VARIANT[variant],
          SIZE[size],
          error ? 'border border-fg-danger' : variant === 'outline' && 'border-border-subtle',
          TOUCH,
        )}
      >
        {icon && iconPosition === 'start' && <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} tone="muted" />}
        <input
          {...rest}
          id={inputId}
          type={revealable ? (shown ? 'text' : 'password') : type}
          aria-invalid={error ? true : rest['aria-invalid']}
          aria-describedby={cx(rest['aria-describedby'], error && errorId) || undefined}
          className={cx('h-full min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant', TEXT[size])}
        />
        {hint && <span className="shrink-0">{hint}</span>}
        {revealable && (
          <IconButton icon={shown ? 'visibility_off' : 'visibility'} label="Show password" aria-pressed={shown} size="xs" onClick={() => setShown((s) => !s)} />
        )}
        {icon && iconPosition === 'end' && <Icon name={icon} size="sm" tone="muted" />}
      </div>
      {error && (
        <p id={errorId} className="font-body-sm text-body-sm text-fg-danger">
          {error}
        </p>
      )}
    </div>
  );
}
