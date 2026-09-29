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
  children?: never;
}>;

/** UML class box: name compartment, attributes, methods. */
export function UmlClass({ name, stereotype, attributes = [], methods = [], tag, emphasis = 'default', size = 'md', dashed, ...rest }: UmlClassProps) {
  const s = SIZE[size];
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
