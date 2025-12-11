'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Armchair,
  Gem,
  Headphones,
  Laptop,
  LayoutGrid,
  Shirt,
  Smartphone,
  Watch,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';

// --- CONFIGURATION ---
const CATEGORIES = [
  { id: 'All', label: 'All Items', icon: LayoutGrid },
  { id: 'Electronics', label: 'Electronics', icon: Smartphone },
  { id: 'Wearables', label: 'Wearables', icon: Watch },
  { id: 'Furniture', label: 'Furniture', icon: Armchair },
  { id: 'Accessories', label: 'Accessories', icon: Gem },
  { id: 'Audio', label: 'Audio', icon: Headphones },
  { id: 'Computers', label: 'Laptops', icon: Laptop },
  { id: 'Clothing', label: 'Fashion', icon: Shirt },
];

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Scroll Container Ref for auto-centering
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get('category') || 'All';

  // --- LOGIC: Handle URL Updates with Transition ---
  const handleFilter = useCallback(
    (category: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        if (category === 'All') {
          params.delete('category');
        } else {
          params.set('category', category);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router, pathname]
  );

  // --- LOGIC: Auto-Scroll Active Item into View ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Find the active button
    const activeButton = container.querySelector(
      `[data-active="true"]`
    ) as HTMLElement;

    if (activeButton) {
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;

      // Calculate if button is out of view
      const buttonRight = buttonLeft + buttonWidth;
      const visibleRight = scrollLeft + containerWidth;

      // Only scroll if button is not fully visible
      if (buttonLeft < scrollLeft || buttonRight > visibleRight) {
        const scrollPosition =
          buttonLeft - containerWidth / 2 + buttonWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      }
    }
  }, [currentCategory]);

  return (
    <div className="relative w-full">
      {/* GRADIENT MASKS - Show only when content overflows */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-8 bg-gradient-to-r from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-8 bg-gradient-to-l from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent" />

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto px-4 py-4 md:px-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              data-active={isActive}
              className={cn(
                'group relative flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'text-blue-700 dark:text-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
              )}
            >
              {/* ACTIVE BACKGROUND (Framer Motion Layout Animation) */}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/40"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* ICON & TEXT */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon
                  size={16}
                  className={cn(
                    'transition-transform duration-300',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="whitespace-nowrap">{cat.label}</span>
              </span>

              {/* LOADING INDICATOR (If router is transitioning) */}
              {isActive && isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
