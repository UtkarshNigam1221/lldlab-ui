import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type TimelineStatus = 'done' | 'current' | 'locked' | 'success' | 'warning' | 'danger' | 'pending';
export type TimelineItem = { id: string; status: TimelineStatus; title: ReactNode; badge?: ReactNode; description?: ReactNode; meta?: ReactNode };

// Marker pairs are the badge bg/text tokens inverted, AA in both scopes; `text` is spoken so colour is never the only signal.
const STATUS: Record<TimelineStatus, { icon: string; marker: string; text: string }> = {
  done: { icon: 'check', marker: 'bg-badge-beginner-text text-badge-beginner-bg', text: 'Completed' },
  current: { icon: 'radio_button_checked', marker: 'bg-badge-intermediate-text text-badge-intermediate-bg ring-4 ring-badge-intermediate-bg', text: 'Current' },
  locked: { icon: 'lock', marker: 'bg-surface-muted text-on-surface-variant', text: 'Locked' },
  success: { icon: 'check_circle', marker: 'bg-badge-beginner-text text-badge-beginner-bg', text: 'Passed' },
  warning: { icon: 'warning', marker: 'bg-badge-amber-text text-badge-amber-bg', text: 'Warning' },
  danger: { icon: 'close', marker: 'bg-badge-advanced-text text-badge-advanced-bg', text: 'Failed' },
  pending: { icon: 'schedule', marker: 'bg-surface-muted text-on-surface-variant', text: 'Pending' },
};

export type TimelineProps = NativeProps<'ol', { label: string; items: TimelineItem[]; children?: never }>;

export function Timeline({ label, items, ...rest }: TimelineProps) {
  return (
    <ol {...rest} aria-label={label} className="flex min-w-0 flex-col">
      {items.map((item, i) => {
        const s = STATUS[item.status];
        return (
          <li key={item.id} aria-current={item.status === 'current' ? 'step' : undefined} className="relative flex min-w-0 gap-space-sm pb-space-md last:pb-0">
            {i < items.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-3 top-7 w-px -translate-x-1/2 bg-border-subtle" />}
            <span aria-hidden="true" className={cx('relative inline-flex size-6 shrink-0 items-center justify-center rounded-full', s.marker)}>
              <Icon name={s.icon} size="sm" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex min-w-0 flex-wrap items-center gap-space-xs">
                <p className="font-body-md text-body-md font-medium text-on-surface wrap-break-word">
                  <span className="sr-only">{s.text}: </span>
                  {item.title}
                </p>
                {item.badge}
              </div>
              {item.description && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{item.description}</p>}
              {item.meta && <p className="font-label-mono text-label-mono text-on-surface-variant">{item.meta}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
