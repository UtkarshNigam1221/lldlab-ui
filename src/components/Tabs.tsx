import { useId, useRef, type ElementType, type KeyboardEvent, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { rovingIndex } from '../internal/roving';
import type { StatusTone } from '../internal/tones';
import { Badge, type BadgeTone } from './Badge';
import { Icon } from './Icon';
import { Dot } from './Dot';

/** `panelId` links a tablist tab to a `<TabPanel id={panelId}>` (aria-controls / aria-labelledby). */
export type TabItem = {
  id: string;
  label: ReactNode;
  count?: ReactNode;
  /** Colour of the count pill (nav variant). */
  countTone?: BadgeTone;
  badge?: ReactNode;
  dot?: StatusTone;
  icon?: string;
  href?: string;
  as?: ElementType;
  panelId?: string;
  /** Not available yet: rendered as text with aria-disabled, never as a link or selectable tab. */
  disabled?: boolean;
  /** Native tooltip (e.g. "Coming soon" on a disabled item). */
  title?: string;
  /** Hide this item below a breakpoint (lower-priority nav entries on crowded bars). */
  hideBelow?: keyof typeof HIDE_BELOW;
};
const HIDE_BELOW = { sm: 'hidden sm:flex', md: 'hidden md:flex', lg: 'hidden lg:flex', xl: 'hidden xl:flex', '2xl': 'hidden 2xl:flex' } as const;
type Variant = 'underline' | 'pills' | 'nav' | 'solid' | 'label';
export type TabsProps = NativeProps<'div', { items: TabItem[]; value: string; onChange?: (id: string) => void; variant?: Variant; label: string; children?: never }>;

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
  // Header navigation: icon + label + count pill; active is a cobalt tint.
  nav: {
    list: 'flex min-w-0 max-w-full items-center gap-space-xs overflow-x-auto [scrollbar-width:none]',
    tab: 'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap rounded-lg px-space-sm py-space-xs font-body-md text-body-md transition-colors',
    active: 'bg-surface-container/60 font-semibold text-brand-cobalt',
    idle: 'text-on-surface-variant hover:bg-surface-subtle hover:text-on-surface',
  },
  // Filter chips: separate buttons, active filled with ink, dot leading.
  solid: {
    list: 'flex min-w-0 max-w-full gap-space-xs overflow-x-auto pb-space-2xs [scrollbar-width:none]',
    tab: 'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap rounded-lg px-space-md py-space-xs font-button-text text-button-text transition-colors',
    active: 'bg-ink text-on-ink shadow-sm',
    idle: 'bg-surface-subtle text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  },
  // Workspace tabs: mono caps, cobalt underline on the active tab, no rule under the list.
  label: {
    list: 'flex min-w-0 max-w-full gap-space-md overflow-x-auto [scrollbar-width:none]',
    tab: 'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap border-b-2 py-space-sm font-label-mono text-label-mono uppercase transition-colors',
    active: 'border-brand-cobalt text-fg-brand',
    idle: 'border-transparent text-on-surface-variant hover:text-on-surface',
  },
} as const;
const DISABLED = 'cursor-not-allowed opacity-60';

function TabBody({ item, variant, active }: { item: TabItem; variant: Variant; active: boolean }) {
  const leadingDot = variant === 'solid';
  let count: ReactNode = null;
  if (item.count !== undefined) {
    if (variant === 'nav') count = <Badge shape="pill" tone={item.countTone ?? 'info'}>{item.count}</Badge>;
    else if (variant === 'solid') count = <span className={cx('rounded px-space-2xs font-label-mono text-label-mono', active ? 'bg-white/20' : 'bg-surface-elevated')}>{item.count}</span>;
    else count = <Badge>{item.count}</Badge>;
  }
  return (
    <>
      {item.dot && leadingDot && <Dot tone={item.dot} size="md" />}
      {item.icon && <Icon name={item.icon} size="ms" />}
      {item.label}
      {count}
      {item.badge && (typeof item.badge === 'string' ? <Badge size="xs" tone="subtle" uppercase>{item.badge}</Badge> : item.badge)}
      {item.dot && !leadingDot && <Dot tone={item.dot} />}
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
              <li key={item.id} className={cx('shrink-0', item.hideBelow ? HIDE_BELOW[item.hideBelow] : 'flex')}>
                {item.disabled ? (
                  <span aria-disabled="true" title={item.title} className={cx(v.tab, v.idle, DISABLED)}>
                    <TabBody item={item} variant={variant} active={false} />
                  </span>
                ) : (
                  <C href={item.href} title={item.title} aria-current={active ? 'page' : undefined} className={cx(v.tab, active ? v.active : v.idle, FOCUS_RING, TOUCH)}>
                    <TabBody item={item} variant={variant} active={active} />
                  </C>
                )}
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
            disabled={item.disabled}
            title={item.title}
            onClick={() => onChange?.(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(v.tab, active ? v.active : v.idle, item.disabled && DISABLED, FOCUS_RING, TOUCH)}
          >
            <TabBody item={item} variant={variant} active={active} />
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
