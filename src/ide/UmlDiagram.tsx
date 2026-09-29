import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { IconButton } from '../components/IconButton';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { UmlClass } from './UmlClass';

export type UmlNode = {
  id: string;
  name: string;
  stereotype?: string;
  attributes?: string[];
  methods?: string[];
  tag?: ReactNode;
  emphasis?: 'default' | 'brand' | 'strong';
  dashed?: boolean;
};
export type UmlEdgeKind = 'association' | 'dependency' | 'realization' | 'inheritance' | 'aggregation' | 'composition';
export type UmlEdge = { from: string; to: string; kind: UmlEdgeKind; label?: string; fromMultiplicity?: string; toMultiplicity?: string };

const VERB: Record<UmlEdgeKind, string> = {
  association: 'is associated with',
  dependency: 'depends on',
  realization: 'implements',
  inheritance: 'extends',
  aggregation: 'aggregates',
  composition: 'composes',
};
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

/** Plain-language description of a diagram for screen readers. */
export function describeDiagram(label: string, nodes: UmlNode[], edges: UmlEdge[]): string {
  const byId = new Map(nodes.map((n) => [n.id, n.name]));
  const classes = nodes.map((n) => (n.stereotype ? `${n.name} (${n.stereotype})` : n.name)).join(', ');
  const rels = edges
    .filter((e) => byId.has(e.from) && byId.has(e.to))
    .map((e) => {
      const mult = e.fromMultiplicity || e.toMultiplicity ? ` (${e.fromMultiplicity ?? ''} to ${e.toMultiplicity ?? ''})` : '';
      return `${byId.get(e.from)} ${VERB[e.kind]} ${byId.get(e.to)}${mult}${e.label ? `, ${e.label}` : ''}`;
    })
    .join('; ');
  return `${label}. Classes: ${classes}.${rels ? ` Relationships: ${rels}.` : ''}`;
}

type Point = { x: number; y: number };
type Layout = { width: number; height: number; nodes: Record<string, Point>; edges: Array<Point[] | null> };

function edgeStyle(kind: UmlEdgeKind, id: string) {
  const dashed = kind === 'dependency' || kind === 'realization';
  const end = kind === 'association' || kind === 'dependency' ? `url(#${id}-arrow)` : kind === 'realization' || kind === 'inheritance' ? `url(#${id}-triangle)` : undefined;
  const start = kind === 'aggregation' ? `url(#${id}-diamond-hollow)` : kind === 'composition' ? `url(#${id}-diamond-filled)` : undefined;
  return { dashed, end, start };
}

export type UmlDiagramProps = NativeProps<'figure', {
  label: string;
  nodes: UmlNode[];
  edges: UmlEdge[];
  direction?: 'TB' | 'LR';
  zoomable?: boolean;
  /** Small inline diagram: no zoom controls, scaled to fit the width. */
  compact?: boolean;
  pattern?: 'dots' | 'none';
  children?: never;
}>;

