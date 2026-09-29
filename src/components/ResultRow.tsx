import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const STATUS = {
  pass: { icon: 'check_circle', tone: 'success', label: 'Passed' },
  fail: { icon: 'cancel', tone: 'danger', label: 'Failed' },
  pending: { icon: 'schedule', tone: 'muted', label: 'Pending' },
} as const;

export type ResultRowProps = NativeProps<'div', { status: keyof typeof STATUS; title: ReactNode; detail?: ReactNode; meta?: ReactNode }>;

export function ResultRow({ status, title, detail, meta, ...rest }: ResultRowProps) {
  const s = STATUS[status];
  return (
    <div {...rest} className="flex min-w-0 items-start gap-space-sm py-space-sm">
      <Icon name={s.icon} tone={s.tone} filled label={s.label} />
      <div className="min-w-0 flex-1">
        <p className="font-body-md text-body-md text-on-surface wrap-break-word">{title}</p>
        {detail && <p className="whitespace-pre-wrap font-code-inline text-code-inline text-on-surface-variant wrap-break-word">{detail}</p>}
      </div>
      {meta && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{meta}</span>}
    </div>
  );
}
