import { useRef, type KeyboardEvent } from 'react';
import { cx, FOCUS_RING, TOUCH } from '../internal/cx';
import { rovingIndex } from '../internal/roving';
import { Icon } from './Icon';

export type SegmentedOption = { value: string; label: string; icon?: string };
export type SegmentedControlProps = { label: string; options: SegmentedOption[]; value: string; onChange: (value: string) => void };

export function SegmentedControl({ label, options, value, onChange }: SegmentedControlProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const checkedIndex = options.findIndex((o) => o.value === value);
  const tabbable = checkedIndex === -1 ? 0 : checkedIndex;
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const next = rovingIndex(e.key, index, options.length);
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(options[next].value);
  };
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex min-w-0 max-w-full gap-space-2xs overflow-x-auto rounded-lg border border-border-subtle bg-surface-subtle p-space-2xs [scrollbar-width:none]">
      {options.map((o, i) => {
        const checked = i === checkedIndex;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={i === tabbable ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              'inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap rounded-md px-space-sm py-space-xs font-button-text text-button-text transition-colors',
              checked ? 'bg-surface-elevated text-ink shadow-sm' : 'text-on-surface-variant hover:text-on-surface',
              FOCUS_RING,
              TOUCH,
            )}
          >
            {o.icon && <Icon name={o.icon} size="sm" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
