import type { ReactNode } from 'react';
import { Heading } from '../primitives/Heading';
import { Icon } from './Icon';

export type EmptyStateProps = { icon?: string; title: ReactNode; description?: ReactNode; action?: ReactNode };

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-on-surface-variant">
        <Icon name={icon} size="lg" />
      </span>
      <Heading level={3} size="sm">{title}</Heading>
      {description && <p className="max-w-prose font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
      {action}
    </div>
  );
}
