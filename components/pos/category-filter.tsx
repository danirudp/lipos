'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All',
  'Electronics',
  'Wearables',
  'Furniture',
  'Accessories',
];

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || 'All';

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* no-scrollbar: Hides the visual bar
         overflow-x-auto: Enables touch swiping & arrow key scrolling
      */}
      <div className="flex w-full items-center gap-2 overflow-x-auto whitespace-nowrap px-1 no-scrollbar py-2">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={cn(
                'relative flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 select-none z-10',
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              )}
            >
              {/* Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-xl bg-blue-50 dark:bg-blue-900/20 -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
