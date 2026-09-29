import { useId, type ReactNode } from 'react';
import { cx, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type TextFieldProps = NativeProps<'input', { label: string; hideLabel?: boolean; icon?: string; hint?: ReactNode; error?: string }>;

export function TextField({ label, hideLabel, icon, hint, error, id, ...rest }: TextFieldProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const errorId = `${inputId}-error`;
  return (
    <div className="flex min-w-0 flex-col gap-space-2xs">
      <label htmlFor={inputId} className={cx('font-body-sm text-body-sm font-medium text-on-surface', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div
        className={cx(
          'flex h-10 min-w-0 items-center gap-space-xs rounded-lg border bg-surface-subtle px-space-sm focus-within:ring-2 focus-within:ring-brand-cobalt',
          error ? 'border-fg-danger' : 'border-border-subtle',
          TOUCH,
        )}
      >
        {icon && <Icon name={icon} size="sm" tone="muted" />}
        <input
          {...rest}
          id={inputId}
          aria-invalid={error ? true : rest['aria-invalid']}
          aria-describedby={cx(rest['aria-describedby'], error && errorId) || undefined}
          className="h-full min-w-0 flex-1 bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        {hint && <span className="shrink-0">{hint}</span>}
      </div>
      {error && (
        <p id={errorId} className="font-body-sm text-body-sm text-fg-danger">
          {error}
        </p>
      )}
    </div>
  );
}
