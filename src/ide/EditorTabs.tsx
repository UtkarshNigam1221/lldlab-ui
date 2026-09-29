import { Dot } from '../components/Dot';
import { Icon } from '../components/Icon';
import { cx, FOCUS_RING, TOUCH, TOUCH_ICON } from '../internal/cx';

export type EditorTab = { id: string; label: string; modified?: boolean; readOnly?: boolean };
export type EditorTabsProps = { tabs: EditorTab[]; activeId: string; onSelect: (id: string) => void; onClose?: (id: string) => void; label?: string };

/** Open-file tabs. A nav list (not a tablist) because each tab carries its own close button. */
export function EditorTabs({ tabs, activeId, onSelect, onClose, label = 'Open files' }: EditorTabsProps) {
  if (!tabs.length) return null;
  return (
    <nav aria-label={label} className="min-w-0 max-w-full border-b border-border-subtle bg-surface-subtle">
      <ul className="flex min-w-0 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((t) => {
          const active = t.id === activeId;
          return (
            <li
              key={t.id}
              className={cx(
                'flex shrink-0 items-center border-r border-border-subtle',
                active ? 'bg-surface-elevated text-ink shadow-[inset_0_-2px_0_var(--color-brand-cobalt)]' : 'text-on-surface-variant hover:text-on-surface',
              )}
            >
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelect(t.id)}
                onAuxClick={(e) => {
                  if (e.button === 1 && onClose) {
                    e.preventDefault();
                    onClose(t.id);
                  }
                }}
                className={cx('flex items-center gap-space-xs whitespace-nowrap px-space-md py-space-xs font-code-inline text-code-inline', FOCUS_RING, TOUCH)}
              >
                {t.readOnly && <Icon name="lock" size="sm" label="Read-only" />}
                {t.readOnly && ' '}
                {t.label}
                {t.modified && (
                  <>
                    <Dot tone="brand" />
                    <span className="sr-only">(modified)</span>
                  </>
                )}
              </button>
              {onClose && (
                <button
                  type="button"
                  aria-label={`Close ${t.label}`}
                  onClick={() => onClose(t.id)}
                  className={cx('mr-space-2xs inline-flex size-6 items-center justify-center rounded text-on-surface-variant hover:bg-surface-muted hover:text-on-surface', FOCUS_RING, TOUCH_ICON)}
                >
                  <Icon name="close" size="sm" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
