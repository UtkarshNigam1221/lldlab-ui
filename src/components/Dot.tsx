import { cx } from '../internal/cx';
import { DOT_TONE, type StatusTone } from '../internal/tones';

const SIZE = { sm: 'size-1.5', md: 'size-2' } as const;

export type DotProps = { tone?: StatusTone; size?: keyof typeof SIZE; pulse?: boolean };

export function Dot({ tone = 'neutral', size = 'sm', pulse }: DotProps) {
  return <span aria-hidden="true" className={cx('inline-block shrink-0 rounded-full', DOT_TONE[tone], SIZE[size], pulse && 'animate-pulse')} />;
}
