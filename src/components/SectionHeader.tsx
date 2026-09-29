import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';
import { Heading } from '../primitives/Heading';
import { Badge } from './Badge';
import { Dot } from './Dot';

export type SectionHeaderProps = NativeProps<'div', { title: ReactNode; level?: 2 | 3; dot?: StatusTone; tag?: ReactNode; meta?: ReactNode }>;

export function SectionHeader({ title, level = 2, dot, tag, meta, ...rest }: SectionHeaderProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-space-xs border-b border-border-subtle pb-space-sm">
      {dot && <Dot tone={dot} size="md" />}
      <Heading level={level} size="sm">{title}</Heading>
      {tag && <Badge uppercase>{tag}</Badge>}
      {meta && <span className="ml-auto font-label-mono text-label-mono uppercase text-on-surface-variant">{meta}</span>}
    </div>
  );
}
