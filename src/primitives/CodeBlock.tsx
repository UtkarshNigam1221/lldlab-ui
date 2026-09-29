import type { ReactNode } from 'react';
import type { NativeProps } from '../internal/poly';

export type CodeBlockProps = NativeProps<'figure', { language?: string; children: ReactNode }>;

/** Dark code block; scrolls inside itself so long lines never widen the page. */
export function CodeBlock({ language, children, ...rest }: CodeBlockProps) {
  return (
    <figure {...rest} className="min-w-0 max-w-full overflow-hidden rounded-xl bg-brand-obsidian">
      {language && (
        <figcaption className="border-b border-white/10 px-space-md py-space-xs font-label-mono text-label-mono uppercase text-slate-300">{language}</figcaption>
      )}
      <pre tabIndex={0} className="overflow-x-auto p-space-md font-code-inline text-code-inline text-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-cobalt">
        <code>{children}</code>
      </pre>
    </figure>
  );
}
