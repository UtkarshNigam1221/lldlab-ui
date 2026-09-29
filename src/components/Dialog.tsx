import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useThemeTone } from '../theme/Theme';
import { IconButton } from './IconButton';

const SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' } as const;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const onCloseRef = useRef(onClose);
  // Portals leave the scope's DOM, so the tone comes from the React tree, not from focus.
  const theme = useThemeTone();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current!;
    const focusables = () => [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    (contentRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? focusables()[0] ?? panel).focus();

    const onKey = (e: KeyboardEvent) => {
      // A nested widget (e.g. a Menu) that already handled the key owns it.
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      const onEdge = active === panel || !panel.contains(active);
      if (e.shiftKey && (active === first || onEdge)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || onEdge)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus();
      else {
        (document.activeElement as HTMLElement | null)?.blur();
        document.body.focus();
      }
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-obsidian/40 p-space-md backdrop-blur-sm sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current();
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
          <IconButton icon="close" label="Close" onClick={() => onCloseRef.current()} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
