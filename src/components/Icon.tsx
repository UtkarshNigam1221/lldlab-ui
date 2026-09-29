import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';
import { TEXT_TONE, type Tone } from '../internal/tones';

const SIZE = { sm: 'text-[16px]', md: 'text-[20px]', lg: 'text-[24px]' } as const;

export type IconProps = NativeProps<
  'span',
  { name: string; size?: keyof typeof SIZE; tone?: Tone | 'inherit'; filled?: boolean; spin?: boolean; label?: string; children?: never }
>;

/** Material Symbols Outlined ligature icon. The app loads the font. */
export function Icon({ name, size = 'md', tone = 'inherit', filled, spin, label, ...rest }: IconProps) {
  return (
    <span
      {...rest}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cx(
        'material-symbols-outlined inline-block shrink-0 select-none leading-none',
        SIZE[size],
        tone !== 'inherit' && TEXT_TONE[tone],
        filled && 'icon-filled',
        spin && 'animate-spin',
      )}
    >
      {name}
    </span>
  );
}
