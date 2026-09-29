import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type TerminalLine = { kind: 'command' | 'plain' | 'error' | 'warning' | 'hint' | 'success'; text: string };

// Always on the dark obsidian surface: these palette colours are AA on #0F172A.
const KIND: Record<TerminalLine['kind'], string> = {
  command: 'text-slate-100',
  plain: 'text-slate-300',
  error: 'border-l-2 border-red-400 bg-red-500/10 pl-space-sm text-red-300',
  warning: 'text-amber-300',
  hint: 'text-sky-300',
  success: 'text-emerald-300',
};
const MAX = { sm: 'max-h-40', md: 'max-h-72', lg: 'max-h-[32rem]', none: '' } as const;

export type TerminalOutputProps = NativeProps<'figure', {
  lines: TerminalLine[];
  title?: ReactNode;
  status?: ReactNode;
  maxHeight?: keyof typeof MAX;
  children?: never;
}>;

export function TerminalOutput({ lines, title, status, maxHeight = 'md', ...rest }: TerminalOutputProps) {
  return (
    <figure {...rest} className="min-w-0 max-w-full overflow-hidden rounded-xl bg-brand-obsidian">
      {(title || status) && (
        <figcaption className="flex min-w-0 items-center justify-between gap-space-sm border-b border-white/10 px-space-md py-space-xs font-label-mono text-label-mono uppercase text-slate-300">
          <span className="truncate">{title}</span>
          {status}
        </figcaption>
      )}
      <div
        role="log"
        aria-label={typeof title === 'string' ? title : 'Output'}
        tabIndex={0}
        className={cx('overflow-auto p-space-md font-code-inline text-code-inline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt', MAX[maxHeight])}
      >
        {lines.map((line, i) => (
          <div key={i} className={cx('whitespace-pre-wrap wrap-break-word', KIND[line.kind])}>
            {line.kind === 'command' && (
              <span aria-hidden="true" className="select-none text-slate-400">
                ${' '}
              </span>
            )}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
