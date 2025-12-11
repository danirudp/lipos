'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="search"
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="h-11 w-full rounded-xl bg-slate-100 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:ring-offset-2 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-800"
      />
    </div>
  );
}
