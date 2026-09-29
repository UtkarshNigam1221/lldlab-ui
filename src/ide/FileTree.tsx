import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Dot } from '../components/Dot';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { allDirs, buildTree, flattenVisible, type FileNode, type TreeItem } from './tree';

const EXT_ICON: Record<string, string> = {
  ts: 'code', tsx: 'code', js: 'javascript', jsx: 'javascript', py: 'code', go: 'code', json: 'data_object', md: 'article',
};

function fileIcon(name: string): string {
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  return EXT_ICON[ext] ?? 'description';
}

const STATUS_ICON = {
  success: { name: 'check_circle', tone: 'success', label: 'Passing' },
  warning: { name: 'warning', tone: 'warning', label: 'Warning' },
  danger: { name: 'error', tone: 'danger', label: 'Failing' },
  info: { name: 'info', tone: 'brand', label: 'Info' },
} as const;

export type FileTreeProps = NativeProps<'ul', {
  nodes: FileNode[];
  activePath?: string;
  onOpen: (path: string) => void;
  defaultExpanded?: string[] | 'all';
  label: string;
  children?: never;
}>;

export function FileTree({ nodes, activePath, onOpen, defaultExpanded = 'all', label, ...rest }: FileTreeProps) {
  const baseId = useId();
  const roots = useMemo(() => buildTree(nodes), [nodes]);
  // In 'all' mode track collapsed dirs, so directories that appear later (async nodes) start open.
  const allOpen = defaultExpanded === 'all';
  const [toggled, setToggled] = useState<Set<string>>(() => new Set(allOpen ? [] : defaultExpanded));
  const [focused, setFocused] = useState<string | undefined>(activePath);
  const refs = useRef(new Map<string, HTMLLIElement>());
  if (!roots.length) return null;

  const expanded = new Set(allDirs(roots).filter((d) => toggled.has(d) !== allOpen));
  const visible = flattenVisible(roots, expanded);
  const tabbable = visible.some((i) => i.path === focused) ? focused : visible[0]?.path;

  const focusPath = (path: string) => {
    setFocused(path);
    refs.current.get(path)?.focus();
  };
  const toggle = (path: string, open?: boolean) =>
    setToggled((prev) => {
      const next = new Set(prev);
      const shouldOpen = open ?? !expanded.has(path);
      // toggled holds collapsed dirs in 'all' mode, expanded dirs otherwise.
      if (shouldOpen !== allOpen) next.add(path);
      else next.delete(path);
      return next;
    });
  const activate = (item: TreeItem) => (item.kind === 'dir' ? toggle(item.path) : onOpen(item.path));

  const onKeyDown = (e: KeyboardEvent, item: TreeItem) => {
    const i = visible.findIndex((v) => v.path === item.path);
    const isOpen = item.kind === 'dir' && expanded.has(item.path);
    let handled = true;
    switch (e.key) {
      case 'ArrowDown':
        if (i < visible.length - 1) focusPath(visible[i + 1].path);
        break;
      case 'ArrowUp':
        if (i > 0) focusPath(visible[i - 1].path);
        break;
      case 'Home':
        focusPath(visible[0].path);
        break;
      case 'End':
        focusPath(visible[visible.length - 1].path);
        break;
      case 'ArrowRight':
        if (item.kind === 'dir') {
          if (!isOpen) toggle(item.path, true);
          else if (item.children[0]) focusPath(item.children[0].path);
        }
        break;
      case 'ArrowLeft':
        if (isOpen) toggle(item.path, false);
        else if (item.parent) focusPath(item.parent);
        break;
      case 'Enter':
        activate(item);
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const renderItems = (items: TreeItem[]) =>
    items.map((item) => {
      const isDir = item.kind === 'dir';
      const isOpen = isDir && expanded.has(item.path);
      // Name the treeitem from its own row only, not from its nested children.
      const rowId = `${baseId}-${encodeURIComponent(item.path)}`;
      return (
        <li
          key={item.path}
          ref={(el) => {
            if (el) refs.current.set(item.path, el);
            else refs.current.delete(item.path);
          }}
          role="treeitem"
          aria-labelledby={rowId}
          aria-level={item.level}
          aria-expanded={isDir ? isOpen : undefined}
          aria-selected={item.path === activePath}
          tabIndex={item.path === tabbable ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, item)}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocused(item.path);
          }}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-inset [&:focus-visible>div]:ring-brand-cobalt"
        >
          <div
            id={rowId}
            onClick={() => {
              focusPath(item.path);
              activate(item);
            }}
            style={{ paddingLeft: `calc(${item.level - 1} * 0.75rem + 0.5rem)` }}
            className={cx(
              'flex min-w-0 cursor-pointer items-center gap-space-xs py-space-2xs pr-space-sm font-code-inline text-code-inline max-md:min-h-11',
              item.path === activePath ? 'bg-surface-muted text-ink' : 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface',
            )}
          >
            {isDir ? <Icon name={isOpen ? 'expand_more' : 'chevron_right'} size="sm" /> : <span className="inline-block w-4 shrink-0" />}
            <Icon name={isDir ? (isOpen ? 'folder_open' : 'folder') : (item.icon ?? fileIcon(item.name))} size="sm" tone={isDir ? 'brand' : 'inherit'} />
            <span className="truncate">{item.name}</span>
            {item.readOnly && ' '}
            {item.readOnly && <Icon name="lock" size="sm" label="Read-only" />}
            {item.modified && (
              <>
                {' '}
                <Dot tone="brand" />
                <span className="sr-only">(modified)</span>
              </>
            )}
            {item.status && (
              <>
                {' '}
                <Icon name={STATUS_ICON[item.status].name} size="sm" tone={STATUS_ICON[item.status].tone} label={STATUS_ICON[item.status].label} />
              </>
            )}
            {item.meta !== undefined && <span className="ml-auto shrink-0 font-label-mono text-[11px] text-on-surface-variant">{item.meta}</span>}
          </div>
          {isDir && isOpen && item.children.length > 0 && <ul role="group">{renderItems(item.children)}</ul>}
        </li>
      );
    });

  return (
    <ul {...rest} role="tree" aria-label={label} className="min-w-0 overflow-auto py-space-xs">
      {renderItems(roots)}
    </ul>
  );
}
