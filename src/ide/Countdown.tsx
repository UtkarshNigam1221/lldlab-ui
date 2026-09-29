import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { cx } from '../internal/cx';

export type CountdownProps = {
  seconds?: number;
  until?: Date;
  direction?: 'down' | 'up';
  warnAt?: number;
  onExpire?: () => void;
  label?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

export function Countdown({ seconds, until, direction = 'down', warnAt, onExpire, label = 'Time remaining' }: CountdownProps) {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);
  const onExpireRef = useRef(onExpire);
  const fired = useRef(false);
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  const elapsed = Math.floor((now - start) / 1000);
  const value =
    direction === 'up'
      ? (seconds ?? 0) + elapsed
      : Math.max(0, until ? Math.ceil((until.getTime() - now) / 1000) : (seconds ?? 0) - elapsed);
  const expired = direction === 'down' && value === 0;

  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expired]);

  useEffect(() => {
    if (expired && !fired.current) {
      fired.current = true;
      onExpireRef.current?.();
    }
  }, [expired]);

  const warn = direction === 'down' && warnAt !== undefined && value <= warnAt;
  return (
    <span role="timer" aria-label={label} className={cx('inline-flex items-center gap-space-2xs font-code-inline text-code-inline tabular-nums', warn ? 'text-fg-danger' : 'text-on-surface')}>
      <Icon name="timer" size="sm" />
      {formatClock(value)}
    </span>
  );
}
