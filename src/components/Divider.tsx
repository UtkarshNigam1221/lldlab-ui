import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import type { Space } from '../internal/tables';

const SPACE_Y: Record<Space, string> = {
  none: '', '2xs': 'my-space-2xs', xs: 'my-space-xs', sm: 'my-space-sm', md: 'my-space-md', lg: 'my-space-lg', xl: 'my-space-xl', '2xl': 'my-space-2xl',
};
const SPACE_X: Record<Space, string> = {
  none: '', '2xs': 'mx-space-2xs', xs: 'mx-space-xs', sm: 'mx-space-sm', md: 'mx-space-md', lg: 'mx-space-lg', xl: 'mx-space-xl', '2xl': 'mx-space-2xl',
};

export type DividerProps = NativeProps<'div', { orientation?: 'horizontal' | 'vertical'; label?: ReactNode; spacing?: Space; children?: never }>;

export function Divider({ orientation = 'horizontal', label, spacing = 'none', ...rest }: DividerProps) {
  if (orientation === 'vertical') {
    return <div {...rest} role="separator" aria-orientation="vertical" className={cx('min-h-4 w-px shrink-0 self-stretch bg-border-subtle', SPACE_X[spacing])} />;
  }
  if (label) {
    return (
      <div {...rest} role="separator" aria-orientation="horizontal" className={cx('flex w-full min-w-0 items-center gap-space-sm', SPACE_Y[spacing])}>
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="shrink-0 font-label-mono text-label-mono uppercase text-on-surface-variant">{label}</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>
    );
  }
  return <div {...rest} role="separator" aria-orientation="horizontal" className={cx('h-px w-full shrink-0 bg-border-subtle', SPACE_Y[spacing])} />;
}
