import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { useThemeTone } from '../theme/Theme';

type TriggerProps = {
  'aria-describedby'?: string;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  ref?: Ref<HTMLElement>;
};

export type TooltipProps = {
  content: ReactNode;
  children: ReactElement<TriggerProps>;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
};

const GAP = 8;

/** Short, non-interactive hint for a trigger. Never put essential information only in a tooltip. */
export function Tooltip({ content, children, side = 'top', delay = 400 }: TooltipProps) {
  const id = useId();
  const theme = useThemeTone();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
    setPos(null);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const t = tipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let s = side;
    if (s === 'top' && r.top - t.height - GAP < 0) s = 'bottom';
    else if (s === 'bottom' && r.bottom + t.height + GAP > vh) s = 'top';
    else if (s === 'left' && r.left - t.width - GAP < 0) s = 'right';
    else if (s === 'right' && r.right + t.width + GAP > vw) s = 'left';
    let top = s === 'top' ? r.top - t.height - GAP : s === 'bottom' ? r.bottom + GAP : r.top + r.height / 2 - t.height / 2;
    let left = s === 'left' ? r.left - t.width - GAP : s === 'right' ? r.right + GAP : r.left + r.width / 2 - t.width / 2;
    left = Math.min(Math.max(GAP, left), Math.max(GAP, vw - t.width - GAP));
    top = Math.min(Math.max(GAP, top), Math.max(GAP, vh - t.height - GAP));
    setPos({ top, left });
  }, [open, side]);

  const own = children.props;
  const trigger = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      const r = own.ref;
      if (typeof r === 'function') r(el);
      else if (r && typeof r === 'object') (r as { current: HTMLElement | null }).current = el;
    },
    'aria-describedby': open ? [own['aria-describedby'], id].filter(Boolean).join(' ') : own['aria-describedby'],
    onMouseEnter: (e: MouseEvent) => {
      own.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent) => {
      own.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent) => {
      own.onFocus?.(e);
      show();
    },
    onBlur: (e: FocusEvent) => {
      own.onBlur?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            data-theme={theme}
            className="pointer-events-none fixed z-50 max-w-[min(20rem,calc(100vw-1rem))] rounded-lg bg-ink px-space-sm py-space-xs font-body-sm text-body-sm text-on-ink shadow-md wrap-break-word"
            style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
