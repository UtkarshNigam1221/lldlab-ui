import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const TONE = { success: 'text-fg-success', danger: 'text-fg-danger', neutral: 'text-ink' } as const;

export type MetricTileProps = NativeProps<'div', { label: ReactNode; value: ReactNode; tone?: keyof typeof TONE; icon?: string }>;

export function MetricTile({ label, value, tone = 'neutral', icon, ...rest }: MetricTileProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-2xs rounded-lg border border-border-subtle bg-surface-subtle p-space-sm">
      <span className="flex min-w-0 items-center gap-space-2xs font-label-mono text-label-mono uppercase text-on-surface-variant">
        {icon && <Icon name={icon} size="sm" />}
        <span className="truncate">{label}</span>
      </span>
      <span className={cx('truncate font-display text-headline-sm', TONE[tone])}>{value}</span>
    </div>
  );
}
