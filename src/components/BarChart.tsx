import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

const HEIGHT = { sm: 'h-16', md: 'h-28' } as const;
const TONE = { brand: 'bg-brand-cobalt', success: 'bg-brand-emerald' } as const;

export type BarChartProps = NativeProps<'figure', {
  label: string;
  bars: Array<{ value: number; label?: string }>;
  highlight?: number;
  highlightLabel?: string;
  axis?: [ReactNode, ReactNode, ReactNode];
  height?: keyof typeof HEIGHT;
  tone?: keyof typeof TONE;
  children?: never;
}>;

/** CSS bar chart; the data is also available as a visually hidden table. */
export function BarChart({ label, bars, highlight, highlightLabel, axis, height = 'md', tone = 'brand', ...rest }: BarChartProps) {
  const max = Math.max(0, ...bars.map((b) => b.value));
  const name = (i: number) => bars[i].label ?? `Bar ${i + 1}`;
  const hl = highlight !== undefined && bars[highlight] ? `; highlighted ${name(highlight)} = ${bars[highlight].value}` : '';
  const summary = `${label}: ${bars.length} bars, highest ${max}${hl}`;
  return (
    <figure {...rest} className="flex min-w-0 flex-col gap-space-xs">
      <div role="img" aria-label={summary} className={cx('flex items-end gap-1', HEIGHT[height], highlightLabel && 'pt-space-lg')}>
        {bars.map((b, i) => {
          const pct = max > 0 ? Math.max(2, Math.round((Math.max(0, b.value) / max) * 100)) : 2;
          const strong = highlight === undefined || i === highlight;
          return (
            <div key={i} className="relative flex h-full min-w-0 flex-1 items-end">
              {i === highlight && highlightLabel && (
                <span className="absolute -top-space-lg left-1/2 -translate-x-1/2 whitespace-nowrap font-label-mono text-[10px] text-fg-brand">{highlightLabel}</span>
              )}
              <div data-bar="" className={cx('w-full rounded-t', strong ? TONE[tone] : 'bg-surface-container-high')} style={{ height: `${pct}%` }} />
            </div>
          );
        })}
      </div>
      {axis && (
        <div aria-hidden="true" className="flex justify-between font-label-mono text-[10px] text-on-surface-variant">
          <span>{axis[0]}</span>
          <span>{axis[1]}</span>
          <span>{axis[2]}</span>
        </div>
      )}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {bars.map((b, i) => (
            <tr key={i}>
              <th scope="row">{name(i)}</th>
              <td>{b.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
