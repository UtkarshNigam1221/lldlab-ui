import { createContext, useContext, type ElementType } from 'react';
import type { PolyProps } from '../internal/poly';

export type ThemeTone = 'light' | 'dark';

const ThemeToneContext = createContext<ThemeTone | undefined>(undefined);

/** The nearest <Theme> tone, for components that render outside their scope's DOM (portals). */
export function useThemeTone(): ThemeTone | undefined {
  return useContext(ThemeToneContext);
}

export type ThemeProps<E extends ElementType = 'div'> = PolyProps<E, { tone?: ThemeTone }>;

/** Scopes the colour tokens: everything inside renders in `tone`. */
export function Theme<E extends ElementType = 'div'>({ as, tone = 'light', ...rest }: ThemeProps<E>) {
  const C: ElementType = as ?? 'div';
  // color-scheme is set by the [data-theme] rules in theme.css.
  return (
    <ThemeToneContext.Provider value={tone}>
      <C {...rest} data-theme={tone} className="bg-surface text-on-surface" />
    </ThemeToneContext.Provider>
  );
}
