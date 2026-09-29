import { useId, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const TONE = { brand: 'bg-brand-cobalt', success: 'bg-brand-emerald', warning: 'bg-brand-amber', danger: 'bg-brand-crimson' } as const;
const SIZE = { sm: 'h-1', md: 'h-1.5' } as const;

export type ProgressBarProps = NativeProps<'div', {
  value: number;
  max?: number;
  tone?: keyof typeof TONE;
  label: ReactNode;
  hideLabel?: boolean;
  /** Replaces the computed percentage (e.g. "7 of 12"). */
  valueLabel?: ReactNode;
  caption?: ReactNode;
  size?: keyof typeof SIZE;
}>;

export function ProgressBar({ value, max = 100, tone = 'brand', label, hideLabel, valueLabel, caption, size = 'md', ...rest }: ProgressBarProps) {
  const id = useId();
  const safeMax = max > 0 ? max : 0;
  const clamped = safeMax ? Math.min(safeMax, Math.max(0, value)) : 0;
  const pct = safeMax ? Math.round((clamped / safeMax) * 100) : 0;
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-2xs">
      <div className={cx('flex justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant', hideLabel && 'sr-only')}>
        <span id={id} className="min-w-0 truncate">{label}</span>
        <span className="shrink-0 tabular-nums">{valueLabel ?? `${pct}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        className={cx('w-full overflow-hidden rounded-full bg-surface-muted', SIZE[size])}
      >
        <div className={cx('h-full rounded-full transition-[width]', TONE[tone])} style={{ width: `${pct}%` }} />
      </div>
      {caption && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{caption}</p>}
    </div>
  );
}
