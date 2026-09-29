import type { ReactNode } from 'react';

export type FileNode = {
  path: string;
  kind: 'file' | 'dir';
  readOnly?: boolean;
  modified?: boolean;
  /** Material Symbol overriding the extension icon. */
  icon?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  meta?: ReactNode;
};

export type TreeItem = {
  path: string;
  name: string;
  kind: 'file' | 'dir';
  readOnly?: boolean;
  modified?: boolean;
  icon?: string;
  status?: FileNode['status'];
  meta?: ReactNode;
  level: number;
  parent: string | null;
  children: TreeItem[];
};

/** Build a sorted tree from flat '/'-separated paths. Missing parents become dirs; duplicate paths keep the first. */
export function buildTree(nodes: FileNode[]): TreeItem[] {
  const byPath = new Map<string, TreeItem>();
  const roots: TreeItem[] = [];
  const ensure = (path: string, kind: 'file' | 'dir', extra?: FileNode): TreeItem => {
    const existing = byPath.get(path);
    if (existing) return existing;
    const parts = path.split('/');
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join('/') : null;
    const parent = parentPath ? ensure(parentPath, 'dir') : null;
    const item: TreeItem = {
      path,
      name: parts[parts.length - 1],
      kind,
      readOnly: extra?.readOnly,
      modified: extra?.modified,
      icon: extra?.icon,
      status: extra?.status,
      meta: extra?.meta,
      level: parts.length,
      parent: parentPath,
      children: [],
    };
    byPath.set(path, item);
    (parent ? parent.children : roots).push(item);
    return item;
  };
  for (const n of nodes) {
    const path = n.path.replace(/^\/+|\/+$/g, '');
    if (path && !byPath.has(path)) ensure(path, n.kind, n);
  }
  const sort = (items: TreeItem[]) => {
    items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1));
    items.forEach((i) => sort(i.children));
  };
  sort(roots);
  return roots;
}

export function flattenVisible(roots: TreeItem[], expanded: Set<string>): TreeItem[] {
  const out: TreeItem[] = [];
  const walk = (items: TreeItem[]) => {
    for (const i of items) {
      out.push(i);
      if (i.kind === 'dir' && expanded.has(i.path)) walk(i.children);
    }
  };
  walk(roots);
  return out;
}

export function allDirs(roots: TreeItem[]): string[] {
  const out: string[] = [];
  const walk = (items: TreeItem[]) => items.forEach((i) => i.kind === 'dir' && (out.push(i.path), walk(i.children)));
  walk(roots);
  return out;
}
