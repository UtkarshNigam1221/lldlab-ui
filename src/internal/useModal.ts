import { useEffect, useRef, type RefObject } from 'react';

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open modal panels. The one containing focus handles Tab and Escape; if focus is in none, the last opened does.
// (Registration order alone isn't enough: React runs a nested child's effect before its parent's.)
const openPanels: HTMLElement[] = [];
// Reference-counted body scroll lock, so nested modals restore the original value in any unmount order.
let locks = 0;
let savedOverflow = '';
function lockScroll() {
  if (locks++ === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}
function unlockScroll() {
  if (--locks === 0) document.body.style.overflow = savedOverflow;
}

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
    const panel = panelRef.current!;
    openPanels.push(panel);
    lockScroll();
    const focusables = () => [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const initial = initialFocusRef?.current;
    const target = initial?.matches(FOCUSABLE) ? initial : initial?.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? focusables()[0] ?? panel).focus();

    const onKey = (e: KeyboardEvent) => {
      // A nested widget (e.g. a Menu) that already handled the key owns it, and so does a modal opened on top.
      if (e.defaultPrevented) return;
      const owner = openPanels.find((p) => p.contains(document.activeElement));
      if (owner ? owner !== panel : openPanels[openPanels.length - 1] !== panel) return;
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
      openPanels.splice(openPanels.indexOf(panel), 1);
      unlockScroll();
      if (opener?.isConnected) opener.focus();
      else {
        (document.activeElement as HTMLElement | null)?.blur();
        document.body.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable; the effect is keyed on open only
  }, [open]);
}
