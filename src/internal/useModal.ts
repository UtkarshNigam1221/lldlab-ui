import { useEffect, useRef, type RefObject } from 'react';

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Options = {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
  /** Element to focus first (or whose first focusable descendant to focus). */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

/** Modal behaviour shared by Dialog, Drawer and CommandPalette. Runs only when `open` changes. */
export function useModal({ open, onClose, panelRef, initialFocusRef }: Options): void {
  const onCloseRef = useRef(onClose);
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
    const initial = initialFocusRef?.current;
    const target = initial?.matches(FOCUSABLE) ? initial : initial?.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? focusables()[0] ?? panel).focus();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable; the effect is keyed on open only
  }, [open]);
}
