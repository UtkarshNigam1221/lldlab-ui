import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const SHAPE = { line: 'rounded', pill: 'rounded-full', rect: 'rounded-xl', circle: 'rounded-full aspect-square' } as const;
const WIDTH = { full: 'w-full', '3/4': 'w-3/4', '1/2': 'w-1/2', '1/3': 'w-1/3', '1/4': 'w-1/4' } as const;
const HEIGHT = { xs: 'h-2', sm: 'h-3', md: 'h-4', lg: 'h-8', xl: 'h-24' } as const;
const DEFAULT_HEIGHT: Record<keyof typeof SHAPE, keyof typeof HEIGHT> = { line: 'sm', pill: 'lg', rect: 'xl', circle: 'lg' };

export type SkeletonProps = NativeProps<'div', {
  shape?: keyof typeof SHAPE;
  width?: keyof typeof WIDTH;
  height?: keyof typeof HEIGHT;
  /** Render n text lines (the last one shorter). */
  lines?: number;
  children?: never;
}>;

/** Loading placeholder. Hidden from assistive tech: pair it with a <Message> saying what is loading. */
export function Skeleton({ shape = 'line', width = 'full', height, lines, ...rest }: SkeletonProps) {
  const h = HEIGHT[height ?? DEFAULT_HEIGHT[shape]];
  if (lines && lines > 1) {
    return (
      <div {...rest} aria-hidden="true" className="flex w-full min-w-0 flex-col gap-space-xs">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={cx('skeleton-shimmer rounded', h, i === lines - 1 ? 'w-3/4' : 'w-full')} />
        ))}
      </div>
    );
  }
  return <div {...rest} aria-hidden="true" className={cx('skeleton-shimmer shrink-0', SHAPE[shape], h, shape !== 'circle' && WIDTH[width])} />;
}
