import type { ClassTable } from './responsive';

export type Space = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Direction = 'row' | 'column';
export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justify = 'start' | 'center' | 'end' | 'between';
export type Cols = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'display' | 'xl' | 'lg' | 'md' | 'sm';

// Literal strings so the consuming app's Tailwind scan of dist/ generates every class.
export const GAP: ClassTable<Space> = {
  base: { none: 'gap-0', '2xs': 'gap-space-2xs', xs: 'gap-space-xs', sm: 'gap-space-sm', md: 'gap-space-md', lg: 'gap-space-lg', xl: 'gap-space-xl', '2xl': 'gap-space-2xl' },
  sm: { none: 'sm:gap-0', '2xs': 'sm:gap-space-2xs', xs: 'sm:gap-space-xs', sm: 'sm:gap-space-sm', md: 'sm:gap-space-md', lg: 'sm:gap-space-lg', xl: 'sm:gap-space-xl', '2xl': 'sm:gap-space-2xl' },
  md: { none: 'md:gap-0', '2xs': 'md:gap-space-2xs', xs: 'md:gap-space-xs', sm: 'md:gap-space-sm', md: 'md:gap-space-md', lg: 'md:gap-space-lg', xl: 'md:gap-space-xl', '2xl': 'md:gap-space-2xl' },
  lg: { none: 'lg:gap-0', '2xs': 'lg:gap-space-2xs', xs: 'lg:gap-space-xs', sm: 'lg:gap-space-sm', md: 'lg:gap-space-md', lg: 'lg:gap-space-lg', xl: 'lg:gap-space-xl', '2xl': 'lg:gap-space-2xl' },
  xl: { none: 'xl:gap-0', '2xs': 'xl:gap-space-2xs', xs: 'xl:gap-space-xs', sm: 'xl:gap-space-sm', md: 'xl:gap-space-md', lg: 'xl:gap-space-lg', xl: 'xl:gap-space-xl', '2xl': 'xl:gap-space-2xl' },
};

export const PADDING: ClassTable<Space> = {
  base: { none: 'p-0', '2xs': 'p-space-2xs', xs: 'p-space-xs', sm: 'p-space-sm', md: 'p-space-md', lg: 'p-space-lg', xl: 'p-space-xl', '2xl': 'p-space-2xl' },
  sm: { none: 'sm:p-0', '2xs': 'sm:p-space-2xs', xs: 'sm:p-space-xs', sm: 'sm:p-space-sm', md: 'sm:p-space-md', lg: 'sm:p-space-lg', xl: 'sm:p-space-xl', '2xl': 'sm:p-space-2xl' },
  md: { none: 'md:p-0', '2xs': 'md:p-space-2xs', xs: 'md:p-space-xs', sm: 'md:p-space-sm', md: 'md:p-space-md', lg: 'md:p-space-lg', xl: 'md:p-space-xl', '2xl': 'md:p-space-2xl' },
  lg: { none: 'lg:p-0', '2xs': 'lg:p-space-2xs', xs: 'lg:p-space-xs', sm: 'lg:p-space-sm', md: 'lg:p-space-md', lg: 'lg:p-space-lg', xl: 'lg:p-space-xl', '2xl': 'lg:p-space-2xl' },
  xl: { none: 'xl:p-0', '2xs': 'xl:p-space-2xs', xs: 'xl:p-space-xs', sm: 'xl:p-space-sm', md: 'xl:p-space-md', lg: 'xl:p-space-lg', xl: 'xl:p-space-xl', '2xl': 'xl:p-space-2xl' },
};

export const COLS: ClassTable<Cols> = {
  base: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' },
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6' },
};

export const DIRECTION: ClassTable<Direction> = {
  base: { row: 'flex-row', column: 'flex-col' },
  sm: { row: 'sm:flex-row', column: 'sm:flex-col' },
  md: { row: 'md:flex-row', column: 'md:flex-col' },
  lg: { row: 'lg:flex-row', column: 'lg:flex-col' },
  xl: { row: 'xl:flex-row', column: 'xl:flex-col' },
};

export const ALIGN: ClassTable<Align> = {
  base: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' },
  sm: { start: 'sm:items-start', center: 'sm:items-center', end: 'sm:items-end', stretch: 'sm:items-stretch', baseline: 'sm:items-baseline' },
  md: { start: 'md:items-start', center: 'md:items-center', end: 'md:items-end', stretch: 'md:items-stretch', baseline: 'md:items-baseline' },
  lg: { start: 'lg:items-start', center: 'lg:items-center', end: 'lg:items-end', stretch: 'lg:items-stretch', baseline: 'lg:items-baseline' },
  xl: { start: 'xl:items-start', center: 'xl:items-center', end: 'xl:items-end', stretch: 'xl:items-stretch', baseline: 'xl:items-baseline' },
};

export const JUSTIFY: ClassTable<Justify> = {
  base: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
  sm: { start: 'sm:justify-start', center: 'sm:justify-center', end: 'sm:justify-end', between: 'sm:justify-between' },
  md: { start: 'md:justify-start', center: 'md:justify-center', end: 'md:justify-end', between: 'md:justify-between' },
  lg: { start: 'lg:justify-start', center: 'lg:justify-center', end: 'lg:justify-end', between: 'lg:justify-between' },
  xl: { start: 'xl:justify-start', center: 'xl:justify-center', end: 'xl:justify-end', between: 'xl:justify-between' },
};

