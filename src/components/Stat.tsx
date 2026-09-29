import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type StatProps = NativeProps<'div', { icon: string; label: ReactNode; value: ReactNode }>;

export function Stat({ icon, label, value, ...rest }: StatProps) {
  return (
    <div {...rest} className="flex min-w-0 items-center gap-space-sm">
      <Icon name={icon} tone="muted" />
      <div className="min-w-0">
        <p className="truncate font-label-mono text-label-mono uppercase text-on-surface-variant">{label}</p>
        <p className="truncate font-display text-headline-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
