import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { Code } from '../primitives/Code';
import { Heading } from '../primitives/Heading';
import { Icon } from './Icon';

// Raw HTML is never rendered (no rehype-raw); react-markdown's default urlTransform drops javascript: URLs.
const components: Components = {
  h1: ({ children }) => <Heading level={1} size="lg">{children}</Heading>,
  h2: ({ children }) => <Heading level={2} size="md">{children}</Heading>,
  h3: ({ children }) => <Heading level={3} size="sm">{children}</Heading>,
  h4: ({ children }) => <Heading level={4} size="sm">{children}</Heading>,
  h5: ({ children }) => <Heading level={4} size="sm">{children}</Heading>,
  h6: ({ children }) => <Heading level={4} size="sm">{children}</Heading>,
  p: ({ children }) => <p className="font-body-md text-body-md text-on-surface wrap-break-word">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-fg-brand underline underline-offset-2 hover:text-brand-cobalt-hover wrap-break-word">
      {children}
    </a>
  ),
  ul: ({ className, children }) => (
    <ul className={cx('flex flex-col gap-space-xs', className === 'contains-task-list' ? 'pl-0' : 'list-disc pl-space-lg')}>{children}</ul>
  ),
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-space-xs pl-space-lg">{children}</ol>,
  li: ({ className, children }) => (
    <li className={cx('font-body-md text-body-md text-on-surface', className === 'task-list-item' ? 'flex list-none items-start gap-space-xs wrap-anywhere' : 'wrap-break-word')}>{children}</li>
  ),
  input: ({ checked }) => <Icon name={checked ? 'check_box' : 'check_box_outline_blank'} size="sm" tone={checked ? 'success' : 'muted'} />,
  code: ({ children }) => <Code>{children}</Code>,
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      className="min-w-0 max-w-full overflow-x-auto rounded-xl bg-brand-obsidian p-space-md font-code-inline text-code-inline text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-cobalt"
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => <blockquote className="border-l-2 border-border-strong pl-space-md text-on-surface-variant wrap-break-word">{children}</blockquote>,
  hr: () => <hr className="border-border-subtle" />,
  table: ({ children }) => (
    <div tabIndex={0} className="min-w-0 max-w-full overflow-x-auto focus-visible:outline-2 focus-visible:outline-brand-cobalt">
      <table className="w-full border-collapse font-body-sm text-body-sm text-on-surface">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-border-subtle bg-surface-subtle px-space-sm py-space-xs text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-border-subtle px-space-sm py-space-xs">{children}</td>,
};

export type MarkdownProps = NativeProps<'div', { children: string }>;

export function Markdown({ children, ...rest }: MarkdownProps) {
  return (
    <div {...rest} className="flex min-w-0 flex-col gap-space-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
