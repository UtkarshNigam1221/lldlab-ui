import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { responsive, type Responsive } from '../internal/responsive';
import { HEADING_SIZE, type HeadingSize } from '../internal/tables';

const TAG = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;
const DEFAULT_SIZE: Record<keyof typeof TAG, HeadingSize> = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'sm' };
const TONE = {
  default: 'text-ink',
  muted: 'text-on-surface-variant',
  brand: 'text-fg-brand',
  inverse: 'text-on-primary',
  success: 'text-fg-success',
  danger: 'text-fg-danger',
  warning: 'text-fg-warning',
} as const;
const ALIGN = { start: '', center: 'text-center' } as const;

export type HeadingProps = NativeProps<'h2', {
  level: keyof typeof TAG;
  size?: Responsive<HeadingSize>;
  tone?: keyof typeof TONE;
  truncate?: boolean;
  align?: keyof typeof ALIGN;
  /** Balanced line breaks (default true). */
  balance?: boolean;
  /** Override the size's line height (none: 1, for tight hero headlines). */
  leading?: 'none';
}>;

export function Heading({ level, size, tone = 'default', truncate, align = 'start', balance = true, leading, ...rest }: HeadingProps) {
  const C = TAG[level];
  return (
    <C
      {...rest}
      className={cx('min-w-0 font-display', truncate ? 'truncate' : cx(balance && 'text-balance', 'wrap-break-word'), responsive(HEADING_SIZE, size ?? DEFAULT_SIZE[level]), leading === 'none' && 'leading-none', TONE[tone], ALIGN[align])}
    />
  );
}