export function UmlDiagram({ label, nodes, edges, direction = 'TB', zoomable = true, compact, pattern = 'dots', ...rest }: UmlDiagramProps) {
  // Marker ids go into url(#…), so keep only safe characters from React's generated id.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(1);
  const contentKey = JSON.stringify({ n: nodes.map((n) => [n.id, n.name, n.stereotype, n.attributes, n.methods]), e: edges.map((e) => [e.from, e.to, e.kind]), direction, compact });
  // Bumped when a box's measured size changes (revealed from hidden, web fonts loaded), forcing a new layout.
  const [sizeTick, setSizeTick] = useState(0);
  const sizes = useRef(new Map<string, string>());
  const key = `${contentKey}#${sizeTick}`;

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      let changed = false;
      nodeRefs.current.forEach((el, nodeId) => {
        const size = `${el.offsetWidth}x${el.offsetHeight}`;
        if (sizes.current.get(nodeId) !== size) {
          sizes.current.set(nodeId, size);
          changed = true;
        }
      });
      if (changed) setSizeTick((t) => t + 1);
    });
    nodeRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [contentKey]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { Graph, layout: runLayout } = await import('@dagrejs/dagre');
      const g = new Graph({ multigraph: true });
      g.setGraph({ rankdir: direction, nodesep: 48, ranksep: 64, marginx: 16, marginy: 16 });
      g.setDefaultEdgeLabel(() => ({}));
      for (const n of nodes) {
        const el = nodeRefs.current.get(n.id);
        // offsetWidth/Height ignore the zoom transform; jsdom reports 0, so fall back to a typical box size.
        g.setNode(n.id, { width: el?.offsetWidth || 160, height: el?.offsetHeight || 80 });
      }
      edges.forEach((e, i) => {
        if (g.hasNode(e.from) && g.hasNode(e.to)) g.setEdge(e.from, e.to, {}, `e${i}`);
      });
      runLayout(g);
      if (cancelled) return;
      const graph = g.graph();
      const positioned: Record<string, Point> = {};
      for (const n of nodes) {
        const v = g.node(n.id) as { x: number; y: number; width: number; height: number } | undefined;
        if (v) positioned[n.id] = { x: v.x - v.width / 2, y: v.y - v.height / 2 };
      }
      setLayout({
        width: graph.width ?? 0,
        height: graph.height ?? 0,
        nodes: positioned,
        edges: edges.map((e, i) => (g.edge({ v: e.from, w: e.to, name: `e${i}` }) as { points?: Point[] } | undefined)?.points ?? null),
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the diagram's content
  }, [key]);

  // Fit-to-width for compact diagrams (and the initial zoom on narrow screens).
  useEffect(() => {
    const vp = viewportRef.current;
    if (!layout || !vp || layout.width === 0) return;
    const measure = () => setFit(Math.min(1, vp.clientWidth / layout.width || 1));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [layout]);

  const scale = compact ? fit : zoom;
  const descId = `${id}-desc`;
  return (
    <figure {...rest} className="relative min-w-0 max-w-full overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle">
      <figcaption id={descId} className="sr-only">
        {describeDiagram(label, nodes, edges)}
      </figcaption>
      {zoomable && !compact && (
        <div className="absolute right-space-sm top-space-sm z-10 flex items-center gap-space-2xs rounded-lg bg-surface-elevated/90 p-space-2xs shadow-sm">
          <IconButton icon="zoom_out" label="Zoom out" size="xs" variant="secondary" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))} />
          <span aria-live="polite" className="w-10 text-center font-label-mono text-[11px] text-on-surface-variant">
            {Math.round(zoom * 100)}%
          </span>
          <IconButton icon="zoom_in" label="Zoom in" size="xs" variant="secondary" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))} />
          <IconButton icon="fit_screen" label="Reset zoom" size="xs" variant="secondary" onClick={() => setZoom(1)} />
        </div>
      )}
      <div
        ref={viewportRef}
        role="region"
        aria-label={`${label} diagram`}
        tabIndex={0}
        className={cx('min-h-40 overflow-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt', pattern === 'dots' && 'bg-pattern-dots', compact ? 'max-h-64' : 'max-h-[36rem]', zoomable && !compact && 'pt-space-2xl')}
      >
        <div
          role="img"
          aria-label={label}
          aria-describedby={descId}
          className={layout ? 'relative origin-top-left' : 'flex flex-wrap gap-space-md p-space-md'}
          style={layout ? { width: layout.width, height: layout.height, transform: `scale(${scale})` } : undefined}
        >
          {layout && (
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible text-on-surface-variant" width={layout.width} height={layout.height}>
              <defs>
                <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-triangle`} viewBox="0 0 12 12" refX="12" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 z" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-diamond-hollow`} viewBox="0 0 14 8" refX="14" refY="4" markerWidth="14" markerHeight="8" orient="auto-start-reverse">
                  <path d="M0,4 L7,0 L14,4 L7,8 z" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="1.5" />
                </marker>
                <marker id={`${id}-diamond-filled`} viewBox="0 0 14 8" refX="14" refY="4" markerWidth="14" markerHeight="8" orient="auto-start-reverse">
                  <path d="M0,4 L7,0 L14,4 L7,8 z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const pts = layout.edges[i];
                if (!pts || pts.length < 2) return null;
                const s = edgeStyle(e.kind, id);
                const d = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                const mid = pts[Math.floor(pts.length / 2)];
                return (
                  <g key={i}>
                    <path
                      data-edge=""
                      d={d}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray={s.dashed ? '6 4' : undefined}
                      markerEnd={s.end}
                      markerStart={s.start}
                    />
                    {e.label && <text x={mid.x + 6} y={mid.y - 6} className="fill-on-surface-variant font-code-inline text-[10px]">{e.label}</text>}
                    {e.fromMultiplicity && <text x={pts[0].x + 6} y={pts[0].y + 14} className="fill-on-surface-variant font-code-inline text-[10px]">{e.fromMultiplicity}</text>}
                    {e.toMultiplicity && <text x={pts[pts.length - 1].x + 6} y={pts[pts.length - 1].y - 6} className="fill-on-surface-variant font-code-inline text-[10px]">{e.toMultiplicity}</text>}
                  </g>
                );
              })}
            </svg>
          )}
          {nodes.map((n) => (
            <div
              key={n.id}
              data-node=""
              ref={(el) => {
                if (el) nodeRefs.current.set(n.id, el);
                else nodeRefs.current.delete(n.id);
              }}
              className={layout ? 'absolute' : undefined}
              style={layout?.nodes[n.id] ? { left: layout.nodes[n.id].x, top: layout.nodes[n.id].y } : undefined}
            >
              <UmlClass name={n.name} stereotype={n.stereotype} attributes={n.attributes} methods={n.methods} tag={n.tag} emphasis={n.emphasis} dashed={n.dashed} size={compact ? 'sm' : 'md'} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
