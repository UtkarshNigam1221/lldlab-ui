import type { ElementType } from 'react';
import { Icon } from '../components/Icon';
import { cx, FOCUS_RING } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type Crumb = { label: string; href?: string; as?: ElementType };
export type BreadcrumbsProps = NativeProps<'nav', { items: Crumb[]; label?: string; children?: never }>;

export function Breadcrumbs({ items, label = 'Breadcrumb', ...rest }: BreadcrumbsProps) {
  const collapse = items.length > 2;
  return (
    <nav {...rest} aria-label={label} className="min-w-0">
      <ol className="flex min-w-0 items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const middle = i > 0 && !last;
          const C: ElementType = c.as ?? 'a';
          return [
            <li key={c.label + i} className={cx('flex min-w-0 items-center gap-space-xs', middle && collapse && 'max-md:hidden', last && 'min-w-0')}>
              {i > 0 && <Icon name="chevron_right" size="sm" />}
              {last ? (
                <span aria-current="page" className="truncate font-medium text-on-surface">{c.label}</span>
              ) : c.href ? (
                <C href={c.href} className={cx('truncate rounded hover:text-on-surface', FOCUS_RING)}>{c.label}</C>
              ) : (
                <span className="truncate">{c.label}</span>
              )}
            </li>,
            i === 0 && collapse && (
              <li key="ellipsis" aria-hidden="true" className="flex items-center gap-space-xs md:hidden">
                <Icon name="chevron_right" size="sm" />
                <span>…</span>
              </li>
            ),
          ];
        })}
      </ol>
    </nav>
  );
}
