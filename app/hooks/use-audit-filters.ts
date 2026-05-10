'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function useAuditFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = useDebouncedCallback((term: string, key: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return { setFilter, searchParams };
}