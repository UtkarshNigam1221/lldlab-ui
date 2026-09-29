import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const LAYOUT = {
  stacked: 'flex flex-col gap-space-sm',
  inline: 'grid grid-cols-1 gap-x-space-md gap-y-space-xs sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)]',
} as const;

export type DescriptionListProps = NativeProps<'dl', {
  items: Array<{ term: ReactNode; detail: ReactNode }>;
  /** inline = term and detail side by side from sm. */
  layout?: keyof typeof LAYOUT;
  mono?: boolean;
  children?: never;
}>;

export function DescriptionList({ items, layout = 'stacked', mono, ...rest }: DescriptionListProps) {
  return (
    <dl {...rest} className={cx('min-w-0', LAYOUT[layout])}>
      {items.map((item, i) => (
        <div key={i} className={cx('min-w-0', layout === 'inline' && 'sm:contents')}>
          <dt className="font-label-mono text-label-mono uppercase text-on-surface-variant">{item.term}</dt>
          <dd className={cx('min-w-0 text-on-surface wrap-break-word', mono ? 'font-code-inline text-code-inline' : 'font-body-md text-body-md')}>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
