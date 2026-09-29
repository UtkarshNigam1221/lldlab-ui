import type { ReactNode } from 'react';

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-border-subtle bg-surface-subtle px-space-xs font-label-mono text-[11px] leading-5 text-on-surface-variant">
      {children}
    </kbd>
  );
}
