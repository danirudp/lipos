'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

// UI Lib Imports
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
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';

// --- CONFIGURATION ---
const CONFIG = {
  TAX_RATE: 0.1,
  API_ENDPOINTS: { CHECKOUT: '/api/orders' },
} as const;

interface Customer {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
}

interface CartSidebarProps {
  customers: Customer[];
  isMobile?: boolean;
}

// --- 1. LOGIC HOOK ---
function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCartStore();
  const router = useRouter();

  const processCheckout = useCallback(
    async (items: any[], totalAmount: number, customerId: string | null) => {
      if (items.length === 0) return;
      setIsProcessing(true);

      try {
        // Format items for API
        const formattedItems = items.map((item) => ({
          id: String(item.id),
          quantity: Number(item.quantity),
          price: Number(parseFloat(item.price).toFixed(2)),
        }));

        const payload = {
          items: formattedItems,
          totalAmount: Number(parseFloat(totalAmount).toFixed(2)),
          customerId: customerId || null,
        };

        const response = await fetch(CONFIG.API_ENDPOINTS.CHECKOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
          // Use the detailed error message from backend
          const errorMsg =
            responseData.details ||
            responseData.error ||
            `Checkout failed (${response.status})`;
          throw new Error(errorMsg);
        }

        toast.success(`Order #${responseData.orderId} placed successfully!`, {
          icon: <Sparkles className="text-blue-500" size={16} />,
          description: responseData.message || 'Your order has been processed.',
        });

        clearCart();
        router.refresh();
        return true;
      } catch (error: any) {
        console.error('Checkout error:', error);

        let errorMessage =
          error.message || 'Transaction failed. Please try again.';

        // Handle specific backend errors
        if (error.message.includes('Product not found')) {
          errorMessage =
            'One or more products are no longer available. Please refresh your cart.';
        } else if (error.message.includes('Insufficient stock')) {
          errorMessage =
            'Some items have insufficient stock. Please update quantities.';
        } else if (error.message.includes('Invalid item data')) {
          errorMessage =
            'Some cart items are invalid. Please refresh your cart.';
        }

        toast.error(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [clearCart, router]
  );

  return { isProcessing, processCheckout };
}

// --- 2. PRESENTATION COMPONENTS ---

const CustomerSelector = ({
  customers,
  selectedId,
  onSelect,
}: {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) => {
  const [open, setOpen] = useState(false);

  const activeCustomer = useMemo(
    () => customers.find((c) => c.id === selectedId),
    [customers, selectedId]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group relative w-full flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 outline-none focus:ring-2 focus:ring-blue-500/20',
            activeCustomer
              ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-500/10 dark:bg-blue-900/20 dark:border-blue-900'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors',
              activeCustomer
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
            )}
          >
            <User size={18} />
          </div>

          <div className="flex flex-1 flex-col">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider',
                activeCustomer
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400'
              )}
            >
              Customer
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
              {activeCustomer ? activeCustomer.name : 'Walk-in / Guest'}
            </span>
          </div>

          <div className="rounded-md bg-white border border-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm group-hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
            CHANGE
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] p-0 shadow-2xl rounded-2xl border-slate-200 dark:border-slate-800"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search database..." className="h-11" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className="cursor-pointer py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 mr-2">
                  <User size={14} />
                </div>
                <span className="font-medium">Guest Customer</span>
                {!selectedId && (
                  <Check className="ml-auto h-4 w-4 text-blue-600" />
                )}
              </CommandItem>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  onSelect={() => {
                    onSelect(customer.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2 font-bold text-xs">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {customer.phone}
                    </span>
                  </div>
                  {selectedId === customer.id && (
                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CartItemRow = ({
  item,
  onAdd,
  onRemove,
}: {
  item: any;
  onAdd: any;
  onRemove: any;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
    transition={{ duration: 0.2 }}
    className="group relative mb-3 flex gap-4 overflow-hidden rounded-2xl border border-transparent bg-white p-3 shadow-sm transition-all hover:border-slate-200 hover:shadow-md dark:bg-slate-900 dark:hover:border-slate-800"
  >
    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
      {item.image ? (
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-300">
          <ShoppingBag size={20} />
        </div>
      )}
    </div>

    <div className="flex flex-1 flex-col justify-between py-0.5">
      <div className="flex justify-between items-start gap-2">
        <h4 className="line-clamp-2 text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">
          {item.name}
        </h4>
        <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded dark:bg-slate-800">
          {formatCurrency(item.price)} / unit
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-50 p-1 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <button
            onClick={() => onRemove(item.id)}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 active:scale-90 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-red-900/30"
          >
            {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
          </button>

          <span className="w-8 text-center text-xs font-bold tabular-nums text-slate-900 dark:text-white">
            {item.quantity}
          </span>

          <button
            onClick={() => onAdd(item)}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-90 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/30"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- 3. MAIN COMPONENT ---
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
  const { isProcessing, processCheckout } = useCheckout();

  const [orderId, setOrderId] = useState<string>('');
  useEffect(() => {
    setOrderId(Math.floor(Math.random() * 10000).toString());
  }, []);

  const cartTotals = useMemo(() => {
    const subtotal = getTotal();
    const tax = subtotal * CONFIG.TAX_RATE;
    return { subtotal, tax, finalTotal: subtotal + tax };
  }, [items, getTotal]);

  return (
    // FIX 1: Ensure parent has explicit overflow control
    <div className="relative flex h-full flex-col overflow-hidden bg-slate-50/50 backdrop-blur-3xl dark:bg-slate-950">
      {/* 1. GLASS HEADER */}
      <div className="relative z-30 flex-none flex flex-col gap-4 border-b border-slate-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold ring-2 ring-white text-white">
                  {items.length}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Current Order
              </h2>
              <p className="text-[10px] font-medium text-slate-400">
                ID: #ORD-{orderId || '...'}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearCart()}
              disabled={items.length === 0}
              title="Clear Cart"
              className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <CustomerSelector
          customers={customers}
          selectedId={customerId}
          onSelect={setCustomer}
        />
      </div>

      {/* 2. SCROLLABLE AREA */}

      <ScrollArea className="flex-1 min-h-0 z-0">
        <div className="px-5 py-4 pb-80">
          {items.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-6 text-center opacity-80">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-100 blur-xl dark:bg-blue-900/20" />
                <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                  <ShoppingBag
                    size={40}
                    className="text-slate-300"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="max-w-[200px]">
                <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-white">
                  Cart is empty
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scan products or search the catalog to start selling.
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 3. FLOATING ACTION FOOTER */}
      <div className="absolute bottom-0 left-0 w-full z-40 p-0">
        {/* Decorative shadow gradient top */}
        <div className="absolute bottom-full left-0 right-0 h-16 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none dark:from-slate-950/80" />

        <div className="bg-white border-t border-slate-200/60 p-5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:border-slate-800/60 dark:bg-slate-950 dark:shadow-black/50">
          <div className="mb-6 space-y-3">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-slate-300 tabular-nums tracking-tight">
                {formatCurrency(cartTotals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>VAT ({(CONFIG.TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-300 tabular-nums tracking-tight">
                {formatCurrency(cartTotals.tax)}
              </span>
            </div>

            <Separator className="my-2 bg-dashed bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Payable
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                  {formatCurrency(cartTotals.finalTotal)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              processCheckout(items, cartTotals.finalTotal, customerId)
            }
            disabled={items.length === 0 || isProcessing}
            className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-4 text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

            <div className="relative z-20 flex items-center justify-center gap-2 font-bold tracking-wide">
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white/80" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Charge {formatCurrency(cartTotals.finalTotal)}</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 opacity-80"
                  />
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
