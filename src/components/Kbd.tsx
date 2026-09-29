import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const VARIANT = {
  outline: 'rounded border border-border-subtle bg-surface-subtle',
  // Lifted keycap for filled fields (the header search).
  raised: 'rounded bg-surface-elevated shadow-sm',
} as const;

export type KbdProps = NativeProps<'kbd', { variant?: keyof typeof VARIANT; children: ReactNode }>;

export function Kbd({ variant = 'outline', children, ...rest }: KbdProps) {
  return (
    <kbd {...rest} className={cx('inline-flex items-center px-space-xs font-label-mono text-[11px] leading-5 text-on-surface-variant', VARIANT[variant])}>
      {children}
    </kbd>
  );
}
