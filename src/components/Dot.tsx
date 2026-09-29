import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';

const SIZE = { sm: 'size-1.5', md: 'size-2' } as const;

export type DotProps = NativeProps<'span', { tone?: StatusTone; size?: keyof typeof SIZE; pulse?: boolean; children?: never }>;

export function Dot({ tone = 'neutral', size = 'sm', pulse, ...rest }: DotProps) {
  return <span {...rest} aria-hidden="true" className={cx('inline-block shrink-0 rounded-full', DOT_TONE[tone], SIZE[size], pulse && 'animate-pulse')} />;
}
