import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { cx, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { rovingIndex } from '../internal/roving';
import { Icon } from './Icon';
import { Kbd } from './Kbd';

export type MenuItem = {
  label: string;
  icon?: string;
  onSelect?: () => void;
  href?: string;
  as?: ElementType;
  tone?: 'default' | 'danger';
  meta?: ReactNode;
  shortcut?: string;
};
export type MenuSeparator = { type: 'separator' };
export type MenuEntry = MenuItem | MenuSeparator;

const isItem = (e: MenuEntry): e is MenuItem => !('type' in e);

export type MenuTriggerProps = {
  ref: RefObject<HTMLButtonElement | null>;
  id: string;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

export type MenuProps = NativeProps<'div', {
  label: string;
  trigger: (props: MenuTriggerProps) => ReactNode;
  items: MenuEntry[];
  align?: 'start' | 'end';
  /** Rendered above the menu items, outside the menu role (e.g. the signed-in user). */
  header?: ReactNode;
  footer?: ReactNode;
  children?: never;
}>;

export function Menu({ label, trigger, items, align = 'end', header, footer, ...rest }: MenuProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const pendingFocus = useRef<number | null>(null);
  const actions = items.filter(isItem);

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

  // Open with focus on actionable item `index`, or move focus there if already open.
  const focusItem = (index: number) => (open ? itemRefs.current[index]?.focus() : openAt(index));

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(actions.length - 1);
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
    const next = rovingIndex(e.key, Math.max(0, current), actions.length);
    if (next === null) return;
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  let actionIndex = 0;
  return (
    <div {...rest} ref={rootRef} className="relative inline-flex">
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
          className={cx(
            'absolute top-full z-40 mt-space-xs flex min-w-48 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {header && <div className="border-b border-border-subtle px-space-sm py-space-sm">{header}</div>}
          <div id={menuId} role="menu" aria-label={label} onKeyDown={onMenuKeyDown} className="flex flex-col p-space-2xs">
            {items.map((entry, i) => {
              if (!isItem(entry)) return <div key={`sep-${i}`} role="separator" className="my-space-2xs h-px bg-border-subtle" />;
              const index = actionIndex++;
              const C: ElementType = entry.href ? (entry.as ?? 'a') : 'button';
              return (
                <C
                  key={i}
                  ref={(el: HTMLElement | null) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  tabIndex={-1}
                  {...(entry.href ? { href: entry.href } : { type: 'button' })}
                  onClick={() => {
                    entry.onSelect?.();
                    close(!entry.href);
                  }}
                  className={cx(
                    'flex w-full items-center gap-space-sm rounded-lg px-space-sm py-space-xs text-left font-body-md text-body-md outline-none hover:bg-surface-muted focus:bg-surface-muted',
                    entry.tone === 'danger' ? 'text-fg-danger' : 'text-on-surface',
                    TOUCH,
                  )}
                >
                  {entry.icon && <Icon name={entry.icon} size="sm" />}
                  <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                  {entry.meta !== undefined && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{entry.meta}</span>}
                  {entry.shortcut && <Kbd>{entry.shortcut}</Kbd>}
                </C>
              );
            })}
          </div>
          {footer && <div className="border-t border-border-subtle bg-surface-subtle px-space-sm py-space-xs">{footer}</div>}
        </div>
      )}
    </div>
  );
}
