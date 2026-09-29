import { cx, FOCUS_RING, TOUCH_ICON } from '../internal/cx';
import { Icon } from './Icon';

const TONE = { neutral: 'border-border-subtle text-on-surface', brand: 'border-brand-cobalt/40 text-fg-brand' } as const;

export type ChipProps = { tone?: keyof typeof TONE; icon?: string; onRemove?: () => void; children: string };

export function Chip({ tone = 'neutral', icon, onRemove, children }: ChipProps) {
  return (
    <span className={cx('inline-flex max-w-full items-center gap-space-2xs rounded-full border bg-surface-elevated px-space-sm py-space-2xs font-body-sm text-body-sm', TONE[tone])}>
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
