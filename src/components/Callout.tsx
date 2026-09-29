import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const TONE = {
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
  info: 'bg-badge-intermediate-bg text-badge-intermediate-text',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
} as const;
const ICON = { danger: 'error', info: 'info', success: 'check_circle', warning: 'warning' } as const;

export type CalloutProps = NativeProps<'div', { tone?: keyof typeof TONE; title?: ReactNode; action?: ReactNode; children: ReactNode }>;

export function Callout({ tone = 'info', title, action, children, ...rest }: CalloutProps) {
  return (
    <div {...rest} role={tone === 'danger' ? 'alert' : 'status'} className={cx('flex min-w-0 flex-wrap items-start gap-space-sm rounded-xl border border-current/20 p-space-md', TONE[tone])}>
      <Icon name={ICON[tone]} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-display text-headline-sm">{title}</p>}
        <div className="font-body-sm text-body-sm wrap-break-word">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
