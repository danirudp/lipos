'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { items, getTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = isMounted ? getTotal() : 0;
  const itemCount = isMounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // Custom "Acme" easing curve
  const fluidEase = [0.22, 1, 0.36, 1];

  return (
    <div className="relative flex h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 dark:bg-slate-950 dark:text-slate-100">
      {/* Background Ambience (Matches Dashboard) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px] dark:bg-blue-900/10" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-[100px] dark:bg-purple-900/10" />
      </div>

      {/* 1. MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col h-full min-w-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {/* Scrollable Grid */}
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <div className="p-4 pb-32 md:p-6 md:pb-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>

        {/* 2. MOBILE FLOATING CART (Glassmorphism) */}
        <Sheet>
          <SheetTrigger asChild>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: fluidEase }}
              className="md:hidden fixed bottom-6 left-4 right-4 z-50"
            >
              <Button
                className={cn(
                  'h-18 w-full rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl flex items-center justify-between px-6 transition-all duration-300 active:scale-95',
                  itemCount > 0
                    ? 'bg-blue-600/90 text-white shadow-blue-900/20 hover:bg-blue-600'
                    : 'bg-slate-900/90 text-white shadow-slate-900/20'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/10">
                    <ShoppingBag size={20} />
                    <AnimatePresence>
                      {itemCount > 0 && (
                        <motion.span
                          key={itemCount}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm"
                        >
                          {itemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                      Current Total
                    </span>
                    <span className="text-xl font-bold tabular-nums leading-none tracking-tight">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold bg-white/10 px-4 py-2 rounded-lg">
                  <span>Checkout</span>
                  <ChevronRight size={16} />
                </div>
              </Button>
            </motion.div>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[95dvh] rounded-t-[2.5rem] p-0 border-t-0 shadow-[0_-10px_60px_-15px_rgba(0,0,0,0.5)] bg-white/95 backdrop-blur-3xl dark:bg-slate-950/95"
          >
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
            <div className="flex w-full justify-center pt-4 pb-2">
              <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-full pb-10">
              <CartSidebar customers={customers} isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </main>

      {/* 3. DESKTOP SIDEBAR (Collapsible) */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 0 : 440,
          opacity: isSidebarCollapsed ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: fluidEase }}
        className="hidden md:flex relative flex-col border-l border-slate-200/60 bg-white/60 backdrop-blur-3xl shadow-2xl z-20 overflow-hidden dark:border-slate-800/60 dark:bg-slate-950/60"
      >
        <div className="h-full w-[440px] flex flex-col">
          <CartSidebar customers={customers} />
        </div>
      </motion.aside>

      {/* 4. TOGGLE BUTTON (Floating) */}
      <div
        className="hidden md:block absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ right: isSidebarCollapsed ? 0 : '440px' }}
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="group flex h-16 w-5 items-center justify-center rounded-l-xl border-y border-l border-slate-200 bg-white text-slate-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:w-8 hover:text-blue-600 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          {isSidebarCollapsed ? (
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          ) : (
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </div>
    </div>
  );
}