export const HEADING_SIZE: ClassTable<HeadingSize> = {
  base: { display: 'text-display', xl: 'text-headline-xl', lg: 'text-headline-lg', md: 'text-headline-md', sm: 'text-headline-sm' },
  sm: { display: 'sm:text-display', xl: 'sm:text-headline-xl', lg: 'sm:text-headline-lg', md: 'sm:text-headline-md', sm: 'sm:text-headline-sm' },
  md: { display: 'md:text-display', xl: 'md:text-headline-xl', lg: 'md:text-headline-lg', md: 'md:text-headline-md', sm: 'md:text-headline-sm' },
  lg: { display: 'lg:text-display', xl: 'lg:text-headline-xl', lg: 'lg:text-headline-lg', md: 'lg:text-headline-md', sm: 'lg:text-headline-sm' },
  xl: { display: 'xl:text-display', xl: 'xl:text-headline-xl', lg: 'xl:text-headline-lg', md: 'xl:text-headline-md', sm: 'xl:text-headline-sm' },
};


export const PADDING_TOP: ClassTable<Space> = {
  base: { none: 'pt-0', '2xs': 'pt-space-2xs', xs: 'pt-space-xs', sm: 'pt-space-sm', md: 'pt-space-md', lg: 'pt-space-lg', xl: 'pt-space-xl', '2xl': 'pt-space-2xl' },
  sm: { none: 'sm:pt-0', '2xs': 'sm:pt-space-2xs', xs: 'sm:pt-space-xs', sm: 'sm:pt-space-sm', md: 'sm:pt-space-md', lg: 'sm:pt-space-lg', xl: 'sm:pt-space-xl', '2xl': 'sm:pt-space-2xl' },
  md: { none: 'md:pt-0', '2xs': 'md:pt-space-2xs', xs: 'md:pt-space-xs', sm: 'md:pt-space-sm', md: 'md:pt-space-md', lg: 'md:pt-space-lg', xl: 'md:pt-space-xl', '2xl': 'md:pt-space-2xl' },
  lg: { none: 'lg:pt-0', '2xs': 'lg:pt-space-2xs', xs: 'lg:pt-space-xs', sm: 'lg:pt-space-sm', md: 'lg:pt-space-md', lg: 'lg:pt-space-lg', xl: 'lg:pt-space-xl', '2xl': 'lg:pt-space-2xl' },
  xl: { none: 'xl:pt-0', '2xs': 'xl:pt-space-2xs', xs: 'xl:pt-space-xs', sm: 'xl:pt-space-sm', md: 'xl:pt-space-md', lg: 'xl:pt-space-lg', xl: 'xl:pt-space-xl', '2xl': 'xl:pt-space-2xl' },
};

export const PADDING_BOTTOM: ClassTable<Space> = {
  base: { none: 'pb-0', '2xs': 'pb-space-2xs', xs: 'pb-space-xs', sm: 'pb-space-sm', md: 'pb-space-md', lg: 'pb-space-lg', xl: 'pb-space-xl', '2xl': 'pb-space-2xl' },
  sm: { none: 'sm:pb-0', '2xs': 'sm:pb-space-2xs', xs: 'sm:pb-space-xs', sm: 'sm:pb-space-sm', md: 'sm:pb-space-md', lg: 'sm:pb-space-lg', xl: 'sm:pb-space-xl', '2xl': 'sm:pb-space-2xl' },
  md: { none: 'md:pb-0', '2xs': 'md:pb-space-2xs', xs: 'md:pb-space-xs', sm: 'md:pb-space-sm', md: 'md:pb-space-md', lg: 'md:pb-space-lg', xl: 'md:pb-space-xl', '2xl': 'md:pb-space-2xl' },
  lg: { none: 'lg:pb-0', '2xs': 'lg:pb-space-2xs', xs: 'lg:pb-space-xs', sm: 'lg:pb-space-sm', md: 'lg:pb-space-md', lg: 'lg:pb-space-lg', xl: 'lg:pb-space-xl', '2xl': 'lg:pb-space-2xl' },
  xl: { none: 'xl:pb-0', '2xs': 'xl:pb-space-2xs', xs: 'xl:pb-space-xs', sm: 'xl:pb-space-sm', md: 'xl:pb-space-md', lg: 'xl:pb-space-lg', xl: 'xl:pb-space-xl', '2xl': 'xl:pb-space-2xl' },
};

export const COL_SPAN: ClassTable<Cols> = {
  base: { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5', 6: 'col-span-6' },
  sm: { 1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3', 4: 'sm:col-span-4', 5: 'sm:col-span-5', 6: 'sm:col-span-6' },
  md: { 1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6' },
  lg: { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6' },
  xl: { 1: 'xl:col-span-1', 2: 'xl:col-span-2', 3: 'xl:col-span-3', 4: 'xl:col-span-4', 5: 'xl:col-span-5', 6: 'xl:col-span-6' },
};
