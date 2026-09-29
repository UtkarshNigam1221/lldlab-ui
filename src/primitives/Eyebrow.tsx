import type { ReactNode } from 'react';
import { Dot } from '../components/Dot';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';

const VARIANT = {
  pill: 'rounded-full border border-border-subtle bg-surface-elevated px-space-sm py-space-2xs',
  plain: '',
} as const;

export type EyebrowProps = NativeProps<'span', { tone?: StatusTone; pulse?: boolean; variant?: keyof typeof VARIANT; children: ReactNode }>;

export function Eyebrow({ tone = 'brand', pulse, variant = 'pill', children, ...rest }: EyebrowProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-xs font-label-mono text-label-mono uppercase text-on-surface-variant', VARIANT[variant])}>
      <Dot tone={tone} pulse={pulse} />
      <span className="truncate">{children}</span>
    </span>
  );
}
