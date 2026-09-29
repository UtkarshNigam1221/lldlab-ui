import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';
import type { NativeProps } from '../internal/poly';

export type CountdownProps = NativeProps<'span', {
  seconds?: number;
  until?: Date;
  direction?: 'down' | 'up';
  warnAt?: number;
  onExpire?: () => void;
  label?: string;
  children?: never;
}>;

const pad = (n: number) => String(n).padStart(2, '0');

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

export function Countdown({ seconds, until, direction = 'down', warnAt, onExpire, label = 'Time remaining', ...rest }: CountdownProps) {
  const [start] = useState(() => Date.now());
  // A deadline depends on wall-clock time, which differs between server render and hydration:
  // leave it unknown (null) until mounted so both renders emit the same text.
  const [now, setNow] = useState<number | null>(() => (until ? null : start));
  const onExpireRef = useRef(onExpire);
  const fired = useRef(false);
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  const value = (() => {
    if (now === null) return null;
    const elapsed = Math.floor((now - start) / 1000);
    if (direction === 'up') return (seconds ?? 0) + elapsed;
    return Math.max(0, until ? Math.ceil((until.getTime() - now) / 1000) : (seconds ?? 0) - elapsed);
  })();
  const expired = direction === 'down' && value === 0;

  useEffect(() => {
    if (expired) return;
    setNow((n) => n ?? Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expired]);

  useEffect(() => {
    if (expired && !fired.current) {
      fired.current = true;
      onExpireRef.current?.();
    }
  }, [expired]);

  const warn = direction === 'down' && warnAt !== undefined && value !== null && value <= warnAt;
  return (
    <span {...rest} role="timer" aria-label={label} className={cx('inline-flex items-center gap-space-2xs font-code-inline text-code-inline tabular-nums', warn ? 'text-fg-danger' : 'text-on-surface')}>
      <Icon name="timer" size="sm" />
      {value === null ? '--:--' : formatClock(value)}
    </span>
  );
}
