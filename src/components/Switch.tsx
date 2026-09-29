import { useId, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type SwitchProps = NativeProps<'button', {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: ReactNode;
  children?: never;
}>;

export function Switch({ label, checked, onChange, description, ...rest }: SwitchProps) {
  const id = useId();
  return (
    <div className={cx('flex min-w-0 items-start justify-between gap-space-md', TOUCH)}>
      <div className="min-w-0">
        <span id={`${id}-label`} className="font-body-md text-body-md text-on-surface">{label}</span>
        {description && <p id={`${id}-desc`} className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{description}</p>}
      </div>
      <button
        {...rest}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cx('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50', checked ? 'bg-brand-cobalt' : 'bg-border-strong', FOCUS_RING)}
      >
        <span aria-hidden="true" className={cx('inline-block size-5 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-5.5' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}
