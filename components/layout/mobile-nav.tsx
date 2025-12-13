'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainNav } from './main-nav';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 transition-all"
        >
          {/* Animated Icon State */}
          <motion.div
            initial={false}
            animate={{ rotate: open ? 90 : 0, scale: open ? 0.8 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </motion.div>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-[85vw] max-w-xs border-r-0 bg-white/95 backdrop-blur-xl dark:bg-slate-950/95"
        style={{ zIndex: 100 }}
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          <MainNav className="border-none bg-transparent" />

          <div className="p-6 text-center text-[10px] text-slate-300 dark:text-slate-700">
            &copy; 2025 LIPOS System
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
