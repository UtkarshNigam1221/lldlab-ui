import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';
import { Heading } from '../primitives/Heading';
import { Icon } from './Icon';

export type EmptyStateProps = NativeProps<'div', { icon?: string; title: ReactNode; description?: ReactNode; action?: ReactNode }>;

export function EmptyState({ icon = 'inbox', title, description, action, ...rest }: EmptyStateProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-on-surface-variant">
        <Icon name={icon} size="lg" />
      </span>
      <div className="w-full">
        <Heading level={3} size="sm">{title}</Heading>
      </div>
      {description && <p className="w-full max-w-prose font-body-sm text-body-sm text-on-surface-variant wrap-break-word">{description}</p>}
      {action}
    </div>
  );
}
