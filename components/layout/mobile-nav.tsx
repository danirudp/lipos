'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // <--- Import Title
import { Menu } from 'lucide-react';
import { MainNav } from './main-nav';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-500"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
      >
        {/* ACCESSIBILITY FIX: Hidden Title */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* We reuse the MainNav but remove the border since the sheet has one */}
        <MainNav className="border-none" />
      </SheetContent>
    </Sheet>
  );
}
