export const BREAKPOINTS = ['base', 'sm', 'md', 'lg', 'xl'] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** One value, or one value per breakpoint (min-width, Tailwind semantics). */
export type Responsive<T extends string | number> = T | Partial<Record<Breakpoint, T>>;

export type ClassTable<V extends string | number> = Record<Breakpoint, Record<V, string>>;

export function responsive<V extends string | number>(table: ClassTable<V>, value: Responsive<V> | undefined): string {
  if (value === undefined) return '';
  if (typeof value !== 'object') return table.base[value];
  return BREAKPOINTS.flatMap((bp) => {
    const v = value[bp];
    return v === undefined ? [] : [table[bp][v]];
  }).join(' ');
}
