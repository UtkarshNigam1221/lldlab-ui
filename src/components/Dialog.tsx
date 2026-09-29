import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { IconButton } from './IconButton';

const SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' } as const;

export type DialogProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZE;
  children?: ReactNode;
}>;

/** Native props (id, data-*, aria-*) go to the dialog panel. */
export function Dialog({ open, onClose, title, description, footer, size = 'md', children, ...rest }: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Portals leave the scope's DOM, so the tone comes from the React tree, not from focus.
  const theme = useThemeTone();
  useModal({ open, onClose, panelRef, initialFocusRef: contentRef });

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-obsidian/40 p-space-md backdrop-blur-sm sm:items-center"
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
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cx('relative flex max-h-[calc(100dvh-2rem)] w-full min-w-0 flex-col gap-space-md overflow-y-auto rounded-xl bg-surface-elevated p-space-lg text-on-surface shadow-md outline-none', SIZE[size])}
      >
        <div className="min-w-0 pr-space-xl">
          <h2 id={titleId} className="font-display text-headline-md text-ink wrap-break-word">{title}</h2>
          {description && <p id={descId} className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
        </div>
        <div ref={contentRef} className="flex min-w-0 flex-col gap-space-sm">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-space-sm">{footer}</div>}
        <div className="absolute right-space-md top-space-md">
          <IconButton icon="close" label="Close" onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
