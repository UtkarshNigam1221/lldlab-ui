import type { ReactNode } from 'react';
import { Dot } from '../components/Dot';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';

export type EyebrowProps = NativeProps<'span', { tone?: StatusTone; children: ReactNode }>;

export function Eyebrow({ tone = 'brand', children, ...rest }: EyebrowProps) {
  return (
    <span {...rest} className="inline-flex max-w-full items-center gap-space-xs rounded-full border border-border-subtle bg-surface-elevated px-space-sm py-space-2xs font-label-mono text-label-mono uppercase text-on-surface-variant">
      <Dot tone={tone} />
      <span className="truncate">{children}</span>
    </span>
  );
}
