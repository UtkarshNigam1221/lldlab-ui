import { useTokenize } from 'prism-react-renderer';
import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Prism, resolveLanguage, tokenClass } from '../internal/highlight';
import type { NativeProps } from '../internal/poly';

const TONE = {
  dark: { root: 'bg-brand-obsidian', header: 'border-white/10 text-slate-300' },
  subtle: { root: 'code-subtle border border-border-subtle bg-code-bg-subtle', header: 'border-border-subtle text-on-surface-variant' },
} as const;

export type CodeBlockProps = NativeProps<'figure', {
  language?: string;
  /** Syntax-highlight string children (ts, tsx, js, jsx, python, go, java, json, bash). */
  highlight?: boolean;
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  lineNumbers?: boolean;
  tone?: keyof typeof TONE;
  children: ReactNode;
  /** Code only: no caption bar, frame or padding (inside a pane that provides them). */
  bare?: boolean;
}>;

function Lines({ lines, numbered }: { lines: Array<Array<{ content: string; className: string }>>; numbered?: boolean }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="table-row">
          {numbered && (
            <span aria-hidden="true" className="table-cell select-none pr-space-md text-right text-code-comment">
              {i + 1}
            </span>
          )}
          <span className="table-cell">
            {line.map((t, j) => (
              <span key={j} className={t.className || undefined}>
                {t.content}
              </span>
            ))}
            {'\n'}
          </span>
        </span>
      ))}
    </>
  );
}

function Highlighted({ code, language, numbered }: { code: string; language: string; numbered?: boolean }) {
  const tokens = useTokenize({ prism: Prism, code, grammar: Prism.languages[language], language });
  return <Lines numbered={numbered} lines={tokens.map((line) => line.map((t) => ({ content: t.content, className: tokenClass(t.types) })))} />;
}

/** Code block; scrolls inside itself so long lines never widen the page. */
export function CodeBlock({ language, highlight, title, meta, actions, lineNumbers, tone = 'dark', bare, children, ...rest }: CodeBlockProps) {
  const t = TONE[tone];
  const code = typeof children === 'string' ? children.replace(/\n$/, '') : null;
  const lang = highlight && code !== null ? resolveLanguage(language) : undefined;
  const heading = title ?? language;
  let body: ReactNode = children;
  if (code !== null && lang) body = <Highlighted code={code} language={lang} numbered={lineNumbers} />;
  else if (code !== null && lineNumbers) body = <Lines numbered lines={code.split('\n').map((l) => [{ content: l, className: '' }])} />;
  return (
    <figure {...rest} data-theme={tone === 'dark' ? 'dark' : undefined} className={cx('min-w-0 max-w-full overflow-hidden', !bare && cx('rounded-xl', t.root))}>
      {!bare && (heading || meta || actions) && (
        <figcaption className={cx('flex min-w-0 flex-wrap items-center gap-space-sm border-b px-space-md py-space-xs font-label-mono text-label-mono', t.header)}>
          {heading && <span className={cx('min-w-0 truncate', !title && 'uppercase')}>{heading}</span>}
          {meta}
          {actions && <span className="ml-auto flex shrink-0 items-center gap-space-xs">{actions}</span>}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        className={cx('overflow-x-auto font-code-inline text-code-inline text-code-plain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt', bare ? 'p-0' : 'p-space-md')}
      >
        <code className={lineNumbers ? 'table' : undefined}>{body}</code>
      </pre>
    </figure>
  );
}
