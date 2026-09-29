import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { cx, TOUCH } from '../internal/cx';
import { rovingIndex } from '../internal/roving';
import { Icon } from './Icon';

export type MenuItem = { label: string; icon?: string; onSelect?: () => void; href?: string; as?: ElementType; tone?: 'default' | 'danger' };

export type MenuTriggerProps = {
  ref: RefObject<HTMLButtonElement | null>;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

export type MenuProps = { label: string; trigger: (props: MenuTriggerProps) => ReactNode; items: MenuItem[]; align?: 'start' | 'end' };

export function Menu({ label, trigger, items, align = 'end' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const pendingFocus = useRef<number | null>(null);

  const openAt = (index: number | null) => {
    pendingFocus.current = index;
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    if (pendingFocus.current !== null) itemRefs.current[pendingFocus.current]?.focus();
    pendingFocus.current = null;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Open the menu with focus on item `index`, or move focus there if it is already open.
  const focusItem = (index: number) => (open ? itemRefs.current[index]?.focus() : openAt(index));

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(items.length - 1);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      close(true);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key === 'Tab') {
      setOpen(false);
      return;
    }
    const current = itemRefs.current.indexOf(document.activeElement as HTMLElement);
    const next = rovingIndex(e.key, Math.max(0, current), items.length);
    if (next === null) return;
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className="relative inline-flex">
      {trigger({
        ref: triggerRef,
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => (open ? close(false) : openAt(0)),
        onKeyDown: onTriggerKeyDown,
      })}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cx(
            'absolute top-full z-40 mt-space-xs flex min-w-48 max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-border-subtle bg-surface-elevated p-space-2xs shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, i) => {
            const C: ElementType = item.href ? (item.as ?? 'a') : 'button';
            return (
              <C
                key={item.label}
                ref={(el: HTMLElement | null) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                {...(item.href ? { href: item.href } : { type: 'button' })}
                onClick={() => {
                  item.onSelect?.();
                  close(!item.href);
                }}
                className={cx(
                  'flex w-full items-center gap-space-sm rounded-lg px-space-sm py-space-xs text-left font-body-md text-body-md outline-none hover:bg-surface-muted focus:bg-surface-muted',
                  item.tone === 'danger' ? 'text-fg-danger' : 'text-on-surface',
                  TOUCH,
                )}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <span className="truncate">{item.label}</span>
              </C>
            );
          })}
        </div>
      )}
    </div>
  );
}
