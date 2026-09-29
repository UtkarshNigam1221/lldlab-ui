import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { IconButton } from '../components/IconButton';
import { SegmentedControl } from '../components/SegmentedControl';
import { cx } from '../internal/cx';

type Panel = 'left' | 'right' | 'bottom';
type Side = 'left' | 'right';
export type WorkbenchSizes = Record<Panel, number>;
export type WorkbenchLimits = Record<Panel, readonly [number, number]>;
type Labels = Record<'left' | 'main' | 'right' | 'bottom', string>;

const DEFAULT_SIZES: WorkbenchSizes = { left: 240, right: 380, bottom: 30 };
const DEFAULT_LIMITS: WorkbenchLimits = { left: [160, 480], right: [260, 640], bottom: [15, 70] };
const DEFAULT_LABELS: Labels = { left: 'Explorer', main: 'Editor', right: 'Details', bottom: 'Panel' };
const STEP: Record<Panel, number> = { left: 16, right: 16, bottom: 5 };
const PANELS: Panel[] = ['left', 'right', 'bottom'];

// Literal grid templates (one per panel combination) so Tailwind generates them.
const COLUMNS = {
  both: 'lg:grid-cols-[var(--wb-left)_4px_minmax(0,1fr)_4px_var(--wb-right)]',
  left: 'lg:grid-cols-[var(--wb-left)_4px_minmax(0,1fr)]',
  right: 'lg:grid-cols-[minmax(0,1fr)_4px_var(--wb-right)]',
  none: 'lg:grid-cols-1',
} as const;

const clamp = (v: number, [min, max]: readonly [number, number]) => Math.min(max, Math.max(min, v));

export function readSizes(raw: string | null, defaults: WorkbenchSizes, limits: WorkbenchLimits): WorkbenchSizes {
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  const out = { ...defaults };
  if (parsed && typeof parsed === 'object') {
    for (const k of PANELS) {
      const v = (parsed as Record<string, unknown>)[k];
      if (typeof v === 'number' && Number.isFinite(v) && v >= limits[k][0] && v <= limits[k][1]) out[k] = v;
    }
  }
  return out;
}

type Ctx = { drawer: Side | null; setDrawer: (d: Side | null) => void; ids: Record<Side, string>; labels: Labels };
const WorkbenchContext = createContext<Ctx | null>(null);

function Toggle({ panel }: { panel: Side }) {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) return null;
  const open = ctx.drawer === panel;
  return (
    <span className="lg:hidden">
      <IconButton
        icon={panel === 'left' ? 'left_panel_open' : 'right_panel_open'}
        label={`${open ? 'Hide' : 'Show'} ${ctx.labels[panel]}`}
        aria-expanded={open}
        aria-controls={ctx.ids[panel]}
        onClick={() => ctx.setDrawer(open ? null : panel)}
      />
    </span>
  );
}

type SeparatorProps = {
  panel: Panel;
  value: number;
  limits: readonly [number, number];
  label: string;
  controls: string;
  onChange: (value: number) => void;
  centerHeight: () => number;
};

function Separator({ panel, value, limits, label, controls, onChange, centerHeight }: SeparatorProps) {
  const drag = useRef<{ x: number; y: number; value: number } | null>(null);
  const vertical = panel !== 'bottom';
  const grow = panel === 'left' ? 'ArrowRight' : panel === 'right' ? 'ArrowLeft' : 'ArrowUp';
  const shrink = panel === 'left' ? 'ArrowLeft' : panel === 'right' ? 'ArrowRight' : 'ArrowDown';

  const onKeyDown = (e: KeyboardEvent) => {
    const next =
      e.key === grow ? value + STEP[panel] : e.key === shrink ? value - STEP[panel] : e.key === 'Home' ? limits[0] : e.key === 'End' ? limits[1] : null;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, value };
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // no active pointer with this id (synthetic events): dragging still works without capture
    }
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (panel === 'left') onChange(d.value + (e.clientX - d.x));
    else if (panel === 'right') onChange(d.value - (e.clientX - d.x));
    else {
      const h = centerHeight();
      if (h > 0) onChange(d.value - ((e.clientY - d.y) / h) * 100);
    }
  };
  const end = () => {
    drag.current = null;
  };

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      aria-label={label}
      aria-controls={controls}
      aria-valuenow={Math.round(value)}
      aria-valuemin={limits[0]}
      aria-valuemax={limits[1]}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      className={cx(
        'shrink-0 touch-none bg-border-subtle outline-none transition-colors hover:bg-brand-cobalt focus-visible:bg-brand-cobalt',
        vertical ? 'w-1 cursor-col-resize max-lg:hidden' : 'h-1 cursor-row-resize max-md:hidden',
      )}
    />
  );
}

export type WorkbenchProps = {
  header?: ReactNode;
  left?: ReactNode;
  main: ReactNode;
  right?: ReactNode;
  bottom?: ReactNode;
  labels?: Partial<Labels>;
  defaultSizes?: Partial<WorkbenchSizes>;
  limits?: Partial<WorkbenchLimits>;
  persistKey?: string;
};

