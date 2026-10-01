import { useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';

export type FullScreenProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the surface. */
  label: string;
  /** Element to focus on open (default: the first focusable one). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
}>;

/**
 * A modal surface over the whole viewport (e.g. an IDE in focus mode). Escape closes it unless a widget inside
 * already handled the key; focus stays inside and returns to the opener; the page behind doesn't scroll.
 * Children fill it: give the child `fill`, or use a Workbench.
 */
export function FullScreen({ open, onClose, label, initialFocusRef, children, ...rest }: FullScreenProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const theme = useThemeTone();
  useModal({ open, onClose, panelRef, initialFocusRef });

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div
      {...rest}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      data-theme={theme}
      className="fixed inset-0 z-50 flex min-w-0 flex-col bg-surface text-on-surface outline-none"
    >
      {children}
    </div>,
    document.body,
  );
}
