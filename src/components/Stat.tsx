import type { ReactNode } from 'react';
import { Icon } from './Icon';

export type StatProps = { icon: string; label: ReactNode; value: ReactNode };

export function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="flex min-w-0 items-center gap-space-sm">
      <Icon name={icon} tone="muted" />
      <div className="min-w-0">
        <p className="truncate font-label-mono text-label-mono uppercase text-on-surface-variant">{label}</p>
        <p className="truncate font-display text-headline-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