function WorkbenchRoot({ header, left, main, right, bottom, labels: labelsProp, defaultSizes, limits: limitsProp, persistKey }: WorkbenchProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const limits = { ...DEFAULT_LIMITS, ...limitsProp };
  const defaults = { ...DEFAULT_SIZES, ...defaultSizes };
  const [sizes, setSizes] = useState<WorkbenchSizes>(defaults);
  const [drawer, setDrawer] = useState<Side | null>(null);
  const [mobileView, setMobileView] = useState<'main' | 'bottom'>('main');
  const baseId = useId();
  const ids = { left: `${baseId}-left`, main: `${baseId}-main`, right: `${baseId}-right`, bottom: `${baseId}-bottom` };
  const centerRef = useRef<HTMLDivElement>(null);

  // Read persisted sizes after mount only: nothing touches storage during render (SSR-safe).
  useEffect(() => {
    if (!persistKey) return;
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(persistKey);
    } catch {
      raw = null;
    }
    setSizes(readSizes(raw, defaults, limits));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- defaults/limits are read once per persistKey
  }, [persistKey]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setDrawer(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawer]);

  const resize = (panel: Panel) => (value: number) =>
    setSizes((prev) => {
      const next = { ...prev, [panel]: clamp(value, limits[panel]) };
      if (persistKey) {
        try {
          window.localStorage.setItem(persistKey, JSON.stringify(next));
        } catch {
          // storage unavailable (private mode, quota): sizes still apply for this session
        }
      }
      return next;
    });
  const centerHeight = () => centerRef.current?.getBoundingClientRect().height ?? 0;

  const vars = { '--wb-left': `${sizes.left}px`, '--wb-right': `${sizes.right}px`, '--wb-bottom': `${sizes.bottom}%` } as CSSProperties;
  const columns = left && right ? COLUMNS.both : left ? COLUMNS.left : right ? COLUMNS.right : COLUMNS.none;
  const drawerClass = (side: Side) =>
    cx(
      'min-h-0 min-w-0 overflow-auto bg-surface-subtle',
      'max-lg:fixed max-lg:inset-y-0 max-lg:z-40 max-lg:w-[min(85vw,320px)] max-lg:shadow-md',
      side === 'left' ? 'border-r border-border-subtle max-lg:left-0' : 'border-l border-border-subtle max-lg:right-0',
      drawer !== side && 'max-lg:hidden',
    );

  return (
    <WorkbenchContext.Provider value={{ drawer, setDrawer, ids, labels }}>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-surface text-on-surface">
        {header && <div className="flex min-w-0 shrink-0 items-center gap-space-sm border-b border-border-subtle px-space-sm py-space-xs">{header}</div>}
        <div style={vars} className={cx('relative grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)]', columns)}>
          {left && (
            <>
              <section id={ids.left} aria-label={labels.left} className={drawerClass('left')}>
                {left}
              </section>
              <Separator panel="left" value={sizes.left} limits={limits.left} label={`Resize ${labels.left}`} controls={ids.left} onChange={resize('left')} centerHeight={centerHeight} />
            </>
          )}
          <div ref={centerRef} className="flex min-h-0 min-w-0 flex-col">
            {bottom && (
              <div className="flex shrink-0 border-b border-border-subtle p-space-2xs md:hidden">
                <SegmentedControl
                  label="View"
                  options={[
                    { value: 'main', label: labels.main },
                    { value: 'bottom', label: labels.bottom },
                  ]}
                  value={mobileView}
                  onChange={(v) => setMobileView(v === 'bottom' ? 'bottom' : 'main')}
                />
              </div>
            )}
            <section id={ids.main} aria-label={labels.main} className={cx('min-h-0 min-w-0 flex-1 overflow-auto', Boolean(bottom) && mobileView === 'bottom' && 'max-md:hidden')}>
              {main}
            </section>
            {bottom && (
              <>
                <Separator panel="bottom" value={sizes.bottom} limits={limits.bottom} label={`Resize ${labels.bottom}`} controls={ids.bottom} onChange={resize('bottom')} centerHeight={centerHeight} />
                <section
                  id={ids.bottom}
                  aria-label={labels.bottom}
                  className={cx('min-h-0 min-w-0 overflow-auto border-t border-border-subtle md:h-(--wb-bottom) md:shrink-0', mobileView === 'main' ? 'max-md:hidden' : 'max-md:flex-1')}
                >
                  {bottom}
                </section>
              </>
            )}
          </div>
          {right && (
            <>
              <Separator panel="right" value={sizes.right} limits={limits.right} label={`Resize ${labels.right}`} controls={ids.right} onChange={resize('right')} centerHeight={centerHeight} />
              <section id={ids.right} aria-label={labels.right} className={drawerClass('right')}>
                {right}
              </section>
            </>
          )}
          {drawer && <button type="button" aria-label="Close panel" tabIndex={-1} onClick={() => setDrawer(null)} className="fixed inset-0 z-30 bg-brand-obsidian/40 lg:hidden" />}
        </div>
      </div>
    </WorkbenchContext.Provider>
  );
}

export const Workbench = Object.assign(WorkbenchRoot, { Toggle });
