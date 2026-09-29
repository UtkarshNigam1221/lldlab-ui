import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

const VARIANT = {
  ghost: 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
  subtle: 'bg-surface-subtle text-on-surface hover:bg-surface-muted',
  primary: 'bg-ink text-on-ink hover:bg-ink-hover',
} as const;
const SIZE = { sm: 'size-8', md: 'size-10' } as const;

export type IconButtonProps = NativeProps<'button', { icon: string; label: string; variant?: keyof typeof VARIANT; size?: keyof typeof SIZE; children?: never }>;

export function IconButton({ icon, label, variant = 'ghost', size = 'md', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={cx('inline-flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50', VARIANT[variant], SIZE[size], FOCUS_RING, TOUCH_ICON)}
    >
      <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
    </button>
  );
}
