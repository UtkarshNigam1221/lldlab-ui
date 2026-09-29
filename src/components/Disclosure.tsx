import { useId, useState, type ReactNode } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Icon } from './Icon';

export type DisclosureProps = NativeProps<'div', {
  /** Button content; keep it free of other interactive elements. */
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  selected?: boolean;
  variant?: 'plain' | 'row';
}>;

export function Disclosure({ summary, children, open, defaultOpen = false, onOpenChange, selected, variant = 'plain', ...rest }: DisclosureProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const row = variant === 'row';
  return (
    <div {...rest} className={cx('min-w-0', row && 'border-b border-border-subtle', selected && 'border-l-4 border-l-brand-cobalt')}>
      <button
        type="button"
        id={`${id}-button`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={toggle}
        className={cx('flex w-full min-w-0 items-center gap-space-sm text-left', row ? 'px-space-sm py-space-sm hover:bg-surface-subtle' : 'py-space-xs', FOCUS_RING, TOUCH)}
      >
        <span className="min-w-0 flex-1">{summary}</span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size="sm" tone="muted" />
      </button>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} hidden={!isOpen} className={cx('min-w-0', row ? 'px-space-sm pb-space-sm' : 'pb-space-xs')}>
        {children}
      </div>
    </div>
  );
}
