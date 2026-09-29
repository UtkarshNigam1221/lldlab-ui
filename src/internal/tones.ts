/** Foreground tones for text and icons. Status tones use the AA-safe fg-* tokens. */
export type Tone = 'default' | 'muted' | 'strong' | 'brand' | 'success' | 'warning' | 'danger' | 'inverse';

export const TEXT_TONE: Record<Tone, string> = {
  default: 'text-on-surface',
  muted: 'text-on-surface-variant',
  strong: 'text-ink',
  brand: 'text-fg-brand',
  success: 'text-fg-success',
  warning: 'text-fg-warning',
  danger: 'text-fg-danger',
  inverse: 'text-on-primary',
};

export type StatusTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

/** Solid fills (dots, bars): not text, so the vivid brand colours are fine. */
export const DOT_TONE: Record<StatusTone, string> = {
  neutral: 'bg-border-strong',
  brand: 'bg-brand-cobalt',
  success: 'bg-brand-emerald',
  warning: 'bg-brand-amber',
  danger: 'bg-brand-crimson',
};
