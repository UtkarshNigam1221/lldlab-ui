import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { IconTile } from './IconTile';

const TITLE = { success: 'text-fg-success', danger: 'text-fg-danger', warning: 'text-fg-warning' } as const;

export type VerdictBannerProps = NativeProps<'section', {
  tone: keyof typeof TITLE;
  icon: string;
  title: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode[];
  actions?: ReactNode;
  children?: never;
}>;

/** Result hero ("Accepted"): stacks below md, a row from md. */
export function VerdictBanner({ tone, icon, title, badge, meta, actions, ...rest }: VerdictBannerProps) {
  return (
    <section {...rest} className="flex min-w-0 flex-col gap-space-md rounded-xl border border-border-subtle bg-surface-elevated p-space-lg md:flex-row md:items-center">
      <IconTile icon={icon} tone={tone} size="xl" shape="circle" filled />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-space-sm">
          <h2 className={cx('min-w-0 font-display text-headline-xl wrap-break-word', TITLE[tone])}>{title}</h2>
          {badge}
        </div>
        {meta && meta.length > 0 && (
          <ul className="mt-space-xs flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-space-2xs font-body-sm text-body-sm text-on-surface-variant">
            {meta.map((m, i) => (
              <li key={i} className="flex items-center gap-space-sm">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-border-strong" />}
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-space-sm">{actions}</div>}
    </section>
  );
}
