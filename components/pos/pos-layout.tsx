'use client';

import { CartSidebar } from '@/components/pos/cart-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // <--- Import SheetTitle
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { ShoppingBag } from 'lucide-react';

interface POSLayoutProps {
  children: React.ReactNode;
  customers: any[];
}

export function POSLayout({ children, customers }: POSLayoutProps) {
  const { items, getTotal } = useCartStore();
  const total = getTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen overflow-hidden">
      {/* MAIN CONTENT (Product Grid) */}
      <div className="flex-1 flex flex-col h-full relative">
        {children}

        {/* MOBILE FLOATING CART BUTTON */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden fixed bottom-6 right-6 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 z-50 px-6 gap-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-lg">{formatCurrency(total)}</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[90vh] p-0 rounded-t-[20px] flex flex-col"
          >
            {/* ACCESSIBILITY FIX: Hidden Title */}
            <SheetTitle className="sr-only">Shopping Cart</SheetTitle>

            <CartSidebar customers={customers} isMobile />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR CART */}
      <div className="hidden md:block w-[400px] border-l bg-white dark:bg-slate-950 h-full shadow-xl z-20">
        <CartSidebar customers={customers} />
      </div>
    </div>
  );
}
