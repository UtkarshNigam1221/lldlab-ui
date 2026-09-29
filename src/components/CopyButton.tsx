import { useEffect, useState } from 'react';
import type { NativeProps } from '../internal/poly';
import { Button, type ButtonVariant } from './Button';

export type CopyButtonProps = NativeProps<'button', {
  value: string;
  label?: string;
  copiedLabel?: string;
  size?: 'sm' | 'md';
  variant?: ButtonVariant;
  children?: never;
}>;

/** Copies `value` to the clipboard; shows success or failure for 2s. Never throws. */
export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', size = 'sm', variant = 'secondary', ...rest }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = setTimeout(() => setState('idle'), 2000);
    return () => clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  };
  return (
    <Button {...rest} variant={variant} size={size} icon={state === 'copied' ? 'check' : state === 'failed' ? 'error' : 'content_copy'} onClick={copy} aria-live="polite">
      {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
    </Button>
  );
}
