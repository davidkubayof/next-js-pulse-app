'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
// ייבוא הטיפוס של ה-Params מ-Next.js
import { ReadonlyURLSearchParams } from 'next/navigation';

// הגדרת ה-Interface של מה שה-Hook מחזיר
interface UseAuditFiltersReturn {
  setFilter: (term: string, key: string) => void;
  searchParams: ReadonlyURLSearchParams;
}

export function useAuditFilters(): UseAuditFiltersReturn {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // הגדרת void כסוג ההחזרה של הקולבק
  const setFilter = useDebouncedCallback((term: string, key: string): void => {
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