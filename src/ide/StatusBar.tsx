import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import { TEXT_TONE } from '../internal/tones';

const TONE = { default: '', success: TEXT_TONE.success, danger: TEXT_TONE.danger, warning: TEXT_TONE.warning, brand: TEXT_TONE.brand } as const;

export type StatusItemProps = { icon?: string; tone?: keyof typeof TONE; children: ReactNode };

function StatusItem({ icon, tone = 'default', children }: StatusItemProps) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-space-2xs', TONE[tone])}>
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  );
}

export type StatusBarProps = { start?: ReactNode; end?: ReactNode; label?: string };

function StatusBarRoot({ start, end, label = 'Status' }: StatusBarProps) {
  return (
    <footer aria-label={label} className="flex h-7 min-w-0 shrink-0 items-center justify-between gap-space-md overflow-hidden border-t border-border-subtle bg-surface-subtle px-space-sm font-label-mono text-[11px] text-on-surface-variant">
      <div className="flex min-w-0 items-center gap-space-md overflow-hidden">{start}</div>
      <div className="flex min-w-0 items-center gap-space-md overflow-hidden">{end}</div>
    </footer>
  );
}

export const StatusBar = Object.assign(StatusBarRoot, { Item: StatusItem });
