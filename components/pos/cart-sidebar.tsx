'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, ShoppingBag, Trash2, User, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface CartSidebarProps {
  customers: any[];
  isMobile?: boolean;
}

export function CartSidebar({ customers, isMobile = false }: CartSidebarProps) {
  const {
    items,
    removeFromCart,
    addToCart,
    clearCart,
    getTotal,
    customerId,
    setCustomer,
  } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false); // State for the new dropdown

  const total = getTotal();
  const tax = total * 0.1;
  const finalTotal = total + tax;

  // Find active customer name for display
  const selectedCustomer = customers.find((c) => c.id === customerId);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: finalTotal,
          paymentMethod: 'CASH',
          customerId: customerId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Order ${data.orderId} completed!`);
        clearCart();
      } else {
        toast.error('Checkout failed.');
      }
    } catch (error) {
      toast.error('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-900">
      {/* HEADER */}
      <div className="relative z-20 flex flex-col gap-4 border-b border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Current Order
              </h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                Transaction #PENDING
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearCart()}
              disabled={items.length === 0}
              className="h-8 px-2 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Clear
            </Button>
            {isMobile && (
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400"
                >
                  <X size={18} />
                </Button>
              </SheetClose>
            )}
          </div>
        </div>

        {/* CUSTOMER SELECTOR - Premium Combobox (Replaces <select>) */}
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={openCombobox}
              className="relative w-full flex items-center rounded-xl bg-slate-100 py-3 pl-11 pr-16 text-sm font-bold text-slate-700 outline-none transition-all hover:bg-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900 group"
            >
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-600 transition-colors">
                <User size={16} />
              </div>

              <span className="truncate">
                {selectedCustomer ? selectedCustomer.name : 'Guest Customer'}
              </span>

              {/* "Change" Pill */}
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white px-3 py-1 text-[10px] font-bold text-slate-500 shadow-sm uppercase tracking-wide group-hover:text-blue-600 transition-colors dark:bg-slate-700 dark:text-slate-300">
                Change
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-[350px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search customer..." className="h-11" />
              <CommandList>
                <CommandEmpty>No customer found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setCustomer(null);
                      setOpenCombobox(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer py-3 aria-selected:bg-blue-50 aria-selected:text-blue-700"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        !customerId ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">Guest Customer</span>
                      <span className="text-[10px] text-slate-500">
                        Walk-in client
                      </span>
                    </div>
                  </CommandItem>

                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      onSelect={() => {
                        setCustomer(customer.id);
                        setOpenCombobox(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer py-3 aria-selected:bg-blue-50 aria-selected:text-blue-700"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          customerId === customer.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold">{customer.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {customer.phone || 'No phone'}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ITEMS LIST (Unchanged) */}
      <ScrollArea className="flex-1 p-2 md:p-3">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-slate-400 opacity-60">
            <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Cart is empty
              </p>
              <p className="text-xs">Scan or tap products to begin</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group relative flex gap-3 overflow-hidden rounded-xl border border-white bg-white p-2 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ShoppingBag size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex justify-between gap-2">
                      <h4 className="line-clamp-2 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-slate-400 font-medium">
                        {formatCurrency(item.price)} each
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-1 dark:bg-slate-900">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm transition-colors hover:text-red-500 dark:bg-slate-800"
                        >
                          <Trash2 size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-slate-700 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      {/* FOOTER (Unchanged) */}
      <div className="relative z-20 border-t border-slate-200 bg-white p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Tax (10%)</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Total Payable
            </span>
            <span className="text-xl font-black text-blue-600 tabular-nums tracking-tight">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || isLoading}
          className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Charge {formatCurrency(finalTotal)}</span>
                <span className="opacity-70 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
