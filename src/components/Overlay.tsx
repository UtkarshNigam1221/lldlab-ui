import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type OverlayProps = NativeProps<'div', { children: ReactNode; overlay: ReactNode; blur?: boolean }>;

/** Covers content (e.g. a signed-out gate): covered content is inert and hidden from assistive tech. */
export function Overlay({ children, overlay, blur = true, ...rest }: OverlayProps) {
  return (
    <div {...rest} className="relative min-w-0 overflow-hidden rounded-xl">
      <div inert aria-hidden="true" className={cx('pointer-events-none select-none', blur && 'blur-sm')}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-surface/70 p-space-md">{overlay}</div>
    </div>
  );
}
