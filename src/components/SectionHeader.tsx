import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { StatusTone } from '../internal/tones';
import { Heading } from '../primitives/Heading';
import { Badge, type BadgeTone } from './Badge';
import { Dot } from './Dot';
import { IconTile } from './IconTile';

const ACCENT: Record<StatusTone, string> = {
  neutral: 'border-b-2 border-b-border-strong',
  brand: 'border-b-2 border-b-brand-cobalt',
  success: 'border-b-2 border-b-brand-emerald',
  warning: 'border-b-2 border-b-brand-amber',
  danger: 'border-b-2 border-b-brand-crimson',
};

export type SectionHeaderProps = NativeProps<'div', {
  title: ReactNode;
  level?: 2 | 3;
  dot?: StatusTone;
  tag?: ReactNode;
  tagTone?: BadgeTone;
  meta?: ReactNode;
  description?: ReactNode;
  icon?: string;
  accent?: StatusTone;
  size?: 'sm' | 'md';
  /** Rule under the header (default true). Without it the dot grows to 12px, as on catalog tier headers. */
  divider?: boolean;
  metaUppercase?: boolean;
}>;

export function SectionHeader({ title, level = 2, dot, tag, tagTone = 'neutral', meta, description, icon, accent, size = 'sm', divider = true, metaUppercase = true, ...rest }: SectionHeaderProps) {
  return (
    <div {...rest} className={cx('flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-space-xs pb-space-sm', accent ? ACCENT[accent] : divider && 'border-b border-border-subtle')}>
      {icon && <IconTile icon={icon} size="sm" tone={accent ?? 'neutral'} />}
      {dot && <Dot tone={dot} size={divider ? 'md' : 'lg'} />}
      <Heading level={level} size={size}>{title}</Heading>
      {tag && <Badge tone={tagTone} uppercase>{tag}</Badge>}
      {meta && <span className={cx('ml-auto min-w-0 max-w-full truncate font-label-mono text-label-mono text-on-surface-variant', metaUppercase && 'uppercase')}>{meta}</span>}
      {description && <p className="basis-full font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{description}</p>}
    </div>
  );
}
