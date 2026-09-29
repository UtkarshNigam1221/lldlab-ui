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
const SIZE = { sm: 'gap-space-xs rounded-lg p-space-sm', md: 'gap-space-sm rounded-xl p-space-md' } as const;

export type CalloutProps = NativeProps<'div', {
  tone?: keyof typeof TONE;
  title?: ReactNode;
  action?: ReactNode;
  /** false for static content (pros/cons): no status/alert role. */
  live?: boolean;
  icon?: string;
  size?: keyof typeof SIZE;
  accent?: boolean;
  children: ReactNode;
}>;

export function Callout({ tone = 'info', title, action, live = true, icon, size = 'md', accent, children, ...rest }: CalloutProps) {
  const role = live ? (tone === 'danger' ? 'alert' : 'status') : undefined;
  return (
    <div {...rest} role={role} className={cx('flex min-w-0 flex-wrap items-start border border-current/20', TONE[tone], SIZE[size], accent && 'border-l-4')}>
      <Icon name={icon ?? ICON[tone]} size={size === 'sm' ? 'sm' : 'md'} />
      <div className="min-w-0 flex-1">
        {title && <p className={cx('font-display wrap-break-word', size === 'sm' ? 'text-body-md font-semibold' : 'text-headline-sm')}>{title}</p>}
        <div className="font-body-sm text-body-sm wrap-break-word">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
