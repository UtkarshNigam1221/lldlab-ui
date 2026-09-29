import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';
import { Icon } from './Icon';

const TONE = {
  neutral: 'border-border-subtle text-on-surface',
  brand: 'border-brand-cobalt/40 text-fg-brand',
  info: 'border-brand-cobalt/40 text-fg-brand',
  success: 'border-fg-success/40 text-fg-success',
  warning: 'border-fg-warning/40 text-fg-warning',
  danger: 'border-fg-danger/40 text-fg-danger',
} as const;

export type ChipProps = NativeProps<'span', {
  tone?: keyof typeof TONE;
  icon?: string;
  /** A status tone, or any CSS colour (e.g. a language brand colour). */
  dot?: StatusTone | string;
  onRemove?: () => void;
  children: string;
}>;

const isStatusTone = (d: string): d is StatusTone => d in DOT_TONE;

export function Chip({ tone = 'neutral', icon, dot, onRemove, children, ...rest }: ChipProps) {
  return (
    <span {...rest} className={cx('inline-flex max-w-full items-center gap-space-2xs rounded-full border bg-surface-elevated px-space-sm py-space-2xs font-body-sm text-body-sm', TONE[tone])}>
      {dot &&
        (isStatusTone(dot) ? (
          <span aria-hidden="true" className={cx('inline-block size-1.5 shrink-0 rounded-full', DOT_TONE[dot])} />
        ) : (
          <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
        ))}
      {icon && <Icon name={icon} size="sm" />}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${children}`}
          onClick={onRemove}
          className={cx('-mr-space-2xs inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface', FOCUS_RING, TOUCH_ICON)}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}
