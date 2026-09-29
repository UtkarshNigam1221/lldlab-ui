import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type MessageProps = NativeProps<'p', { tone?: 'default' | 'danger'; children: ReactNode }>;

/** Short loading / error / empty text. Danger announces as an alert. */
export function Message({ tone = 'default', children, ...rest }: MessageProps) {
  return <p {...rest} role={tone === 'danger' ? 'alert' : 'status'} className={cx('min-w-0 font-body-md text-body-md wrap-break-word', tone === 'danger' ? 'text-fg-danger' : 'text-on-surface-variant')}>{children}</p>;
}
