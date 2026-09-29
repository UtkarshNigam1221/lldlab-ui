import { useId } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type SelectOption = { value: string; label: string };
export type SelectProps = NativeProps<'select', { label: string; hideLabel?: boolean; options: SelectOption[]; children?: never }>;

export function Select({ label, hideLabel, options, id, ...rest }: SelectProps) {
  const generated = useId();
  const selectId = id ?? generated;
  return (
    <div className="flex min-w-0 flex-col gap-space-2xs">
      <label htmlFor={selectId} className={cx('font-body-sm text-body-sm font-medium text-on-surface', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative min-w-0">
        <select
          {...rest}
          id={selectId}
          className={cx('h-10 w-full min-w-0 appearance-none rounded-lg border border-border-subtle bg-surface-subtle pl-space-sm pr-space-xl font-body-md text-body-md text-on-surface', FOCUS_RING, TOUCH)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-space-sm flex items-center text-on-surface-variant">
          <Icon name="expand_more" size="sm" />
        </span>
      </div>
    </div>
  );
}
