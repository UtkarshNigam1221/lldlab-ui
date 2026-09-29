import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

// Vivid brand colours: these icons are decorative, so they don't need text contrast.
const ICON_TONE = { muted: 'text-on-surface-variant', brand: 'text-brand-cobalt', success: 'text-brand-emerald', warning: 'text-brand-amber', danger: 'text-brand-crimson' } as const;
const VARIANT = { plain: 'gap-space-sm', tile: 'gap-space-xs rounded-lg bg-surface-subtle px-space-md py-space-xs shadow-sm' } as const;

export type StatProps = NativeProps<'div', { icon: string; label: ReactNode; value: ReactNode; variant?: keyof typeof VARIANT; iconTone?: keyof typeof ICON_TONE }>;

export function Stat({ icon, label, value, variant = 'plain', iconTone = 'muted', ...rest }: StatProps) {
  return (
    <div {...rest} className={cx('flex min-w-0 items-center', VARIANT[variant])}>
      <span className={ICON_TONE[iconTone]}>
        <Icon name={icon} tone="inherit" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-label-mono text-label-mono uppercase leading-none text-on-surface-variant">{label}</p>
        <p className="mt-space-2xs truncate font-display text-headline-sm leading-none text-ink">{value}</p>
      </div>
    </div>
  );
}
