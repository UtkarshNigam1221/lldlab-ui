import { useId } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type SelectOption = { value: string; label: string };
const VARIANT = { outline: 'border border-border-subtle bg-surface-subtle', raised: 'bg-surface-elevated shadow-sm' } as const;
const SIZE = { md: 'h-10 pl-space-sm font-body-md text-body-md', lg: 'h-11 pl-space-md font-body-sm text-body-sm' } as const;
export type SelectProps = NativeProps<'select', { label: string; hideLabel?: boolean; options: SelectOption[]; variant?: keyof typeof VARIANT; size?: keyof typeof SIZE; children?: never }>;

export function Select({ label, hideLabel, options, variant = 'outline', size = 'md', id, ...rest }: SelectProps) {
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
          className={cx('w-full min-w-0 appearance-none rounded-lg pr-space-xl text-on-surface', VARIANT[variant], SIZE[size], FOCUS_RING, TOUCH)}
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
