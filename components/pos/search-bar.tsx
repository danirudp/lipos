'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Loader2, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(
    searchParams.get('query')?.toString() || ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateUrl = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) params.set('query', term);
      else params.delete('query');
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const handleInput = (term: string) => {
    setValue(term);
    updateUrl(term);
  };

  const handleClear = () => {
    setValue('');
    updateUrl('');
    inputRef.current?.focus();
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div
      className={cn(
        'group relative flex w-full items-center rounded-2xl transition-all duration-300 ease-out',
        isFocused
          ? 'bg-white shadow-[0_4px_20px_-2px_rgba(37,99,235,0.1)] ring-2 ring-blue-600 dark:bg-slate-900 dark:ring-blue-500'
          : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'
      )}
    >
      <div className="pointer-events-none absolute left-4 flex items-center justify-center text-slate-400 transition-colors group-focus-within:text-blue-600">
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Search size={18} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-12 w-full bg-transparent pl-11 pr-24 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
      />

      <div className="absolute right-3 flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {value ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400"
            >
              <X size={12} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-900"
            >
              <Command size={10} />
              <span>K</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
