import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type CheckboxProps = NativeProps<'input', {
  label: ReactNode;
  description?: ReactNode;
  /** sm: 13px label for compact side-rail lists. */
  size?: 'sm' | 'md';
  /** Strike the label through while checked (task lists). */
  strikeWhenChecked?: boolean;
  indeterminate?: boolean;
}>;

export function Checkbox({ label, description, strikeWhenChecked, indeterminate, size = 'md', id, ...rest }: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const descId = `${inputId}-desc`;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <div className="min-w-0">
      {/* The whole row is the label, so the tap target is the row (44px below md), not the 16px box. */}
      <label htmlFor={inputId} className={cx('group flex min-w-0 cursor-pointer items-start gap-space-sm', TOUCH)}>
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-describedby={cx(rest['aria-describedby'], description ? descId : undefined) || undefined}
          className={cx(
            'peer size-4 cursor-pointer appearance-none rounded border border-border-strong bg-surface-elevated checked:border-brand-cobalt checked:bg-brand-cobalt indeterminate:border-brand-cobalt indeterminate:bg-brand-cobalt disabled:cursor-not-allowed disabled:opacity-50',
            FOCUS_RING,
          )}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
          <Icon name="check" size="sm" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-indeterminate:flex">
          <Icon name="remove" size="sm" />
        </span>
      </span>
      <span className={cx('min-w-0 text-on-surface wrap-break-word', size === 'sm' ? 'font-body-sm text-body-sm' : 'font-body-md text-body-md', strikeWhenChecked && 'group-has-checked:text-on-surface-variant group-has-checked:line-through')}>
        {label}
      </span>
      </label>
      {description && (
        <p id={descId} className="pl-6 font-body-sm text-body-sm text-on-surface-variant wrap-break-word">
          {description}
        </p>
      )}
    </div>
  );
}
