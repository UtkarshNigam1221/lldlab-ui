import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { useModal } from '../internal/useModal';
import { useThemeTone } from '../theme/Theme';
import { Icon } from './Icon';

export type CommandItem = { id: string; label: ReactNode; icon?: string; meta?: ReactNode; onSelect: () => void };
export type CommandGroup = { label: string; items: CommandItem[] };

export type CommandPaletteProps = NativeProps<'div', {
  open: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: ReactNode;
  label?: string;
  children?: never;
}>;

/** ⌘K palette: a dialog with an APG combobox over grouped results. The caller filters `groups`. */
export function CommandPalette({ open, onClose, query, onQueryChange, groups, placeholder = 'Search…', emptyText = 'No results', label = 'Command palette', ...rest }: CommandPaletteProps) {
  const base = useId();
  const theme = useThemeTone();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  useModal({ open, onClose, panelRef, initialFocusRef: inputRef });

  const flat = groups.flatMap((g) => g.items);
  const active = flat.find((i) => i.id === activeId) ?? flat[0];
  const optionId = (id: string) => `${base}-opt-${id}`;

  useEffect(() => {
    if (active) document.getElementById(optionId(active.id))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scroll only when the active option changes
  }, [active?.id]);

  const select = (item: CommandItem) => {
    item.onSelect();
    onClose();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!flat.length) return;
    const i = active ? flat.indexOf(active) : 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length;
      setActiveId(flat[next].id);
    } else if (e.key === 'Enter' && active) {
      e.preventDefault();
      select(active);
    }
  };

  if (!open || typeof document === 'undefined') return null;
  const listId = `${base}-list`;
  return createPortal(
    <div
      data-theme={theme}
      className="fixed inset-0 z-50 flex items-start justify-center bg-brand-obsidian/40 p-space-md pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        {...rest}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="flex max-h-[80vh] w-full min-w-0 max-w-xl flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated text-on-surface shadow-md outline-none"
      >
        <div className="flex items-center gap-space-sm border-b border-border-subtle px-space-md">
          <Icon name="search" tone="muted" />
          <input
            ref={inputRef}
            role="combobox"
            aria-label={label}
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active ? optionId(active.id) : undefined}
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setActiveId(null);
            }}
            onKeyDown={onKeyDown}
            className="h-12 min-w-0 flex-1 bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>
        <div id={listId} role="listbox" aria-label={label} className="min-h-0 flex-1 overflow-y-auto p-space-2xs">
          {flat.length === 0 && <p className="px-space-sm py-space-md text-center font-body-sm text-body-sm text-on-surface-variant">{emptyText}</p>}
          {groups.map((g, gi) => (
            <div key={g.label} role="group" aria-labelledby={`${base}-g${gi}`}>
              <p id={`${base}-g${gi}`} className="px-space-sm pb-space-2xs pt-space-sm font-label-mono text-label-mono uppercase text-on-surface-variant">
                {g.label}
              </p>
              {g.items.map((item) => {
                const isActive = item === active;
                return (
                  <div
                    key={item.id}
                    id={optionId(item.id)}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActiveId(item.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(item)}
                    className={cx('flex min-w-0 cursor-pointer items-center gap-space-sm rounded-lg px-space-sm py-space-xs font-body-md text-body-md max-md:min-h-11', isActive ? 'bg-surface-muted text-ink' : 'text-on-surface')}
                  >
                    {item.icon && <Icon name={item.icon} size="sm" tone="muted" />}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.meta && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{item.meta}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
