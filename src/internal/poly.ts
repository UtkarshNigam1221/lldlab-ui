import type { ComponentPropsWithRef, ElementType } from 'react';

/** Props no public component accepts: styling only changes through variants. */
export type Forbidden = 'className' | 'style';

/** Own props P, plus `as`, plus the rendered element's props minus Forbidden. */
export type PolyProps<E extends ElementType, P> = P & { as?: E } & Omit<ComponentPropsWithRef<E>, keyof P | 'as' | Forbidden>;

/** Own props P plus a fixed element's props minus Forbidden. */
export type NativeProps<E extends ElementType, P> = P & Omit<ComponentPropsWithRef<E>, keyof P | Forbidden>;
