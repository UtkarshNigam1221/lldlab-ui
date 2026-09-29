import type { ElementType } from 'react';
import { cx } from '../internal/cx';
import type { PolyProps } from '../internal/poly';
import { TEXT_TONE, type Tone } from '../internal/tones';

const VARIANT = {
  'body-lead': 'font-body-lead text-body-lead',
  'body-md': 'font-body-md text-body-md',
  'body-sm': 'font-body-sm text-body-sm',
  label: 'font-label-mono text-label-mono uppercase',
  code: 'font-code-inline text-code-inline',
} as const;
const WEIGHT = { regular: '', medium: 'font-medium', semibold: 'font-semibold' } as const;
const CLAMP = { 1: 'line-clamp-1', 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4' } as const;

type TextOwnProps = {
  variant?: keyof typeof VARIANT;
  tone?: Tone;
  weight?: keyof typeof WEIGHT;
  truncate?: boolean;
  clamp?: keyof typeof CLAMP;
};
export type TextProps<E extends ElementType = 'p'> = PolyProps<E, TextOwnProps>;

export function Text<E extends ElementType = 'p'>({ as, variant = 'body-md', tone = 'default', weight = 'regular', truncate, clamp, ...rest }: TextProps<E>) {
  const C: ElementType = as ?? 'p';
  return (
    <C
      {...rest}
      className={cx('min-w-0 wrap-break-word', VARIANT[variant], TEXT_TONE[tone], WEIGHT[weight], truncate && 'truncate', clamp && CLAMP[clamp])}
    />
  );
}
