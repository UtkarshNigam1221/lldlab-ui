import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const POSITION = { sticky: 'sticky top-0', fixed: 'fixed inset-x-0 top-0', static: 'relative' } as const;
const HEIGHT = { sm: 'h-12', md: 'h-16' } as const;

export type AppBarProps = NativeProps<'header', {
  position?: keyof typeof POSITION;
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  blur?: boolean;
  /** md (64px) matches --spacing-appbar, which Split stickyOffset="appbar" clears. */
  height?: keyof typeof HEIGHT;
  /** Constrain the content to the 80rem page column. */
  contained?: boolean;
  children?: never;
}>;

export function AppBar({ position = 'sticky', start, center, end, blur = true, height = 'md', contained = true, ...rest }: AppBarProps) {
  return (
    <header {...rest} className={cx('z-40 w-full min-w-0 border-b border-border-subtle', POSITION[position], blur ? 'bg-surface-elevated/95 backdrop-blur-md' : 'bg-surface-elevated')}>
      <div className={cx('flex min-w-0 items-center gap-space-md px-gutter-fluid', HEIGHT[height], contained && 'mx-auto max-w-7xl')}>
        <div className="flex min-w-0 shrink-0 items-center gap-space-sm">{start}</div>
        <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
        <div className="flex shrink-0 items-center gap-space-xs">{end}</div>
      </div>
    </header>
  );
}
