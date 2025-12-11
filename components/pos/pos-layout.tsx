'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

// Components
import { CartSidebar } from '@/components/pos/cart-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';

interface POSLayoutProps {
  children: React.ReactNode;
  customers: any[];
}

export function POSLayout({ children, customers }: POSLayoutProps) {
  // Hydration Check
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { items, getTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe access to store values
  const total = isMounted ? getTotal() : 0;
  const itemCount = isMounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    // Use 100dvh (dynamic viewport height) for better mobile browser support
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* 1. MAIN CONTENT AREA (Product Grid) */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 transition-all duration-300 ease-in-out">
        {/* Scrollable Container for Children */}
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="p-4 pb-24 md:pb-4">{children}</div>
        </div>

        {/* 2. MOBILE FLOATING ACTION BUTTON (FAB) */}
        <Sheet>
          <SheetTrigger asChild>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="md:hidden fixed bottom-6 left-6 right-6 z-50"
            >
              <Button
                className={cn(
                  'h-16 w-full rounded-2xl shadow-2xl shadow-blue-900/20 backdrop-blur-lg border border-white/20 flex items-center justify-between px-6 transition-transform active:scale-95',
                  itemCount > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-900 text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <ShoppingBag size={20} />
                    {itemCount > 0 && (
                      <motion.span
                        key={itemCount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-900 ring-2 ring-blue-600"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-blue-100">
                      Total
                    </span>
                    <span className="text-lg font-bold tabular-nums leading-none">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                  <span>View Cart</span>
                  <ChevronRight size={16} />
                </div>
              </Button>
            </motion.div>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[92dvh] rounded-t-[2rem] p-0 border-t-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]"
          >
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
            {/* Grab Handle Visual Cue */}
            <div className="flex w-full justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="h-full pb-8">
              <CartSidebar customers={customers} isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </main>

      {/* 3. DESKTOP COLLAPSIBLE SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 0 : 420,
          opacity: isSidebarCollapsed ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex h-full relative flex-col border-l border-slate-200 bg-white shadow-2xl z-20 overflow-hidden dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="h-full w-[420px]">
          {' '}
          {/* Fixed width inner container prevents content squishing during animation */}
          <CartSidebar customers={customers} />
        </div>
      </motion.aside>

      {/* 4. DESKTOP TOGGLE BUTTON */}
      {/* Placed outside the sidebar so it remains visible when collapsed */}
      <div
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-300"
        style={{ right: isSidebarCollapsed ? 0 : '420px' }}
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex h-12 w-6 items-center justify-center rounded-l-xl border-y border-l border-slate-200 bg-white text-slate-400 shadow-md hover:w-8 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900"
          title={isSidebarCollapsed ? 'Open Cart' : 'Collapse Cart'}
        >
          {isSidebarCollapsed ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
