import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const STATUS = {
  pass: { icon: 'check_circle', tone: 'success', label: 'Passed' },
  fail: { icon: 'cancel', tone: 'danger', label: 'Failed' },
  warning: { icon: 'warning', tone: 'warning', label: 'Warning' },
  pending: { icon: 'schedule', tone: 'muted', label: 'Pending' },
} as const;
const VARIANT = { plain: 'items-start py-space-sm', boxed: 'items-center rounded bg-surface-subtle p-space-sm' } as const;

export type ResultRowProps = NativeProps<'div', {
  status: keyof typeof STATUS;
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  variant?: keyof typeof VARIANT;
  selected?: boolean;
  titleMono?: boolean;
}>;

export function ResultRow({ status, title, detail, meta, badge, variant = 'plain', selected, titleMono, ...rest }: ResultRowProps) {
  const s = STATUS[status];
  return (
    <div {...rest} className={cx('flex min-w-0 gap-space-sm', VARIANT[variant], selected && 'border-l-4 border-l-brand-cobalt pl-space-sm')}>
      <Icon name={s.icon} tone={s.tone} filled label={s.label} />
      <div className="min-w-0 flex-1">
        <p className={cx('text-on-surface wrap-break-word', titleMono ? 'font-code-inline text-code-inline' : 'font-body-md text-body-md')}>{title}</p>
        {detail && <p className="whitespace-pre-wrap font-code-inline text-code-inline text-on-surface-variant wrap-break-word">{detail}</p>}
      </div>
      {(meta || badge) && (
        <div className="flex shrink-0 items-center gap-space-xs">
          {meta && <span className="font-label-mono text-label-mono text-on-surface-variant">{meta}</span>}
          {badge}
        </div>
      )}
    </div>
  );
}
