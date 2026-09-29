import type { ReactNode } from 'react';

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-muted px-space-xs py-space-2xs font-code-inline text-code-inline text-ink wrap-break-word">{children}</code>;
}
