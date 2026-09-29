import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cx } from '../internal/cx';
import { IconButton } from './IconButton';

export type ToastOptions = { title: ReactNode; description?: ReactNode; tone?: 'default' | 'success' | 'danger'; action?: ReactNode; duration?: number };
type Toast = Required<Pick<ToastOptions, 'tone' | 'duration'>> & ToastOptions & { id: number };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const EMPTY: Toast[] = [];
const emit = () => listeners.forEach((l) => l());

/** Module-level store: toasts can be shown from anywhere, even before <Toaster /> mounts. */
export const toastStore = {
  show(options: ToastOptions): number {
    // `??` (not spread defaults) so an explicit `undefined` still gets the default.
    const toast: Toast = { ...options, tone: options.tone ?? 'default', duration: options.duration ?? 4000, id: nextId++ };
    toasts = [...toasts, toast];
    emit();
    return toast.id;
  },
  dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  clear() {
    toasts = [];
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => toasts,
};

export function useToast() {
  return { show: toastStore.show, dismiss: toastStore.dismiss };
}

const TONE = { default: 'border-l-ink', success: 'border-l-brand-emerald', danger: 'border-l-brand-crimson' } as const;

function ToastItem({ toast }: { toast: Toast }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || !Number.isFinite(toast.duration)) return;
    // ponytail: resuming restarts the full duration rather than the remainder.
    const t = setTimeout(() => toastStore.dismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [paused, toast]);
  return (
    <li
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cx('pointer-events-auto flex min-w-0 items-start gap-space-sm rounded-lg border border-l-4 border-border-subtle bg-surface-elevated p-space-sm text-on-surface shadow-md', TONE[toast.tone])}
    >
      <div className="min-w-0 flex-1">
        <p className="font-body-md text-body-md font-semibold wrap-break-word">{toast.title}</p>
        {toast.description && <p className="font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{toast.description}</p>}
        {toast.action && <div className="mt-space-xs">{toast.action}</div>}
      </div>
      <IconButton icon="close" label="Dismiss notification" size="xs" onClick={() => toastStore.dismiss(toast.id)} />
    </li>
  );
}

export type ToasterProps = { label?: string };

/** Mount once at the app root. Bottom-right from md, full width below. */
export function Toaster({ label = 'Notifications' }: ToasterProps) {
  const list = useSyncExternalStore(toastStore.subscribe, toastStore.get, () => EMPTY);
  return (
    <section aria-label={label} className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-space-md md:inset-x-auto md:right-0 md:w-96">
      <div aria-live="polite" aria-relevant="additions">
        <ol className="flex flex-col gap-space-xs">
          {list.map((t) => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </ol>
      </div>
    </section>
  );
}
