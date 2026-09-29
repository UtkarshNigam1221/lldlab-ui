import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { AVATAR_SIZE, type AvatarProps } from './Avatar';

export type AvatarGroupProps = NativeProps<'div', { children: ReactNode; max?: number; size?: keyof typeof AVATAR_SIZE; label?: string }>;

export function AvatarGroup({ children, max, size = 'md', label, ...rest }: AvatarGroupProps) {
  const all = Children.toArray(children);
  const shown = max !== undefined ? all.slice(0, Math.max(0, max)) : all;
  const extra = all.length - shown.length;
  return (
    <div {...rest} role="group" aria-label={label} className="flex items-center -space-x-2">
      {shown.map((child, i) => (
        <span key={i} className="inline-flex rounded-full ring-2 ring-surface-elevated">
          {isValidElement(child) ? cloneElement(child as ReactElement<AvatarProps>, { size }) : child}
        </span>
      ))}
      {extra > 0 && (
        <span className={cx('inline-flex items-center justify-center rounded-full bg-surface-muted font-label-mono text-on-surface-variant ring-2 ring-surface-elevated', AVATAR_SIZE[size])}>
          +{extra}
        </span>
      )}
    </div>
  );
}
