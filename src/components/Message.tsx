import type { ReactNode } from 'react';

export type MessageProps = { tone?: 'default' | 'danger'; children: ReactNode };

/** One-line loading / error / empty text. Danger announces as an alert. */
export function Message({ tone = 'default', children }: MessageProps) {
  return tone === 'danger' ? (
    <p role="alert" className="font-body-md text-body-md text-fg-danger">{children}</p>
  ) : (
    <p role="status" className="font-body-md text-body-md text-on-surface-variant">{children}</p>
  );
}
