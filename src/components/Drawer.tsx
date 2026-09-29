import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { IconButton } from './IconButton';

const SIDE = { left: 'left-0 border-r', right: 'right-0 border-l' } as const;
const SIZE = { sm: 'w-[min(85vw,20rem)]', md: 'w-[min(90vw,28rem)]' } as const;

export type DrawerProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  side?: keyof typeof SIDE;
  size?: keyof typeof SIZE;
  children?: ReactNode;
}>;

/** Modal slide-over (mobile navigation, side panels). Native props go to the panel. */
export function Drawer({ open, onClose, title, side = 'left', size = 'sm', children, ...rest }: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const theme = useThemeTone();
  useModal({ open, onClose, panelRef, initialFocusRef: bodyRef });

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 bg-brand-obsidian/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('fixed inset-y-0 flex flex-col border-border-subtle bg-surface-elevated text-on-surface shadow-md outline-none', SIDE[side], SIZE[size])}
      >
        <div className="flex min-w-0 items-center justify-between gap-space-sm border-b border-border-subtle px-space-md py-space-sm">
          <h2 id={titleId} className="min-w-0 truncate font-display text-headline-sm text-ink">{title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto p-space-md">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
