import { useState, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { DOT_TONE, type StatusTone } from '../internal/tones';

export const AVATAR_SIZE = { sm: 'size-7 text-[11px]', ms: 'size-8 text-xs', md: 'size-9 text-xs', ml: 'size-10 text-sm', lg: 'size-12 text-sm' } as const;
const SHAPE = { circle: 'rounded-full', square: 'rounded-lg' } as const;
const TONE = {
  ink: 'bg-ink text-on-ink',
  brand: 'bg-brand-cobalt text-white',
  success: 'bg-badge-beginner-text text-badge-beginner-bg',
  warning: 'bg-badge-amber-text text-badge-amber-bg',
  danger: 'bg-badge-advanced-text text-badge-advanced-bg',
} as const;

export type AvatarProps = NativeProps<'span', {
  name: string;
  src?: string;
  size?: keyof typeof AVATAR_SIZE;
  shape?: keyof typeof SHAPE;
  tone?: keyof typeof TONE;
  badge?: ReactNode;
  /** Presence dot at the corner. Pair with `statusLabel` so it isn't colour-only. */
  status?: StatusTone;
  statusLabel?: string;
  children?: never;
}>;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, src, size = 'md', shape = 'circle', tone = 'ink', badge, status, statusLabel, ...rest }: AvatarProps) {
  // Remember which src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const accessibleName = statusLabel ? `${name}, ${statusLabel}` : name;
  return (
    <span {...rest} className="relative inline-flex shrink-0">
      {src && failedSrc !== src ? (
        <img src={src} alt={accessibleName} onError={() => setFailedSrc(src)} className={cx('object-cover', SHAPE[shape], AVATAR_SIZE[size])} />
      ) : (
        <span role="img" aria-label={accessibleName} className={cx('inline-flex items-center justify-center font-label-mono', SHAPE[shape], TONE[tone], AVATAR_SIZE[size])}>
          {initials(name)}
        </span>
      )}
      {status && <span aria-hidden="true" className={cx('absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-surface-elevated', DOT_TONE[status])} />}
      {badge && (
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-surface-elevated bg-brand-cobalt px-1 font-label-mono text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </span>
  );
}
