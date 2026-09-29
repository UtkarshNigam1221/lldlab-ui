import type { ReactNode } from 'react';
import { Dot } from '../components/Dot';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';

const VARIANT = {
  pill: 'rounded-full bg-surface-elevated shadow-sm px-space-sm py-space-2xs',
  tinted: 'rounded-full bg-surface-container px-space-sm py-space-2xs',
  plain: '',
} as const;
const TEXT = { neutral: 'text-on-surface-variant', brand: 'text-fg-brand', success: 'text-fg-success', warning: 'text-fg-warning', danger: 'text-fg-danger' } as const;

export type EyebrowProps = NativeProps<'span', { tone?: StatusTone; pulse?: boolean; variant?: keyof typeof VARIANT; dot?: boolean; children: ReactNode }>;

/** Mono kicker above a heading; the text takes the tone colour, as in the Stitch mockups. */
export function Eyebrow({ tone = 'brand', pulse, variant = 'pill', dot = true, children, ...rest }: EyebrowProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-xs font-label-mono text-label-mono uppercase', TEXT[tone], VARIANT[variant])}>
      {dot && <Dot tone={tone} pulse={pulse} data-dot="" />}
      <span className="truncate">{children}</span>
    </span>
  );
}
