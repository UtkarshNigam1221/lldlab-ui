import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { TEXT_TONE } from '../internal/tones';

const TONE = { default: '', success: TEXT_TONE.success, danger: TEXT_TONE.danger, warning: TEXT_TONE.warning, brand: TEXT_TONE.brand } as const;

export type StatusItemProps = NativeProps<'span', { icon?: string; tone?: keyof typeof TONE; children: ReactNode }>;

function StatusItem({ icon, tone = 'default', children, ...rest }: StatusItemProps) {
  return (
    <span {...rest} className={cx('inline-flex shrink-0 items-center gap-space-2xs', TONE[tone])}>
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  );
}

export type StatusBarProps = NativeProps<'footer', { start?: ReactNode; end?: ReactNode; label?: string; children?: never }>;

function StatusBarRoot({ start, end, label = 'Status', ...rest }: StatusBarProps) {
  return (
    <footer {...rest} aria-label={label} className="flex h-7 min-w-0 shrink-0 items-center justify-between gap-space-md overflow-hidden border-t border-border-subtle bg-surface-subtle px-space-sm font-label-mono text-[11px] text-on-surface-variant">
      <div className="flex min-w-0 items-center gap-space-md overflow-hidden">{start}</div>
      <div className="flex min-w-0 items-center gap-space-md overflow-hidden">{end}</div>
    </footer>
  );
}

export const StatusBar = Object.assign(StatusBarRoot, { Item: StatusItem });
