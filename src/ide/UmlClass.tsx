import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const EMPHASIS = { default: 'border border-border-strong', brand: 'border-2 border-brand-cobalt', strong: 'border-2 border-ink' } as const;
const SIZE = { sm: { text: 'text-[11px] leading-4', pad: 'px-space-xs py-space-2xs' }, md: { text: 'text-code-inline', pad: 'px-space-sm py-space-xs' } } as const;

export type UmlClassProps = NativeProps<'div', {
  name: string;
  stereotype?: string;
  attributes?: string[];
  methods?: string[];
  tag?: ReactNode;
  emphasis?: keyof typeof EMPHASIS;
  size?: keyof typeof SIZE;
  dashed?: boolean;
  /** tinted: borderless card with a tinted title block (marketing/preview diagrams). */
  variant?: 'box' | 'tinted';
  /** Title block tint for the tinted variant. */
  headerTone?: keyof typeof HEADER_TONE;
  /** Member columns for the tinted variant. */
  columns?: 1 | 2;
  children?: never;
}>;
const HEADER_TONE = { container: 'bg-surface-container', info: 'bg-badge-intermediate-bg', strong: 'bg-surface-container-high' } as const;
const STEREO_TONE = { container: 'text-secondary', info: 'text-badge-intermediate-text', strong: 'text-secondary' } as const;

/** UML class box: name compartment, attributes, methods. */
export function UmlClass({ name, stereotype, attributes = [], methods = [], tag, emphasis = 'default', size = 'md', dashed, variant = 'box', headerTone = 'container', columns = 1, ...rest }: UmlClassProps) {
  const s = SIZE[size];
  if (variant === 'tinted') {
    const strong = headerTone === 'strong';
    return (
      <div {...rest} className="flex min-w-0 flex-col gap-space-xs rounded-lg bg-surface-elevated p-space-sm shadow-sm">
        <div className={cx('flex min-w-0 gap-space-xs rounded px-space-xs py-space-2xs', HEADER_TONE[headerTone], strong ? 'items-center justify-between' : 'flex-col items-center text-center')}>
          {stereotype && <span className={cx('font-label-mono text-label-mono italic', STEREO_TONE[headerTone])}>«{stereotype}»</span>}
          <span className="truncate font-headline-sm text-headline-sm text-ink">{name}</span>
          {tag}
        </div>
        {attributes.length + methods.length > 0 && (
          <ul className={cx('grid min-w-0 gap-space-2xs p-space-2xs font-code-inline text-code-inline', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
            {attributes.map((a, i) => <li key={`a${i}`} className="min-w-0 truncate text-on-surface-variant">{a}</li>)}
            {methods.map((m, i) => <li key={`m${i}`} className={cx('min-w-0 truncate text-fg-brand', columns === 2 && 'col-span-2')}>{m}</li>)}
          </ul>
        )}
      </div>
    );
  }
  return (
    <div {...rest} className={cx('inline-flex min-w-0 max-w-full flex-col overflow-hidden rounded-lg bg-surface-elevated font-code-inline text-on-surface shadow-sm', EMPHASIS[emphasis], dashed && 'border-dashed', s.text)}>
      <div className={cx('flex flex-col items-center text-center', s.pad)}>
        {stereotype && <span className="text-on-surface-variant">«{stereotype}»</span>}
        <span className="font-semibold text-ink">{name}</span>
        {tag}
      </div>
      {attributes.length > 0 && (
        <ul className={cx('border-t border-border-subtle', s.pad)}>
          {attributes.map((a, i) => <li key={i} className="whitespace-nowrap">{a}</li>)}
        </ul>
      )}
      {methods.length > 0 && (
        <ul className={cx('border-t border-border-subtle', s.pad)}>
          {methods.map((m, i) => <li key={i} className="whitespace-nowrap">{m}</li>)}
        </ul>
      )}
    </div>
  );
}
