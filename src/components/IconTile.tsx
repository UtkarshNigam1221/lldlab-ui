import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type IconTileTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const TONE: Record<IconTileTone, string> = {
  neutral: 'bg-surface-muted text-on-surface-variant',
  brand: 'bg-badge-intermediate-bg text-badge-intermediate-text',
  success: 'bg-badge-beginner-bg text-badge-beginner-text',
  warning: 'bg-badge-amber-bg text-badge-amber-text',
  danger: 'bg-badge-advanced-bg text-badge-advanced-text',
};
// Inverted pairs: both halves are AA in light and dark scopes.
const FILLED: Record<IconTileTone, string> = {
  neutral: 'bg-ink text-on-ink',
  brand: 'bg-badge-intermediate-text text-badge-intermediate-bg',
  success: 'bg-badge-beginner-text text-badge-beginner-bg',
  warning: 'bg-badge-amber-text text-badge-amber-bg',
  danger: 'bg-badge-advanced-text text-badge-advanced-bg',
};
const SIZE = { sm: 'size-8', md: 'size-10', lg: 'size-12', xl: 'size-14' } as const;
const ICON_SIZE = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const;
const SHAPE = { square: 'rounded-lg', circle: 'rounded-full' } as const;

export type IconTileProps = NativeProps<'span', {
  icon: string;
  tone?: IconTileTone;
  size?: keyof typeof SIZE;
  shape?: keyof typeof SHAPE;
  filled?: boolean;
  label?: string;
  children?: never;
}>;

export function IconTile({ icon, tone = 'neutral', size = 'md', shape = 'square', filled, label, ...rest }: IconTileProps) {
  return (
    <span
      {...rest}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('inline-flex shrink-0 items-center justify-center', filled ? FILLED[tone] : TONE[tone], SIZE[size], SHAPE[shape])}
    >
      <Icon name={icon} size={ICON_SIZE[size]} filled={filled} />
    </span>
  );
}
