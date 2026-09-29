import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';

export type KbdProps = NativeProps<'kbd', { children: ReactNode }>;

export function Kbd({ children, ...rest }: KbdProps) {
  return (
    <kbd {...rest} className="inline-flex items-center rounded border border-border-subtle bg-surface-subtle px-space-xs font-label-mono text-[11px] leading-5 text-on-surface-variant">
      {children}
    </kbd>
  );
}
