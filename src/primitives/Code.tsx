import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';

export type CodeProps = NativeProps<'code', { children: ReactNode }>;

export function Code({ children, ...rest }: CodeProps) {
  return <code {...rest} className="rounded bg-surface-muted px-space-xs py-space-2xs font-code-inline text-code-inline text-ink wrap-break-word">{children}</code>;
}
