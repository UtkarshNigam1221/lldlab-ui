import type { ReactNode } from 'react';
import { Icon } from './Icon';

export type CheckListProps = { items: ReactNode[] };

export function CheckList({ items }: CheckListProps) {
  return (
    <ul className="flex min-w-0 flex-col gap-space-xs">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-space-xs font-body-md text-body-md text-on-surface">
          <Icon name="check" size="sm" tone="success" />
          <span className="min-w-0 wrap-break-word">{item}</span>
        </li>
      ))}
    </ul>
  );
}
