import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import type { Tone } from '../internal/tones';
import { Icon } from './Icon';

export type CheckListProps = NativeProps<'ul', { items: ReactNode[]; icon?: string; tone?: Tone; children?: never }>;

export function CheckList({ items, icon = 'check', tone = 'success', ...rest }: CheckListProps) {
  return (
    <ul {...rest} className="flex min-w-0 flex-col gap-space-xs">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-space-xs font-body-md text-body-md text-on-surface">
          <Icon name={icon} size="sm" tone={tone} />
          <span className="min-w-0 wrap-break-word">{item}</span>
        </li>
      ))}
    </ul>
  );
}
