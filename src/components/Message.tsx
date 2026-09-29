import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';

export type MessageProps = NativeProps<'p', { tone?: 'default' | 'danger'; children: ReactNode }>;

/** One-line loading / error / empty text. Danger announces as an alert. */
export function Message({ tone = 'default', children, ...rest }: MessageProps) {
  return tone === 'danger' ? (
    <p {...rest} role="alert" className="font-body-md text-body-md text-fg-danger">{children}</p>
  ) : (
    <p {...rest} role="status" className="font-body-md text-body-md text-on-surface-variant">{children}</p>
  );
}
