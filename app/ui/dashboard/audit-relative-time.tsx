'use client';

import { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';

const DISPLAY_LOCALE = 'he-IL';

type RelativeTimeProps = {
  createdAt: Date | string;
};

/**
 * Hydration-safe relative label: SSR + first client paint use absolute locale string;
 * after mount, switch to Intl relative time (depends on client clock).
 */
export function RelativeTime({ createdAt }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const date =
    createdAt instanceof Date ? createdAt : new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  const iso = date.toISOString();
  const absoluteFallback = date.toLocaleString(DISPLAY_LOCALE);

  const label = mounted
    ? formatRelativeTime(date, { locale: DISPLAY_LOCALE })
    : absoluteFallback;

  return (
    <time
      dateTime={iso}
      title={absoluteFallback}
      className="text-sm text-gray-500 tabular-nums"
    >
      {label}
    </time>
  );
}
