import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Heading } from '../primitives/Heading';
import { Icon } from './Icon';

const TONE = {
  default: { tile: 'bg-surface-muted text-on-surface-variant', text: 'text-on-surface-variant' },
  danger: { tile: 'bg-badge-advanced-bg text-badge-advanced-text', text: 'text-fg-danger' },
} as const;

export type EmptyStateProps = NativeProps<'div', {
  icon?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Illustration that replaces the icon. */
  media?: ReactNode;
  /** Large mono numeral such as "404"; replaces the icon. */
  code?: string;
  tone?: keyof typeof TONE;
}>;

export function EmptyState({ icon = 'inbox', title, description, action, media, code, tone = 'default', ...rest }: EmptyStateProps) {
  const t = TONE[tone];
  return (
    <div {...rest} className="flex min-w-0 flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
      {media ? (
        <div className="w-full min-w-0">{media}</div>
      ) : code ? (
        <p className="font-label-mono text-6xl font-semibold text-ink">{code}</p>
      ) : (
        <span className={cx('inline-flex size-12 items-center justify-center rounded-full', t.tile)}>
          <Icon name={icon} size="lg" />
        </span>
      )}
      <div className="w-full min-w-0">
        <Heading level={3} size="sm">{title}</Heading>
      </div>
      {description && <p className={cx('w-full min-w-0 max-w-prose font-body-sm text-body-sm wrap-break-word', t.text)}>{description}</p>}
      {action}
    </div>
  );
}
