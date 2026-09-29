import type { ElementType, ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type NavItem = { id: string; label: ReactNode; icon?: string; href?: string; as?: ElementType; count?: ReactNode; onSelect?: () => void };

const VARIANT = {
  sidebar: {
    item: 'rounded-lg px-space-sm py-space-xs font-body-md text-body-md',
    active: 'bg-surface-container-high font-medium text-ink',
    idle: 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
  },
  toc: {
    item: 'border-l-2 px-space-sm py-space-2xs font-body-sm text-body-sm',
    active: 'border-brand-cobalt bg-badge-intermediate-bg font-medium text-badge-intermediate-text',
    idle: 'border-transparent text-on-surface-variant hover:border-border-strong hover:text-on-surface',
  },
} as const;

export type NavListProps = NativeProps<'nav', {
  label: string;
  items: NavItem[];
  current?: string;
  heading?: ReactNode;
  variant?: keyof typeof VARIANT;
  children?: never;
}>;

/** Vertical navigation: app sidebar or in-page table of contents. */
export function NavList({ label, items, current, heading, variant = 'sidebar', ...rest }: NavListProps) {
  const v = VARIANT[variant];
  return (
    <nav {...rest} aria-label={label} className="min-w-0">
      {heading && <p className="px-space-sm pb-space-xs font-label-mono text-label-mono uppercase text-on-surface-variant">{heading}</p>}
      <ul className="flex min-w-0 flex-col gap-space-2xs">
        {items.map((item) => {
          const active = item.id === current;
          const C: ElementType = item.href ? (item.as ?? 'a') : 'button';
          return (
            <li key={item.id} className="min-w-0">
              <C
                {...(item.href ? { href: item.href } : { type: 'button' })}
                aria-current={active ? (item.href ? 'page' : 'true') : undefined}
                onClick={item.onSelect}
                className={cx('flex w-full min-w-0 items-center gap-space-sm text-left transition-colors', v.item, active ? v.active : v.idle, FOCUS_RING, TOUCH)}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.count !== undefined && <span className="shrink-0 font-label-mono text-label-mono text-on-surface-variant">{item.count}</span>}
              </C>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
