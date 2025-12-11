'use client';

import { cn } from '@/lib/utils'; // Assuming you have this utility
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

  // Local state for immediate UI feedback (Clear button visibility)
  // We sync this with the URL param initially
  const [value, setValue] = useState(
    searchParams.get('query')?.toString() || ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition(); // Tracks Next.js navigation state

  // Handle Debounced URL Updates
  const updateUrl = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  // Sync local input immediately, debounce the URL
  const handleInput = (term: string) => {
    setValue(term);
    updateUrl(term);
  };

  const handleClear = () => {
    setValue('');
    updateUrl('');
    inputRef.current?.focus();
  };

  // Keyboard Shortcut (Cmd+K or /)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
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
        'group relative flex w-full items-center rounded-xl border-2 transition-all duration-200 ease-in-out',
        isFocused
          ? 'border-blue-600 bg-white ring-4 ring-blue-600/10 dark:border-blue-500 dark:bg-slate-950'
          : 'border-transparent bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-900 dark:hover:bg-slate-800'
      )}
    >
      {/* Search Icon / Spinner */}
      <div className="pointer-events-none absolute left-3 flex items-center justify-center text-slate-400 transition-colors group-focus-within:text-blue-600">
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
        className="h-11 w-full bg-transparent pl-10 pr-20 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
      />

      {/* Right Side Actions */}
      <div className="absolute right-3 flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {/* Clear Button - Only visible when there is text */}
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <X size={10} strokeWidth={3} />
            </motion.button>
          )}

          {/* Keyboard Shortcut Hint - Hidden when there is text OR when mobile (optional check) */}
          {!value && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800 md:flex"
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
