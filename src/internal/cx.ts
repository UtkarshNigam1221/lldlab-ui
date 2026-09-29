export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cobalt';
/** 44px minimum touch height below md. */
export const TOUCH = 'max-md:min-h-11';
/** 44×44px minimum touch target below md, for icon-only controls. */
export const TOUCH_ICON = 'max-md:min-h-11 max-md:min-w-11';
