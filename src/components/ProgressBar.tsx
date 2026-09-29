import { useId } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const TONE = { brand: 'bg-brand-cobalt', success: 'bg-brand-emerald', warning: 'bg-brand-amber', danger: 'bg-brand-crimson' } as const;

export type ProgressBarProps = NativeProps<'div', { value: number; max?: number; tone?: keyof typeof TONE; label: string; hideLabel?: boolean }>;

export function ProgressBar({ value, max = 100, tone = 'brand', label, hideLabel, ...rest }: ProgressBarProps) {
  const id = useId();
  const safeMax = max > 0 ? max : 0;
  const clamped = safeMax ? Math.min(safeMax, Math.max(0, value)) : 0;
  const pct = safeMax ? Math.round((clamped / safeMax) * 100) : 0;
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-2xs">
      <div className={cx('flex justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant', hideLabel && 'sr-only')}>
        <span id={id} className="truncate">{label}</span>
        <span className="shrink-0 tabular-nums">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div className={cx('h-full rounded-full transition-[width]', TONE[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
