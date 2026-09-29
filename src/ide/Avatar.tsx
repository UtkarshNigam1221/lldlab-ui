import { useState, type ReactNode } from 'react';
import { cx } from '../internal/cx';

const SIZE = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-12 text-sm' } as const;

export type AvatarProps = { name: string; src?: string; size?: keyof typeof SIZE; badge?: ReactNode };

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, src, size = 'md', badge }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative inline-flex shrink-0">
      {src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} className={cx('rounded-full object-cover', SIZE[size])} />
      ) : (
        <span role="img" aria-label={name} className={cx('inline-flex items-center justify-center rounded-full bg-ink font-label-mono text-on-ink', SIZE[size])}>
          {initials(name)}
        </span>
      )}
      {badge && (
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-surface-elevated bg-brand-cobalt px-1 font-label-mono text-[10px] leading-4 text-white">
          {badge}
        </span>
      )}
    </span>
  );
}
