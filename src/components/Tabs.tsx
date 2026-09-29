import { useId, useRef, type ElementType, type KeyboardEvent, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { rovingIndex } from '../internal/roving';
import type { StatusTone } from '../internal/tones';
import { Badge } from './Badge';
import { Dot } from './Dot';

/** `panelId` links a tablist tab to a `<TabPanel id={panelId}>` (aria-controls / aria-labelledby). */
export type TabItem = { id: string; label: ReactNode; count?: number; dot?: StatusTone; href?: string; as?: ElementType; panelId?: string };
export type TabsProps = NativeProps<'div', { items: TabItem[]; value: string; onChange?: (id: string) => void; variant?: 'underline' | 'pills'; label: string; children?: never }>;

const VARIANT = {
  underline: {
    list: 'flex min-w-0 max-w-full gap-space-lg overflow-x-auto border-b border-border-subtle [scrollbar-width:none]',
    tab: 'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap border-b-2 py-space-sm font-button-text text-button-text transition-colors',
    active: 'border-ink text-ink',
    idle: 'border-transparent text-on-surface-variant hover:text-on-surface',
  },
  pills: {
    list: 'inline-flex min-w-0 max-w-full gap-space-2xs overflow-x-auto rounded-lg bg-surface-subtle p-space-2xs [scrollbar-width:none]',
    tab: 'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap rounded-md px-space-md py-space-xs font-button-text text-button-text transition-colors',
    active: 'bg-surface-elevated text-ink shadow-sm',
    idle: 'text-on-surface-variant hover:text-on-surface',
  },
} as const;

function TabBody({ item }: { item: TabItem }) {
  return (
    <>
      {item.label}
      {item.count !== undefined && <Badge>{item.count}</Badge>}
      {item.dot && <Dot tone={item.dot} />}
    </>
  );
}

/** Scrolls horizontally instead of wrapping. Links (any item with href) render as navigation, not a tablist. */
export function Tabs({ items, value, onChange, variant = 'underline', label, ...rest }: TabsProps) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  if (!items.length) return null;
  const v = VARIANT[variant];

  if (items.some((i) => i.href)) {
    return (
      <nav {...(rest as NativeProps<'nav', object>)} aria-label={label} className="min-w-0 max-w-full">
        <ul className={v.list}>
          {items.map((item) => {
            const C: ElementType = item.as ?? 'a';
            const active = item.id === value;
            return (
              <li key={item.id} className="flex shrink-0">
                <C href={item.href} aria-current={active ? 'page' : undefined} className={cx(v.tab, active ? v.active : v.idle, FOCUS_RING, TOUCH)}>
                  <TabBody item={item} />
                </C>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const activeIndex = Math.max(0, items.findIndex((i) => i.id === value));
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const next = rovingIndex(e.key, index, items.length);
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange?.(items[next].id);
  };
  return (
    <div {...rest} role="tablist" aria-label={label} className={v.list}>
      {items.map((item, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={item.panelId ? `${item.panelId}-tab` : `${baseId}-${item.id}`}
            aria-controls={item.panelId}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(v.tab, active ? v.active : v.idle, FOCUS_RING, TOUCH)}
          >
            <TabBody item={item} />
          </button>
        );
      })}
    </div>
  );
}

export type TabPanelProps = NativeProps<'div', { id: string; active: boolean; children: ReactNode }>;

/** Content for the tab whose `panelId` is `id`; hidden (not unmounted) when inactive. */
export function TabPanel({ id, active, children, ...rest }: TabPanelProps) {
  return (
    <div {...rest} role="tabpanel" id={id} aria-labelledby={`${id}-tab`} hidden={!active} tabIndex={0} className={cx('min-w-0 outline-none', FOCUS_RING)}>
      {children}
    </div>
  );
}
